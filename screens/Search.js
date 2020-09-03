import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import db from '../config'
import { FlatList } from 'react-native-gesture-handler';

class SearchScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            allTransactions: [],
            enteredBookID: "AA000",
            enteredStudentID: "AAAAA" 
        }
    }
    
    componentDidMount = async ()=>{
        var query = await db.collection("Transactions").get()
        query.docs.map((doc)=>{
          this.setState({
            allTransactions: [this.state.allTransactions, doc.data()],
          })
        })

        console.log(query)
      }

    render() {
        return(
        <View>
            <FlatList
          data={this.state.allTransactions}
          renderItem={({item})=>(
            <View style={{borderBottomWidth: 2}}>
              <Text>{"Book Id: " + item.BookID}</Text>
              <Text>{"Student id: " + item.StudentID}</Text>
              <Text>{"Transaction Type: " + item.Type}</Text>
              <Text>{"Date: " + item.Date}</Text>
            </View>
          )}
          keyExtractor= {(item, index)=> index.toString()}
        /> 
        </View>
        )
    }
}

export default SearchScreen