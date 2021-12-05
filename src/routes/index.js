import React, {useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import SettingScreen from '../screens/SettingScreen';
import GradientHeader from '../components/atoms/GradientHeader';
import GradientBackground from '../components/wrappers/GradientBackground';
import {HOME, SETTINGS} from './route-paths';

const Stack = createStackNavigator();

const Routes = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={{
					headerStyle: {
						backgroundColor: 'transparent',
					},
					headerTintColor: 'white',
					header: (props) => {
						return <GradientHeader {...props} />;
					},
					headerBackground: () => <GradientBackground />,
				}}>
				<Stack.Screen
					name={HOME}
					options={{title: 'Spin & Win'}}
					component={HomeScreen}
				/>
				<Stack.Screen
					name={SETTINGS}
					options={{title: 'Settings'}}
					component={SettingScreen}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default Routes;
