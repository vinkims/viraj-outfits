import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { Easing, Extrapolate, interpolate, useAnimatedStyle, useDerivedValue, useSharedValue, withDelay, withSpring, withTiming } from "react-native-reanimated";

import { COLORS } from "../constants/theme";

export default function FloatingButton({ showThird, firstText, secondText, thirdText }) {
  const first = useSharedValue(30);
  const second = useSharedValue(30);
  const third = useSharedValue(30);
  const firstWidth = useSharedValue(60);
  const secondWidth = useSharedValue(60);
  const thirdWidth = useSharedValue(60);
  const isOpen = useSharedValue(false);
  const opacity = useSharedValue(0);
  const progress = useDerivedValue(() => isOpen.value ? withTiming(1) : withTiming(0));

  const handlePress = () => {
    const config = {
      easing: Easing.bezier(0.68, -0.6, 0.32, 1.6),
      duration: 500,
    };
    if (isOpen.value) {
      firstWidth.value = withTiming(60, { duration: 100 }, finish => {
        if (finish) {
          first.value = withTiming(30, config);
        }
      });
      secondWidth.value = withTiming(60, { duration: 100 }, finish => {
        if (finish) {
          second.value = withDelay(50, withTiming(30, config));
        }
      });
      thirdWidth.value = withTiming(60, { duration: 100 }, finish => {
        if (finish) {
          third.value = withDelay(100, withTiming(30, config));
        }
      });
      opacity.value = withTiming(0, { duration: 100 });
    } else {
      first.value = withDelay(200, withSpring(130));
      second.value = withDelay(100, withSpring(210));
      third.value = withSpring(290);
      firstWidth.value = withDelay(1200, withSpring(200));
      secondWidth.value = withDelay(1100, withSpring(200));
      thirdWidth.value = withDelay(1000, withSpring(200));
      opacity.value = withDelay(1200, withSpring(1));
    }
    isOpen.value = !isOpen.value;
  }

  const opacityText = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    }
  });

  const firstWidthStyle = useAnimatedStyle(() => {
    return {
      width: firstWidth.value
    }
  });

  const secondWidthStyle = useAnimatedStyle(() => {
    return {
      width: secondWidth.value
    }
  });

  const thirdWidthStyle = useAnimatedStyle(() => {
    return {
      width: thirdWidth.value
    }
  });

  const firstIcon = useAnimatedStyle(() => {
    const scale = interpolate(
      first.value,
      [30, 130],
      [0, 1],
      Extrapolate.CLAMP
    )

    return {
      bottom: first.value,
      transform: [{scale: scale}],
    }
  })

  const secondIcon = useAnimatedStyle(() => {
    const scale = interpolate(
      second.value,
      [30, 130],
      [0, 1],
      Extrapolate.CLAMP
    )

    return {
      bottom: second.value,
      transform: [{scale: scale}],
    }
  })

  const thirdIcon = useAnimatedStyle(() => {
    const scale = interpolate(
      third.value,
      [30, 290],
      [0, 1],
      Extrapolate.CLAMP
    )

    return {
      bottom: third.value,
      transform: [{scale: scale}],
    }
  })

  const plusIcon = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${progress.value * 45}deg`}]
    }
  })

  return (
    <View style={styles.container}>
      {showThird && <Animated.View style={[styles.contentContainer, thirdIcon, thirdWidthStyle, {backgroundColor: COLORS.lightBlue}]}>
        <View style={styles.iconContainer}>
          <Image source={require("../assets/images/reassign.png")} style={styles.iconImage} />
        </View>
        <Animated.Text style={[styles.text, opacityText]}>{thirdText}</Animated.Text>
      </Animated.View> }
      <Animated.View style={[styles.contentContainer, secondIcon, secondWidthStyle, {backgroundColor: COLORS.green}]}>
        <View style={styles.iconContainer}>
          <Image source={require("../assets/images/return.png")} style={styles.iconImage} />
        </View>
        <Animated.Text style={[styles.text, opacityText]}>{secondText}</Animated.Text>
      </Animated.View>
      <Animated.View style={[styles.contentContainer, firstIcon, firstWidthStyle, {backgroundColor: COLORS.lightOrange}]}>
        <View style={styles.iconContainer}>
          <Image source={require("../assets/images/broken-file.png")} style={styles.iconImage} />
        </View>
        <Animated.Text style={[styles.text, opacityText]}>{firstText}</Animated.Text>
      </Animated.View>
      
      <Pressable style={[styles.contentContainer]} onPress={() => handlePress()}>
        <Animated.View style={[styles.iconContainer, plusIcon]}>
          <Image source={require("../assets/images/plus.png")} style={styles.iconImage} />
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    alignItems: "center",
    backgroundColor: COLORS.red,
    borderRadius: 50,
    bottom: 30,
    flexDirection: "row",
    right: 30,
    overflow: "hidden",
    position: "absolute"
  },
  iconContainer: {
    alignItems: "center",
    height: 60,
    justifyContent: "center",
    width: 60
  },
  iconImage: {
    height: 30,
    width: 30
  },
  text: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "600",
  }
});