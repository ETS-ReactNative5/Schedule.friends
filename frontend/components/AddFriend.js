import React, {useState, useContext} from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert} from 'react-native';
import { Button, Paragraph, Dialog, Portal, Provider } from 'react-native-paper';
import {BASE_URL} from "@env";
import UserContext from '../context/UserContext';

const AddFriend = ({title, route}) => {

    const context = useContext(UserContext);
    const [text, setText] = useState('');
    const [visible, setVisible] = useState(false);

    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);

    const onChange = textValue => {
        setText(textValue);
    }

    const validation = () => {

        //checks if input is just whitespace(nothing inputed)
        if(!text.replace(/\s/g, "").length)
        {
            Alert.alert("please enter a username");
        }
        else
        {
            onPressBtn();
        }
    }

    const onPressBtn = async () => {
        
        console.log("**** onPressBtn is running... ****");

        //GET friend info based on user input
        let friend_json;
        try {
            const resonse = await fetch(`${BASE_URL}/?query=${text}`, {
                method: 'GET', // or 'PUT'
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${context.user.token}`
                },
            });
            friend_json = await resonse.json();
        } catch(error) {
            console.log(error);
        }

        console.log(friend_json);
        if(!friend_json.length)
        {
            console.log("user not found");
            Alert.alert("user not found");
        }
        else 
        {
            console.log("user found");
            const friend_id = friend_json[0].id;
            const data = {
                from_user: context.user.id,   //CURRENT USER
                to_user: friend_id
            }

            try {
                //Fetch URL should be an dotenv variable
                const postResponse = await fetch(`${BASE_URL}/friend_requests/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        //This needs to be brought down from props
                        'Authorization': `Token ${context.user.token}`
                    },
                    body: JSON.stringify(data),
                });
                //const jsonResponse = await postResponse.json();
                //this means the server did not accepted the post request
                if (postResponse.status !== 201)
                {
                    console.log("Friend Request Already Pending");
                    Alert.alert("Friend Request Already Pending");
                }
                else if(postResponse.status === 201)
                {
                    console.log("Friend request sent");
                    Alert.alert("Friend request sent");
                }
            }
            catch(error) {
                console.log(error);
            }
        }   
    }
   
    return (

        <Provider>
        <View style={styles.container}>
            <TextInput placeholder="Enter Username" style={styles.input} onChangeText={onChange}/>
            
            <TouchableOpacity style={styles.btn} onPress={validation}>
                <Text style={styles.btnText}> Send Request</Text>
            </TouchableOpacity>

        </View>

        </Provider>
    )
};


const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },

    input: {
        borderWidth: 1,
        width: 240,
        borderColor: '#ccc'
    },

    btn: {
        marginTop: 30,
        backgroundColor: 'darkslateblue',
        height: 40,
        width: 120,
        borderRadius: 40/2,
        justifyContent: 'center',
        alignItems: 'center',
    },

    btnText: {
        color: '#fff'
    }



})
export default AddFriend;





/*
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    
                    <Dialog.Title>Friend Request Sent!</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>Friend request sent to {text}! They will see it in their friend requests!</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog}>Done</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
*/


/*

            //actual POST. Create the friend request
            //swap url with actual server when deployed
            fetch(`${BASE_URL}/friend_requests/`, {
                method: 'POST', // or 'PUT'
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${context.user.token}`
                },
                body: JSON.stringify(data),
            })
            .then( response => response.json())
            .then( data => {
                console.log(data);     
            })
            .catch( error => {
                console.log(error);
            })

            */

            //showDialog();
        