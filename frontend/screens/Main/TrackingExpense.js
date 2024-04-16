import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

const TrackingExpense = () => {
  const [expenseName, setExpenseName] = useState('');
  const [dateText, setDateText] = useState('');
  const [amount, setAmount] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const messageTimer = useRef(null);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    return () => {
      if (messageTimer.current) {
        clearTimeout(messageTimer.current);
      }
    };
  }, []);

  const animateMessage = (isSuccess) => {
    setShowSuccessMessage(isSuccess);
    setErrorMessage(isSuccess ? '' : errorMessage);

    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    messageTimer.current = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setShowSuccessMessage(false);
        setErrorMessage('');
      });
    }, 3000);
  };

  const validateDate = (text) => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (datePattern.test(text) && !isNaN(new Date(text).getTime())) {
      setDateText(text);
      setErrorMessage('');
    } else {
      setDateText(text);
      setErrorMessage('Invalid date format. Please use YYYY-MM-DD.');
      animateMessage(false);
    }
  };

  const submitExpense = async () => {
    if (!dateText.match(/^\d{4}-\d{2}-\d{2}$/) || isNaN(new Date(dateText).getTime())) {
      setErrorMessage('Invalid date format. Please ensure the date is correct.');
      animateMessage(false);
      return;
    }

    const formattedDate = new Date(dateText).toISOString();
    const apiUrl = 'https://dine-saver.com/api/expenses';
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: expenseName,
          date: formattedDate,
          amount,
        }),
      });

      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(responseText || 'Something went wrong with the server response');
      }

      await response.json();
      animateMessage(true);

      setExpenseName('');
      setDateText('');
      setAmount('');
    } catch (error) {
      setErrorMessage(`Failed to add expense: ${error.toString()}`);
      animateMessage(false);
    }
  };
 
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.messageBox, { opacity }]}>
        {showSuccessMessage && (
          <Text style={styles.successMessage}>Expense added successfully!</Text>
        )}
        {errorMessage !== '' && (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}
      </Animated.View>

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

      <TouchableOpacity style={styles.button} onPress={submitExpense}>
        <Text style={styles.buttonText}>Add Expense</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    paddingHorizontal: 20,
  
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  input: {
    alignSelf: 'stretch',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 5,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#F7F7F7',
    shadowOpacity: 0.1,
   shadowRadius: 3,
    shadowColor: '#000',
    shadowOffset: { height: 1, width: 1 },
    textAlign: 'left',
  },

  button: {
    alignSelf: 'center',
    backgroundColor: 'skyblue',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    paddingHorizontal: 20,
    elevation: 3,
    width: '100%',
  },
   buttonText: {
     color: 'white',
     fontSize: 18,
     fontWeight: 'bold',
   },
 
   datePickerContainer: {
     borderColor: 'gray',
     borderWidth: 1,
     padding: 15,
     marginBottom: 16,
   },
   dateText: {
     textAlign: 'center',
     fontSize: 10,
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
   messageBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    alignSelf: 'stretch',
    marginBottom: 10,
    padding: 8,
    borderRadius: 4,
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 1000,
    alignItems: 'center',
    padding: 8,
  },
   successMessage: {
    backgroundColor: 'green',
    color: 'white',
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  successMessageText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorMessage: {
    backgroundColor: 'red',
    color: 'white',
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },

});


export default TrackingExpense;
