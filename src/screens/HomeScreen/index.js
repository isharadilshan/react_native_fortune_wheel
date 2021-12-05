import React, {useRef} from 'react';
import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Title, Subheading} from 'react-native-paper';
import SpinWheel from '../../components/SpinWheel';
import SpinWrapper from '../../components/wrappers/SpinWrapper';
import ScreenWrapper from '../../components/wrappers/ScreenWrapper';

const HomeScreen = () => {
	const childRef = useRef();
	const rewards = [
		'10',
		'200',
		'40',
		'100',
		'0',
		'10',
		'60',
		'90',
		'0',
		'10',
		'200',
		'40',
		'100',
		'0',
		'10',
		'60',
		'90',
		'0',
		'50',
		'300',
	];
	return (
		<ScreenWrapper>
			<SpinWrapper>
				<View style={{alignItems: 'center', height: 700}}>
					<View style={{alignItems: 'center', marginTop: 118}}>
						<Title
							style={{
								fontSize: 18,
								textAlign: 'center',
								width: 246,
								lineHeight: 22,
								color: 'white',
							}}>
							You have 5 winning chances remaining
						</Title>
						<Subheading
							style={{
								fontSize: 14,
								lineHeight: 29,
								color: 'white',
								textAlign: 'center',
							}}>
							{'Press “GO” button to spin the wheel'}
						</Subheading>
						<Title
							style={{
								color: '#FFDA0B',
								fontSize: 25,
								lineHeight: 29,
								textAlign: 'center',
							}}>
							0
						</Title>
					</View>
					<View style={{alignItems: 'center'}}>
						<SpinWheel ref={childRef} rewards={rewards} />
					</View>
					<View style={{position: 'absolute', bottom: 10}}>
						<TouchableOpacity
							onPress={() => childRef.current.onPress()}
							style={{
								height: 50,
								width: 50,
								borderRadius: 25,
								backgroundColor: 'red',
								justifyContent: 'center',
								alignItems: 'center',
							}}>
							<Text>Play</Text>
						</TouchableOpacity>
					</View>
				</View>
			</SpinWrapper>
		</ScreenWrapper>
	);
};

const styles = StyleSheet.create({
	parentContainer: {
		height: 1000,
		width: '100%',
		// flex: 1,
		// justifyContent: 'center',
		alignItems: 'center',
		// backgroundColor: 'white',
	},
});

export default HomeScreen;
