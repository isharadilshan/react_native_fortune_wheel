import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Wheel from './src/components/wheel/Wheel.js';

const App = () => {
  return (
    <View style={styles.parentContainer}>
      <Text>cacvavca</Text>
      <Wheel />
    </View>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
