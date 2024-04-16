import React, { useState } from 'react';
import {
  Modal, View, TextInput, TouchableOpacity, FlatList, Text,
  Linking, Platform, KeyboardAvoidingView,StyleSheet
} from 'react-native';

const fetchRestaurants = async (location, term, setResults, setError) => {
  try {
    const url = `https://dine-saver.com/api/search?location=${encodeURIComponent(location)}&term=${encodeURIComponent(term)}`;
    const response = await fetch(url);
    const data = await response.json();
    if (!data.error) {
      setResults(data.businesses);
    } else {
      setError(data.message);
    }
  } catch (error) {
    setError(`Unable to fetch data: ${error.message}`);
  }
};

const RestaurantItem = ({ restaurant, onPress }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
    <Text style={styles.itemName}>{restaurant.name}</Text>
    <Text style={styles.itemDetail}>Rating: {restaurant.rating} / Reviews: {restaurant.review_count}</Text>
  </TouchableOpacity>
);

const SearchScreen = () => {
  const [location, setLocation] = useState('');
  const [term, setTerm] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const handleSearch = () => {
    if (!location.trim() || !term.trim()) {
      setError('Please enter both a location and a search term.');
      return;
    }
    setError('');
    fetchRestaurants(location, term, setResults, setError);
  };

  const openMap = (latitude, longitude, name) => {
    const label = encodeURIComponent(name);
    let url;

    if (Platform.OS === 'ios') {
      url = `maps://?q=${label}&ll=${latitude},${longitude}`;
    } else {
      url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&query_place_id=${label}`;
    }

    Linking.openURL(url).catch(err => console.error('An error occurred opening the map', err));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "position"}
      style={styles.container}
    >
      <TextInput
        style={styles.searchInput}
        value={location}
        onChangeText={setLocation}
        placeholder="Enter Location (e.g., Vancouver, Toronto)"
      />
      <TextInput
        style={styles.searchInput}
        value={term}
        onChangeText={setTerm}
        placeholder="Enter Search Term (e.g., Sushi, Starbucks)"
      />
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <FlatList
        data={results}
        renderItem={({ item }) => (
          <RestaurantItem
            restaurant={item}
            onPress={() => {
              setSelectedRestaurant(item);
              setIsModalVisible(true);
            }}
          />
        )}
        keyExtractor={item => item.id.toString()}
      />
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {selectedRestaurant && (
              <>
                <Text style={styles.modalText}>{selectedRestaurant.name}</Text>
                <Text>Rating: {selectedRestaurant.rating}</Text>
                <Text>Reviews: {selectedRestaurant.review_count}</Text>
                <TouchableOpacity
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => openMap(selectedRestaurant.coordinates.latitude, selectedRestaurant.coordinates.longitude, selectedRestaurant.name)}
                >
                  <Text style={styles.searchButtonText}>Open Map</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.searchButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};





const styles = StyleSheet.create({
  searchButton: {
    backgroundColor: 'skyblue', 
    paddingVertical: 10,        
    paddingHorizontal: 20,      
    borderRadius: 5,            
    alignItems: 'center',       
    marginTop: 10,         
    marginBottom:15,     
    shadowOpacity: 0.1,         
    shadowRadius: 5,           
    shadowColor: '#000',        
    shadowOffset: {height: 3, width: 0}, 
    borderRadius: 10, 
  },
  searchButtonText: {
    color: 'white',             
    fontSize: 18,               
    fontWeight: 'bold',         
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 5,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 10,
    marginTop:60,
    paddingTop: 20,
    flexDirection: 'column',
  },
  innerContainer: {
    flex: 1,
  },
  searchInput: {
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
    elevation: 2,
    textAlign: 'left',
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 5,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemDetail: {
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'red',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
    padding: 20,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  button: {
    borderRadius: 5,
    minWidth: 100,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    elevation: 2,
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowColor: '#000',
    shadowOffset: { height: 1, width: 1 },
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    marginBottom: 10,
  },
  buttonCancel: {
    backgroundColor: 'gray',
  },
  
});

export default SearchScreen;
