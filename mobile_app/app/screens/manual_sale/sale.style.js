import { StyleSheet } from "react-native";

import { COLORS } from "../../constants/theme";

const styles = StyleSheet.create({
  confirmRes: {
    color: COLORS.primary,
    fontSize: 17,
    fontWeight: "800"
  },
  confirmText: {
    color: COLORS.black,
    fontFamily: "serif",
    fontSize: 20,
    fontWeight: "bold"
  },
  confirmTitle: {
    color: COLORS.black,
    fontSize: 17
  },
  container: {
    // backgroundColor: COLORS.white,
    flex: 1,
    padding: 10
  },
  detailsView: {
    flexDirection: "row",
    marginTop: 10
  },
  formView: {
    alignItems: "center",
    flex: 1
  },
  headingText: {
    alignSelf: "center",
    color: COLORS.black,
    fontSize: 17
  },
  modalParentView: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    width: "80%"
  },
  modalView: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    height: "90%",
    justifyContent: "center",
    marginTop: 30,
    opacity: 0.9
  },
});

export default styles;
