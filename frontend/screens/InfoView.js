import React, {useState, useContext, useEffect} from 'react';
import {View, SafeAreaView, StyleSheet, StatusBar, Image, TextInput, TouchableOpacity} from 'react-native';
import UserContext from '../context/UserContext';
import {Avatar, Title, Caption, Text, TouchableRipple, useTheme} from 'react-native-paper';
import InfoComponent from '../components/InfoComponent';

const InfoView = ({ navigation, route }) => {
    const context = useContext(UserContext);
    const { colors } = useTheme();
    const settingsOptions=[
        {title: 'Guide', subTitle: 'Learn how to use Schedule.Friends', navName: 'GuideView'},
        {title: 'Mission', subTitle: 'Learn about our mission.', navName: ''},
        {title: 'Developers', subTitle: 'Get information regarding the developers of the app.', navName: ''},
        {title: 'FAQ', subTitle: 'Frequently Asked Questions.', navName: ''},
    ];
    return (
    
        <InfoComponent settingsOptions={settingsOptions} navigation={navigation} bgColor={colors.backgroundColor}/>
       
    )
  }
  
export default InfoView;
  

    