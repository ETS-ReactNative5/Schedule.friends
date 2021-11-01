from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status

from .models import User
from .models import Course
from .models import FriendRequest
from .serializers import *

from rest_framework import permissions as base_permissions
from sf_users import permissions as custom_permissions

# Users request methods
# To-do
# Make query return just a list of user names and friend list (pop out schedule)
# Make get list all a superuser privilege only
@api_view(['GET'])
@permission_classes([base_permissions.IsAuthenticated])
def get_users_list(request):
    if request.method == 'GET':
        # First checks if query parameter exists
        # Then filters Users by the string in the 'username' property
        if request.query_params.get('query'):
            results = User.objects.filter(username__iregex=request.query_params.get('query'))
            serializer = UserSerializer(results, context={'request': request}, many=True)
            return Response(serializer.data)
        # Otherwise, returns all Users in the database
        data = User.objects.all()
        serializer = UserSerializer(data, context={'request': request}, many=True)
        return Response(serializer.data)

@api_view(['POST'])
@permission_classes([base_permissions.AllowAny])
def create_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        user_dict = dict(UserSerializer(user).data)
        user_dict.update({'token': token.key})
        return Response(user_dict, status=status.HTTP_201_CREATED)            
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Need to make PATCH and DELETE authenticated with owner and superuser
@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([base_permissions.IsAuthenticated])
def users_detail(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # Get User object by iD
    if request.method == 'GET':
        serializer = UserSerializer(user, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'PATCH':
        serializer = UserSerializer(user, data=request.data, context={'request': request}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        # Finds all FriendRequests connected to deleting user
        # Then deletes them and the user
        sent_friend_requests = FriendRequest.objects.filter(from_user=pk)
        recieved_friend_requests = FriendRequest.objects.filter(to_user=pk)
        sent_friend_requests.delete()
        recieved_friend_requests.delete()
        user.delete()
        return Response({
            'id': int(pk),
            'result': f"User ID# {pk} Sucessfully Deleted"
            }, status=status.HTTP_200_OK)

# ======================================

# Schedule request methods
@api_view(['GET', 'POST'])
@permission_classes([base_permissions.IsAuthenticated])
def schedule_list(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = CourseSerializer(user.schedule, context={'request': request}, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        # First validates the request.data to fit the Course model
        course_serializer = CourseSerializer(data=request.data)
        if course_serializer.is_valid():
            # Course objects have to be created in the User object
            # So the course is put in 'schedule' field, validated for User model
            # Then the referenced User runs a PATCH request, which will
            # create the Course inside the User object
            user_obj = {
                'schedule': [request.data]
            }
            user_serializer = UserSerializer(user, data=user_obj, context={'request': 'PATCH'}, partial=True)
            if user_serializer.is_valid():
                user_serializer.save()
                # Find the latest course created, which logically is the highest course ID in
                # user's schedule
                course_created = user_serializer.data['schedule'][0]
                for course in user_serializer.data['schedule']:
                    if course_created['id'] < course['id']:
                        course_created = course
                return Response(course, status=status.HTTP_201_CREATED)
            else:
               Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
        return Response(course_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([base_permissions.IsAuthenticated])
def schedule_detail(request, user_pk, course_pk):
    try:
        course = Course.objects.get(pk=course_pk)
    except Course.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CourseSerializer(course, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'PATCH':
        serializer = CourseSerializer(course, data=request.data, context={'request': request}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        course.delete()
        return Response({
            'id': int(course_pk),
            'result': f"Course ID# {course_pk} Sucessfully Deleted"
            }, status=status.HTTP_200_OK)

# ======================================

# Friend request methods
@api_view(['GET','POST'])
@permission_classes([base_permissions.IsAuthenticated])
def fr_list(request):
    if request.method == 'GET':
        data = FriendRequest.objects.all()
        serializer = FriendRequestSerializer(data, context={'request': request}, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        try:
            from_user = User.objects.get(pk=request.data['from_user'])
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        try:
            to_user = User.objects.get(pk=request.data['to_user'])
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
       
        fr_serializer = FriendRequestSerializer(data=request.data)
        if fr_serializer.is_valid():
            fr_serializer.save()
            from_user.friend_requests.add(fr_serializer.data['id'])
            from_user.save()
            to_user.friend_requests.add(fr_serializer.data['id'])
            to_user.save()
            return Response(fr_serializer.data, status=status.HTTP_201_CREATED) 
        return Response(fr_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([base_permissions.IsAuthenticated])
def fr_detail(request, pk):
    try:
        friend_request = FriendRequest.objects.get(pk=pk)
    except FriendRequest.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = FriendRequestSerializer(friend_request, context={'request': request})
        return Response(serializer.data)

    # PATCHing a FriendRequest is called when a user accepts or denies a friend request
    # by sending "accepted": true or false.
    elif request.method == 'PATCH':
        fr_serializer = FriendRequestSerializer(friend_request, data=request.data, context={'request': request}, partial=True)
        if fr_serializer.is_valid():
            fr_serializer.save()
            # If accepted, it reads the user IDs from the from_user and to_user property
            if fr_serializer.data['accepted']:
                # Fetches the corresponding user objects
                try:
                    from_user = User.objects.get(pk=fr_serializer.data['from_user'])
                except User.DoesNotExist:
                    return Response(status=status.HTTP_404_NOT_FOUND)
                try:
                    to_user = User.objects.get(pk=fr_serializer.data['to_user'])
                except User.DoesNotExist:
                    return Response(status=status.HTTP_404_NOT_FOUND)
                # Add the users to their friend_list property
                from_user.friend_list.add(to_user.id)
                to_user.friend_list.add(from_user.id)
            # After a FriendRequest is accepted or denied, it is deleted
            friend_request.delete()
            return Response({
                'id': int(pk),
                'result': f"Friend Request ID# {pk} Deleted"
                },status=status.HTTP_200_OK)
        return Response(fr_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        friend_request.delete()
        return Response({
            'id': int(pk),
            'result': f"Friend Request ID# {pk} Deleted"
        }, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([base_permissions.IsAuthenticated])
def remove_friend(request, from_user_pk, to_user_pk):
    try:
        from_user = User.objects.get(pk=from_user_pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    try:
        to_user = User.objects.get(pk=to_user_pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    from_user.friend_list.remove(to_user_pk)
    to_user.friend_list.remove(from_user_pk)
    return Response({
        'from_user_id': int(from_user_pk),
        'to_user_id': int(to_user_pk),
        'result': f"Friendship from user {from_user_pk} to user {to_user_pk} deleted"
        }, status=status.HTTP_200_OK)

# Override for ObtainAuthToken.Post, returns user and token in same response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token

class ObtainAuthTokenWithUser(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        user_dict = dict(UserSerializer(user).data)
        user_dict.update({'token': token.key})
        return Response(user_dict)
