import React, { useRef,useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';

// Import ProfileScreen, SearchScreen, TrackingExpense, RecordedExpense
// Please adjust the paths as necessary
import SearchScreen from './SearchScreen';
import TrackingExpense from './TrackingExpense';
import RecordedExpense from './RecordedExpense';
import { useAuth } from '../Logins/AuthContext';

const BottomTabNavigator = () => {
  const [activeTab, setActiveTab] = useState('Search');
  const [modalVisible, setModalVisible] = useState(false);
  const { signOut } = useAuth(); // Get signOut from useAuth
 
  const logout = () => {
    signOut() // Logout from Firebase Auth
    .then(() => {
      Alert.alert("Logout Successful", "You have been logged out.");
      // Add any other state updates or navigation actions here if necessary
    })
    .catch((error) => {
      Alert.alert("Logout Failed", error.message);
    });
  };
  
  const Tab = ({ name, onPress }) => (
    <TouchableOpacity
      style={activeTab === name ? styles.tabActive : styles.tab}
      onPress={onPress || (() => setActiveTab(name))}>
      <Text style={activeTab === name ? styles.tabTextActive : styles.tabText}>
        {name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Do you want to logout?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  logout(); // Execute logout process
                }}>
                <Text style={styles.textStyle}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>No</Text>
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
        <Tab name="Tracking Expense" />
        <Tab name="Recorded Expense" />
        <Tab name="Logout" onPress={() => setModalVisible(true)} />
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
    paddingVertical: 10,
    backgroundColor: '#EEE',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  tabText: {
    color: 'gray',
  },
  tabTextActive: {
    color: 'tomato',
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
    backgroundColor: "#2196F3",
    marginRight: 10, 
  },

  buttonCancel: {
    backgroundColor: "red", 
    marginLeft: 10, 
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
    textAlign: "center"
  }
});

export default BottomTabNavigator;