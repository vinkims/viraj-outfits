import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import LinearGradient from "react-native-linear-gradient";
import { useToast } from "native-base";
import { useFocusEffect } from "@react-navigation/native";

import { COLORS } from "../../constants/theme";
import Loading from "../../components/Loading";
import LoggerUtil from "../../utils/LoggerUtil";
import ServerCommunicationUtil from "../../utils/ServerCommunicationUtil";
import StorageUtil from "../../utils/StorageUtil";
import styles from "./viewagents.style";
import ToastComponent from "../../components/Toast";
import { useLanguage } from "../../utils/language/LanguageProvider";
import { useTheme } from "../../theme/ThemeContext";

export default function ViewAgentsScreen({ navigation }) {
  const { theme } = useTheme();
  const toast = useToast();
  const toastIdRef = useRef();
  const { translate } = useLanguage();
  const [ agents, setAgents ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ sortBy, setSortBy ] = useState('sales');
  const [ sortOrder, setSortOrder ] = useState('desc');

  const gradientColors = [theme.gradientStart, COLORS.white];

  useEffect(() => {
    getAgents();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getAgents();
    }, [sortOrder, sortBy])
  )

  const calculateSalesAmount = (stock) => {
    let totalSalesAmount = 0;
    stock.forEach((item) => {
      if (item.status.name === 'sold' || item.status.name === 'manually_sold') {
        totalSalesAmount += item * 45;
      }
    });
    return totalSalesAmount;
  }

  const getAgents = async () => {
    try {
      setLoading(true);
      const userId = await StorageUtil.getUserId();
      await ServerCommunicationUtil.getUser(userId)
      .then(resp => {
        if (resp.status === 200) {
          const sortedAgents = sortAgents(resp.content.userRelations);
          setAgents(sortedAgents);
        }
      })
    } catch(error) {
      LoggerUtil.logError("Error getting agents", error);
    } finally {
      setLoading(false);
    }
  }

  const getAllocatedStockCount = (stock) => {
    return stock.filter((item) => item.status.name === "received").length;
  }

  const getSoldStockCount = (stock) => {
    return stock.filter((item) => item.status.name === "sold" || item.status.name === "manually_sold").length;
  }

  const handleSuspendUser = (userId, fullName, status) => {
    const statusAction = status === 'active' ? 'suspend' : 'activate';
    Alert.alert(
      'Confirm',
      `Confirm you want to ${statusAction} agent ${fullName}`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel pressed'),
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => suspendUser(userId, status)
        }
      ]
    );
  }

  const handleViewStock = (userId) => {
    navigation.navigate('ViewStock', {
      userId: userId
    });
  }

  const showToast = (title, message) => {
    toastIdRef.current = toast.show({
      placement: "top",
      render: () => {
        return <ToastComponent title={title} message={message} />
      }
    })
  }

  const sortAgents = (agents) => {
    console.log("AgentsA: ", agents);
    if (!agents) {
      return [];
    }

    let sortedAgents = [...agents];
    if (sortBy === 'sales'){
      sortedAgents.sort((a, b) => {
        const aSales = getSoldStockCount(a.childUser.productItems);
        const bSales = getSoldStockCount(b.childUser.productItems);
        return sortOrder === 'desc' ? bSales - aSales : aSales - bSales;
      });
    } else if (sortBy === 'salesAmount') {
      sortedAgents.sort((a, b) => {
        const aSalesAmount = calculateSalesAmount(a.childUser.productItems);
        const bSalesAmount = calculateSalesAmount(b.childUser.productItems);
        return sortOrder === 'desc' ? bSalesAmount - aSalesAmount : aSalesAmount - bSalesAmount;
      });
    }
    return sortedAgents;
  }

  const suspendUser = async (userId, status) => {
    let statusId = status === 'active' ? 3 : 1;
    let statusText = status === 'active' ? 'suspended' : 'activated';
    let statusErrorText = status === 'active' ? 'suspending' : 'activating';
    let payload = {
      statusId: statusId
    }

    try {
      setLoading(true);
      await ServerCommunicationUtil.updateUser(userId, payload)
      .then(resp => {
        if (resp.status === 200) {
          showToast('Success', `Successfully ${statusText} agent`);
          getAgents();
        }
      })
    } catch (error) {
      LoggerUtil.logError("Error updating agent", error);
      showToast('Error', `Error ${statusErrorText} agent`);
    } finally {
      setLoading(false);
    }
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  }

  if (loading) {
    return(<Loading/>);
  }

  const AgentView = ({ item, navigation }) => {
    return (
      <View style={styles.agentCard}>
        <View style={styles.agentNameView}>
          <Text style={styles.agentName}>{item.childUser.fullName}</Text>
          <Text style={[styles.statusText, {color: item.childUser.status.name === 'active' ? COLORS.green : COLORS.red}]}>{item.childUser.status.name}</Text>
          <TouchableOpacity 
            style={[styles.suspendButton, {backgroundColor: theme.primaryColor}]} 
            onPress={() => handleSuspendUser(item.childUser.id, item.childUser.fullName, item.childUser.status.name)}
          >
            <Text style={styles.viewStockButtonText}>{item.childUser.status.name === 'active' ? 'SUSPEND' : 'ACTIVATE'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.agentPhoneView}>
          <View style={styles.agentPhoneContainer}>
            <Text style={styles.agentPhoneHeadingText}>Mobile: </Text>
            <Text style={styles.agentPhoneDetailsText}>{item.childUser.phoneNumber}</Text>
          </View>
          <View style={styles.agentPhoneContainer}>
            <Text style={styles.agentPhoneHeadingText}>Code: </Text>
            <Text style={styles.agentPhoneDetailsText}>{item.childUser.key}</Text>
          </View>
        </View>
        <View style={styles.stockInfo}>
          <View style={styles.stockNumberContainer}>
            <Text style={styles.stockText}>Stock</Text>
            <View style={styles.stockStatus}>
              <StockStatusIcon name="database" color="#3498db" />
              <StockNumberContainer heading={translate('allocated')} stockNumber={item.childUser.productItems.length} />
            </View>
            <View style={styles.stockStatus}>
              <StockStatusIcon name="check-circle" color="#2ecc71" />
              <StockNumberContainer heading={translate('available')} stockNumber={getAllocatedStockCount(item.childUser.productItems)} />
            </View>
            <View style={styles.stockStatus}>
              <StockStatusIcon name="shopping-cart" color="#e74c3c" />
              <StockNumberContainer heading={translate('sold')} stockNumber={getSoldStockCount(item.childUser.productItems)} />
            </View>
          </View>
          <TouchableOpacity style={[styles.viewStockButton, {backgroundColor: theme.primaryColor}]} onPress={() => handleViewStock(item.childUser.id)}>
            <Text style={styles.viewStockButtonText}>{translate('viewStockBtn')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const StockNumberContainer = ({heading, stockNumber}) => (
    <View style={styles.stockNumberView}>
      <Text style={styles.stockNumberHeading}>{heading}: </Text>
      <Text style={styles.stockNumberText}>{stockNumber}</Text>
    </View>
  );

  const StockStatusIcon = ({name, color}) => (
    <Icon name={name} size={15} color={color} style={{marginRight: 5}} />
  );

  return(
    <LinearGradient colors={gradientColors} style={{flex: 1}}>
    <View style={styles.container}>
      <Text style={styles.sortOptionText}>Sort By Sales:</Text>
      <View style={styles.sortContainer}>
        <View style={styles.sortRadioView}>
          <TouchableOpacity style={styles.sortRadioContainer} onPress={() => setSortBy("sales")}>
            <Icon name={sortBy === "sales"? "dot-circle-o": "circle-o"} size={20} color={COLORS.black} />
            <Text style={styles.sortRadioText}>Numbers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.sortRadioContainer, { marginLeft: 10 }]} onPress={() => setSortBy("salesAmount")}>
            <Icon name={sortBy === "salesAmount" ? "dot-circle-o" : "circle-o"} size={20} color={COLORS.black} />
            <Text style={styles.sortRadioText}>Amount</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.sortOrder} onPress={toggleSortOrder}>
          <Icon 
            name={sortOrder === "asc" ? "arrow-up" : "arrow-down"} 
            size={15}
            color={COLORS.black}
          />
          <Text style={styles.sortRadioText}>{sortOrder === "asc" ? "asc" : "desc"}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={agents}
        keyExtractor={(item) => item.childUser.id}
        contentContainerStyle={{ flexGrow: 1}}
        renderItem={({ item }) => (
          <AgentView item={item} navigation={navigation} />
        )}
      />
    </View>
    </LinearGradient>
  );
}