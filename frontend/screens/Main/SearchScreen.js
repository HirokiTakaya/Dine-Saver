import React, { useState } from 'react';
import { Modal, View, TextInput, Button, FlatList, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';


const fetchRestaurants = async (location, term, setResults, setError) => {
  try {
    const url = `http://localhost:3000/api/search?location=${encodeURIComponent(location)}&term=${encodeURIComponent(term)}`;
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
  const [restaurant, setRestaurant] = useState(null);
  const handleSearch = () => {
    if (!location.trim() || !term.trim()) {
      setError('Please enter both a location and a search term.');
      return;
    }
    setError('');
    fetchRestaurants(location, term, setResults, setError);
  };
  const openMap = (latitude, longitude) => {
    if (!latitude || !longitude) {
      console.error('Invalid restaurant location data');
      return;
    }
  
    const label = encodeURIComponent(selectedRestaurant.name);
    let url;
  
    if (Platform.OS === 'ios') {
      url = `maps://?q=${label}&ll=${latitude},${longitude}`;
    } else {
      url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    }
  
    Linking.openURL(url).catch(err => console.error('An error occurred opening the map', err));
  };
  

  const renderItem = ({ item }) => (
    <RestaurantItem
      restaurant={item}
      onPress={() => {
        setSelectedRestaurant(item);
        setIsModalVisible(true);
      }}
    />
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        value={location}
        onChangeText={setLocation}
        placeholder="Enter Location (e.g., Tokyo, Shibuya)"
      />
      <TextInput
        style={styles.searchInput}
        value={term}
        onChangeText={setTerm}
        placeholder="Enter Search Term (e.g., Sushi, Starbucks)"
      />
      <Button title="Search" onPress={handleSearch} />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(!isModalVisible)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {selectedRestaurant && (
              <>
                <Text style={styles.modalText}>{selectedRestaurant.name}</Text>
                <Text>Rating: {selectedRestaurant.rating}</Text>
                <Text>Reviews: {selectedRestaurant.review_count}</Text>
                
                <Button
  title="Map"
  onPress={() => openMap(selectedRestaurant.coordinates.latitude, selectedRestaurant.coordinates.longitude)}
/>

              </>
            )}
            <Button
              title="Close"
              onPress={() => setIsModalVisible(!isModalVisible)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};






const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 40,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 5,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  itemName: {
    fontSize: 18,
  },
  itemDetail: {
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default SearchScreen;
