import React from 'react';
import {StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';

const SpinWrapper = ({children, color, style}) => (
	<View style={{...styles.container, ...style}}>
		<LinearGradient colors={color || ['#282882', '#B44182']}>
			{children}
		</LinearGradient>
	</View>
);

const styles = StyleSheet.create({
	container: {
		borderRadius: 14,
		overflow: 'hidden',
		marginTop: 16,
	},
});

SpinWrapper.propTypes = {
	children: PropTypes.node,
	color: PropTypes.array,
	style: PropTypes.object,
};

export default SpinWrapper;
