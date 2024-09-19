import React from "react";
import { View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

import { COLORS } from "../constants/theme";
import { useTheme } from "./ThemeContext";

const BackgroundWrapper = ({ children }) => {
  const { theme } = useTheme();

  const gradientColors = [theme.gradientStart, COLORS.white];

  return (
    <LinearGradient style={{ flex: 1}} colors={gradientColors}>
      {children}
    </LinearGradient>
  );
}

export default BackgroundWrapper;