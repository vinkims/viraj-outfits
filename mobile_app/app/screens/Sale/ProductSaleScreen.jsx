import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import Config from "react-native-config";
import DropDownPicker from "react-native-dropdown-picker";
import LinearGradient from "react-native-linear-gradient";
import { useToast } from "native-base";

import { airtimeCategoryId } from "../../constants/properties";
import { COLORS } from "../../constants/theme";
import FormInput from "../../components/FormInput";
import Loading from "../../components/Loading";
import LoggerUtil from "../../utils/LoggerUtil";
import ModalComponent from "../../components/ModalComponent";
import ServerCommunicationUtil from "../../utils/ServerCommunicationUtil";
import StorageUtil from "../../utils/StorageUtil";
import styles from "./sale.style";
import SubmitButton from "../../components/SubmitButton";
import ToastComponent from "../../components/Toast";

export default function ProductSaleScreen() {
  const toast = useToast();
  const toastIdRef = useRef();
  const [ amount, setAmount ] = useState('');
  const [ amountError, setAmountError ] = useState(false);
  const [ amountErrorText, setAmountErrorText ] = useState('');
  const [ dropdownValueError, setDropdownValueError ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ modalVisible, setModalVisible ] = useState(false);
  const [ openDropdown, setOpenDropdown ] = useState(false);
  const [ productId, setProductId ] = useState(null);
  const [ productName, setProductName ] = useState('');
  const [ products, setProducts ] = useState([]);
  const [ serial, setSerial ] = useState('');
  const [ serialError, setSerialError ] = useState(false);
  const [ serialErrorText, setSerialErrorText ] = useState('');
  const [ units, setUnits ] = useState('');
  const [ unitsError, setUnitsError ] = useState(false);
  const [ unitsErrorText, setUnitsErrorText ] = useState('');

  useEffect(() => {
    const getProducts = async () => {
      let clientId = await StorageUtil.getClientId();
      let param = `q=client.idEQ${clientId}`;
      await ServerCommunicationUtil.getClientProductServices(param)
      .then(resp => {
        if (resp.status === 200) {
          if (resp.content.data.length > 0) {
            const filteredProducts = resp.content.data.filter(item => item.product.productCategory.id !== airtimeCategoryId);
            setProducts(filteredProducts.map(prod => ({
              label: prod.product.name,
              value: prod.product.id
            })));
          }
        }
      })
    };

    getProducts();
  }, []); 

  const closeToast = () => {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
  }

  const getProductInfo = (productId) => {
    const selectedProduct = products.filter((prod) => prod.value === productId);
    return selectedProduct[0];
  }

  const handleDetailsConfirm = () => {
    
    if (productId) {
      const selected = getProductInfo(productId);
      setProductName(selected.label);
    }

    const conditions = [
      {
        value: productId,
        setError: setDropdownValueError,
      },
      {
        value: serial,
        setError: setSerialError,
        setErrorText: setSerialErrorText,
        errormessage: 'Enter product serial',
      },
      {
        value: amount,
        setError: setAmountError,
        setErrorText: setAmountErrorText,
        errorMessage: 'Enter product sale amount'
      },
      {
        value: units,
        setError: setUnitsError,
        setErrorText: setUnitsErrorText,
        errorMessage: 'Enter number of units'
      }
    ];

    const errorMessages = validateInputs(conditions);

    if (errorMessages.length > 0) {
      return;
    }

    setModalVisible(true);
  }

  const handleModalClose = () => {
    setModalVisible(!modalVisible);
  }

  const handleProductSale = async () => {
    handleModalClose();

    let clientRef = await StorageUtil.getClientRef();
    let dateStr = Math.floor(Date.now()).toString();

    const payload = {};
    payload.amount = amount;
    payload.clientRef = clientRef;
    payload.currencyCode = Config.KENYAN_CURRENCY_CODE;
    payload.externalReference = dateStr;
    payload.productId = productId;
    payload.productItemCount = units;
    payload.reference = dateStr;
    payload.serial = serial;

    setLoading(true);
    await ServerCommunicationUtil.sellProduct(payload)
    .then(resp => {
      if (resp.status === 200) {
        setAmount('');
        setProductId(null);
        setProductName('');
        setSerial('');
        setUnits('');
        setLoading(false);
        showToast('Success', 'Product sold successfully');
      } else if (resp.notFoundError && resp.notFoundError.errors) {
        setLoading(false);
        LoggerUtil.logError('Product sale error: ', resp.notFoundError.message + '\n' + resp.notFoundError.errors);
        const errorMessages = resp.notFoundError.errors;
        Object.keys(errorMessages).map((key) => {
          showToast('Error', errorMessages[key]);
        });
      } else if (resp.validationError && resp.validationError.errors) {
        setLoading(false);
        LoggerUtil.logError('Product sale error: ', resp.validationError.errors);
        const errorMessages = resp.validationError.errors;
        Object.keys(errorMessages).map((key) => {
          showToast('Error', errorMessages[key]);
        });
      }
    })
    .catch(error => {
      setLoading(false);
      LoggerUtil.logError('Error selling product', error);
      if (error.toString().includes('Network request failed')) {
        showToast('Error', 'Please check your internet connection');
      } else {
        showToast('Error', 'Error selling product');
      }
    })
  }

  const showToast = (title, message) => {
    toastIdRef.current = toast.show({
      placement: "top",
      duration: 20000,
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
      <Text style={styles.confirmRes}>{content}</Text>
    </View>
  )

  const ModalContent = () => (
    <View>
      <Text style={styles.confirmText}>Confirm Product Sale Details</Text>
      <ConfirmContentView heading="Product" content={productName} />
      <ConfirmContentView heading="Serial" content={serial} />
      <ConfirmContentView heading="Sale Amount" content={amount} />
      <ConfirmContentView heading="Number of Units" content={units} />
    </View>
  )

  if (loading) {
    return (<Loading/>);
  }
  
  return (
    <LinearGradient style={{flex: 1}} colors={['#bcd3e3', '#ffffff']}>
    <View style={styles.container}>
      <View style={styles.formView}>
        <Text style={styles.dropdownHeadingText}>Select product to sell</Text>
        <DropDownPicker
          open={openDropdown}
          value={productId}
          items={products}
          setOpen={setOpenDropdown}
          setValue={setProductId}
          setItems={setProducts}
          style={{
            alignSelf: "center",
            borderColor: dropdownValueError ? COLORS.red : COLORS.grey,
            marginTop: 5,
            width: "90%"
          }}
          placeholder="Select product"
          disableBorderRadius={true}
          onPress={() => setDropdownValueError(false)}
        />
        {dropdownValueError && <Text style={styles.dropdownErrorText}>select product</Text>}
        <FormInput
          error={serialError}
          errorText={serialErrorText}
          heading="Product Serial"
          placeholder="e.g 23458978474"
          onFocus={() => setSerialError(false)}
          inputValue={serial}
          setValue={setSerial}
        />
        <FormInput
          error={amountError}
          errorText={amountErrorText}
          heading="Sale Amount"
          placeholder="e.g 100"
          onFocus={() => setAmountError(false)}
          inputValue={amount}
          setValue={setAmount}
          keyboardType="numeric"
        />
        <FormInput
          error={unitsError}
          errorText={unitsErrorText}
          heading="Number of Units"
          placeholder="e.g 5"
          onFocus={() => setUnitsError(false)}
          inputValue={units}
          setValue={setUnits}
          keyboardType="numeric"
        />
        <SubmitButton
          btnTitle="Sell"
          submit={handleDetailsConfirm}
        />
        <View style={styles.modalParentView}>
          <ModalComponent
            modalVisible={modalVisible}
            handleModalClose={handleModalClose}
            modalContent={<ModalContent/>}
            handleConfirm={handleProductSale}
          />
        </View>
      </View>
    </View>
    </LinearGradient>
  );
}