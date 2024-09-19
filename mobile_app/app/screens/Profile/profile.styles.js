import { Dimensions, StyleSheet } from "react-native";

import { COLORS } from "../../constants/theme";

const devWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    padding: 10,
    width: "100%"
  },
  detailsHeadingText: {
    color: COLORS.black,
    fontSize: 14,
  },
  detailsText: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: "600"
  },
  detailsTextView: {
    borderBottomColor: COLORS.grey,
    borderBottomWidth: 0.5,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingBottom: 2,
    paddingHorizontal: 10
  },
  languageView: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 0.5,
    paddingHorizontal: 5,
    paddingVertical: 3,
  }
});

export default styles;