import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TextInput, Image, Button } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as firebase from 'firebase';
import db from '../config';

export default class TransactionScreen extends React.Component {
    constructor(){
      super();
      this.state = {
        hasCameraPermissions: false,
        scanned: false,
        scannedData: '',
        buttonState: 'normal',
        scannedBookID: 'AA0000',
        scannedStudentID: 'AAAAA',
      }
    }

    getCameraPermissions = async (ID) =>{
      const {status} = await Permissions.askAsync(Permissions.CAMERA);
      
      this.setState({
        /*status === "granted" is true when user has granted permission
          status === "granted" is false when user has not granted the permission
        */
        hasCameraPermissions: status === "granted",
        buttonState: ID,
        scanned: false
      });
    }

    handleBarCodeScanned = async({type, data})=>{
      const {buttonState} = this.state
      if (buttonState =  'Book ID') {
      this.setState({
        scanned: true,
        scannedBookID: data,
        buttonState: 'normal'
      })
      }

      else if (buttonState = 'Student') {
        this.setState({
          scanned: true,
          scannedStudentID: data,
          buttonState: 'normal'
        })
      }
    }

    handleTransaction = async ()=>{
      db.collection("Transactions").add({
        'Student ID' : this.state.scannedStudentID,
        'Book ID' : this.state.scannedBookID,
        'Data' : firebase.firestore.Timestamp.now().toDate(),
        'Type' : "Issue"
      })

      db.collection("Books").doc(this.state.scannedBookID).update({
        'Availability' : false
      })

      db.collection("Students").doc(this.state.scannedStudentID).update({
        'Number Of Books Issued' : firebase.firestore.FieldValue.increment(1)
      })
  
      this.setState({
        scannedStudentID : '',
        scannedBookID: ''
      })
    }
    render() {
      const hasCameraPermissions = this.state.hasCameraPermissions;
      const scanned = this.state.scanned;
      const buttonState = this.state.buttonState;

      if (buttonState !== 'normal' && hasCameraPermissions){
        return(
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        );
      }

      else if (buttonState === "normal"){
        return(
          <View style={styles.container}>
            <Text style = {{fontSize: 33, fontFamily:'Times-new-roman', marginBottom:30,}}>LIBRARY APP</Text>

            <Image source = {{uri: 'https://i.pinimg.com/originals/b1/4e/21/b14e21dc0a95125054aba3a2cfac1f6b.png'}} style = {{width:150, height: 150, marginBottom: 70}}></Image>

          <Text style={styles.displayText}>{
            hasCameraPermissions===true ? this.state.scannedData: "Request Camera Permission"
          }</Text>     

          <TouchableOpacity
            onPress={this.getCameraPermissions}
            style={styles.scanButton}>
            <Text style={styles.buttonText}>Scan QR Code</Text>
          </TouchableOpacity>

           <TextInput style = {styles.input} placeholder = "Student Name" value = {this.state.scannedStudentID}></TextInput>

            <TouchableOpacity
           onPress = {() => {this.getCameraPermissions('Student')}}
           ><Text style = {styles.buttonText}>Scan Student</Text>
           </TouchableOpacity>

           <TextInput style = {styles.input} placeholder = "Book ID" value = {this.state.scannedBookID}></TextInput>

           <TouchableOpacity
           onPress = {() =>{this.getCameraPermissions('Book ID')}}
           ><Text style = {styles.buttonText}>Scan Book ID</Text>
           </TouchableOpacity>

           <Button title = 'SUBMIT' style = {styles.scanButton} onPress = {async()=>{this.handleTransaction()}}></Button>

          </View>
        );
      }
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'turquoise',
    },
    input: {
      width: 100,
      height: 20,
      fontSize:15,
      marginRight: 20,
    },
    displayText:{
      fontSize: 15,
      textDecorationLine: 'underline'
    },
    scanButton:{
      backgroundColor: '#2196F3',
      padding: 10,
      margin: 10
    },
    buttonText:{
      fontSize: 20,
    }
  });