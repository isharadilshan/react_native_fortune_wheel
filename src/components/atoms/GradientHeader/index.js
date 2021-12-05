import React from 'react';
import {Header} from '@react-navigation/stack';
import {StatusBar} from 'react-native';
import GradientBackground from '../../wrappers/GradientBackground';

const GradientHeader = (props) => {
	return (
		<GradientBackground
			style={{height: StatusBar.currentHeight}}
			color={['#282882', '#B44182']}>
			<Header {...props} />
		</GradientBackground>
	);
};

export default GradientHeader;
