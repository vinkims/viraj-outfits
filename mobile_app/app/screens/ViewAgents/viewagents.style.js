import { StyleSheet } from "react-native";

import { COLORS } from "../../constants/theme";

const styles = StyleSheet.create({
  agentCard: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.lightGrey,
    borderRadius: 8,
    elevation: 2,
    marginVertical: 10,
    padding: 5,
  },
  agentInfo: {
    marginBottom: 5,
  },
  agentName: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  agentNameText: {
    color: COLORS.black,
    flex: 0.5,
    fontSize: 15,
    fontWeight: "600"
  },
  agentNameView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  agentPhoneContainer: {
    flexDirection: "row",
    paddingRight: 5,
  },
  agentPhoneDetailsText: {
    color: COLORS.black,
    fontSize: 14,
    fontWeight: "600",
  },
  agentPhoneHeadingText: {
    color: COLORS.black,
    fontSize: 13
  },
  agentPhoneText: {
    flex: 0.5,
    fontSize: 15,
    fontWeight: "600"
  },
  agentPhoneView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  agentView: {
    borderColor: COLORS.grey,
    borderRadius: 5,
    borderWidth: 0.6,
    marginTop: 10,
    padding: 5,
    width: "100%"
  },
  container: {
    flex: 1,
    height: "100%",
    padding: 10,
    width: "100%"
  },
  modalParentView: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
    width: "80%"
  },
  modalView: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    justifyContent: "center",
    marginTop: 10
  },
  sortContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5
  },
  sortOption: {
    borderColor: COLORS.black,
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  sortOrder: {
    alignItems: "center",
    backgroundColor: COLORS.lightGrey,
    borderRadius: 5,
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  sortOptionText:{
    color: COLORS.black,
    fontSize: 16,
    fontWeight: "bold"
  },
  sortRadioContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  sortRadioText: {
    color: COLORS.black,
    fontSize: 14,
    marginLeft: 5,
  },
  sortRadioView: {
    flexDirection: "row"
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  stockInfo: {
    flexDirection: "row",
    marginTop: 5,
  },
  stockNumberContainer: {
    flex: 1,
    flexDirection: "column"
  },
  stockNumberHeading: {
    color: COLORS.black,
    fontWeight: "500",
    textTransform: "capitalize"
  },
  stockNumberText: {
    color: COLORS.black,
    fontWeight: "800"
  },
  stockNumberView: {
    flexDirection: "row",
  },
  stockStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  stockStatusView: {
    flex: 0.7,
    marginLeft: 10
  },
  stockText: {
    color: COLORS.black,
    fontSize: 14,
    marginBottom: 5
  },
  stockView: {
    flexDirection: "row",
    marginTop: 5
  },
  suspendButton: {
    borderRadius: 5,
    padding: 5,
  },
  viewStockButton: {
    alignSelf: "flex-end",
    // backgroundColor: COLORS.primary,
    borderRadius: 5,
    marginTop: 10,
    padding: 8,
  },
  viewStockButtonText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "600"
  },
});

export default styles;