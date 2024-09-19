import React, { useEffect, useRef, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useToast } from "native-base";

import { COLORS } from "../../constants/theme";
import FormattingUtil from "../../utils/FormattingUtil";
import FormInput from "../../components/FormInput";
import Loading from "../../components/Loading";
import LoggerUtil from "../../utils/LoggerUtil";
import ModalComponent from "../../components/ModalComponent";
import ServerCommunicationUtil from "../../utils/ServerCommunicationUtil";
import StorageUtil from "../../utils/StorageUtil";
import SubmitButton from "../../components/SubmitButton";
import styles from "./sale.style";
import ToastComponent from "../../components/Toast";
import { useLanguage } from "../../utils/language/LanguageProvider";
import { useTheme } from "../../theme/ThemeContext";

export default function SaleScreen({ navigation }) {
  const { theme } = useTheme();
  const { translate } = useLanguage();
  const toast = useToast();
  const toastIdRef = useRef();
  const [ airtimeAmount, setAirtimeAmount ] = useState('');
  const [ airtimeAmountError, setAirtimeAmountError ] = useState(false);
  const [ airtimeAmountErrorText, setAirtimeAmountErrorText ] = useState('');
  const [ loading, setLoading ] = useState(false);
  const [ mobileNumber, setMobileNumber ] = useState('');
  const [ mobileNumberError, setMobileNumberError ] = useState(false);
  const [ mobileNumberErrorText, setMobileNumberErrorText ] = useState('');
  const [ modalVisible, setModalVisible ] = useState(false);
  const [ serial, setSerial ] = useState('');
  const [ serialError, setSerialError ] = useState(false);
  const [ serialErrorText, setSerialErrorText ] = useState('');

  const gradientColors = [theme.gradientStart, COLORS.white];

  useEffect(() => {
    const getStoredSerial = async () => {
      let isStored = await StorageUtil.getSerialStored();
      if (isStored) {
        LoggerUtil.logDebug("SERIAL AVAILABLE");
        let serialNumber = await StorageUtil.getSerialNumber();
        setSerial(serialNumber);
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      getStoredSerial();
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);

  const closeToast = () => {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
  }

  const handleConfirmDetails = () => {
    const conditions = [
      {
        value: serial,
        setError: setSerialError,
        setErrorText: setSerialErrorText,
        errorMessage: 'Enter or scan serial number'
      },
      {
        value: airtimeAmount,
        setError: setAirtimeAmountError,
        setErrorText: setAirtimeAmountErrorText,
        errorMessage: 'Enter airtime amount'
      },
      {
        value: mobileNumber,
        setError: setMobileNumberError,
        setErrorText: setMobileNumberErrorText,
        errorMessage: 'Enter mobile number'
      }
    ];

    const errorMessages = validateInputs(conditions)

    if (errorMessages.length > 0) {
      return;
    }

    setModalVisible(true);
  }

  const handleLineSale = async () => {
    handleModalClose();

    setLoading(true);
    const payload = [{
      baMSISDN: FormattingUtil.formatMobileNumber(mobileNumber),
      serial: serial,
      topUpAmount: airtimeAmount
    }]

    await ServerCommunicationUtil.sellLine(payload)
    .then(resp => {
      if (resp.status === 200) {
        setLoading(false);
        setSerial('');
        setMobileNumber('');
        setAirtimeAmount('');
        StorageUtil.removeItem("serialNumber");
        StorageUtil.removeItem("serialStored");
        showToast('Success', 'Line sold successfully');
      } else if (resp.notFoundError && resp.notFoundError.errors) {
        setLoading(false);
        LoggerUtil.logError('Sell line error: ', resp.notFoundError.message +'\n' + resp.notFoundError.errors );
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
    })
    .catch(error => {
      LoggerUtil.logError('Error selling line', error);
      setLoading(false);
      if (error.toString().includes('Network request failed')) {
        showToast('Error', 'Please check your internet connection');
      } else {
        showToast('Error', 'Error selling line');
      }
    })
  }

  const handleModalClose = () => {
    setModalVisible(!modalVisible);
  }

  const handleScanSerial = () => {
    setSerialError(false);
    navigation.navigate('ScanSerial');
  }

  const showToast = (title, message) => {
    toastIdRef.current = toast.show({
      placement: "top",
      duration: 30000,
      render: () => {
        return <ToastComponent title={title} message={message} closeToast={closeToast} />
      }
    })
  }

  const validateInputs = (conditions) => {
    const errorMessages = [];

    for (const condition of conditions) {
      const { value, setError, setErrorText, errorMessage, min, max } = condition;
      if (!value || value === undefined || value === null) {
        setError(true);
        if (setErrorText) {
          setErrorText(errorMessage);
        }
        errorMessages.push(errorMessage);
      } else if (typeof min === 'number' && value < min) {
        setError(true);
        if (setErrorText) {
          setErrorText(`Value must be greater than or equal to ${min}`);
        }
        errorMessages.push(`Value must be greater than or equal to ${min}`);
      } else if (typeof max === 'number' && value > max) {
        setError(true);
        if (setErrorText) {
          setErrorText(`Value must be less than or equal to ${max}`);
        }
        errorMessages.push(`Value must be less than or equal to ${max}`);
      }
    }
    return errorMessages;
  }

  const ConfirmContentView = ({ heading, content }) => (
    <View style={styles.detailsView}>
      <Text style={styles.confirmTitle}>{heading}: </Text>
      <Text style={[styles.confirmRes, {color: theme.primaryColor}]}>{content}</Text>
    </View>
  );

  const ModalContent = () => (
    <View>
      <Text style={styles.confirmText}>Confirm Line Sale Details</Text>
      <ConfirmContentView heading="Serial" content={serial} />
      <ConfirmContentView heading="Mobile Number" content={mobileNumber} />
      <ConfirmContentView heading="Airtime Amount" content={airtimeAmount} />
    </View>
  )

  if (loading) {
    return (<Loading/>)
  }

  return (
    <LinearGradient style={{ flex: 1}} colors={gradientColors}>
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.saleHeadingText}>{translate('enterDetails')}</Text>
          <View style={styles.modalParentView}>
            <ModalComponent
              modalVisible={modalVisible}
              handleModalClose={handleModalClose}
              modalContent={<ModalContent/>}
              handleConfirm={handleLineSale}
            />
          </View>
          <View style={styles.formView}>
            <View style={styles.serialView}>
              <FormInput
                error={serialError}
                errorText={serialErrorText}
                heading={translate('serialNumber')}
                onFocus={() => setSerialError(false)}
                placeholder="e.g 09652442222"
                inputValue={serial}
                setValue={setSerial}
              />
              <TouchableOpacity style={styles.scanContainer} onPress={handleScanSerial}>
                <Text style={styles.scanText}>or {translate('clickScanSerial')}</Text>
                <Image source={require('../../assets/images/qrcode.png')} style={styles.scanImage} />
              </TouchableOpacity>
            </View>
            <FormInput
              error={mobileNumberError}
              errorText={mobileNumberErrorText}
              heading={translate('mobileNumber')}
              onFocus={() => setMobileNumberError(false)}
              placeholder="e.g 254712345678"
              inputValue={mobileNumber}
              setValue={setMobileNumber}
              keyboardType="numeric"
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
              btnTitle={translate('sell')}
              submit={handleConfirmDetails}
            />
            <View style={{marginBottom: 50}}/>
          </View>
      </View>
    </ScrollView>
    </LinearGradient>
  )
}
