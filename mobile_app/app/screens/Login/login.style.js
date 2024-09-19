import { Dimensions, StyleSheet } from "react-native";

import { COLORS } from "../../constants/theme";

const devWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    height: "100%",
    width: "100%",
  },
  credentialsContainer: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    width: "100%"
  },
  image: {
    height: "20%",
    marginTop: 20,
    resizeMode: "contain",
    width: "50%",
  },
  imageMapema: {
    height: 150,
    marginTop: 20,
    width: 150
  },
  loginContainer: {
    alignItems: "center",
    height: "40%",
    width: "100%",
  },
  logoContainer: {
    alignItems: "center"
  },
  logoText: {
    fontFamily: "monospace",
    fontSize: 70,
    fontWeight: "bold",
    marginBottom: 20
  },
  resetContainer: {
    marginTop: 20
  },
  resetText: {
    color: COLORS.red,
    fontSize: 16,
  },
  textInput: {
    borderRadius: 5,
    borderWidth: 1,
    height: 50,
    marginTop: 10,
    width: "90%"
  },
  textInputHeading: {
    alignSelf: "flex-start",
    fontWeight: "bold"
  },
  textInputView: {
    alignItems: "center",
    width: "100%"
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
  versionText: {
    color:COLORS.black,
    fontWeight: 'bold',
    marginTop: 30,
  }
});

export default styles;