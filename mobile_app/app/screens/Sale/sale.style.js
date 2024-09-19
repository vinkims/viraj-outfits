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
    height: "100%",
    padding: 10,
    width: "100%"
  },
  detailsView: {
    flexDirection: "row",
    marginTop: 10
  },
  dropdownErrorText: {
    alignSelf: "flex-start",
    color: COLORS.red,
    fontSize: 12,
    fontWeight: "bold",
    paddingLeft: 20
  },
  dropdownHeadingText: {
    alignSelf: "flex-start",
    color: COLORS.black,
    marginLeft: 20,
  },
  formView: {
    alignItems: "center",
    height: "100%",
    width: "100%"
  },
  modalText: {
    color: COLORS.white,
    fontSize: 20
  },
  modalParentView: {
    alignItems: "center",
    flex: 1,
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
  numberContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  numberView: {
    width: "45%"
  },
  saleHeadingText : {
    alignSelf: "center",
    color: COLORS.black,
    fontSize: 17
  },
  scanContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 5
  },
  scanImage: {
    width: 50,
    height: 50
  },
  scanText: {
    color: COLORS.red
  },
  scrollView: {
    backgroundColor: COLORS.white,
  },
  sellText: {
    alignSelf: "center",
    color: COLORS.black,
    fontSize: 16
  },
  serialCaptureButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    padding: 5
  },
  serialCaptureButtonsView: {
    flexDirection: "row"
  },
  serialCaptureButtonText: {
    color: COLORS.white,
    fontSize: 16
  },
  serialCaptureView: {
    alignItems: "center",
    flex: 0.2,
    marginTop: 10
  },
  serialText: {
    color: COLORS.white,
    fontSize: 17,
  },
  serialView: {
    alignItems: "center",
    marginTop: 10,
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
});

export default styles;