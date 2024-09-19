import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { COLORS } from "../constants/theme";
import { useLanguage } from "../utils/language/LanguageProvider";

export default function ModalComponent({ modalVisible, handleModalClose, modalContent, handleConfirm, confirmBtnText = 'ok' }) {
  const { translate } = useLanguage();

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalView}>
          {modalContent}
          <View style={styles.confirmButtonsView}>
            <TouchableOpacity style={[styles.confirmButton, {backgroundColor: COLORS.red}]} onPress={handleModalClose}>
              <Text style={styles.confirmButtonText}>{translate('cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.confirmButton, {backgroundColor: COLORS.green}]} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>{translate(confirmBtnText)}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

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
  container: {
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
});