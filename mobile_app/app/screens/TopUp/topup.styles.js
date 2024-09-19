import { Dimensions, StyleSheet } from "react-native";

import { COLORS } from "../../constants/theme";

const devWidth = Dimensions.get("window").width;
const devHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    padding: 10,
    width: "100%"
  },
  formView: {
    alignItems: "center",
    height: "100%",
    width: "100%"
  },
  headingText: {
    alignSelf: "center",
    color: COLORS.black,
    fontSize: 17
  }
});

export default styles;