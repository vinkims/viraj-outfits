import { Dimensions, StyleSheet } from "react-native";

import { COLORS } from "../../constants/theme";

const devWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    // backgroundColor: COLORS.white,
    height: "100%",
    padding: 10,
    width: "100%",
  },
  resetText: {
    color: COLORS.black,
    fontSize: 16
  },
  toastContainer: {
    alignItems: "center",
    borderRadius: 10,
    elevation: 5,
    height: 100,
    justifyContent: "center",
    shadowColor: COLORS.grey,
    shadowOffset: {
      height: 2,
      width: 0
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    width: devWidth * 0.8,
  },
  toastHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
  },
  toastHeaderView: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%"
  },
  toastImage: {
    height: 30,
    width: 30
  },
  toastMessage: {
    fontSize: 15
  },
  toastRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: "90%"
  },
  toastText: {
    padding: 2,
    width: "70%"
  },
  validationText: {
    alignSelf: "flex-start",
    color: COLORS.red,
    fontSize: 12,
    fontWeight: "bold",
    paddingLeft: 20
  }
});

export default styles;