import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

function AuthScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Button
        title="SIgnup"
        onPress={() => navigation.navigate('SignUp')}
      />
      <Button
        title="Login"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AuthScreen;
