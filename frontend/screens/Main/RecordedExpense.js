import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Button } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const RecordedExpense = () => {
  const [expenses, setExpenses] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const loadExpenses = async () => {
        try {
          const apiURL = 'http://localhost:3000/api/expenses';
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
      const response = await fetch(`http://localhost:3000/api/expenses/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorRes = await response.json();
        throw new Error(errorRes.error || `Failed to delete the expense. Status code: ${response.status}`);
      }
      setExpenses(currentExpenses => currentExpenses.filter(expense => expense._id !== id));
      Alert.alert('Success', 'Expense deleted successfully');
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
    <FlatList
      data={expenses}
      renderItem={renderItem}
      keyExtractor={(item, index) => `expense-${index}`}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 24,
  },
});

export default RecordedExpense;
