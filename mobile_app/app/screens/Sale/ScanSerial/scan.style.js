import { StyleSheet } from "react-native";

import { COLORS } from "../../../constants/theme";

const styles = StyleSheet.create({
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  captureButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    // marginTop: 5,
  },
  captureButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    alignItems: "center",
    // backgroundColor: COLORS.black,
    flex: 1,
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",
    padding: 10,
    width: "100%"
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  serialText: {
    color: COLORS.red,
    fontSize: 17
  },
  text: {
    color: COLORS.white,
    fontSize: 20,
  }
});

export default styles;