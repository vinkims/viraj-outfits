import { Dimensions, StyleSheet } from "react-native";

import { COLORS } from "../../constants/theme";

const devWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  agentSearchbar: {
    height: 50,
    marginTop: 5,
    width: "80%"
  },
  allocationView: {
    borderColor: COLORS.grey,
    borderRadius: 5,
    borderWidth: 1,
    // height: 60,
    marginTop: 10,
    padding: 5
  },
  confirmButton: {
    alignItems: "center",
    borderRadius: 25,
    borderWidth: 0.2,
    height:50,
    justifyContent: "center",
    width: 80
  },
  confirmButtonsView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    width: "60%"
  },
  confirmButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold"
  },
  confirmText: {
    color: COLORS.black,
    fontFamily: "serif",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center"
  },
  container: {
    // backgroundColor: COLORS.white,
    flex: 1,
    height: "100%",
    padding: 10,
    width: "100%",
  },
  detailsView: {
    flexDirection: "row"
  },
  dropdownErrorText: {
    alignSelf: "flex-start",
    color: COLORS.red,
    fontSize: 12,
    fontWeight: "bold",
    paddingLeft: 20
  },
  flatlistView: {
    maxHeight: "60%",
    width: "90%"
  },
  formView: {
    alignItems: "center",
    width: "100%"
  },
  headingText: {
    alignSelf: "flex-start",
    color: COLORS.black,
    paddingLeft: 20,
  },
  modalParentView: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    marginTop: 30,
    width: "80%"
  },
  modalView: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    height: "90%",
    justifyContent: "center",
    marginTop: 30,
    opacity: 0.9,
  },
  nameText: {
    color: COLORS.black
  },
  nameView: {
    flexDirection: "row",
    justifyContent: "space-between"
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
  scrollView: {
    backgroundColor: COLORS.white,
  },
  searchBar: {
    height: 50,
    marginTop: 5,
    width: "70%"
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 5
  },
  selectText: {
    color: COLORS.primary,
    fontSize: 14
  },
  selectView: {
    marginLeft: 10,
    justifyContent: "center"
  },
  serialConfirmText: {
    alignSelf: "center",
    color: COLORS.black,
    fontSize: 16,
    fontWeight: "bold",
  },
  serialHeadingText: {
    color: COLORS.black
  },
  serialText: {
    color: COLORS.black,
    fontWeight: "bold"
  }
});

export default styles;