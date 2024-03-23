import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Linking, Platform, Modal } from 'react-native';

const RestaurantDetailScreen = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [isVisible, setIsVisible] = useState(false); 

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        
        const response = await fetch('http://localhost:3000/api/search?location=${encodeURIComponent(location)}&term=${encodeURIComponent(term)}');
        const data = await response.json();
        setRestaurant(data.businesses[0]); 
        setIsVisible(true); 
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
      }
    };

    fetchRestaurantData();
  }, []);

  const openMapsApp = () => {
    if (!restaurant || !restaurant.coordinates) {
      console.error('Invalid restaurant location data');
      return;
    }

    const latitude = restaurant.coordinates.latitude;
    const longitude = restaurant.coordinates.longitude;
    const label = encodeURIComponent(restaurant.name);
    let url;

    if (Platform.OS === 'ios') {
      url = `maps://?q=${label}&ll=${latitude},${longitude}`;
    } else {
      url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    }

    Linking.openURL(url).catch(err => console.error('An error occurred opening the map', err));
  };

  
  const onClose = () => {
    setIsVisible(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose} 
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {restaurant ? (
            <>
              <Text style={styles.title}>{restaurant.name}</Text>
              <Text>Rating: {restaurant.rating}</Text>
              <Text>Reviews: {restaurant.review_count}</Text>
              <Button
                title="Open in Maps"
                onPress={openMapsApp}
              />
              <Button
                title="Close"
                onPress={onClose} 
              />
            </>
          ) : (
            <Text>Loading...</Text>
          )}
        </View>
      </View>
    </Modal>
  );
};




const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
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
  title: {
    fontSize: 20,
    marginBottom: 8,
  },

});

export default RestaurantDetailScreen;
