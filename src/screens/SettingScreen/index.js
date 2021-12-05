import React from 'react';
import {View, Button, Text} from 'react-native';

const SettingScreen = () => {
	return (
		<View>
			<Text>This is Setting Screen</Text>
			<Button title={'test crash'} />
		</View>
	);
};

export default SettingScreen;
