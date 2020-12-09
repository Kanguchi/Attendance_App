import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity} from 'react-native';
import db from '../config';
import AppHeader from '../components/AppHeader';

export default class HomeScreen extends Component{
  constructor(){
    super();
    this.state={
      all_students: [],
      presentPressedList: [],
      absentPressedList: [],
    }
  }
  componentDidMount=async()=>{
    var classRef = await db.ref('classA/');
    classRef.on('value', data =>{
      var all_students = []
      var class_a = data.val();
      for (var i in class_a) {
        all_students.push(class_a[i]);
      }
      all_students.sort(function(a, b) {
        return a.roll_no - b.roll_no;
      });
      this.setState({
        all_students: all_students
      });
    });
  }

  updateAttendence(roll_no, status) {
    var id = '';
    if (roll_no <= 9){
      id = '0' + roll_no;
    } else {
      id = roll_no;
    }

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    today = dd + '-' + mm + '-' + yyy;
    var ref_path = 'classA/'+id+'/';
    var class_ref = db.ref(ref_path);
    class_ref.update({
      [today]: status,
    });
  }

  goToSummaryScreen=()=>{
    this.props.navigation.navigate('SummaryScreen');
  }

  
  render(){
    var all_students = this.state.all_students;
    if (all_students.length === 0){
      return(
        <View>
          <AppHeader />
          <Text>No Students Found</Text>
        </View>
      )
    }else{
      return(
      <View style={styles.container}>
        <AppHeader />
        <View style={{flex: 3, backgroundColor: '#798FA7'}}>
          {all_students.map((student, index) => (
              <View key={index} style={styles.studentChartContainer}>
                  <View
                  key={'name' + index}
                  style={{ flex: 1, flexDirection: 'row' }}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold',marginRight: 10 }}>
                    {student.roll_no}.
                  </Text>
                  <Text style={{ fontSize: 15, fontWeight:'bold' }}>{student.name}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  
                  <TouchableOpacity
                    style={
                      this.state.presentPressedList.includes(index)
                        ? [styles.presentButton, { backgroundColor: '#00D30D' }]
                        : styles.presentButton
                    }
                    onPress={() => {
                      var presentPressedList = this.state.presentPressedList;
                      presentPressedList.push(index);
                      this.setState({ presentPressedList: presentPressedList });
                      var roll_no = index + 1;
                      this.updateAttendence(roll_no, 'present');
                    }}>
                    <Text>Present</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={
                      this.state.absentPressedList.includes(index)
                        ? [styles.absentButton, { backgroundColor: 'red' }]
                        : styles.absentButton
                    }
                    onPress={() => {
                      var absentPressedList = this.state.absentPressedList;
                      absentPressedList.push(index);
                      this.setState({ absentPressedList: absentPressedList });
                      var roll_no = index + 1;
                      this.updateAttendence(roll_no, 'absent');
                    }}>
                    <Text>Absent</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            <View style={{ alignItems: 'center', flex: 1 }}>
            <TouchableOpacity
              style={styles.footer}
              onPress={() => {
                this.props.navigation.navigate('SummaryScreen');
              }}>
              <Text style={{fontSize: 25, color: '#D5DBDB'}}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
    }
    
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  studentChartContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    margin: 20,
  
  },
  presentButton: {
    width: 70,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 4,
  },
  absentButton: {
    width: 70,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
  },
  footer: {
    width: 200,
    height: 67,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F3A57',
    marginTop:10, 
    borderRadius: 10,
    borderWidth: 7,
    borderColor: 'rgba(0,0,0,0.4)'
  },
});

