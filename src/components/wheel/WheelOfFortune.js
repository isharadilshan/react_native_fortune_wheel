import React, {Component} from 'react';
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

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const {width, height} = Dimensions.get('screen');

class WheelOfFortune extends Component {
	constructor(props) {
		super(props);
		this.state = {
			enabled: false,
			started: false,
			finished: false,
			winner: null,
			gameScreen: new Animated.Value(width - 20),
			wheelOpacity: new Animated.Value(1),
			imageLeft: new Animated.Value(width / 2 - 30),
			imageTop: new Animated.Value(height / 2 - 70),
		};
		this.angle = 0;

		this.prepareWheel();
	}

	prepareWheel = () => {
		this.Rewards = [
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
		this.RewardCount = this.Rewards.length;

		this.numberOfSegments = this.RewardCount;
		this.fontSize = 20;
		this.oneTurn = 360;
		this.angleBySegment = this.oneTurn / this.numberOfSegments;
		this.angleOffset = this.angleBySegment / 2;
		this.winner = Math.floor(Math.random() * this.numberOfSegments);

		this._wheelPaths = this.makeWheel();
		this._angle = new Animated.Value(0);
	};

	resetWheelState = () => {
		this.setState({
			enabled: false,
			started: false,
			finished: false,
			winner: null,
			gameScreen: new Animated.Value(width - 40),
			wheelOpacity: new Animated.Value(1),
			imageLeft: new Animated.Value(width / 2 - 30),
			imageTop: new Animated.Value(height / 2 - 70),
		});
	};

	_tryAgain = () => {
		this.prepareWheel();
		this.resetWheelState();
		this.angleListener();
		this._onPress();
	};

	angleListener = () => {
		this._angle.addListener((event) => {
			if (this.state.enabled) {
				this.setState({
					enabled: false,
					finished: false,
				});
			}

			this.angle = event.value;
		});
	};

	componentDidMount() {
		this.angleListener();
	}

	makeWheel = () => {
		const data = Array.from({length: this.numberOfSegments}).fill(1);
		const arcs = d3Shape.pie()(data);
		var colors = ['#F05F16', '#FDD091'];
		return arcs.map((arc, index) => {
			const instance = d3Shape
				.arc()
				.outerRadius(width / 2 - 10)
				.innerRadius(20);
			return {
				path: instance(arc),
				color: colors[index % colors.length],
				value: this.Rewards[index],
				centroid: instance.centroid(arc),
			};
		});
	};

	_getWinnerIndex = () => {
		const deg = Math.abs(Math.round(this.angle % this.oneTurn));
		// wheel turning counterclockwise
		if (this.angle < 0) {
			return Math.floor(deg / this.angleBySegment);
		}
		// wheel turning clockwise
		return (
			(this.numberOfSegments - Math.floor(deg / this.angleBySegment)) %
			this.numberOfSegments
		);
	};

	_onPress = () => {
		const duration = 3000;

		this.setState({
			started: true,
		});
		Animated.timing(this._angle, {
			toValue:
				365 -
				this.winner * (this.oneTurn / this.numberOfSegments) +
				360 * (duration / 1000),
			duration: duration,
			useNativeDriver: true,
		}).start(() => {
			const winnerIndex = this._getWinnerIndex();
			this.setState({
				finished: true,
				winner: this._wheelPaths[winnerIndex].value,
			});
			// this.props.getWinner(this._wheelPaths[winnerIndex].value, winnerIndex);
		});
	};

	_textRender = (x, y, number, i) => (
		<Text
			x={x - number.length * 5}
			y={y - 70}
			fill="#fff"
			textAnchor="middle"
			fontSize={this.fontSize}>
			{Array.from({length: number.length}).map((_, j) => {
				return (
					<TSpan x={x} dy={this.fontSize} key={`arc-${i}-slice-${j}`}>
						{number.charAt(j)}
					</TSpan>
				);
			})}
		</Text>
	);

	_renderSvgWheel = () => {
		return (
			<View style={styles.container}>
				{this._renderKnob()}
				<Animated.View
					style={{
						alignItems: 'center',
						justifyContent: 'center',
						transform: [
							{
								rotate: this._angle.interpolate({
									inputRange: [-this.oneTurn, 0, this.oneTurn],
									outputRange: [
										`-${this.oneTurn}deg`,
										`0deg`,
										`${this.oneTurn}deg`,
									],
								}),
							},
						],
						backgroundColor: '#FFB53C',
						width: width - 20,
						height: width - 20,
						borderRadius: (width - 20) / 2,
						borderWidth: 2,
						borderColor: '#FFB53C',
						opacity: this.state.wheelOpacity,
					}}>
					<AnimatedSvg
						width={this.state.gameScreen}
						height={this.state.gameScreen}
						viewBox={`0 0 ${width} ${width}`}
						style={{
							transform: [{rotate: `-${this.angleOffset}deg`}],
							margin: 10,
						}}>
						<G y={width / 2} x={width / 2}>
							{this._wheelPaths.map((arc, i) => {
								const [x, y] = arc.centroid;
								const number = arc.value.toString();

								return (
									<G key={`arc-${i}`}>
										<Path d={arc.path} strokeWidth={2} fill={arc.color} />
										<G
											rotation={
												(i * this.oneTurn) / this.numberOfSegments +
												this.angleOffset
											}
											origin={`${x}, ${y}`}>
											{this._textRender(x, y, number, i)}
										</G>
									</G>
								);
							})}
						</G>
					</AnimatedSvg>
				</Animated.View>
			</View>
		);
	};

	_renderKnob = () => {
		const knobSize = 20;
		// [0, this.numberOfSegments]
		const YOLO = Animated.modulo(
			Animated.divide(
				Animated.modulo(
					Animated.subtract(this._angle, this.angleOffset),
					this.oneTurn,
				),
				new Animated.Value(this.angleBySegment),
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
					opacity: this.state.wheelOpacity,
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

	_renderTopToPlay() {
		if (this.state.started == false) {
			return (
				<TouchableOpacity onPress={() => this._onPress()}>
					<Text style={{color: 'red', fontSize: 40}}>play button</Text>
				</TouchableOpacity>
			);
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<TouchableOpacity
					style={{
						position: 'absolute',
						width: width,
						height: height / 2,
						justifyContent: 'center',
						alignItems: 'center',
					}}
					onPress={() => this._onPress()}>
					<Animated.View style={[styles.content, {padding: 10}]}>
						{this._renderSvgWheel()}
					</Animated.View>
				</TouchableOpacity>
				{this._renderTopToPlay()}
			</View>
		);
	}
}

export default WheelOfFortune;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	content: {},
	startText: {
		fontSize: 50,
		color: '#fff',
		fontWeight: 'bold',
		textShadowColor: 'rgba(0, 0, 0, 0.4)',
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 10,
	},
});
