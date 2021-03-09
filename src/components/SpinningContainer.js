import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, Dimensions, Animated} from 'react-native';
import {State, PanGestureHandler} from 'react-native-gesture-handler';
import * as d3Shape from 'd3-shape';
import color from 'randomcolor';
import {snap} from '@popmotion/popcorn';
import SpinningWheel from './SpinningWheel';

const {width} = Dimensions.get('screen');

const NUMBER_OF_SEGMENTS = 12;
const WHEEL_SIZE = width * 0.8;
const FONT_SIZE = 26;
const ONE_TURN = 360;
const ANGLE_BY_SEGMENT = ONE_TURN / NUMBER_OF_SEGMENTS;
const ANGLE_OFFSET = ANGLE_BY_SEGMENT / 2;
const KNOB_COLOR = color({hue: 'purple'});

const makeWheel = () => {
	const data = Array.from({length: NUMBER_OF_SEGMENTS}).fill(1);
	const arcs = d3Shape.pie()(data);
	const colors = color({
		luminosity: 'dark',
		count: NUMBER_OF_SEGMENTS,
	});

	return arcs.map((arc, index) => {
		const instance = d3Shape
			.arc()
			.padAngle(0.02)
			.outerRadius(width / 2)
			.innerRadius(50);
		return {
			path: instance(arc),
			color: colors[index],
			value: Math.round(Math.random() * 10 + 1) * 200, //[200, 2200]
			centroid: instance.centroid(arc),
		};
	});
};

const SpinningContainer = () => {
	const _wheelPaths = makeWheel();
	const _angle = useRef(new Animated.Value(0)).current;
	const angle = useRef(0);

	const [enabled, setEnabled] = useState(true);
	const [finished, setFinished] = useState(false);
	const [winner, setWinner] = useState(null);

	useEffect(() => {
		_angle.addListener((event) => {
			if (enabled) {
				setEnabled(false);
				setFinished(false);
			}
			angle.current = event.value;
		});
	}, []);

	const renderWinner = () => {
		return <Text style={styles.winnerText}>Winner is: {winner}</Text>;
	};

	const getWinnerIndex = () => {
		const deg = Math.abs(Math.round(angle.current % ONE_TURN));
		return Math.floor(deg / ANGLE_BY_SEGMENT);
	};

	const onPan = ({nativeEvent}) => {
		if (nativeEvent.state === State.END) {
			const {velocityY} = nativeEvent;
			Animated.decay(_angle, {
				velocity: velocityY / 1000,
				deceleration: 0.999,
				useNativeDriver: true,
			}).start(() => {
				console.log('ANGLE ---------------------', angle);
				_angle.setValue(angle.current % ONE_TURN);
				const snapTo = snap(ONE_TURN / NUMBER_OF_SEGMENTS);
				Animated.timing(_angle, {
					toValue: snapTo(angle.current),
					duration: 300,
					useNativeDriver: true,
				}).start(() => {
					const winnerIndex = getWinnerIndex();
					setEnabled(true);
					setFinished(true);
					setWinner(_wheelPaths[winnerIndex].value);
				});
			});
		}
	};

	return (
		<PanGestureHandler onHandlerStateChange={onPan} enabled={enabled}>
			<View style={styles.container}>
				<SpinningWheel _angle={_angle} _wheelPaths={_wheelPaths} />
				{finished && enabled && renderWinner()}
			</View>
		</PanGestureHandler>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	winnerText: {
		fontSize: 32,
		fontFamily: 'Menlo',
		position: 'absolute',
		bottom: 10,
	},
});

export default SpinningContainer;
