import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Wheel from './src/components/wheel/Wheel.js';
import SpinningContainer from './src/components/SpinningContainer';

const App = () => {
	return (
		<View style={styles.parentContainer}>
			<Text>cacvavca</Text>
			<SpinningContainer />
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
