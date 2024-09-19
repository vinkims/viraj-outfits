import React, { useRef, useState } from "react";
import { Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useToast } from "native-base";

import { COLORS } from "../../constants/theme";
import FormInput from "../../components/FormInput";
import Loading from "../../components/Loading";
import LoggerUtil from "../../utils/LoggerUtil";
import ModalComponent from "../../components/ModalComponent";
import ServerCommunicationUtil from "../../utils/ServerCommunicationUtil";
import SubmitButton from "../../components/SubmitButton";
import styles from "./sale.style";
import ToastComponent from "../../components/Toast";
import { useLanguage } from "../../utils/language/LanguageProvider";
import { useTheme } from "../../theme/ThemeContext";

export default function ManualLineSale() {
  const { theme } = useTheme();
  const { translate } = useLanguage();
  const toast = useToast();
  const toastRef = useRef();
  const [ airtimeAmount, setAirtimeAmount ] = useState('');
  const [ airtimeAmountError, setAirtimeAmountError ] = useState(false);
  const [ airtimeAmountErrorText, setAirtimeAmountErrorText ] = useState('');
  const [ itemId, setItemId ] = useState(null);
  const [ loading, setLoading ] = useState(false);
  const [ modalVisible, setModalVisible ] = useState(false);
  const [ serialError, setSerialError ] = useState(false);
  const [ serialErrorText, setSerialErrorText ] = useState('');
  const [ serialNumber, setSerialNumber ] = useState('');

  const gradientColors = [theme.gradientStart, COLORS.white];

  const handleCloseToast = () => {
    if (toastRef.current) {
      toast.close(toastRef.current);
    }
  }

  const handleConfirmDetails = async () => {
    const conditions = [
      {
        value: serialNumber,
        setError: setSerialError,
        setErrorText: setSerialErrorText,
        errorMessage: 'Enter serial number'
      },
      {
        value: airtimeAmount,
        setError: setAirtimeAmountError,
        setErrorText: setAirtimeAmountErrorText,
        errorMessage: 'Enter airtime amount'
      }
    ];

    const errorMessages = validateInputs(conditions);

    if (errorMessages.length > 0) {
      return;
    }

    let params = `q=serialNumberEQ${serialNumber}`;
    await ServerCommunicationUtil.getProductItems(params)
    .then(resp => {
      if (resp.status === 200) {
        if (resp.content.data.length > 0) {
          if (resp.content.data[0].status.name === 'manually_sold' || resp.content.data[0].status.name === 'sold') {
            showToast('Error', 'Line has already been sold');
          }else {
            setItemId(resp.content.data[0].id);
            setModalVisible(true)
          }
        } else {
          showToast('Error', 'Line with the given serial number not found');
        }
      }
    })
    .catch (error => {
      LoggerUtil.logError('Error getting line', error);
      if (error.toString().includes('Network request failed')) {
        showToast('Error', 'Please check your internet connection');
      } else {
        showToast('Error', 'Error getting line');
      }
    })
  }

  const handleModalClose = () => {
    setModalVisible(!modalVisible);
  }

  const handleSale = async () => {
    setLoading(true);
    handleModalClose();

    const payload = {
      statusId: 20,
      topupAmount: airtimeAmount
    }

    await ServerCommunicationUtil.updateProductItem(itemId, payload)
    .then(resp => {
      if (resp.status === 200) {
        setLoading(false);
        setSerialNumber('')
        setAirtimeAmount('');
        setItemId(null);
        showToast('Success', 'Line sold successfully');
      } else if (resp.notFoundError && resp.notFoundError.errors) {
        setLoading(false);
        LoggerUtil.logError('Manual line sale error: ', resp.notFoundError.message +'\n' + resp.notFoundError.errors );
        const errorMessages = resp.notFoundError.errors;
        Object.keys(errorMessages).map((key) => {
          showToast('Error', errorMessages[key]);
        });
      } else if (resp.validationError.errors && resp.validationError.errors) {
        LoggerUtil.logError('Validation Error', resp.validationError.errors);
        setLoading(false);
        const errorMessages = resp.validationError.errors;
        Object.keys(errorMessages).map((key) => {
          showToast('Error', errorMessages[key]);
        });
      }
    }).catch (error => {
      LoggerUtil.logError('Error manually selling line', error);
      setLoading(false);
      if (error.toString().includes('Network request failed')) {
        showToast('Error', 'Please check your internet connection');
      } else {
        showToast('Error', 'Error manually selling line');
      }
    })
  }

  const showToast = (title, message) => {
    toastRef.current = toast.show({
      placement: "top",
      duration: 20000,
      render: () => {
        return <ToastComponent title={title} message={message} closeToast={handleCloseToast} />
      }
    })
  }

  const validateInputs = (conditions) => {
    const errorMessages = [];

    for (const condition of conditions) {
      const { value, setError, setErrorText, errorMessage } = condition;
      if (!value || value === undefined || value === null) {
        setError(true);
        if (setErrorText) {
          setErrorText(errorMessage);
        }
        errorMessages.push(errorMessage);
      }
    }
    return errorMessages;
  }

  const ModalContent = () => (
    <View>
      <Text style={styles.confirmText}>{translate('confirmManualSaleDetails')}</Text>
      <View style={styles.detailsView}>
        <Text style={styles.confirmTitle}>{translate('serialNumber')}: </Text>
        <Text style={styles.confirmRes}>{serialNumber}</Text>
      </View>
      <View style={styles.detailsView}>
        <Text style={styles.confirmTitle}>{translate('airtimeAmount')}: </Text>
        <Text style={styles.confirmRes}>{airtimeAmount}</Text>
      </View>
    </View>
  )

  if (loading) {
    return (<Loading/>);
  }

  return (
    <LinearGradient colors={gradientColors} style={{flex: 1}}>
    <View style={styles.container}>
      <Text style={styles.headingText}>{translate('enterManualSaleDetails')}</Text>
      <View style={styles.modalParentView}>
        <ModalComponent
          modalVisible={modalVisible}
          handleModalClose={handleModalClose}
          handleConfirm={handleSale}
          modalContent={<ModalContent/>}
        />
      </View>
      <View style={styles.formView}>
        <FormInput
          error={serialError}
          errorText={serialErrorText}
          heading={translate('serialNumber')}
          onFocus={() => setSerialError(false)}
          placeholder="e.g000000009990009"
          inputValue={serialNumber}
          setValue={setSerialNumber}
        />
        <FormInput
          error={airtimeAmountError}
          errorText={airtimeAmountErrorText}
          heading={translate('airtimeAmount')}
          onFocus={() => setAirtimeAmountError(false)}
          placeholder="e.g 50"
          inputValue={airtimeAmount}
          setValue={setAirtimeAmount}
          keyboardType="numeric"
        />
        <SubmitButton 
          btnTitle={translate('sellManually')}
          submit={handleConfirmDetails} 
        />
      </View>
    </View>
    </LinearGradient>
  );
}