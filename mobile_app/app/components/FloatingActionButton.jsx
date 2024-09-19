import React, { useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { Easing, useSharedValue, withSpring, useAnimatedStyle } from "react-native-reanimated";

import { COLORS } from "../constants/theme";

export default function FloatingActionButton() {
  const scale = useSharedValue(0);
  const isOpen = useRef(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: scale.value,
      display: scale.value === 0 ? 'none' : 'flex',
    }
  })

  const toggleButtons = () => {
    scale.value = withSpring(
      isOpen.current ? 0 : 1, 
      {
        damping: 5,
        stiffness: 80,
        easing: Easing.inOut(Easing.ease)
      }, 
      (isFinished) => {
        if (isFinished) {
          isOpen.current = !isOpen.current;
        }
      })
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.subButton, animatedStyle]}>
        <TouchableOpacity style={styles.button} onPress={toggleButtons}>
          <Text style={styles.buttonText}>Main</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.subButtonItem}>
          <Text style={styles.buttonText}>Button 1</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: COLORS.red,
    borderRadius: 28,
    elevation: 3,
    justifyContent: "center",
    padding: 10
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    bottom: 16,
    right: 100,
    position: "absolute",
  },
  subButton: {
    position: "absolute",
  },
  subButtonItem: {
    alignItems: "center",
    backgroundColor: COLORS.green,
    borderRadius: 20,
    elevation: 3,
    justifyContent: "center",
    marginVertical: 10,
    padding: 10,
  }
});