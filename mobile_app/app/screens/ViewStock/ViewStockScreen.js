import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Image, Modal, Text, TouchableOpacity, View } from "react-native";
import DatePicker from "react-native-date-picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LinearGradient from "react-native-linear-gradient";
import { RadioButton } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";

import { COLORS } from "../../constants/theme";
import FormattingUtil from "../../utils/FormattingUtil";
import Loading from "../../components/Loading";
import LoggerUtil from "../../utils/LoggerUtil";
import ServerCommunicationUtil from "../../utils/ServerCommunicationUtil";
import styles from "./stock.style";
import { useTheme } from "../../theme/ThemeContext";

export default function ViewStockScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { userId } = route.params;
  const [ dateClicked, setDateClicked ] = useState(false);
  const [ fromDate, setFromDate ] = useState(new Date());
  const [ loading, setLoading ] = useState(false);
  const [ modalVisible, setModalVisible ] = useState(false);
  const [ name, setName ] = useState('');
  const [ openFromDate, setOpenFromDate ] = useState(false);
  const [ openToDate, setOpenToDate ] = useState(false);
  const [ statusId, setStatusId ] = useState('');
  const [ stock, setStock ] = useState([]);
  const [ toDate, setToDate ] = useState(new Date());

  const gradientColors = [theme.gradientStart, COLORS.white];

  useEffect(() => {
    getUser();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getProductItems();
    }, [])
  )

  const applyFilter = async () => {
    let filterStr = '';
    if (statusId) {
      filterStr = `q=status.idEQ${statusId}&pgSize=1000`;
    }
    if (dateClicked) {
      let startDate = formatStartDate(fromDate.toISOString());
      let endDate = formatEndDate(toDate.toISOString());
      filterStr = `q=soldOnGT${startDate},soldOnLT${endDate}&pgSize=1000`;
      if (statusId) {
        filterStr = `q=status.idEQ${statusId},q=soldOnGT${startDate},soldOnLT${endDate}&pgSize=1000`;
      }
    }

    await ServerCommunicationUtil.getProductItems(filterStr)
    .then(resp => {
      if (resp.status === 200) {
        setStock(resp.content.data);
        handleModalClose();
      }
    }).catch(error => {
      LoggerUtil.logError("Error applying filter", error);
    })
  }

  const cancelFilter = () => {
    setModalVisible(false);
    setStatusId('');
    resetDates();
  }

  const formatEndDate = (dateStr) => {
    const endTime = `T23:59:59+03:00`;
    return `${dateStr}${endTime}`;
  }

  const formatStartDate = (dateStr) => {
    const startTime = `T00:00:00+03:00`;
    return `${dateStr}${startTime}`;
  }

  const getProductItems = async () => {
    setLoading(true);
    let filterParams = `q=assignedTo.idEQ${userId}&pgSize=1000`;
    await ServerCommunicationUtil.getProductItems(filterParams)
    .then(resp => {
      if (resp.status === 200) {
        setStock(sortStock(resp.content.data));
        setLoading(false);
      } else {
        setLoading(false);
        LoggerUtil.logError('Error getting stock', resp.message);
      }
    }).catch(error => {
      LoggerUtil.logError("Error getting stock", error);
      setLoading(false);
    })
  }

  const getUser = async () => {
    try {
      setLoading(true);
      await ServerCommunicationUtil.getUser(userId)
      .then(resp => {
        if (resp.status === 200) {
          setName(resp.content.fullName);
          setLoading(false);
        }
      })
    } catch (error) {
      LoggerUtil.logError("Error getting user", error);
    }
  };

  const handleModalClose = () => {
    setModalVisible(!modalVisible);
  }

  const resetDates = () => {
    setFromDate(new Date());
    setToDate(new Date());
    setDateClicked(false);
  }

  const openFromDatePicker = () => {
    setOpenFromDate(true);
  }

  const openToDatePicker = () => {
    setOpenToDate(true);
  }

  const sortStock = (productItems) => {
    const sortedProductItems = productItems.sort((a, b) => {
      const statusIdA = a.status.id;
      const statusIdB = b.status.id;

      if (statusIdA > statusIdB) {
        return -1;
      }

      if (statusIdA < statusIdB) {
        return 1;
      }

      return 0;
    });

    return sortedProductItems;
  }

  const viewProductItem = (id) => {
    navigation.navigate('StockDetails', {
      productItemId: id
    });
  }

  if (loading) {
    return(<Loading/>);
  }

  const ModalContent = () => (
    <View style={styles.modalView}>
      <View style={styles.statusModalView}>
        <Text style={styles.statusModalText}>Status</Text>
        <TouchableOpacity onPress={() => setStatusId('')}>
          <Text style={styles.statusResetText}>Reset</Text>
        </TouchableOpacity>
      </View>
      <RadioButtonGroup/>
      <View style={styles.dateModalView}>
        <Text style={styles.statusModalText}>Date sold</Text>
        <TouchableOpacity onPress={resetDates}>
          <Text style={styles.statusResetText}>Reset</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.dateContainer}>
        <TouchableOpacity onPress={openFromDatePicker}>
          <Text style={styles.dateSelectText}>From</Text>
          <View style={styles.dateSelectContainer}>
            <Icon name="calendar-month" size={40} color={COLORS.black} />
            <View style={styles.dateView}>
              <Text style={styles.dateSelectText}>{FormattingUtil.formatShortDate(fromDate.toISOString())}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <DatePicker
          modal
          open={openFromDate}
          mode="date"
          date={fromDate}
          onConfirm={(date) => {
            setOpenFromDate(false)
            setFromDate(date)
          }}
          onCancel={() => { 
            setOpenFromDate(false) 
          }}
        />
        <TouchableOpacity onPress={openToDatePicker}>
          <Text style={styles.dateSelectText}>To</Text>
          <View style={styles.dateSelectContainer}>
            <Icon name="calendar-month" size={40} color={COLORS.black} />
            <View style={styles.dateView}>
              <Text style={styles.dateSelectText}>{FormattingUtil.formatShortDate(toDate.toISOString())}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <DatePicker
          modal
          open={openToDate}
          mode="date"
          date={toDate}
          onConfirm={(date) => {
            setOpenToDate(false)
            setToDate(date)
          }}
          onCancel={() => { 
            setOpenToDate(false) 
          }}
        />
      </View>
      <View style={styles.modalButtonContainer}>
        <TouchableOpacity style={[styles.modalButton, styles.modalButtonCancel]} onPress={cancelFilter}>
          <Text style={styles.modalButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.modalButton, styles.modalButtonApply]} onPress={applyFilter}>
          <Text style={styles.modalButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const RadioButtonGroup = () => (
    <View style={styles.radioGroup}>
      <View style={styles.radioButton}>
        <RadioButton.Android
          value="16"
          status={statusId === '16' ? 'checked' : 'unchecked'}
          onPress={() => setStatusId('16')}
          color={COLORS.primary}
        />
        <Text style={styles.radioLabel}>Sold</Text>
      </View>
      <View style={[styles.radioButton, {marginLeft: 30}]}>
        <RadioButton.Android
          value="17"
          status={statusId === '17' ? 'checked' : 'unchecked'}
          onPress={() => setStatusId('17')}
          color={COLORS.primary}
        />
        <Text style={styles.radioLabel}>In Stock</Text>
      </View>
    </View>
  )

  const StockView = ({ item, navigation }) => (
    <TouchableOpacity style={styles.stockContainer} onPress={() => viewProductItem(item.id)}>
      <View style={styles.nameView}>
        <Text style={styles.nameText}>{item.product.name}</Text>
        <Text style={styles.nameText}>{item.product.serviceProvider.name}</Text>
      </View>
      <View style={styles.nameView}>
        <View style={styles.detailsView}>
          <Text style={styles.serialHeadingText}>Serial: </Text>
          <Text style={styles.serialText}>{item.serialNumber}</Text>
        </View>
        {item.batchNumber &&
          <View style={styles.detailsView}>
            <Text style={styles.serialHeadingText}>Batch No: </Text>
            <Text style={styles.serialText}>{item.batchNumber}</Text>
          </View>
        }
      </View>
      <View style={styles.nameView}>
        <Text style={[styles.statusText, {color: item.status.name === 'received' || item.status.name === 'dispatched' ? COLORS.green : COLORS.red}]}>
          {item.status.name === 'received' ? 'In Stock' : item.status.name}
        </Text>
        {item.soldOn &&
          <View style={styles.detailsView}>
            <Text style={[styles.dateText, {fontWeight: "400"}]}>Date sold: </Text>
            <Text style={[styles.dateText, {fontWeight: "600"}]}>{FormattingUtil.formatDate(item.soldOn)}</Text>
          </View>
        }
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={gradientColors} style={{flex: 1}}>
    <View style={styles.container}>
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleModalClose}
        >
          <ModalContent/>
        </Modal>
      </View>
      <View style={styles.headingView}>
        <Text style={styles.agentNameText}>{name}</Text>
        <TouchableOpacity style={styles.filterContainer} onPress={() => setModalVisible(true)}>
          <Image source={require('../../assets/images/filter.png')} style={styles.filterImage} />
          <Text style={styles.filterText}>filter</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={stock}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StockView item={item} navigation={navigation} />
        )}
      />
    </View>
    </LinearGradient>
  );
}