import React from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';

const ScreenWrapper = ({children, color, noPaddings}) => {
	return (
		<View
			style={{
				flex: 1,
				backgroundColor: 'white',
				paddingHorizontal: noPaddings ? 0 : 16,
			}}>
			{children}
		</View>
	);
};

ScreenWrapper.propTypes = {
	children: PropTypes.node,
	color: PropTypes.string,
	noPaddings: PropTypes.bool,
};

export default ScreenWrapper;
