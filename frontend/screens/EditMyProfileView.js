import React, {useState, useContext} from 'react';
import {View, StyleSheet, TouchableOpacity, Alert, ImageBackground, useColorScheme} from 'react-native';
import UserContext from '../context/UserContext';
import {Avatar, Text, TextInput, Button, TouchableRipple, useTheme} from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
import {BASE_URL} from "@env";

const EditMyProfileView = ({ navigation, route }) => {

    const context = useContext(UserContext);
    
    const {user} = route.params;

    const [fName, setFName] = useState(user.first_name);
    const [lName, setLName] = useState(user.last_name);
    const [userName, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [ProfileImage, setProfileImage] = useState(user.profile_image);

    const userData = new FormData();

    const [loadingButton, setLoadingButton] = useState(false);


    //Function Thats Chooses Photo From Phone's Library
    const choosPhotoFromLibrary = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
            compressImageQuality: 0.7,
          }).then(image => {
            console.log(image);
            setProfileImage(image.path);
          })
          .catch(error => console.log("Unable to Load Photo"));
    }

    //Form Data Creation/Update for User
    const createUserData = () => {
        userData.append('first_name', fName);
        userData.append('last_name', lName);
        userData.append('username', userName);
        userData.append('email', email);

        
        if (ProfileImage != null){

            userData.append('profile_image', {
                uri: ProfileImage,
                type: "image/jpeg",
                name: ProfileImage.substring(ProfileImage.lastIndexOf('/') + 1)
             }) 

        }

      
         confirmPressHandle();

    }


    // HELPER TEXT CHECKER FUNCS
    
    // Returns true if first_name does not only contain alphabet or is over 150 characters
    const fnameValid = () => {
        const nameRegex = /^[A-Za-z]{1,150}$/;
        return (!(nameRegex.test(fName)) && fName.length > 0);
    };

    // Returns true if last_name does not only contain alphabet or is over 150 characters
    const lnameValid = () => {
        const nameRegex = /^[A-Za-z]{1,150}$/;
        return (!(nameRegex.test(lName)) && lName.length > 0);
    };

    // Returns true if username does not only contain alphanumeric, -, _, @, +, and . and if over 20 character
    const unameValid = () => {
        const usernameRegex = /^[0-9a-zA-Z-_@+.]{1,20}$/;
        return !(usernameRegex.test(userName)) && userName.length > 0;
    };

    // Returns true if email is not valid name@host.ext
    const emailValid = () => {
        const simpleEmailRegex = /\S+@\S+\.\S+/; 
        return !(simpleEmailRegex.test(email)) && email.length > 0;
    }

    // fourmCheck that runs on Register submit button
    const forumCheck = () => {
        // Checks if first_name is empty
        if (fName=="") {
            Alert.alert("Please enter a first name.");
        }
        
        // Checks if last name is empty
        else if (lName=="") {
            Alert.alert("Please enter a last name.");
        }

        // regex check first_name and last_name
        else if ((fnameValid()) || (lnameValid())){
            Alert.alert("Only alphabetical characters are accepted for first and last names.");
        }

        // Checks if username is empty
        else if (userName=="") {
            Alert.alert("Please enter a username.");
        }

        // regex check username
        else if (unameValid()) {
            Alert.alert("Username can only contain alphanumeric, _, @, +, . and - characters.");
        }

        // regex check email
        else if (emailValid()) {
            Alert.alert("Please enter a valid email.");
        }

        // All checks are passed, data is sent to backend
        else 
            createUserData();
    }


    //PATCH API CALL   
    const confirmPressHandle = async () => {
        setLoadingButton(true);
        try {
            const response = await fetch(`${BASE_URL}/${user.id}`, {
                method:"PATCH",
                headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Token ${user.token}`
                
                },

                body: userData
            
            })
            
            const jsonResponse = await response.json();
            if (response.status === 200) {
                setLoadingButton(false);
                context.setUser(jsonResponse);
                navigation.pop();
            }
            else {
                setLoadingButton(false);
                console.log(`Server Error ${response.status}`)
                Alert.alert(`Server Error or Username already taken`);
            }
        } catch(error) {
            console.log(error)
        }
        setLoadingButton(false);
    }
    
    //GO BACK TO PROFILE SCRREN WHEN CANCEL IS PRESSED
    const cancelPressHandle = () => {
        navigation.pop();
        console.log("Cancel button pressed");
    }

    const { colors } = useTheme(); //THEME

// something, {backgroundColor:colors.backgroundColor}]}>

    return (
        
        <View style={{backgroundColor: colors.backgroundColor}}>
        <View syle={styles.container}> 
            <View style={{margin: 20}}>
                <View style={{alignItems: 'center'}}>
                    <TouchableOpacity onPress={() => {choosPhotoFromLibrary()}}>
                        <View style={styles.icon}>

                            {/*
                            <Avatar.Text 
                                size = {100} 
                                backgroundColor = '#D7A4FF'
                                label=
                                {user.first_name.charAt(0)+user.last_name.charAt(0)}
                            />
                            */}

                            <ImageBackground
                            source={{
                            uri: ProfileImage,
                            }}
                            style={{height:125, width:125}}
                            imageStyle = {{borderRadius: 125/2}}
                            >
                            
                            <View style = {{
                                flex:1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                
                            }}>
                                <Icon name="photo" size={35} color="grey" style={styles.imageIcon}/>
                            </View>
                            </ImageBackground>

                        </View>
                    </TouchableOpacity>
                    <Text style = {[styles.fnamelname, {color:colors.firstColor}]}>
                        {user.first_name + " " + user.last_name}
                    </Text>
                </View>

                <View style={styles.inputfields}>
                <FontAwesome name="user-o" size={30} color={colors.secondColor} />
                    <TextInput
                        mode="outlined"
                        label="First Name"
                        value={fName}
                        placeholderTextColor = {colors.secondColor}
                        onChangeText = {(val) => setFName(val)}
                        autoCorrect={false}
                        style={styles.textInput}
                        theme={{
                            colors: {
                                placeholder: colors.secondColor,
                                text: colors.secondColor,
                                primary: colors.secondColor,
                                underlineColor: 'transparent'
                            }
                        }}/>
                        
                </View>

                <View style={styles.inputfields}>
                <FontAwesome name="user-o" size={30} color={colors.thirdColor}/>
                    <TextInput
                        mode="outlined"
                        label="Last Name"
                        value={lName}
                        placeholderTextColor = {colors.thirdColor}
                        onChangeText = {(val) => setLName(val)}
                        autoCorrect={false}
                        style={styles.textInput}
                        theme={{
                            colors: {
                                placeholder: colors.thirdColor,
                                text: colors.thirdColor,
                                primary: colors.thirdColor,
                                underlineColor: 'transparent'
                            }
                    }}/>
                
                </View>
     
                <View style={styles.inputfields}>
                    <FontAwesome name="user-o" size={30} color={colors.firstColor}/>
                        <TextInput
                            mode="outlined"
                            label="E-Mail"
                            value={email}
                            placeholderTextColor = {colors.firstColor}
                            onChangeText = {(val) => setEmail(val)}
                            autoCorrect={false}
                            style={styles.textInput}
                            theme={{
                                colors: {
                                    placeholder: colors.firstColor,
                                    text: colors.firstColor,
                                    primary: colors.firstColor,
                                    underlineColor: 'transparent'
                                }
                        }}/>
                        
                </View>
                <View style={styles.inputfields}>
                    <FontAwesome name="user-o" size={30} color={colors.thirdColor} />
                        <TextInput
                            mode="outlined"
                            label="Username"
                            value={userName}
                            placeholderTextColor = {colors.thirdColor}
                            onChangeText = {(val) => setUsername(val)}
                            autoCorrect={false}
                            style={styles.textInput}
                            theme={{
                                colors: {
                                    placeholder: colors.thirdColor,
                                    text: colors.thirdColor,
                                    primary: colors.thirdColor,
                                    underlineColor: 'transparent'
                                }
                            }}/>
                        
                </View>

                <View style={styles.listWrapper}>
                    <TouchableRipple style={[styles.confirmBox,{backgroundColor:colors.secondColor}]} onPress={() => forumCheck()}>
                        <View style={styles.listItem1}>
                            <Icon name="check" size={25} color='white'/>
                            <Text style={styles.listItemText}>Confirm</Text>
                        </View>
                    </TouchableRipple>
                </View>

                <View style={styles.listWrapper}>
                    <TouchableRipple style={[styles.cancelBox,{backgroundColor:colors.fifthColor}]} onPress={() => cancelPressHandle()}>
                        <View style={styles.listItem1}>
                            <Icon name="cancel" size={25} color='white'/>
                            <Text style={styles.listItemText}>Cancel</Text>
                        </View>
                    </TouchableRipple>
                </View>

            </View>
        </View>
    </View>

    
    );
    
}

export default EditMyProfileView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'yellow',
    },
    inputfields: {
        flexDirection: 'row',
        marginTop: 5,
        marginBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'transparent',
        paddingBottom: 5,
    },
    textInput: {
        flex: 1,
        marginTop: 0,
        paddingLeft: 10,
        height: 35,
        color: '#05375a',
        marginLeft: 10,
    },
    icon: {
        height: 100,
        width: 100,
        borderRadius:15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fnamelname: {
        marginTop:10,
        fontSize: 23,
        fontWeight: 'bold',
        marginBottom: 10,
        color:'#D7A4FF'
    },
    listItemText: {
        color: 'white',
        marginLeft: 10,
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 27,
    },
    listWrapper: {
        marginTop: 10,
    },
    confirmBox: {
        flexDirection: 'row',
        width:370, 
        height:50,
        backgroundColor:'#9E8DFF',
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20, 
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderRadius: 25, 
        
    },
    cancelBox: {
        flexDirection: 'row',
        width:370, 
        height:50,
        backgroundColor:'#5CDBD5',
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20, 
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderRadius: 25, 
        top:5,
    },
    listItem1: {
        flexDirection: 'row',
        top: 10,
        left:10,
        
    },

  });