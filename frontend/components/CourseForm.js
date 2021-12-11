import React, { useEffect, useState } from 'react';
import { View, StyleSheet, DynamicColorIOS, Alert } from 'react-native';
import { TextInput, Button, RadioButton, Text, useTheme} from 'react-native-paper';
import TimePickerInput from './TimePickerInput';

const DaysRadioButton = (props) => {
    const [isSelected, setSelected] = useState(false);
    const { colors } = useTheme(); //THEME

    useEffect(() => {
        setSelected(props.selectedDays[props.index][props.day]);
    })
    return (
        <View style={styles.daysRadio}>
            <Text>{props.day}</Text>
            <RadioButton 
                status={isSelected ? 'checked' : 'unchecked'}
                color={colors.radioButtonColor}
                onPress={() => {
                    setSelected(!isSelected);
                    let selectedDaysBuffer = [...props.selectedDays];
                    const day_key = Object.keys(selectedDaysBuffer[props.index])
                    selectedDaysBuffer[props.index][day_key[0]] = !isSelected;
                    props.setSelectedDays(selectedDaysBuffer);
                }}
            />
        </View>
    )
}

const CourseForm = (props) => {
    const [courseName, setcourseName] = useState(props.courseName);
    const [courseNumber, setCourseNumber] = useState(props.courseNumber);
    const [startHour, setStartHour] = useState(props.startHour);
    const [startMin, setStartMin] = useState(props.startMin);
    const [endHour, setEndHour] = useState(props.endHour);
    const [endMin, setEndMin] = useState(props.endMin);
    const [selectedDays, setSelectedDays] = useState(
        [{SUN: false}, {MON: false}, {TUE: false}, {WED: false},
         {THU: false}, {FRI: false}, {SAT: false}]);

    const { colors } = useTheme(); //THEME
    
    useEffect(() => {
        let iterator = props.selectedDays.values();
        let propsDay = iterator.next().value;
        let selectedDaysBuffer = selectedDays.map(day => {
            if (propsDay in day) {
                const newDay = {[propsDay]: true};
                propsDay = iterator.next().value;
                return newDay;
            }
                return day;
        });
        setSelectedDays(selectedDaysBuffer);
    }, []);

    const submitToParent = () => {
        let trimSelectedDays = [];
        selectedDays.forEach(day => {
            day_key = Object.keys(day);
            if (day[day_key[0]] === true)
                trimSelectedDays.push(day_key[0]);
        })

        const returnJSON = JSON.stringify({
            "course_name": `${courseName}`,
            "course_number": `${courseNumber}`,
            "time_start": `${startHour}:${startMin}`,
            "time_end": `${endHour}:${endMin}`,
            "day_name": trimSelectedDays
        })

        props.setReturnedJSON(returnJSON);
        props.setLoadingButton(!props.loadingButton);
    }

    //function for validation
    const inputValidation = () => {
        console.log("*** inputValidation Running ***");
        //course name may only contain letters
        var courseNameRegex = /^[A-Za-z]+$/;
        //course number may only contain numbers
        var courseNumberRegex = /^[0-9]+$/;

        if(courseName.length == 0){
            Alert.alert("Please enter a course name");
        }
        else if(courseName.length > 5){ 
            Alert.alert("Course names may only contain 5 letters");
        }
        else if(!(courseNameRegex.test(courseName))){
            Alert.alert("Course names may only contain letters");
        }
        else if(courseNumber.length == 0){
            Alert.alert("Please enter a course number");
        }
        else if(courseNumber.length > 5){ 
            Alert.alert("Course number may only contain 5 digits");
        }
        else if(!(courseNumberRegex.test(courseNumber))){
            Alert.alert("Course number may only contain numbers");
        }
        else{
            submitToParent();
        }
    }

    return (
        <View>
            <View style={[styles.inputBox, {backgroundColor: colors.secondColor, marginTop: 20}]}>
                <TextInput 
                    label="Course Name"
                    value={courseName}
                    onChangeText={text => setcourseName(text)}
                    style={[styles.input]}
                />
            </View>
            <View style={[styles.inputBox,  {backgroundColor: colors.thirdColor}]}>
                <TextInput   
                    label="Course Number"
                    value={courseNumber}
                    onChangeText={text => setCourseNumber(text)}
                    style={styles.input}
                />
            </View>

            <View style={styles.daysRadioBar}>
                <DaysRadioButton index={0} day="SUN" selectedDays={selectedDays} setSelectedDays={setSelectedDays}/>
                <DaysRadioButton index={1} day="MON" selectedDays={selectedDays} setSelectedDays={setSelectedDays}/>
                <DaysRadioButton index={2} day="TUE" selectedDays={selectedDays} setSelectedDays={setSelectedDays}/>
                <DaysRadioButton index={3} day="WED" selectedDays={selectedDays} setSelectedDays={setSelectedDays}/>
                <DaysRadioButton index={4} day="THU" selectedDays={selectedDays} setSelectedDays={setSelectedDays}/>
                <DaysRadioButton index={5} day="FRI" selectedDays={selectedDays} setSelectedDays={setSelectedDays}/>
                <DaysRadioButton index={6} day="SAT" selectedDays={selectedDays} setSelectedDays={setSelectedDays}/>
            </View>

            <TimePickerInput
                label="Start Time"
                hour={startHour}
                min={startMin}
                setHour={setStartHour}
                setMin={setStartMin}
                
            />

            <TimePickerInput
                label="End Time"
                hour={endHour}
                min={endMin}
                setHour={setEndHour}
                setMin={setEndMin}
            /> 

            <View style={styles.buttons}>   
                <Button icon="check"  color='black' loading={props.loadingButton} onPress={inputValidation} mode="contained" style={{ backgroundColor: colors.firstColor}}>Submit</Button>
                <Button icon="cancel" color='black' onPress={() => {props.navigation.pop()}} mode="contained" style={{ backgroundColor: colors.fifthColor}}>Cancel</Button>
                <>{/*Both buttons here for some reason color 'black' makes it white*/}</>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    inputBox: {
        width: 350, 
        borderRadius: 20,
        height: 55,
        paddingHorizontal: 16,
        fontSize: 16, 
        color: 'white',
        overflow: 'hidden',
        alignSelf: 'center',
        marginVertical: 10,
    },
    input: {
        backgroundColor: 'transparent',
        margin: -6,
        overflow: 'hidden'
    },  
    buttons: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginTop: 30,
        
    },
    daysRadioBar: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    daysRadio: {
        flexDirection: "column",
        alignItems: "center"
    },

    courseInfoInput: {
        width:350, 
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20, 
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderRadius: 25, 
        height:55,
        paddingHorizontal: 16, 
        fontSize: 16, 
        marginVertical: 10,
        alignSelf: 'center'
        
    }
})


export default CourseForm;
