import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

import { COLORS } from "../constants/theme";
import { useTheme } from "../theme/ThemeContext";

export default function SubmitButton({ btnTitle, submit }) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity style={[styles.buttonView, {backgroundColor: theme.primaryColor}]} onPress={submit}>
      <Text style={styles.buttonText}>{btnTitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonView: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.lightGrey,
    borderRadius: 30,
    borderWidth: 1,
    height: 50,
    justifyContent: "center",
    marginTop: 40,
    width: "90%",
  },
  buttonText: {
    alignSelf: "center",
    color: COLORS.white,
    fontSize: 18
  }
});