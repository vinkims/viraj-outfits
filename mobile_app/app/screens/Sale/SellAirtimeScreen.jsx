import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import Config from "react-native-config";
import DropDownPicker from "react-native-dropdown-picker";
import LinearGradient from "react-native-linear-gradient";
import { useToast } from "native-base";

import { airtimeCategoryId, giftCardCategoryId, payBillCategoryId } from "../../constants/properties";
import { COLORS } from "../../constants/theme";
import FormattingUtil from "../../utils/FormattingUtil";
import FormInput from "../../components/FormInput";
import Loading from "../../components/Loading";
import LoggerUtil from "../../utils/LoggerUtil";
import ModalComponent from "../../components/ModalComponent";
import ServerCommunicationUtil from "../../utils/ServerCommunicationUtil";
import StorageUtil from "../../utils/StorageUtil";
import styles from "./sale.style";
import SubmitButton from "../../components/SubmitButton";
import ToastComponent from "../../components/Toast";
import { useLanguage } from "../../utils/language/LanguageProvider";
import { useTheme } from "../../theme/ThemeContext";
import { useRoute } from "@react-navigation/native";

export default function SellAirtimeScreen(){
  const { theme } = useTheme();
  const { translate } = useLanguage();
  const route = useRoute();
  const toast = useToast();
  const toastIdRef = useRef();
  const [ airtimeAmount, setAirtimeAmount ] = useState('');
  const [ airtimeAmountAlt, setAirtimeAmountAlt] = useState('');
  const [ airtimeAmountError, setAirtimeAmountError ] = useState(false);
  const [ airtimeAmountErrorText, setAirtimeAmountErrorText ] = useState('');
  const [ airtimeProducts, setAirtimeProducts ] = useState([]);
  const [ airtimeProviders, setAirtimeProviders ] = useState([]);
  const [ dropdownOpen, setDropdownOpen ] = useState(false);
  const [ dropdownValue, setDropdownValue ] = useState(null);
  const [ dropdownValueError, setDropdownValueError ] = useState(false);
  const [ externalRef, setExternalRef ] = useState('');
  const [ loading, setLoading ] = useState(false);
  const [ mobileNumber, setMobileNumber ] = useState('');
  const [ mobileNumberError, setMobileNumberError ] = useState(false);
  const [ mobileNumberErrorText, setMobileNumberErrorText ] = useState('');
  const [ modalVisible, setModalVisible ] = useState(false);
  const [ productName, setProductName ] = useState('');
  const [ selectedProduct, setSelectedProduct] = useState({});
  const [userCurrency, setUserCurrency] = useState(null);
  const [currencyConversionRequired, setCurrencyConversionRequired] = useState(false);
  const [productCategoryId, setProductCategoryId] = useState(airtimeCategoryId);

  const gradientColors = [theme.gradientStart, COLORS.white];

  // TODO: Replace with dynamic currency ie. add currency exchange rate to prod payload
  const currencies = {
    MXN: {
      buyRate: 16.9650,
      name: "Mexican Peso",
      sellRate: 17.5650,
    },
    ETB: {
        buyRate: 56.7318,
        name: "Ethiopian Birr",
        sellRate: 57.5318,
    },
    KES: {
        buyRate: 132.2852,
        name : "Kenya shilling",
        sellRate : 133.0852,
    },
    USD: {
        buyRate: 1.0000,
        name: "US Dollar",
        sellRate: 1.0000,
    }
  };

  useEffect(() => {
    const getProductsOrServices = async () => {
      let clientId = await StorageUtil.getClientId();
      let param = isProductScreen() 
        ? `q=client.idEQ${clientId},product.productCategory.idEQ${getProductCategoryId()}`
        : `q=client.idEQ${clientId}`;
      await ServerCommunicationUtil.getClientProductServices(`${param}&pgSize=50`)
      .then(resp => {
        if (resp.status === 200) {
          if (resp.content.data.length > 0) {
            let items = resp.content.data;
            const type = isProductScreen() ? "product" : "service";
            if (!isProductScreen()) {
              items = items.filter(i => Object.keys(i).includes("service"));
            }
            setAirtimeProviders(items.map(i => ({
              label: `${i[type].name} - ${i[type]?.currency?.code}`,
              value: i[type].id,
            })));
            setAirtimeProducts(items.map(i => ({...i[type]})));
            setDropdownValue(items[0]?.id);
          }
        }
      })
    }

    getProductsOrServices();
    StorageUtil.getCurrency().then(cur => setUserCurrency(JSON.parse(cur)))
  }, [route.name])

  useEffect(() => {
    if (!!airtimeAmount && !!selectedProduct) {
      if (!currencyConversionRequired) {
        setAirtimeAmountAlt(airtimeAmount);
      } else {
        const airtimeAmountUSD = airtimeAmount / currencies[selectedProduct?.currency.code.toUpperCase()].buyRate;
        const convertedAmount = airtimeAmountUSD * currencies[userCurrency.code.toUpperCase()].sellRate;
        setAirtimeAmountAlt((convertedAmount < 1 ? convertedAmount.toFixed(2) : Math.floor(convertedAmount)).toString());
      }
    }
  }, [airtimeAmount])

  useEffect(() => {
    if (!!dropdownValue) {
      const product = airtimeProducts.find(prod => prod.id === dropdownValue);
      setSelectedProduct(product || null);
      const productCurrencyCode = product?.currency?.code || Config.KENYAN_CURRENCY_CODE;
      const userCurrencyCode = userCurrency?.code.toLowerCase() || Config.KENYAN_CURRENCY_CODE;
      setCurrencyConversionRequired(productCurrencyCode.toLowerCase() != userCurrencyCode.toLowerCase());
      setAirtimeAmount('0');
      setAirtimeAmountAlt('0');
    }
  }, [dropdownValue])

  const closeToast = () => {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
  }

  const getProductCategoryId = () => {
    const screen = route.name?.toLowerCase();
    let productCategoryId = airtimeCategoryId;
    if (screen.includes("bill")) {
      productCategoryId = payBillCategoryId;
    }  else if (screen.includes("gift")) {
      productCategoryId = giftCardCategoryId;
    }
    return productCategoryId;
  }

  const getProductConfigValues = (productId) => {
    const selectedProduct = airtimeProducts.filter((prod) => prod.id === productId);
    LoggerUtil.logDebug('Selected product', selectedProduct[0]);
    return selectedProduct[0];
  }

  const isProductScreen = () => {
    const screen = route.name?.toLowerCase();
    return screen.includes("deposit") ? false : true;
  }

  const handleAirtimeSale = async () => {
    handleModalClose();

    let clientRef = await StorageUtil.getClientRef();

    const payload = {};
    payload.amount = airtimeAmount;
    payload.clientRef = clientRef;
    payload.currencyCode = selectedProduct?.currency.code ?? Config.KENYAN_CURRENCY_CODE;
    if (externalRef) {
      payload.externalReference = externalRef;
    } else {
      payload.externalReference = Date.now().toString();
    }
    if(isProductScreen()) {
      payload.productId = dropdownValue;
    } else {
      payload.serviceId = dropdownValue;
    }
    payload.reference = getProductCategoryId() === airtimeCategoryId ? FormattingUtil.formatMobileNumber(mobileNumber) : mobileNumber;

    setLoading(true);
    await ServerCommunicationUtil.sellAirtime(payload)
    .then(resp => {
      if (resp.status) {
        if (resp.status.name === "complete") {
          setLoading(false);
          setExternalRef('');
          setMobileNumber('');
          setAirtimeAmount('');
          setDropdownValue(null);
          setProductName('');
          showToast('Success', translate('successfulAirtimeSale'));
        } else if (resp.status.name === "failed" || resp.status.name === "unknown") {
          setLoading(false);
          showToast('Error', translate('failedAirtimeSale'));
        }
      } else if (resp.notFoundError && resp.notFoundError.errors) {
        setLoading(false);
        LoggerUtil.logError('Sell airtime error: ', resp.notFoundError.message +'\n' + resp.notFoundError.errors );
        const errorMessages = resp.notFoundError.errors;
        Object.keys(errorMessages).map((key) => {
          showToast('Error', errorMessages[key]);
        });
      } else if (resp.validationError && resp.validationError.errors) {
        LoggerUtil.logError('Sell airtime error: ', resp.validationError.errors);
        setLoading(false);
        const errorMessages = resp.validationError.errors;
        Object.keys(errorMessages).map((key) => {
          showToast('Error', errorMessages[key]);
        });
      }
    })
    .catch(error => {
      setLoading(false);
      LoggerUtil.logError('Error selling airtime', error);
      if (error.toString().includes('Network request failed')) {
        showToast('Error', translate('checkInternetConnection'));
      } else {
        showToast('Error', translate('airtimeSaleError'));
      }
    })
  }

  const handleDetailsConfirm = () => {
    let maxAmount = null;
    let minAmount = null;

    if (dropdownValue) {
      const selected = getProductConfigValues(dropdownValue);
      maxAmount = selected.maxAmount;
      minAmount = selected.minAmount;
      setProductName(selected.name);
    }

    const conditions = [
      {
        value: dropdownValue,
        setError: setDropdownValueError,
      },
      {
        value: mobileNumber,
        setError: setMobileNumberError,
        setErrorText: setMobileNumberErrorText,
        errorMessage: translate('enterMobileNumber'),
      },
      {
        value: airtimeAmount,
        setError: setAirtimeAmountError,
        setErrorText: setAirtimeAmountErrorText,
        errorMessage: translate('enterAirtimeAmount'),
        min: minAmount == null ? 2 : minAmount,
        max: maxAmount == null ? 10000 : maxAmount,
        allowed: selectedProduct?.availableAmounts
      },
    ];

    const errorMessages = validateInputs(conditions);

    if (errorMessages.length > 0) {
      return;
    }

    if (getProductCategoryId() === airtimeCategoryId && (mobileNumber.length < 10 || mobileNumber.length > 13)) {
      setMobileNumberError(true);
      setMobileNumberErrorText(translate('mobileNumberLengthError'));
      return;
    }

    setModalVisible(true);
  }

  const handleModalClose = () => {
    setModalVisible(!modalVisible);
  }

  const showToast = (title, message) => {
    toastIdRef.current = toast.show({
      placement: "top",
      render: () => {
        return <ToastComponent title={title} message={message} closeToast={closeToast}/>
      }
    })
  }

  const validateInputs = (conditions) => {
    const errorMessages = [];

    for (const condition of conditions) {
      const { value, setError, setErrorText, errorMessage, min, max, allowed } = condition;
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
      } else if (!!value && !!allowed && !allowed?.includes(parseInt(value))) {
        setError(true);
        if (setErrorText) {
          setErrorText(`Value must be one of ${allowed.join(',')}`);
        }
        errorMessages.push(`Value must be one of ${allowed.join(',')}`);
      }
    }
    return errorMessages;
  }

  const ConfirmContentView = ({heading, content, extras = {}}) => (
    <View style={styles.detailsView}>
      <Text style={styles.confirmTitle}>{heading}: </Text>
      <Text style={[styles.confirmRes, {color: theme.primaryColor}]}>
        {content}
        {!!Object.entries(extras).length && (" " + extras?.currency ?? Config.KENYAN_CURRENCY_CODE)}
      </Text>
    </View>
  )

  const ModalContent = () => (
    <View>
      <Text style={styles.confirmText}>{translate('confirmAirtimeSaleDetails')}</Text>
      <ConfirmContentView heading={translate('product')} content={productName} />
      {externalRef && <ConfirmContentView heading={translate('transactionCode')} content={externalRef} /> }
      <ConfirmContentView heading={translate('mobileNumber')} content={mobileNumber} />
      <ConfirmContentView heading={translate('amount')} content={airtimeAmount} extras={{currency: selectedProduct.currency.code}} />
    </View>
  );

  if (loading) {
    return (<Loading/>);
  }

  return(
    <LinearGradient style={{ flex: 1}} colors={gradientColors}>
    <View style={styles.container}>
      <Text style={styles.sellText}>{translate('enterCustomerDetails')}</Text>
      <View style={styles.modalParentView}>
        <ModalComponent
          modalVisible={modalVisible}
          handleModalClose={handleModalClose}
          modalContent={<ModalContent/>}
          handleConfirm={handleAirtimeSale}
        />
      </View>
      <View style={styles.formView}>
        <DropDownPicker
          open={dropdownOpen}
          value={dropdownValue}
          items={airtimeProviders}
          searchable={true}
          setOpen={setDropdownOpen}
          setValue={setDropdownValue}
          setItems={setAirtimeProviders}
          style={{
            alignSelf: "center",
            borderColor: dropdownValueError ? COLORS.red : COLORS.grey,
            marginTop: 20,
            width: "90%"
          }}
          placeholder={isProductScreen() ? translate('selectProduct') : translate('selectService')}
          disableBorderRadius={true}
          onPress={() => setDropdownValueError(false)}
        />
        {dropdownValueError && <Text style={styles.dropdownErrorText}>select product</Text>}
        <FormInput
          heading={translate('transactionCode')}
          placeholder="e.g RGD65FDRG"
          optional={true}
          inputValue={externalRef}
          setValue={setExternalRef}
        />
        <FormInput
          error={mobileNumberError}
          errorText={mobileNumberErrorText}
          heading={translate(route.name?.toLowerCase().includes("airtime") ? "mobileNumber" : "accountNumber")}
          placeholder="e.g 25412345678"
          onFocus={() => setMobileNumberError(false)}
          inputValue={mobileNumber}
          setValue={setMobileNumber}
          keyboardType="numeric"
        />
        <FormInput
            error={airtimeAmountError}
            errorText={airtimeAmountErrorText}
            heading={`${translate('amount')} - ${selectedProduct?.currency?.code.toUpperCase() || ''}`}
            placeholder="e.g 100"
            onFocus={() => setAirtimeAmountError(false)}
            inputValue={airtimeAmount}
            setValue={setAirtimeAmount}
            keyboardType="numeric"
          />
        {
          currencyConversionRequired &&
          <FormInput
            error={airtimeAmountError}
            errorText={airtimeAmountErrorText}
            heading={`${translate('amount')} - ${userCurrency?.code.toUpperCase()}`}
            placeholder="e.g 100"
            onFocus={() => setAirtimeAmountError(false)}
            inputValue={airtimeAmountAlt}
            setValue={setAirtimeAmountAlt}
            keyboardType="numeric"
            readOnly={true}
          />
        }
        
        <SubmitButton
          btnTitle={translate('sell')}
          submit={handleDetailsConfirm}
        />
      </View>
    </View>
    </LinearGradient>
  );
}