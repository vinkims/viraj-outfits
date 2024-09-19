import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import LinearGradient from "react-native-linear-gradient";
import { useToast } from "native-base";

import { COLORS } from "../../constants/theme";
import FormattingUtil from "../../utils/FormattingUtil";
import Loading from "../../components/Loading";
import LoggerUtil from "../../utils/LoggerUtil";
import ServerCommunicationUtil from "../../utils/ServerCommunicationUtil";
import StorageUtil from "../../utils/StorageUtil";
import styles from "./stock.style";
import ToastComponent from "../../components/Toast";
import { useLanguage } from "../../utils/language/LanguageProvider";
import { useTheme } from "../../theme/ThemeContext";

export default function StockDetailsScreen({ route, navigation }) {
  const { productItemId } = route.params;
  const { theme } = useTheme();
  const { translate } = useLanguage();
  const toast = useToast();
  const toastRef = useRef();
  const [ agents, setAgents ] = useState([]);
  const [ assignedBy, setAssignedBy ] = useState('');
  const [ assignedById, setAssignedById ] = useState(0);
  const [ assignedTo, setAssignedTo ] = useState('');
  const [ assignedToId, setAssignedToId ] = useState(0);
  const [ batchNumber, setBatchNumber ] = useState('');
  const [ dateAssigned, setDateAssigned ] = useState('');
  const [ dateSold, setDateSold ] = useState('');
  const [ dropdownOpen, setDropdownOpen ] = useState(false);
  const [ dropdownValue, setDropdownValue ] = useState(null);
  const [ dropdownValueError, setDropdownValueError ] = useState(false);
  const [ isCBL, setIsCBL ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ productName, setProductName ] = useState('');
  const [ reassign, setReassign ] = useState(false);
  const [ serialNumber, setSerialNumber ] = useState('');
  const [ serviceProvider, setServiceProvider ] = useState('');
  const [ showThird, setShowThird ] = useState(false);
  const [ status, setStatus ] = useState(false);
  const [ stockStatus, setStockStatus ] = useState('') ;
  const [ units, setUnits ] = useState('');

  const gradientColors = [theme.gradientStart, COLORS.white];

  useEffect(() => {
    getProductItem() ;
  }, []);

  useEffect(() => {
    const getUserRoles = async () => {
      try {
        let userRoles = await StorageUtil.getUserRoles();
        userRoles?.map(role => {
          if (role.name === 'CBL') {
            setIsCBL(true);
            setShowThird(true);
          }
        });
      } catch (error) {
        LoggerUtil.logError("Error getting user roles", error);
      }
    }
    getUserRoles();
  }, []);

  useEffect(() => {
    const getAgents = async () => {
      try {
        const userId = await StorageUtil.getUserId();
        await ServerCommunicationUtil.getUser(userId)
        .then(resp => {
          if (resp.status === 200) {
            const updatedAgents = resp.content.userRelations
              .filter((ag) => ag.childUser.id !== assignedToId)
              .map((ag) => ({
                label: ag.childUser.fullName,
                value: ag.childUser.id
              }));
            setAgents(updatedAgents);
          }
        })
      } catch (error) {
        LoggerUtil.logError("Error fetching agents", error);
      }
    }
    getAgents();
  }, [assignedToId]);

  const closeToast = () => {
    if (toastRef.current) {
      toast.close(toastRef.current);
    }
  }

  const getProductItem = async () => {
    try {
      setLoading(true);
      await ServerCommunicationUtil.getProductItemById(productItemId)
      .then(resp => {
        if (resp.status === 200) {
          if (resp.content.assignedBy) {
            setAssignedBy(resp.content.assignedBy.fullName);
            setAssignedById(resp.content.assignedBy.id);
          }
          setAssignedTo(resp.content.assignedTo.fullName);
          setAssignedToId(resp.content.assignedTo.id);
          if (resp.content.batchNumber) {
            setBatchNumber(resp.content.batchNumber);
          }
          if (resp.content.dispatchDate) {
            setDateAssigned(FormattingUtil.formatDate(resp.content.dispatchDate));
          }
          if (resp.content.soldOn) {
            setDateSold(FormattingUtil.formatDate(resp.content.soldOn));
          }
          setProductName(resp.content.product.name);
          setSerialNumber(resp.content.serialNumber);
          setServiceProvider(resp.content.product.serviceProvider.name)
          if (resp.content.status.name === 'received') {
            setStatus(true);
          }
          setStockStatus(resp.content.status.name);
          setUnits(resp.content.productItemCount);
        }
      })
    } catch (error) {
      LoggerUtil.logError("Error fetching product item", error);
    } finally {
      setLoading(false);
    }
  }

  const handleAllocation = async () => {
    if (!dropdownValue) {
      setDropdownValueError(true);
    }

    const productItems = [];
    productItems.push(productItemId);

    const payload = {
      productItemIds : productItems
    }

    setLoading(true);
    await ServerCommunicationUtil.allocateStock(dropdownValue, payload)
    .then(resp => {
      if (resp.status === 200) {
        setLoading(false);
        showToast('Success', 'Line reallocated successfully');
        setDropdownValue(null);
        getProductItem();
        navigation.goBack();
      } else if (resp.notFoundError && resp.notFoundError.errors) {
        setLoading(false);
        LoggerUtil.logError('Line reallocation error', resp.notFoundError.message + '\n' + resp.notFoundError.errors);
        const errorMessages = resp.notFoundError.errors;
        Objects.keys(errorMessages).map((key) => {
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
      LoggerUtil.logError('Error reallocating lines', error);
      if (error.toString().includes('Network request failed')) {
        showToast('Error', 'Please check your internet connection');
      } else {
        showToast('Error', 'Error reallocating line');
      }
    })
  }

  const handleCancelReassign = () => {
    setReassign(false);
    setDropdownValue(null);
  }

  const handleDamage = async () => {
    let payload = {
      action: 'DAMAGED',
      statusId: 19
    }

    setLoading(true);
    await ServerCommunicationUtil.updateProductItem(productItemId, payload)
    .then(resp => {
      if (resp.status === 200) {
        setLoading(false);
        showToast('Success', translate('successLineMarkDamage'));
      } else if (resp.notFoundError && resp.notFoundError.errors) {
        setLoading(false);
        LoggerUtil.logError('Error marking line as damaged', resp.notFoundError.message + '\n' + resp.notFoundError.errors);
        const errorMessages = resp.notFoundError.errors;
        Objects.keys(errorMessages).map((key) => {
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
    .catch (error => {
      setLoading(false);
      LoggerUtil.logError('Error marking line as damaged', error);
      if (error.toString().includes('Network request failed')) {
        showToast('Error', 'Please check your internet connection');
      } else {
        showToast('Error', 'Error marking line as damaged');
      }
    })
  }

  const handleReassign = () => {
    setReassign(true);
  }

  const handleReturn = async () => {
    const itemIds = [];
    itemIds.push(productItemId);
    
    let payload = {
      productItemIds: itemIds
    }

    setLoading(true);
    await ServerCommunicationUtil.allocateStock(assignedById, payload)
    .then(resp => {
      if (resp.status === 200) {
        setLoading(false);
        showToast('Success', 'Line returned successfully');
        navigation.goBack();
      } else if (resp.notFoundError && resp.notFoundError.errors) {
        setLoading(false);
        LoggerUtil.logError('Error returning line', resp.notFoundError.message + '\n' + resp.notFoundError.errors);
        const errorMessages = resp.notFoundError.errors;
        Objects.keys(errorMessages).map((key) => {
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
    .catch (error => {
      setLoading(false);
      LoggerUtil.logError('Error returning line', error);
      if (error.toString().includes('Network request failed')) {
        showToast('Error', 'Please check your internet connection');
      } else {
        showToast('Error', 'Error returning line');
      }
    })
  }

  const showToast = (title, message) => {
    toastRef.current = toast.show({
      placement: "top",
      render: () => {
        return <ToastComponent title={title} message={message} closeToast={closeToast} />
      }
    })
  }

  const TextContainer = ({ heading, description }) => {
    return (
      <View style={styles.detailsTextView}>
        <Text style={styles.detailsHeadingText}>{heading}: </Text>
        <Text style={styles.detailsText}>{description}</Text>
      </View>
    );
  }

  if (loading) {
    return (<Loading/>);
  }

  return (
    <LinearGradient style={{ flex: 1}} colors={gradientColors}>
    <View style={styles.container}>
      <View style={styles.detailsContainer}>
        <TextContainer heading={translate('productName')} description={productName} />
        <TextContainer heading={translate('serviceProvider')} description={serviceProvider} />
        {isCBL && <TextContainer heading={translate('assignedTo')} description={assignedTo} />}
        <TextContainer heading={translate('serialNumber')} description={serialNumber} />
        {batchNumber && <TextContainer heading={translate('batchNumber')} description={batchNumber} />}
        <TextContainer heading={translate('numberOfUnits')} description={units} />
        {dateAssigned && <TextContainer heading={translate('dateAssigned')} description={dateAssigned} />}
        <TextContainer heading={translate('assignedBy')} description={assignedBy} />
        {dateSold && <TextContainer heading={translate('dateSold')} description={dateSold} />}
        <TextContainer heading={translate('status')} description={translate(stockStatus)} />
        <Text style={styles.actionText}>{translate('actions')}</Text>
        <View style={styles.actionButtonsView}>
          {stockStatus !== 'damaged' &&
            <TouchableOpacity style={[styles.actionButton, {backgroundColor: theme.primaryColor, borderColor: theme.primaryColor}]} onPress={handleDamage}>
              <Text style={[styles.actionButtonText, {color: COLORS.white}]}>{translate('markDamaged')}</Text>
            </TouchableOpacity>
          }
          <TouchableOpacity style={[styles.actionButton, {backgroundColor: COLORS.white, borderColor: theme.primaryColor}]} onPress={handleReturn}>
            <Text style={[styles.actionButtonText, {color: theme.primaryColor}]}>{translate('returnItem')}</Text>
          </TouchableOpacity>
          {status && !reassign && isCBL &&
            <TouchableOpacity style={[styles.actionButton, {backgroundColor: theme.primaryColor, borderColor: theme.primaryColor}]} onPress={handleReassign}>
              <Text style={[styles.actionButtonText, {color: COLORS.white}]}>{translate('reassign')}</Text>
            </TouchableOpacity>
          }
        </View>

        {/* <FloatingButton 
          firstText="Mark Damaged"
          secondText="Return Item"
          thirdText="Reallocate"
          showThird={showThird} 
        /> */}

        {reassign && <View style={styles.dropdownView}>
          <Text style={[styles.detailsHeadingText, {marginBottom: 5}]}>{translate('selectAgentReassignText')}</Text>
          <DropDownPicker
            open={dropdownOpen}
            value={dropdownValue}
            items={agents}
            setOpen={setDropdownOpen}
            setValue={setDropdownValue}
            setItems={setAgents}
            placeholder={translate('selectAgent')}
            onPress={() => setDropdownValueError(false)}
            style={{
              borderColor: dropdownValueError ? COLORS.red : COLORS.grey,
            }}
          />
          {dropdownValueError && <Text style={styles.dropdownErrorText}>{translate('selectAgent')}</Text>}
          <View style={styles.confirmButtonsView}>
            <TouchableOpacity style={[styles.confirmButton, {backgroundColor: COLORS.red}]} onPress={handleCancelReassign}>
              <Text style={styles.confirmButtonText}>{translate('cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.confirmButton, {backgroundColor: COLORS.green}]} onPress={handleAllocation}>
              <Text style={styles.confirmButtonText}>{translate('confirm')}</Text>
            </TouchableOpacity>
          </View>
        </View>}
      </View>
    </View>
    </LinearGradient>
  );
}
