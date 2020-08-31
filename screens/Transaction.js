import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TextInput, Image, Button, KeyboardAvoidingView } from 'react-native';
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
        scannedBookID: 'AA000',
        scannedStudentID: 'AAAAA',
        type: "ISSUE"
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

    async BookEledigible(bookID) {
      var bookRef = await db.collection("Books").where("Book ID", "==", bookID).get()
      var type = "";
      console.log(bookRef.docs)
      if (bookRef.docs.length == 0) {
        type = false
      }
      else {
        bookRef.docs.map((doc)=>{
          var book = doc.data()
          if (book.Availability) {
            type = "Issue"
          }
          else {
            type = "Return"
          }
        })
      }
console.log(type)
      return type
      

    }

    async StudentEledigible(studentID) {
      var studentRef = await db.collection("Students").where("Student ID", "==", studentID).get()
      var type = "";
      console.log(studentRef.docs)
      if (studentRef.docs.length == 0) {
        this.setState({
          scannedStudentID: "",
          scannedBookID: '',
        })
        type = false;
        console.log("Student ID does not exist in the database")
      }
      else {
        studentRef.docs.map((doc)=>{
          var student = doc.data()
          if (student.Number_Of_Books_Issued < 2) {
            type = true
          }
          else {
            type = false
          }
        })
      }
      console.log(type)

      return type

    }
    

    initiateBookIssue = async()=>{

      //add a transaction
      db.collection("Transactions").add({
        'Student ID': this.state.scannedStudentID,
        'Book ID' : this.state.scannedBookID,
        'Date' : firebase.firestore.Timestamp.now().toDate(),
        'Type': "Issue"
      })
      //change book status
      db.collection("Books").doc(this.state.scannedBookID).update({
        'Availability': false
      })
      //change number  of issued books for student
      db.collection("Students").doc(this.state.scannedStudentID).update({
        'Number_Of_Books_Issued': firebase.firestore.FieldValue.increment(1)
      })
    }

    initiateBookReturn = async()=>{
      //add a transaction
      db.collection("Transactions").add({
        'Student ID': this.state.scannedStudentID,
        'Book ID' : this.state.scannedBookID,
        'Date' : firebase.firestore.Timestamp.now().toDate(),
        'Type': "Return"
      })
      //change book status
      db.collection("Books").doc(this.state.scannedBookID).update({
        'Availability': true
      })
      //change number  of issued books for student
      db.collection("Students").doc(this.state.scannedStudentID).update({
        'Number_Of_Books_Issued': firebase.firestore.FieldValue.increment(-1)
      })
    }

    handleTransaction =  ()=>{
      console.log("handled")
      var transType =  this.BookEledigible(this.state.scannedBookID);
      console.log(transType)
      if (!transType) {
        console.log("The Book Does Not Exist In The Database.")
        this.setState({
          scannedStudentID: "",
          scannedBookID: '',
        })
      }

      else if (transType === "Issue") {
        var studentEledigible = this.StudentEledigible(this.scannedStudentID);
        console.log("Issued")
        if (!studentEledigible) {
          console.log("Student has reached limit of books issued.")
            this.setState({
              scannedStudentID: "",
              scannedBookID: '',
            })
        }

        else {
          var transactionMessage
      db.collection("Books").doc(this.state.scannedBookID).get()
      .then((doc)=>{
          //snapshot.forEach((doc)=>{
            var book = doc.data()
            if(book.Availability){
                this.initiateBookIssue();       
                transactionMessage = "Book Issued"
                console.log(transactionMessage)
            }
            else{
                this.initiateBookReturn();
                transactionMessage = "Book Returned"
                console.log(transactionMessage)
            }
    })
        }
      }
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

          <KeyboardAvoidingView style = {styles.container} behavior = "padding" enabled>

           <TextInput style = {styles.input} placeholder = "Student Name" value = {this.state.scannedStudentID} onChangeText = {text => {this.setState({scannedStudentID: text})}}></TextInput>

            <TouchableOpacity
           onPress = {() => {this.getCameraPermissions('Student')}}
           ><Text style = {styles.buttonText}>Scan Student</Text>
           </TouchableOpacity>

           <TextInput style = {styles.input} placeholder = "Book ID" value = {this.state.scannedBookID} onChangeText = {text => {this.setState({scannedBookID: text})}}></TextInput>

           <TouchableOpacity
           onPress = {() =>{this.getCameraPermissions('Book ID')}}
           ><Text style = {styles.buttonText}>Scan Book ID</Text>
           </TouchableOpacity>

           </KeyboardAvoidingView>

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