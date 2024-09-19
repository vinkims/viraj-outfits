import React from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { COLORS } from "../constants/theme";

const devWidth = Dimensions.get("window").width;

export default function ToastComponent({ title, message, closeToast, color }) {
  let background = !!color ? color : (title === 'Error' ? COLORS.red : COLORS.green);
  
  return (
    <View style={[styles.container, {backgroundColor: background}]}>
      <View style={styles.headerView}>
        <Text style={styles.headerText}>{title}</Text>
        <TouchableOpacity onPress={closeToast}>
          <Image source={require('../assets/images/cancel.png')} style={styles.image}/>
        </TouchableOpacity>
      </View>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    elevation: 5,
    height: 100,
    justifyContent: "center",
    paddingHorizontal: 20,
    shadowColor: COLORS.grey,
    shadowOffset: {
      height: 2,
      width: 0
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    width: devWidth * 0.8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
  },
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%"
  },
  image: {
    height: 30,
    width: 30
  },
  message: {
    fontSize: 15
  }
});