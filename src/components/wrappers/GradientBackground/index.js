import React from 'react';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';

const GradientBackground = ({children, color, rest}) => (
	<LinearGradient
		colors={color || ['#282882', '#B44182']}
		start={{x: 0, y: 0}}
		end={{x: 1, y: 0}}
		{...rest}>
		{children}
	</LinearGradient>
);

GradientBackground.propTypes = {
	children: PropTypes.node,
	color: PropTypes.array,
	rest: PropTypes.object,
};

export default GradientBackground;
