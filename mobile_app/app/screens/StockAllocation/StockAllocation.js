import React, { useEffect, useRef, useState } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import filter from "lodash.filter";
import LinearGradient from "react-native-linear-gradient";
import { useToast } from "native-base";

import { COLORS } from "../../constants/theme";
import Loading from "../../components/Loading";
import LoggerUtil from "../../utils/LoggerUtil";
import ModalComponent from "../../components/ModalComponent";
import ServerCommunicationUtil from "../../utils/ServerCommunicationUtil";
import StorageUtil from "../../utils/StorageUtil";
import styles from "./allocation.style";
import SubmitButton from "../../components/SubmitButton";
import ToastComponent from "../../components/Toast";
import { useLanguage } from "../../utils/language/LanguageProvider";
import { useTheme } from "../../theme/ThemeContext";

export default function StockAllocation() {
  const { theme } = useTheme();
  const { translate } = useLanguage();
  const toast = useToast();
  const toastIdRef = useRef();
  const [ agents, setAgents ] = useState([]);
  const [ dropdownOpen, setDropdownOpen ] = useState(false);
  const [ dropdownValue, setDropdownValue ] = useState(null);
  const [ dropdownValueError, setDropdownValueError ] = useState(false);
  const [ fullStock, setFullStock ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ modalVisible, setModalVisible ] = useState(false);
  const [ searchText, setSearchText ] = useState('');
  const [ selected, setSelected ] = useState([]);
  const [ selectedSerial, setSelectedSerial ] = useState([]);
  const [ stock, setStock ] = useState([]);

  const gradientColors = [theme.gradientStart, COLORS.white];

  useEffect(() => {
    const getAgents = async () => {
      const userId = await StorageUtil.getUserId();
      await ServerCommunicationUtil.getUser(userId)
      .then(resp => {
        if (resp.status === 200) {
          setAgents(resp.content.userRelations.map(ag => ({
            label: ag.childUser.firstName + ' ' + ag.childUser.lastName + '  ' + '  ' + ag.childUser.key + '  ' + ag.childUser.phoneNumber,
            value: ag.childUser.id
          })));
        }
      })
      .catch(error => {
        LoggerUtil.logError('Get agents', error);
      }) 
    };

    getAgents();
  }, []);

  useEffect(() => {
    getStock();
  }, []);

  const closeToast = () => {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
  }

  const contains = ({serialNumber, batchNumber}, query) => {
    if (serialNumber.includes(query) || (batchNumber !== null && batchNumber.includes(query))) {
      return true;
    }
    return false;
  }

  const getStock = async () => {
    setLoading(true);
    const userId = await StorageUtil.getUserId();
    let params = `q=assignedTo.idEQ${userId}&pgSize=1000`;
    await ServerCommunicationUtil.getProductItems(params)
    .then(resp => {
      if (resp.status === 200) {
        setStock(resp.content.data);
        setFullStock(resp.content.data);
        setLoading(false);
      } else {
        setLoading(false);
        LoggerUtil.logError('Error getting stock', resp.message);
      }
    })
    .catch(error => {
      LoggerUtil.logError('Error getting stock', error);
      setLoading(false);
    })
  }

  const handleDetailsConfirm = () => {
    const conditions = [
      {
        value: dropdownValue,
        setError: setDropdownValueError
      }
    ];

    const errorMessages = validateInputs(conditions);

    if (errorMessages.length > 0) {
      return;
    }

    if (selected.length === 0) {
      showToast('Error', translate('selectStockMessage'));
      return;
    }

    setModalVisible(true);
  }

  const handleAllocation = async () => {
    handleModalClose();

    setLoading(true);
    const payload = {
      productItemIds: selected
    }
    LoggerUtil.logDebug('Payload', payload);
    await ServerCommunicationUtil.allocateStock(dropdownValue, payload)
    .then(resp => {
      if (resp.status === 200) {
        setLoading(false);
        setSelected([]);
        setSelectedSerial([]);
        showToast('Success', 'Product(s) allocated successfully');
        setDropdownValue(null);
        getStock();
      } else if (resp.notFoundError && resp.notFoundError.errors) {
        setLoading(false);
        LoggerUtil.logError('Line allocation error:', resp.notFoundError.message +'\n' + resp.notFoundError.errors );
        const errorMessages = resp.notFoundError.errors;
        Object.keys(errorMessages).map((key) => {
          showToast('Error', errorMessages[key]);
        });
      } else if (resp.validationError && resp.validationError.errors) {
        LoggerUtil.logError('Validation error', resp.validationError.errors);
        setLoading(false);
        const errorMessages = resp.validationError.errors;
        Object.keys(errorMessages).map((key) => {
          showToast('Error', errorMessages[key]);
        });
      }
    })
    .catch(error => {
      setLoading(false);
      LoggerUtil.logError('Error allocating lines', error);
      if (error.toString().includes('Network request failed')) {
        showToast('Error', 'Please check your internet connection');
      } else {
        showToast('Error', 'Error allocating stock');
      }
    })
  }

  const handleItemPress = (item) => {
    if (selected.includes(item.id)) {
      setSelected(selected.filter((id) => id !== item.id));
      setSelectedSerial(selectedSerial.filter((serial) => serial !== item.serialNumber));
    } else {
      setSelected([...selected, item.id]);
      setSelectedSerial([...selectedSerial, item.serialNumber]);
    }
  }

  const handleModalClose = () => {
    setModalVisible(!modalVisible);
  }

  const handleSearch = (query) => {
    setSearchText(query);
    const formattedQuery = query.toUpperCase();
    const filteredData = filter(fullStock, (item) => {
      return contains(item, formattedQuery);
    });
    setStock(filteredData);
  }

  const handleSelectAll = () => {
    setSelected(stock.map((item) => item.id))
    setSelectedSerial(stock.map((item) => item.serialNumber));
  }

  const showToast = (title, message) => {
    toastIdRef.current = toast.show({
      placement: "top",
      render: () => {
        return <ToastComponent title={title} message={message} closeToast={closeToast} />
      }
    })
  }

  const validateInputs = (conditions) => {
    const errorMessages = [];

    for (const condition of conditions) {
      const { value, setError, setErrorText, errorMessage} = condition;
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
      <Text style={styles.confirmText}>Confirm you are assigning products with the following serial number(s): </Text>
      {selectedSerial.map((item, index) => (
        <Text key={index} style={styles.serialConfirmText}>{item}</Text>
      ))}
    </View>
  );

  if (loading) {
    return (<Loading/>);
  }

  return (
    <LinearGradient colors={gradientColors} style={{flex: 1}}>
    <View style={styles.container}>
      <View style={styles.formView}>
        <ModalComponent
          modalVisible={modalVisible}
          handleModalClose={handleModalClose}
          modalContent={<ModalContent/>}
          handleConfirm={handleAllocation}
        />
        <Text style={styles.headingText}>{translate('selectAgent')}</Text>
        <DropDownPicker
          open={dropdownOpen}
          value={dropdownValue}
          items={agents}
          searchable={true}
          setOpen={setDropdownOpen}
          setValue={setDropdownValue}
          setItems={setAgents}
          style={{
            alignSelf: "center",
            borderColor: dropdownValueError ? COLORS.red : COLORS.grey,
            marginBottom: 5,
            marginTop: 10,
            width: "90%"
          }}
          placeholder={translate('selectAgent')}
          onPress={() => setDropdownValueError(false)}
        />
        {dropdownValueError && <Text style={styles.dropdownErrorText}>{translate('selectAgent')}</Text>}
        <Text style={[styles.headingText, {marginTop: 5}]}>{translate('selectStockAllocation')}</Text>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <TextInput
              style={{color: COLORS.black, backgroundColor: COLORS.white}}
              placeholder={translate('searchBySerialOrBatchNumber')}
              placeholderTextColor={COLORS.black}
              clearButtonMode="always"
              value={searchText}
              onChangeText={(query) => handleSearch(query)}
            />
          </View>
          <TouchableOpacity style={styles.selectView} onPress={handleSelectAll}>
            <Text style={styles.selectText}>{translate('selectAll')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.flatlistView}>
          <FlatList
            data={stock}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                onPress={() => handleItemPress(item)}
                style={[styles.allocationView, {backgroundColor: selected.includes(item.id) ? COLORS.lightBlue : COLORS.lightGrey}]}
              >
                <View>
                  <View style={styles.nameView}>
                    <Text style={styles.nameText}>{item.product.name}</Text>
                    <Text style={styles.nameText}>{item.product.serviceProvider.name}</Text>
                  </View>
                  <View style={styles.detailsView}>
                    <Text style={styles.serialHeadingText}>{translate('serial')}: </Text>
                    <Text style={styles.serialText}>{item.serialNumber}</Text>
                  </View>
                  {item.batchNumber !== null &&
                    <View style={styles.detailsView}>
                      <Text style={styles.serialHeadingText}>{translate('batch')}: </Text>
                      <Text style={styles.serialText}>{item.batchNumber}</Text>
                  </View>
                  }
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
        <SubmitButton
          btnTitle={translate('allocate')}
          submit={handleDetailsConfirm}
        />
      </View>
    </View>
    </LinearGradient>
  );
}