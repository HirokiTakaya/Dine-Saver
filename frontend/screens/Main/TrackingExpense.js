import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';

const TrackingExpense = () => {
  const [expenseName, setExpenseName] = useState('');
  const [date, setDate] = useState(new Date());
  const [dateText, setDateText] = useState('');
  const [amount, setAmount] = useState('');

  const submitExpense = async () => {
   
    const apiUrl = 'http://localhost:3000/api/expenses';
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: expenseName,
          date: date.toISOString(), // Uses the date state which is updated by validateDate function
          amount: amount,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong!');
      }
  
      Alert.alert('Success', 'Expense added successfully!');
      setExpenseName('');
      setDate(new Date());
      setDateText(''); // Resetting the date text field as well
      setAmount('');
    } catch (error) {
      Alert.alert('Error', `Failed to add expense: ${error.toString()}`);
    }
  };

  const validateDate = (text) => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (datePattern.test(text)) {
      setDate(new Date(text));
      setDateText(text);
    } else {
      setDateText(text);
     
    }
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={expenseName}
        onChangeText={setExpenseName}
        placeholder="Expense Name"
      />
      <TextInput
        style={styles.input}
        value={dateText}
        onChangeText={validateDate}
        placeholder="Enter date (YYYY-MM-DD)"
      />
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={(text) => setAmount(text.replace(/[^0-9]/g, ''))}
        placeholder="Amount ($)"
        keyboardType="numeric"
      />
      <Button title="Add Expense" onPress={submitExpense} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'lightgray', 
   flex:1,
   padding:150,
    
  },
  input: {
    height: 48,
    borderColor: 'gray',
    borderWidth: 2,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  datePickerContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 15,
    marginBottom: 16,
  },
  dateText: {
    textAlign: 'center',
    fontSize: 18,
  },
  dateTimePicker: {
    backgroundColor: 'white',
    width: 320,
    height: 260,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});


export default TrackingExpense;
