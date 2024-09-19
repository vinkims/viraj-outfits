import { Dimensions, StyleSheet } from "react-native";

import { COLORS } from "../../constants/theme";

const devWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  confirmButton: {
    alignItems: "center",
    borderRadius: 25,
    borderWidth: 0.2,
    height:50,
    justifyContent: "center",
    width: 80
  },
  confirmButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold"
  },
  confirmButtonsView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    width: "60%"
  },
  confirmRes: {
    // color: COLORS.primary,
    fontSize: 17,
    fontWeight: "500"
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
  agentMessageTitle: {
    color: COLORS.green,
    fontSize: 16,
    alignSelf: "center",
    marginBottom: 2
  },
  agentMessageText: {
    color: COLORS.black,
    fontSize: 12,
    fontFamily: "serif",
    marginLeft: 1,
    marginRight: 1,
  },
  container: {
    // backgroundColor: COLORS.white,
    height: "100%",
    paddingHorizontal: 10,
    width: "100%"
  },
  detailsView: {
    flexDirection: "row",
    marginTop: 10
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
  },
  modalParentView: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    // marginTop: 30,
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
  passwordRefreshView: {
    marginLeft: 20
  },
  passwordText: {
    color: COLORS.black,
    fontSize: 18,
    fontWeight: "500"
  },
  passwordTextView: {
    backgroundColor: COLORS.white,
    borderRadius: 5,
    borderWidth: 0.2,
    marginLeft: 10,
    padding: 5,
  },
  passwordView: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
    width: "90%"
  },
  passwordViewHeadingText: {
    color: COLORS.black,
    fontSize: 15,
  },
  scrollView: {
    // backgroundColor: COLORS.white,
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