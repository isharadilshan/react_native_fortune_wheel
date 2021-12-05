import React, {
	useReducer,
	useState,
	useRef,
	useEffect,
	forwardRef,
	useImperativeHandle,
} from 'react';
import {
	View,
	StyleSheet,
	Dimensions,
	Animated,
	TouchableOpacity,
	Image,
} from 'react-native';
import * as d3Shape from 'd3-shape';
import Svg, {G, Text, TSpan, Path, Pattern} from 'react-native-svg';
import {relativeWidth} from '../utils/view-helper';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const SpinWheel = forwardRef((props, ref) => {
	const {rewards} = props;
	const REWARD_COUNT = rewards.length;
	const NUMBER_OF_SEGMENTS = REWARD_COUNT;
	const FONT_SIZE = 20;
	const ONE_TURN = 360;
	const ANGLE_BY_SEGMENT = ONE_TURN / NUMBER_OF_SEGMENTS;
	const ANGLE_OFFSET = ANGLE_BY_SEGMENT / 2;
	const WINNER = 18;

	const _angle = useRef(new Animated.Value(0)).current;
	const angle = useRef(0);

	const initialState = {
		enabled: false,
		started: false,
		finished: false,
		winner: null,
		gameScreen: new Animated.Value(windowWidth - 40),
		wheelOpacity: new Animated.Value(1),
	};

	const [wheelPaths, setWheelPaths] = useState([]);
	const [wheelState, setWheelState] = useReducer((state, newState) => {
		return {...state, ...newState};
	}, initialState);

	useEffect(() => {
		setWheelPaths(makeWheel());
		angleListener();
	}, []);

	const makeWheel = () => {
		const data = Array.from({length: NUMBER_OF_SEGMENTS}).fill(1);
		const arcs = d3Shape.pie()(data);
		var colors = ['#F05F16', '#FDD091'];
		return arcs.map((arc, index) => {
			const instance = d3Shape
				.arc()
				.outerRadius(relativeWidth(150))
				.innerRadius(relativeWidth(20));
			return {
				path: instance(arc),
				color: colors[index % colors.length],
				value: rewards[index],
				centroid: instance.centroid(arc),
			};
		});
	};

	const tryAgain = () => {
		console.log('TRY AGAIN ------------------------');
		setWheelPaths(makeWheel());
		const nextState = {
			enabled: false,
			started: false,
			finished: false,
			winner: null,
			gameScreen: new Animated.Value(windowWidth - 40),
			wheelOpacity: new Animated.Value(1),
		};
		setWheelState(nextState);
		angleListener();
		onPress();
		console.log('WHEEL STATE ------------------------', wheelState);
	};

	const angleListener = () => {
		_angle.addListener((event) => {
			if (wheelState.enabled) {
				setWheelState({
					enabled: false,
					finished: false,
				});
			}

			angle.current = event.value;
		});
	};

	const getWinnerIndex = () => {
		const deg = Math.abs(Math.round(angle.current % ONE_TURN));
		// wheel turning counterclockwise
		if (angle.current < 0) {
			return Math.floor(deg / ANGLE_BY_SEGMENT);
		}
		// wheel turning clockwise
		return (
			(NUMBER_OF_SEGMENTS - Math.floor(deg / NUMBER_OF_SEGMENTS)) %
			NUMBER_OF_SEGMENTS
		);
	};

	const onPress = () => {
		const duration = 10000;

		setWheelState({
			started: true,
		});
		Animated.timing(_angle, {
			toValue:
				361 -
				WINNER * (ONE_TURN / NUMBER_OF_SEGMENTS) +
				360 * (duration / 1000),
			duration: duration,
			useNativeDriver: true,
		}).start(() => {
			const winnerIndex = getWinnerIndex();
			setWheelState({
				finished: true,
				winner: wheelPaths[winnerIndex].value,
			});
		});
	};

	useImperativeHandle(ref, () => ({
		onPress,
		tryAgain,
	}));

	const fillTextColor = (num) => {
		if (num % 2 === 0) {
			return '#FFDA0B';
		} else {
			return '#B90514';
		}
	};

	const textRender = (x, y, number, i) => (
		<Text
			x={x}
			y={y + 10}
			fill={fillTextColor(i)}
			textAnchor="start"
			fontSize={FONT_SIZE}
			fontWeight="500">
			{Array.from({length: number.length}).map((_, j) => {
				return (
					<TSpan rotate={270} x={x + 5} dy={-12} key={`arc-${i}-slice-${j}`}>
						{number.charAt(j)}
					</TSpan>
				);
			})}
		</Text>
	);

	const renderKnob = () => {
		const knobSize = 20;
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
					opacity: wheelState.wheelOpacity,
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
					style={{
						transform: [{translateY: 8}],
					}}>
					<Image
						source={require('./knob.png')}
						style={{width: knobSize, height: (knobSize * 100) / 57}}
					/>
				</Svg>
			</Animated.View>
		);
	};

	const renderSvgWheel = () => {
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
						backgroundColor: '#FFB53C',
						width: relativeWidth(290),
						height: relativeWidth(290),
						borderRadius: relativeWidth(290) / 2,
						opacity: wheelState.wheelOpacity,
					}}>
					<AnimatedSvg
						width={wheelState.gameScreen}
						height={wheelState.gameScreen}
						viewBox={`0 0 ${windowWidth} ${windowWidth}`}
						style={{
							transform: [{rotate: `-${ANGLE_OFFSET}deg`}],
							margin: 10,
						}}>
						<G y={windowWidth / 2} x={windowWidth / 2}>
							{wheelPaths.map((arc, i) => {
								const [x, y] = arc.centroid;
								const number = arc.value.toString();

								return (
									<G key={`arc-${i}`}>
										<Path d={arc.path} strokeWidth={2} fill={arc.color} />
										<G
											rotation={
												(i * ONE_TURN) / NUMBER_OF_SEGMENTS + ANGLE_OFFSET
											}
											origin={`${x}, ${y}`}>
											{textRender(x, y, number, i)}
										</G>
									</G>
								);
							})}
						</G>
					</AnimatedSvg>
					<View
						style={{
							height: 20,
							width: 20,
							borderRadius: 10,
							backgroundColor: 'red',
							position: 'absolute',
						}}
					/>
				</Animated.View>
			</View>
		);
	};

	return (
		<>
			<View
				style={{
					position: 'absolute',
				}}>
				{renderSvgWheel()}
			</View>
		</>
	);
});

export default SpinWheel;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
