import React, {useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import UserListHeader from './UserListHeader';
const FriendRequestItem = ({friendRequest,  displayOptions, rejectFriend, acceptFriend}) => {

    return (
        <TouchableOpacity style={styles.friendRequest}>
            {
                displayOptions === "from_user"
                ? (
                    <View style={styles.itemView}>
                        <UserListHeader user={friendRequest.to_user_data}  textColor='#5cdbd5' bgColor='white'/>
                        <Icon name='cancel' size={30} color='#900' onPress={() => rejectFriend(friendRequest.id)} style={styles.button}/>
                    </View>
                )
                : (
                    <View style={styles.itemView}>
                        <UserListHeader user={friendRequest.from_user_data} textColor='#5cdbd5' bgColor='white'/>
                        <Icon name='close' size={30} color='#900' onPress={() => rejectFriend(friendRequest.id)} style={styles.button}/>
                        <Icon name='check' size={30} color='#37ba0f'onPress={() => acceptFriend(friendRequest.id)} style={styles.button}/>
                    </View>
                )
            }
        </TouchableOpacity>
        
    )
}
const styles = StyleSheet.create({

    friendRequest : {
        padding: 15,
        backgroundColor: '#5cdbd5',         //STATIC BACKGROUND
        borderBottomWidth: 1,
        borderColor: '#ccc',
        borderRadius: 40 / 2,
        width: 350,
        alignSelf: 'center',
        marginTop: 15,
        
    },

    itemView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    button: {
        backgroundColor: 'black',   //STATIC BACKGROUND COLOR
        borderRadius: 50 / 2,
        alignSelf: 'flex-end',
        marginBottom: -10
    }
    
})
export default FriendRequestItem;
