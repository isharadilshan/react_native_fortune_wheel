import React from 'react';
import {StyleSheet, View, Dimensions, Animated} from 'react-native';
import Svg, {Path, G, Text, TSpan} from 'react-native-svg';
import color from 'randomcolor';

const {width} = Dimensions.get('screen');

const NUMBER_OF_SEGMENTS = 12;
const WHEEL_SIZE = width * 0.8;
const FONT_SIZE = 26;
const ONE_TURN = 360;
const ANGLE_BY_SEGMENT = ONE_TURN / NUMBER_OF_SEGMENTS;
const ANGLE_OFFSET = ANGLE_BY_SEGMENT / 2;
const KNOB_COLOR = color({hue: 'purple'});

const SpinningWheel = ({_angle, _wheelPaths}) => {
	const renderKnob = () => {
		const knobSize = 30;
		const YOLO = Animated.modulo(
			Animated.divide(
				Animated.modulo(Animated.subtract(_angle, ANGLE_OFFSET), ONE_TURN),
				new Animated.Value(ANGLE_BY_SEGMENT),
			),
			1,
		);

		return (
			<Animated.View
				style={{
					width: knobSize,
					height: knobSize * 2,
					justifyContent: 'flex-end',
					zIndex: 1,
					transform: [
						{
							rotate: YOLO.interpolate({
								inputRange: [-1, -0.5, -0.0001, 0.0001, 0.5, 1],
								outputRange: [
									'0deg',
									'0deg',
									'35deg',
									'-35deg',
									'0deg',
									'0deg',
								],
							}),
						},
					],
				}}>
				<Svg
					width={knobSize}
					height={(knobSize * 100) / 57}
					viewBox={`0 0 57 100`}
					style={{transform: [{translateY: 8}]}}>
					<Path
						d="M28.034,0C12.552,0,0,12.552,0,28.034S28.034,100,28.034,100s28.034-56.483,28.034-71.966S43.517,0,28.034,0z   M28.034,40.477c-6.871,0-12.442-5.572-12.442-12.442c0-6.872,5.571-12.442,12.442-12.442c6.872,0,12.442,5.57,12.442,12.442  C40.477,34.905,34.906,40.477,28.034,40.477z"
						fill={KNOB_COLOR}
					/>
				</Svg>
			</Animated.View>
		);
	};

	return (
		<View style={styles.container}>
			{renderKnob()}
			<Animated.View
				style={{
					alignItems: 'center',
					justifyContent: 'center',
					transform: [
						{
							rotate: _angle.interpolate({
								inputRange: [-ONE_TURN, 0, ONE_TURN],
								outputRange: [`-${ONE_TURN}deg`, `0deg`, `${ONE_TURN}deg`],
							}),
						},
					],
				}}>
				<Svg
					width={WHEEL_SIZE}
					height={WHEEL_SIZE}
					viewBox={`0 0 ${width} ${width}`}
					style={{transform: [{rotate: `-${ANGLE_OFFSET}deg`}]}}>
					<G y={width / 2} x={width / 2}>
						{_wheelPaths.map((arc, i) => {
							const [x, y] = arc.centroid;
							const number = arc.value.toString();
							return (
								<G key={`arc-${i}`}>
									<Path d={arc.path} fill={arc.color} />
									<G
										rotation={
											(i * ONE_TURN) / NUMBER_OF_SEGMENTS + ANGLE_OFFSET
										}
										origin={`${x}, ${y}`}>
										<Text
											x={x}
											y={y - 70}
											fill="white"
											textAnchor="middle"
											fontSize={FONT_SIZE}>
											{Array.from({length: number.length}).map((_, j) => {
												return (
													<TSpan
														x={x}
														dy={FONT_SIZE}
														key={`arc-${i}-slice-${j}`}>
														{number.charAt(j)}
													</TSpan>
												);
											})}
										</Text>
									</G>
								</G>
							);
						})}
					</G>
				</Svg>
			</Animated.View>
		</View>
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

export default React.memo(SpinningWheel);
