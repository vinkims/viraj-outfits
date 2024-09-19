import { Dimensions, StyleSheet } from "react-native";

import { COLORS } from "../../constants/theme";

const devWidth = Dimensions.get("window").width;
const devHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  actionButton: {
    alignItems: "center",
    // borderColor: COLORS.primary,
    borderRadius: 20,
    borderWidth: 0.5,
    height: 45,
    justifyContent: "center",
    marginTop: 10,
    shadowColor: COLORS.black,
    shadowOpacity: 1,
    shadowRadius: 10,
    width: "46%",
  },
  actionButtonText: {
    fontSize: 15
  },
  actionButtonsView: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between"
  },
  actionText: {
    color: COLORS.black,
    fontSize: 17,
    fontWeight: "700",
    marginTop: 20,
  },
  agentNameText: {
    color: COLORS.black,
    fontSize: 14,
    fontWeight: "700",
  },
  confirmButton: {
    alignItems: "center",
    borderRadius: 25,
    borderWidth: 0.5,
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
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    width: "60%"
  },
  container: {
    // backgroundColor: COLORS.white,
    flex: 1,
    height: "100%",
    padding: 10,
    width: "100%"
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5
  },
  dateModalView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  dateSelectContainer: {
    flexDirection: "row"
  },
  dateSelectText: {
    color: COLORS.black,
    fontSize: 14,
  },
  dateText: {
    color: COLORS.black,
    fontSize: 11
  },
  dateView: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderColor: COLORS.grey,
    borderRadius: 8,
    borderWidth: 0.5,
    height: 40,
    justifyContent: "center",
    width: 120,
  },
  detailsContainer: {
    // alignItems: "center",
    height: "90%"
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
    paddingHorizontal: 10,
  },
  detailsView: {
    flexDirection: "row"
  },
  dropdownErrorText: {
    color: COLORS.red,
    fontSize: 12,
    fontWeight: "600"
  },
  dropdownView: {
    marginTop: 30,
    width: "90%"
  },
  filterContainer: {
    flexDirection: "row",
    marginRight: 10,
  },
  filterImage: {
    height: 20,
    width: 20
  },
  filterText: {
    color: COLORS.red,
    fontSize: 14,
    fontWeight: "400",
    marginLeft: 5,
  },
  headingView: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  modalButton: {
    alignItems: "center",
    borderColor: COLORS.grey,
    borderRadius: 20,
    borderWidth: 0.5,
    padding: 10,
  },
  modalButtonApply: {
    backgroundColor: COLORS.green,
    marginLeft: 30,
    width: 150,
  },
  modalButtonCancel: {
    backgroundColor: COLORS.red,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 50,
    width: devWidth,
  },
  modalButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "500",
  },
  modalView: {
    backgroundColor: COLORS.white,
    height: devHeight,
    marginTop: 20,
    opacity: 0.95,
    padding: 10,
  },
  nameText: {
    color: COLORS.black
  },
  nameView: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  radioButton: {
    alignItems: "center",
    flexDirection: "row",
  },
  radioGroup: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    elevation: 4,
    flexDirection: "row",
    marginTop: 10,
    padding: 10,
    shadowColor: COLORS.black,
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  radioLabel: {
    color: COLORS.black,
    fontSize: 14,
    marginLeft: 8,
  },
  serialHeadingText: {
    color: COLORS.black
  },
  serialText: {
    color: COLORS.black,
    fontWeight: "bold"
  },
  statusModalText: {
    color: COLORS.black,
    fontSize: 15,
  },
  statusModalView: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  statusResetText: {
    color: COLORS.darkRed,
    fontSize: 15,
    fontWeight: "600",
    marginRight: 10,
  },
  statusText: {
    fontWeight: "600",
    textTransform: "capitalize"
  },
  stockContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 5,
    borderWidth: 0.4,
    marginTop: 10,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
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