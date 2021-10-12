from rest_framework import serializers
from .models import User
from .models import Course
from .models import FriendRequest

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'
    
    # All fields commented out if you wish to customize return fields
        # fields = (
        #     "id",
        #     "day_name",
        #     "course_name",
        #     "course_number",
        #     "time_start",
        #     "time_end",
        #     "date_created",
        #     "dated_modified",
        #     "user"
        # )

    def create(self, validated_data):
        course = Course.objects.create(**validated_data)
        return course
    
    def update(self, instance, validated_data):
        instance.day_name = validated_data.get('day_name', instance.day_name)
        instance.course_name = validated_data.get('course_name', instance.course_name)
        instance.course_number = validated_data.get('course_number', instance.course_number)
        instance.time_start = validated_data.get('time_start', instance.time_start)
        instance.time_end = validated_data.get('time_end', instance.time_end)
        instance.save()
        return instance

class FriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = '__all__'

    # All fields commented out if you wish to customize return fields
        # fields = (
        #     "id",
        #     "from_user",
        #     "to_user",
        #     "pending",
        #     "accepted",
        #     "date_created",
        #     "dated_modified"
        # )
    
    def create(self, validated_data):
        friend_request = FriendRequest.objects.create(**validated_data)
        return friend_request
    
    def update(self, instance, validated_data):
        instance.from_user = validated_data.get('from_user', instance.from_user)
        instance.to_user = validated_data.get('to_user', instance.to_user)
        instance.pending = validated_data.get('pending', instance.pending)
        instance.accepted = validated_data.get('accepted', instance.accepted)
        instance.save()
        return instance

class UserSerializer(serializers.ModelSerializer):
    schedule = CourseSerializer(many = True, allow_null = True)
    class Meta:
        model = User
        fields = '__all__'

    # All fields commented out if you wish to customize return fields
        # fields = (
        #     "id",
        #     "username",
        #     "password",
        #     "first_name",
        #     "last_name",
        #     "email",
        #     "date_joined",
        #     "last_login",
        #     "is_superuser",
        #     "is_staff",
        #     "is_active",
        #     "groups",
        #     "user_permissions":,
        #     "schedule",
        #     "friend_list",
        #     "friend_requests"
        # )


    # designed only to create a user, as when a new user is made, they did not input a schedule yet
    def create(self, validated_data):
        validated_data.pop('schedule')
        user = User.objects.create(**validated_data)
        return user

    def update(self, instance, validated_data):
        # Creates a new course into schedule if included in validated data
        if 'schedule' in validated_data:
            schedule_data = validated_data.pop('schedule')
            for schedule_dict in schedule_data:
                Course.objects.create(user=instance, **schedule_dict)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.username = validated_data.get('username', instance.username)
        instance.password = validated_data.get('password', instance.password)
        instance.save()
        return instance

# Leftover serializer for Day model; leaving here for now in case we need to rollback
# class DaySerializer(serializers.ModelSerializer):
#     courses = CourseSerializer(many = True, allow_null = True)
#     class Meta:
#         model = Day
#         fields = (
#             "day_name",
#             "courses"
#         )
    
#     def create(self, validated_data):
#         courses_data = validated_data.pop('courses')
#         day = Day.objects.create(**validated_data)
#         for courses_data in courses_data:
#             Course.objects.create(day=day, **courses_data)
#         return day

#     def update(self, instance, validated_data):
#         instance.day_name = validated_data.get('day_name', instance.day_name)
#         instance.courses.set(validated.get('courses'))
#         return instance