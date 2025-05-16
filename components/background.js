import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

function BloodDropBackground() {
  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <Path
          d="M100,0 Q70,50 100,100 Z"
          fill="#FF3B3B" // mesma cor da gota
        />
      </Svg>
    </View>
  );
}

export default BloodDropBackground;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
    width: '50%', // metade do ecrã
    zIndex: -1,
  },
});