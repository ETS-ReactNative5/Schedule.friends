import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Button, Paragraph, Dialog, Portal, Avatar, Title, Caption } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getFocusedRouteNameFromRoute } from '@react-navigation/core';
import UserListHeader from './UserListHeader';

const FriendListItem = ({ navigation, route, user }) => {

    return (
        
        <TouchableOpacity style={styles.friendItem}>
            <UserListHeader user={user} />
            <View>
                <Icon
                    style={{paddingRight:15}}
                    name="account-details"
                    size={45}
                    color="#6200EE"
                    onPress={() => navigation.push('FriendProfileView', {
                        friend: user})}
                />
            </View>
        </TouchableOpacity>
        
    )
}

const styles = StyleSheet.create({

    friendItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f8f8f8',
        borderBottomWidth: 1,
        borderColor: '#ccc',
    }
})

export default FriendListItem;
