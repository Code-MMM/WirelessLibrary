import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Image, TouchableOpacity } from 'react-native';
import db from '../config'
import { TextInput } from 'react-native-gesture-handler';
import * as firebase from "firebase"

export default class LoginScreen extends React.Component {
    constructor() {
        super()
        this.state = {
            password: '',
            email: '',
        }
    }

    login = async (email, pass) => {
        if (email && pass) {
            try {
                const response = await firebase.auth().signInWithEmailAndPassword(email, pass)
                if (response) {
                    this.props.navigation.nagivate("Transaction")
                }
            }
            
            catch(error) {
                switch(error.code) {
                    case "auth/user-not-found": 
                    alert("User Not Found")
                    break;

                    case "auth/invalid-email":
                    alert("Incorrect E-mail or Password")
                    break;
                }
            }
        }
    }

    render() {
        return(
                <KeyboardAvoidingView style = {{alignItems: "center", marginTop: 10}}>
                    <View>
                        <Image source = {require("../Images/book.png")} style = {{width: 200, height: 200}}></Image>
                        <Text style = {{alignSelf: "center", fontSize: 36}}>Wireless Library App!</Text>
                    </View>

                    <View>
                        <TextInput style = {{width: 200, height:50, borderWidth:3}} placeholder = "abc@gmail.com" 
                        keyboardType = "email-address" onChangeText = {(text)=>{
                            this.setState({
                                email:text
                            })
                        }}></TextInput>

                        <TextInput style = {{width: 200, height:50, borderWidth:3}} placeholder = "Password" 
                        keyboardType = "default" onChangeText = {(text)=>{
                            this.setState({
                                password:text
                            })
                        }}></TextInput>
                    </View>
                    <View>
                        <TouchableOpacity style = {{borderRadius:10, width:200, height:50, borderWidth:3}} onPress =  {()=>{this.login(this.state.email, this.state.password)}}>
                        <Text>LOGIN</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
        )
    }
}