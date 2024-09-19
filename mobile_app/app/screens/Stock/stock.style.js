import { Dimensions, StyleSheet } from "react-native";

import { COLORS } from "../../constants/theme";

const devWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: COLORS.white,
    flex: 1,
    padding: 10
  },
  dateHeadingText: {
    color: COLORS.black,
    fontSize: 11,
    fontWeight: "400"
  },
  dateText: {
    color: COLORS.black,
    fontSize: 11,
    fontWeight: "600"
  },
  detailsView: {
    flexDirection: "row"
  },
  nameText: {
    color: COLORS.black
  },
  nameView: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  noStockContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%"
  },
  noStockText: {
    color: "#333",
    fontSize: 20,
    fontWeight: "bold"
  },
  serialHeadingText: {
    color: COLORS.black
  },
  serialText: {
    color: COLORS.black,
    fontWeight: "bold"
  },
  stockContainer: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.grey,
    borderRadius: 10,
    borderWidth: 1,
    elevation: 5,
    marginVertical: 5,
    padding: 5,
  },
});

export default styles;