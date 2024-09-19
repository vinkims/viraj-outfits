import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import { COLORS } from "../constants/theme";

const NoStockMessage = () => {
  
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    animate();
  }, []);

  const animate = () => {
    Animated.timing(translateY, {
      toValue: 1,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const translateYValue = translateY.interpolate({
    inputRange: [0, 1],
    outputRange: [-1, 0],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[ styles.centeredContent, { transform: [{ translateY: translateYValue }]}]}>
        <Icon name="exclamation-circle" size={50} color={COLORS.red} />
        <Text style={styles.noStockText}>No Stock</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredContent: {
    alignItems: "center",
    justifyContent: "center"
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  noStockText: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default NoStockMessage;