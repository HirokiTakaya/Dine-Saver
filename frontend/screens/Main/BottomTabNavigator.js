import React, { useRef, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';

import SearchScreen from './SearchScreen';
import TrackingExpense from './TrackingExpense';
import RecordedExpense from './RecordedExpense';
import { useAuth } from '../Logins/AuthContext';

const BottomTabNavigator = () => {
  const [activeTab, setActiveTab] = useState('Search');
  const [modalVisible, setModalVisible] = useState(false);
  const { signOut } = useAuth();
  const tabWidth = Dimensions.get('window').width / 4;

  const logout = async () => {
    try {
      await signOut();
      Alert.alert("Logout Successful", "You have been logged out.");
    } catch (error) {
      Alert.alert("Logout Failed", error.message);
    }
  };

  const Tab = ({ name, onPress, isLong }) => (
    <TouchableOpacity
      style={[
        styles.tab,
        activeTab === name && styles.tabActive,
        isLong && { height: 72 }
      ]}
      onPress={onPress || (() => {
        if (name === "Logout") {
          setModalVisible(true);
        } else {
          setActiveTab(name);
        }
      })}
      activeOpacity={0.7}
      accessibilityLabel={`Switch to ${name}`}
    >
      <Text
        style={[
          activeTab === name ? styles.tabTextActive : styles.tabText,
          isLong && { fontSize: 12, lineHeight: 16 }
        ]}
        numberOfLines={2}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Do you want to log out?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  logout();
                }}>
                <Text style={styles.textStyle}>Logout</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.screenContainer}>
        {activeTab === 'Search' && <SearchScreen />}
        {activeTab === 'Tracking Expense' && <TrackingExpense />}
        {activeTab === 'Recorded Expense' && <RecordedExpense />}
      </View>
      <View style={styles.tabBar}>
        <Tab name="Search" />
        <Tab name="Tracking Expense" isLong />
        <Tab name="Recorded Expense" isLong />
        <Tab name="Logout" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#DDD',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#2196F3',
    marginHorizontal: 4,
    elevation: 3,
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { height: 2, width: 0 },
  },
  tabText: {
    fontSize: 14,
    color: '#555',
    padding: 8,
    flexShrink: 1,
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  tabTextActive: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D47A1',
  },
  tabActive: {
    backgroundColor: '#E3F2FD',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: "#F44336",
    marginRight: 20,
  },
  buttonCancel: {
    backgroundColor: "#757575",
    marginLeft: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
  }
});

export default BottomTabNavigator;
