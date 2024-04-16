import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Button, Animated } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const RecordedExpense = () => {
  const [expenses, setExpenses] = useState([]);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const fadeAnim = new Animated.Value(1); 

  useFocusEffect(
    React.useCallback(() => {
      const loadExpenses = async () => {
        try {
          const apiURL = 'https://dine-saver.com/api/expenses';
          const response = await fetch(apiURL);
          if (!response.ok) {
            const errorRes = await response.json();
            throw new Error(errorRes.error || `Failed to fetch expenses. Status code: ${response.status}`);
          }
          const result = await response.json();
          setExpenses(result);
        } catch (error) {
          Alert.alert('Error', error.message);
        }
      };
      loadExpenses();
    }, [])
  );

  const handleDeleteExpense = async (id) => {
    try {
      const response = await fetch(`https://dine-saver.com/api/expenses/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorRes = await response.json();
        throw new Error(errorRes.error || `Failed to delete the expense. Status code: ${response.status}`);
      }
      
      setFeedbackVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      }).start(() => {
        setExpenses(currentExpenses => currentExpenses.filter(expense => expense._id !== id));
        fadeAnim.setValue(1); 
        setFeedbackVisible(false); 
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.name}</Text>
      <Text>{item.date}</Text>
      <Text>${item.amount ? item.amount.toFixed(2) : '0.00'}</Text>
      <Button title="Delete" onPress={() => handleDeleteExpense(item._id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      {feedbackVisible && (
        <Animated.View style={[styles.feedback, { opacity: fadeAnim }]}>
          <Text style={styles.feedbackText}>Expense deleted successfully!</Text>
        </Animated.View>
      )}
    <FlatList
  data={expenses}
  renderItem={renderItem}
  keyExtractor={(item, index) => `expense-${index}`}
  contentContainerStyle={styles.listContentContainer}
  style={styles.list}
/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  item: {
    backgroundColor: 'silver',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
  },
  feedback: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'green',
    alignItems: 'center',
  },
  feedbackText: {
    color: 'white',
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  listContentContainer: {
    justifyContent: 'flex-end', 
   
    flexGrow: 1, 

  },
});

export default RecordedExpense;
