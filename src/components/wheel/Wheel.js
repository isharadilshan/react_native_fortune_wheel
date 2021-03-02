import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text as RNText,
  Dimensions,
  Animated,
} from 'react-native';
import {State, PanGestureHandler} from 'react-native-gesture-handler';
import Svg, {Path, G, Text, TSpan} from 'react-native-svg';
import * as d3Shape from 'd3-shape';
import color from 'randomcolor';
import {snap} from '@popmotion/popcorn';

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
      .padAngle(0.01)
      .outerRadius(width / 2)
      .innerRadius(20);
    return {
      path: instance(arc),
      color: colors[index],
      value: Math.round(Math.random() * 10 + 1) * 200, //[200, 2200]
      centroid: instance.centroid(arc),
    };
  });
};

const Wheel = () => {
  const _wheelPaths = makeWheel();
  const _angle = useRef(new Animated.Value(0)).current;
  const angle = useRef(0);

  const [enabled, setEnabled] = useState(true);
  const [finished, setFinished] = useState(false);
  const [winner, setWinner] = useState(null);

  // useEffect(() => {
  //   _angle.addListner((event) => {
  //     if (enabled) {
  //       setEnabled(false);
  //       setFinished(false);
  //     }
  //     angle.current = event.value;
  //   });
  // }, []);

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
        _angle.setValue(angle % ONE_TURN);
        const snapTo = snap(ONE_TURN / NUMBER_OF_SEGMENTS);
        Animated.timing(_angle, {
          toValue: snapTo(angle),
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          const winnerIndex = getWinnerIndex();
          setEnabled(true);
          setFinished(true);
          setWinner(this._wheelPaths[winnerIndex].value);
        });
      });
    }
  };

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

  const renderWinner = () => {
    return <RNText style={styles.winnerText}>Winner is: {winner}</RNText>;
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

  return (
    <PanGestureHandler onHandlerStateChange={onPan} enabled={enabled}>
      <View style={styles.container}>
        {renderSvgWheel()}
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

export default Wheel;
