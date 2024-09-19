import React, { useEffect, useRef, useState } from "react";
import { Linking, Text, View } from "react-native";
import Config from "react-native-config";
import DropDownPicker from "react-native-dropdown-picker";
import LinearGradient from "react-native-linear-gradient";

import { useToast } from "native-base";

import {
  SQIPCardEntry,
  SQIPCore,
} from 'react-native-square-in-app-payments';

import { COLORS } from "../../constants/theme";
import FormInput from "../../components/FormInput";
import Loading from "../../components/Loading";
import LoggerUtil from "../../utils/LoggerUtil";
import ServerCommunicationUtil from "../../utils/ServerCommunicationUtil";
import StorageUtil from "../../utils/StorageUtil";
import styles from "./topup.styles";
import SubmitButton from "../../components/SubmitButton";
import ToastComponent from "../../components/Toast";
import { useLanguage } from "../../utils/language/LanguageProvider";
import { useTheme } from "../../theme/ThemeContext";

export default function TopUpScreen({ route, navigation }) {
  const { mobileNumber } = route.params;
  const { theme } = useTheme();
  const { translate } = useLanguage();
  const toast = useToast();
  const toastIdRef = useRef();
  const [ completePhase, setCompletePhase ] = useState(false);
  const [ dropdownOpen, setDropdownOpen ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ paymentChannels, setPaymentChannels ] = useState([]);
  const [ redirectUrl, setRedirectUrl ] = useState(null);
  const [ selectedChannelId, setSelectedChannelId ] = useState('');
  const [ dropdownValueError, setDropdownValueError ] = useState(false);
  const [ topupAmount, setTopupAmount ] = useState('');
  const [ topupAmountError, setTopupAmountError ] = useState(false);
  const [ topupAmountErrorText, setTopupAmountErrorText ] = useState('');
  const [ topupNumber, setTopupNumber ] = useState(mobileNumber);
  const [ topupNumberError, setTopupNumberError ] = useState(false);
  const [ topupNumberErrorText, setTopupNumberErrorText ] = useState('');
  const [ userCurrency, setUserCurrency ] = useState(null);

  const gradientColors = [theme.gradientStart, COLORS.white];

  useEffect(() => {
    StorageUtil.getCountry()
    .then(country => {
      const getPaymentMethods = async (countryCode) => {
        await ServerCommunicationUtil.getPaymentChannels(countryCode)
          .then(resp => {
            if (resp.status === 200 && resp.content?.data.length > 0) {
              const channels = resp.content.data;
              setPaymentChannels(channels.map(channel => ({
                label: channel.name,
                value: channel.id,
              })));
              setSelectedChannelId(channels[0].id)
              // TODO: Make dynamic => ie. use backend
              if (channels.some(ch => ch.name.search(/(card){1}.*(usd){1}/i) >= 0)) {
                initializeSquare();
              }
            }
          }).catch(error => {
            LoggerUtil.logError("Error getting payment channels", error);
          });
      }
      getPaymentMethods(country.code);
    })

    StorageUtil.getCurrency().then(cur => setUserCurrency(JSON.parse(cur)))
  }, [])

  useEffect(() => {
      
  }, [selectedChannelId])

  const closeToast = () => {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
  }

  const getConditions = () => {
    return [
      {
        value: topupAmount,
        setError: setTopupAmountError,
        setErrorText: setTopupAmountErrorText,
        errorMessage: 'Please enter topup amount'
      },
      {
        value: topupNumber,
        setError: setTopupNumberError,
        setErrorText: setTopupNumberErrorText,
        errorMessage: 'Please enter mobile number'
      }
    ];
  }

  const initializeSquare = async () => {
    await SQIPCore.setSquareApplicationId(Config.SQUARE_APPLICATION_ID);
  }

  const initiateStkPush = async() => {
    const conditions = getConditions();

    const errorMessages = validateInputs(conditions);

    if (errorMessages.length > 0) {
      return;
    }

    let payload = {
      amount: topupAmount,
      phoneNumber : topupNumber
    };

    let userReference = await StorageUtil.getUserAccountNumber();
    setLoading(true);
    await ServerCommunicationUtil.topupFloat(userReference, payload)
    .then(resp => {
      if (resp.status === 200) {
        setLoading(false);
        showToast('Success', 'Payment initiated successfully.');
        navigation.goBack();
      } else if (resp.validationError.errors) {
        setLoading(false);
        const errorMessages = resp.validationError.errors;
        Object.keys(errorMessages).map((key) => {
          showToast('Error', errorMessages[key]);
        })
      }
    })
    .catch(error => {
      setLoading(false);
      LoggerUtil.logError('Stk Push error', error);
      if (error.toString().includes('Network request failed')) {
        showToast('Error', 'Please check your internet connection');
      } else {
        showToast('Error', 'Error initiating stk push');
      }
    })
  }

  const initiateTopUp = async() => {
    
    if (completePhase) {
      Linking.openURL(redirectUrl);
      setCompletePhase(false)
    }

    const errorMessages = validateInputs(getConditions());
    if (errorMessages.length > 0) return;

    const payload = {
      amount: topupAmount,
      currency: userCurrency?.code || Config.KENYAN_CURRENCY_CODE,
      phoneNumber: topupNumber,
      paymentChannelId: selectedChannelId,
    };

    if (paymentChannels.some(ch => selectedChannelId === ch.value && ch.label.search(/(card){1}.*(usd){1}/i) >= 0)) {
      handleSquareCard(payload)
      return;
    }

    initiateCharge(payload);
  }

  const initiateCharge = async (payload) => {
    let userReference = await StorageUtil.getUserAccountNumber();
    setLoading(true);
    await ServerCommunicationUtil.topup(userReference, payload)
    .then(resp => {
      setLoading(false);
      if (resp.status && ['pending', 'complete'].includes(resp.status.name.toLowerCase())) {
        showToast('Success', 'Payment initiated successfully.');
        setCompletePhase(true);
        setRedirectUrl(resp?.redirectUrl || null);
        StorageUtil.storePendingTransaction({
          id: resp?.id,
          externalId: resp?.externalId,
          type: resp?.transactionType?.name,
          createdOn: resp?.createdOn,
        })
      } else {
        showToast('Error', 'Failed to initiate Top Up, Confirm details and try again')
      }
    })
    .catch(error => {
      setLoading(false);
      LoggerUtil.logError('TopUp error', error);
      if (error.toString().includes('Network request failed')) {
        showToast('Error', 'Please check your internet connection');
      } else {
        showToast('Error', 'Error initiating top up');
      }
    })
  };

  const handleSquareCard = async () => {
    const cardEntryConfig = {
      collectPostalCode: true,
      amount: topupAmount,
      currencyCode: userCurrency?.code?.toUpperCase() || null,
      phone: topupNumber || null,
    };
    await SQIPCardEntry.startCardEntryFlow(
      cardEntryConfig,
      onCardNonceRequestSuccess,
      onCardEntryCancel,
    );
  }

  const onCardEntryCancel = async () => {
    console.log(`onCardEntryCancel:i01`);
  };

  const onCardEntryComplete = async () => {
    console.log(`onCardEntryComplete:i01`);
  };

  const onCardNonceRequestSuccess = async (cardDetails) => {
    try {
      console.log(`onCardNonceRequestSuccess:i01|${cardDetails}`);
      // take payment with the card details
      const payload =  {
        amount: topupAmount,
        currency: userCurrency?.code || Config.KENYAN_CURRENCY_CODE,
        phoneNumber: topupNumber,
        paymentChannelId: selectedChannelId,
        metadata: {
          paymentToken: cardDetails.nonce,
        }
      };
      await initiateCharge(payload);

      // payment finished successfully
      await SQIPCardEntry.completeCardEntry(
        () => onCardEntryComplete(),
      );
    } catch (ex) {
      await SQIPCardEntry.showCardNonceProcessingError(ex.message);
    }
  };

  const showToast = (title, message, color = null) => {
    toastIdRef.current=toast.show({
      placement: "top",
      render: () => {
        return <ToastComponent title={title} message={message} color={color} closeToast={closeToast} />
      }
    })
  }

  const validateInputs = (conditions) => {
    const errorMessages = [];

    for (const condition of conditions) {
      const { value, setError, setErrorText, errorMessage } = condition;
      if (!value) {
        setError(true);
        if (setErrorText) {
          setErrorText(errorMessage);
        }
        errorMessages.push(errorMessage);
      }
    }
    return errorMessages;
  }

  if (loading) {
    return (
      <Loading/>
    );
  }

  return (
    <LinearGradient colors={gradientColors} style={{flex: 1}}>
      <View style={styles.container}>
        <Text style={styles.headingText}>Enter topup details</Text>
        <View style={styles.formView}>
          {
            paymentChannels.length > 0 &&
            <DropDownPicker
              open={dropdownOpen}
              value={selectedChannelId}
              items={paymentChannels}
              setOpen={setDropdownOpen}
              setValue={setSelectedChannelId}
              setItems={paymentChannels}
              style={{
                alignSelf: "center",
                borderColor: dropdownValueError ? COLORS.red : COLORS.grey,
                marginTop: 20,
                width: "90%"
              }}
              placeholder={translate('select Payment Channel')}
              disableBorderRadius={true}
              onPress={() => setDropdownValueError(false)}
            />
          }
          <FormInput
            error={topupAmountError}
            errorText={topupAmountErrorText}
            heading="Topup Amount"
            onFocus={() => setTopupAmountError(false)}
            placeholder="e.g 50"
            inputValue={topupAmount}
            setValue={setTopupAmount}
            keyboardType="numeric"
          />
          <FormInput
            error={topupNumberError}
            errorText={topupNumberErrorText}
            heading="Topup Number"
            onFocus={() => setTopupNumberError(false)}
            placeholder="e.g 254712345678"
            inputValue={topupNumber}
            setValue={setTopupNumber}
            keyboardType="numeric"
          />
          {
            paymentChannels.length == 0 ? (
              <SubmitButton
                btnTitle="Initiate Topup"
                submit={initiateStkPush}
              />
            ) : (
              <SubmitButton
                btnTitle={completePhase ? "Complete Topup" : "Initiate Topup"}
                submit={initiateTopUp}
              />
            )
          }
          
        </View>
      </View>
    </LinearGradient>
  );
}