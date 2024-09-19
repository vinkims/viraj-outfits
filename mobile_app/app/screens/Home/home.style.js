import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("screen");

import { COLORS } from "../../constants/theme";

const styles = StyleSheet.create({
  actionButton: {
    alignItems: "center",
    borderColor: COLORS.primary,
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
  actionsView: {
    marginTop: 20
  },
  amountText: {
    color: COLORS.black,
    flex: 0.2,
    fontSize: 13,
    fontWeight: "600"
  },
  balancesContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  balancesView: {
    height: 150
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    elevation: 4,
    flexDirection:"row",
    justifyContent: "space-between",
    marginHorizontal: 5,
    marginVertical: 3,
    padding: 5,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardDetailsContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 2
  },
  cardDetailsLabel: {
    color:'#666666',
    fontSize: 15,
  },
  cardDetailsValue: {
    color: "#333333",
    fontSize: 15,
    fontWeight:'bold',
  },
  container: {
    // backgroundColor: COLORS.white,
    flex: 1,
    padding: 10,
    width: "100%",
  },
  dataContainer: {
    alignItems: "center",
    borderColor: COLORS.lightGrey,
    borderRadius: 10,
    borderWidth: 1,
    height: 100,
    justifyContent: "center",
    marginRight: 20,
    marginTop: 10,
    opacity: 0.9,
    shadowColor: COLORS.black,
    shadowOpacity: 1,
    shadowRadius: 5,
    width: 100,
  },
  dataText: {
    color: COLORS.black,
    fontSize: 14,
    fontWeight: "bold",
  },
  dateText: {
    color: COLORS.black,
    flex: 0.3,
    fontSize: 11
  },
  detailsView: {
    flexDirection: "row"
  },
  externalRefText: {
    color: COLORS.black,
    flex: 0.5,
    fontSize: 12,
    fontWeight: "600"
  },
  flatlistView: {
    flex: 1
  },
  floatTopupButton: {
    borderRadius: 5,
    padding: 8
  },
  floatTopupText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600"
  },
  headingText: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%"
  },
  logoutImage: {
    height: 25,
    width: 25
  },
  logoutText: {
    color: COLORS.primary,
    fontSize: 18,
    marginLeft: 5
  },
  logoutView: {
    marginTop: 20
  },
  numberText: {
    color: COLORS.black,
    fontSize: 15,
    fontWeight: "bold",
  },
  recipientHeading: {
    color: COLORS.black,
    fontSize: 11,
    fontWeight: "400"
  },
  recipientText: {
    color: COLORS.black,
    fontSize: 11,
    fontWeight: "600"
  },
  recipientView: {
    flexDirection: "row"
  },
  reloadImage: {
    height: 25,
    marginRight: 20,
    width: 25
  },
  resetContainer: {
    alignSelf: "center",
    marginTop: 20
  },
  resetText: {
    color: COLORS.primary,
    fontSize: 16,
  },
  saleView: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600"
  },
  transactionName: {
    color: COLORS.black,
    fontSize: 12,
    fontWeight: "600"
  },
  transactionNameView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 3
  },
  transactionSelectionText : {
    fontSize: 16,
    fontWeight: "bold",
  },
  transactionSelectionView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "10%",
    marginBottom: "3%"
  },
  transactionTypeName : {
    color: COLORS.black,
    fontSize: 12,
    fontWeight: "600"
  },
  transactionUserHeading: {
    color: COLORS.black,
    fontSize: 12
  },
  transactionUserView: {
    flexDirection: "row",
    marginTop: 3
  },
  transactionView: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.grey,
    borderRadius: 5,
    borderWidth: 0.7,
    marginTop: 5,
    padding: 5
  },
});

export default styles;