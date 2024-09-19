import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, FlatList, Linking, Text, TouchableOpacity, View } from "react-native";
import Config from "react-native-config";

import FontIcon from "react-native-vector-icons/FontAwesome";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import jwt_decode from "jwt-decode";
import LinearGradient from "react-native-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import { useToast } from "native-base";

import { COLORS } from "../../constants/theme";
import FormattingUtil from "../../utils/FormattingUtil";
import Loading from "../../components/Loading";
import LoggerUtil from "../../utils/LoggerUtil";
import NavigationService from "../../services/NavigationService";
import ServerCommunicationUtil from "../../utils/ServerCommunicationUtil";
import StorageUtil from "../../utils/StorageUtil";
import styles from "./home.style";
import ToastComponent from "../../components/Toast";
import { useLanguage } from "../../utils/language/LanguageProvider";
import { useTheme } from "../../theme/ThemeContext";

const TRANSACTION_TYPE_IDS = [ 4, 7, 8, 11];

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  const toast = useToast();
  const toastIdRef = useRef();
  const { translate } = useLanguage();
  const [ agents, setAgents ] = useState([]);
  const [ bonus, setBonus ] = useState('');
  const [ confirmedCommission, setConfirmedCommission ] = useState('');
  const [ float, setFloat ] = useState('');
  const [ currency, setCurrency] = useState('');
  const [ isCBL, setIsCBL ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ mobileNumber, setMobileNumber ] = useState('');
  const [ myTransactions, setMyTransactions ] = useState([]);
  const [ pendingCommission, setPendingCommission ] = useState('');
  const [ productItemCount, setProductItemCount ] = useState('');
  const [ reload, setReload ] = useState(false);
  const [ selectedType, setSelectedType ] = useState('myTransactions');
  const [ transactions, setTransactions ] = useState([]);

  const gradientColors = [theme.gradientStart, COLORS.white];

  useEffect(() => {
    checkAppVersion();
    StorageUtil.getCurrency().then(cur => setCurrency(JSON.parse(cur)));
    processPendingTransaction();
  }, []);

  useEffect(() => {
    const checkTokenValidity = async () => {
      setLoading(true);
      try {
        const token = await StorageUtil.getToken();
        if (token) {
          const dateNow = new Date();
          const decoded = jwt_decode(token);
          if (decoded.exp * 1000 > dateNow.getTime()) {
            LoggerUtil.logInfo("TOKEN VALID");
          } else {
            StorageUtil.removeKeys();
            NavigationService.reset('Login');
          }
        } else {
          StorageUtil.removeKeys();
          NavigationService.reset('Login');
        }
      } catch (error) {
        LoggerUtil.logError('Error checking token validity', error);
        StorageUtil.removeKeys();
        NavigationService.reset('Login');
      }
    }

    checkTokenValidity();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getSafaricomLines();
      getAgentTransactions();
      getOwnTransactions();
      getUserDetails();
    }, [isCBL, reload])
  )

  const checkAppVersion = async () => {
    try {
      await ServerCommunicationUtil.checkAppVersion()
      .then(resp => {
        const appVersion = Config.VERSION_NUMBER;
        const serverVersion = resp.toString();
        if (compareVersions(appVersion, serverVersion) < 0) {
          Alert.alert(
            'There is a latest version of the app', 
            'Click Ok to download',
            [
              {
                text: 'Cancel',
                style: 'cancel'
              },
              {
                text: 'OK',
                onPress: downloadApp
              }
            ]
          )
        }
      })
    } catch (error) {
      LoggerUtil.logError("App version error", error);
    }
  }

  const closeToast = () => {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
  }

  const processPendingTransaction = async () => {
    const pendingTransaction  = StorageUtil.getPendingTransaction();
    if (!!pendingTransaction || !!pendingTransaction?.externalId) return;
    await ServerCommunicationUtil.completeTopup(pendingTransaction?.externalId)
      .then(resp => {
        if (resp.content && resp.content.status) {
          if (resp.content.status.name.toLowerCase() === 'complete') {
            handleReload();
            showToast('success', 'topup completed successfully', COLORS.green)
          } else {
            const color = resp.content.status.name.toLowerCase() === 'failed' ? COLORS.red : COLORS.grey;
            showToast(resp.content.status.name, `topup ${resp.content.status.name}`, color);
          }
          if (resp.content.status.name.toLowerCase() === 'pending') {
            StorageUtil.storePendingTransaction(null);
          }
        }
      })
      .catch(err => {
        console.error("processPendingTransaction:e01", err)
      })
  }

  const compareVersions = (versionA, versionB) => {
    const partsA = versionA.split('.').map(Number);
    const partsB = versionB.split('.').map(Number);

    for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
      const a = partsA[i] || 0;
      const b = partsB[i] || 0;

      if (a !== b) {
        return a - b;
      }
    }

    return 0;
  }

  const downloadApp = () => {
    const downloadUrl = Config.APP_DOWNLOAD_URL;
    Linking.openURL(downloadUrl);
  }

  const getAgentTransactions = async () => {
    const allTransactions = [];

    if (isCBL) {
      for (const agent of agents) {
        let params = `q=userTransactions.user.idEQ${agent.childUser.id},transactionType.idIN${TRANSACTION_TYPE_IDS.join(";")}&pgSize=20`;
        await ServerCommunicationUtil.getTransactions(params)
        .then(resp => {
          if (resp.status === 200 && resp.content.data.length > 0) {
            allTransactions.push(...resp.content.data);
          }
        })
        .catch(error => {
          LoggerUtil.logError("Error getting agent transactions", error);
        })
      }
    }

    setTransactions(allTransactions);
  }

  const getSafaricomLines = async () => {
    setLoading(true);
    const userId = await StorageUtil.getUserId();
    let params = `q=assignedTo.idEQ${userId},status.idEQ17`;
    await ServerCommunicationUtil.getProductItems(params)
    .then(resp => {
      if (resp.status === 200) {
        setProductItemCount(resp.pageInfo.totalResults);
        setLoading(false);
      }
    })
    .catch(error => {
      LoggerUtil.logError("Error getting product items", error);
      setLoading(false);
    })
  };

  const getTransactions = async () => {
    const allTransactions = [];
    const transactionIds = [4, 7];

    if (isCBL) {
      for (const agent of agents){
        for (const transactionId of transactionIds) {
          let params = `q=userTransactions.user.idEQ${agent.childUser.id},transactionType.idEQ${transactionId}&pgSize=20`;
          await ServerCommunicationUtil.getTransactions(params)
          .then(resp => {
            if (resp.status === 200 && resp.content.data.length > 0) {
              allTransactions.push(...resp.content.data);
            }
          })
          .catch(error => {
            LoggerUtil.logError("Error getting agent transactions", error);
          })
        }
      }
    } else {
      const userId = await StorageUtil.getUserId();
      for (const transactionId of transactionIds) {
        let params = `q=userTransactions.user.idEQ${userId},transactionType.idEQ${transactionId}&pgSize=20`;
        await ServerCommunicationUtil.getTransactions(params)
        .then(resp => {
          if (resp.status === 200 && resp.content.data.length > 0) {
            allTransactions.push(...resp.content.data);
          }
        })
        .catch (error => {
          LoggerUtil.logError("Error getting transactions", error);
        })
      }
    }

    setTransactions(allTransactions);
  };

  const getOwnTransactions = async () => {
    const userId = await StorageUtil.getUserId();

    let params = `q=userTransactions.user.idEQ${userId},transactionType.idIN${TRANSACTION_TYPE_IDS.join(";")}&pgSize=100`;
    await ServerCommunicationUtil.getTransactions(params)
    .then(resp => {
      if (resp.status === 200 && resp.content.data.length > 0) {
        setMyTransactions(resp.content.data);
      }
    })
    .catch(error => {
      LoggerUtil.logError("Error getting own transactions", error);
    })
  }

  const getProductOrServiceName = item => {
    if (item.product == null && item.service == null) {
      return item.transactionType?.name?.replace("_", " ").toUpperCase() || 'NA';
    }
    if (item.product) {
      return item.product.name;
    }
    return item.service?.name || 'NA';
  }

  const getUserDetails = async () => {
    try {
      setLoading(true);
      const userId = await StorageUtil.getUserId();
      await ServerCommunicationUtil.getUser(userId)
      .then(resp => {
        if (resp.status === 200) {
          setAgents(resp.content.userRelations);
          setBonus(resp.content.bonus);
          setConfirmedCommission(resp.content.confirmedCommission);
          setFloat(resp.content.float);
          setPendingCommission(resp.content.pendingCommission);
          if (resp.content.phoneNumber) {
            setMobileNumber(resp.content.phoneNumber);
          }
          if (resp.content.hasResetPassword === false) {
            NavigationService.reset('ResetPassword');
          }
          if (resp.content.client) {
            StorageUtil.storeClientId(resp.content.client.id);
            StorageUtil.storeClientRef(resp.content.client.key);
          }
          resp.content.userRoles.map((item, index) => {
            if (item.role.name === 'CBL') {
              setIsCBL(true);
            }
          });
        } else if (resp.validationError.errors) {
          LoggerUtil.logError('Error getting user details', resp.validationError.errors);
        }
      })
    } catch (error) {
      LoggerUtil.logError("Error getting user details", error);
    }
  }

  const handleReload = () => {
    setReload(!reload);
  }

  const showToast = (title, message, color = COLORS.orange) => {
    toastIdRef.current = toast.show({
      placement: "top",
      render: () => {
        return <ToastComponent title={title} message={message} color={color} closeToast={closeToast}/>
      }
    })
  }

  const topupFloat = async () => {
    navigation.navigate('TopUp', {
      mobileNumber: mobileNumber
    })
  }

  if (loading) {
    return (<Loading/>)
  }

  const BalancesContainer = () => {
    return (
      <View style={[styles.card, { marginBottom: 50 }]}>
        <View style={{ width: "100%" }}>
          <BalancesView 
            label="Float"
            value={float}
            iconName="money"
            color={theme.primaryColor}
            isAmount={true}
            btn = {
              <TouchableOpacity style={[styles.floatTopupButton, {backgroundColor: theme.primaryColor}]} onPress={topupFloat}>
                <Text style={styles.floatTopupText}>TOPUP FLOAT</Text>
              </TouchableOpacity>
            }
          />
          <BalancesView label="Stock Count" value={productItemCount} iconName="th-large" color={theme.tertiaryColor} />
          <BalancesView label="Confirmed Commission" value={confirmedCommission} iconName="check" color={theme.primaryColor} isAmount={true} />
          <BalancesView label="Pending Commission" value={pendingCommission} iconName="spinner" color={theme.tertiaryColor} isAmount={true} />
          <BalancesView label="Bonus" value={bonus} iconName="gift" color={theme.primaryColor} />
        </View>
      </View>
    );
  };

  const BalancesIcon = ({ name, color }) => (
    <FontIcon name={name} size={15} color={color} style={{marginRight: 6}} />
  );

  const BalancesView = ({label, value, iconName, color, isAmount, btn}) => (
    <View style={[styles.cardDetailsContainer, !!btn && {justifyContent: "space-between"}]}>
      <BalancesIcon name={iconName} color={color} />
      <Text style={styles.cardDetailsLabel}>{label}: </Text>
      <Text style={styles.cardDetailsValue}>
        {isAmount ? (value || 0).toFixed(2) : value || 0}
        {isAmount && ` ${currency.code}`}
      </Text>
      {btn}
    </View>
  );

  const TransactionSelectionView = () => (
    <View style={styles.transactionSelectionView}>
      <TouchableOpacity onPress={() => setSelectedType('myTransactions')}>
        <Text style={[styles.transactionSelectionText, selectedType === 'myTransactions' && {color: theme.primaryColor}]}>{translate('myTransactions')}</Text>
      </TouchableOpacity>
      {isCBL && <TouchableOpacity onPress={() => setSelectedType('agentTransactions')}>
        <Text style={[styles.transactionSelectionText, selectedType === 'agentTransactions' && {color: theme.primaryColor}]}>{translate('agentTransactions')}</Text>
      </TouchableOpacity>}
    </View>
  )

  const TransactionView = ({ item }) => (
    <View style={styles.transactionView}>
      <View style={styles.detailsView}>
        <Text style={styles.externalRefText}>{getProductOrServiceName(item)}</Text>
        <Text style={styles.amountText}>{item.totalAmount}</Text>
        <Text style={styles.dateText}>{FormattingUtil.formatDate(item.createdOn)}</Text>
      </View>
      <View style={styles.transactionNameView}>
        <View style={styles.recipientView}>
          <Text style={styles.recipientHeading}>{translate('reference')}: </Text>
          <Text style={styles.recipientText}>{item.accountReference ? item.accountReference : 'NA'}</Text>
        </View>
        <Text style={[styles.statusText, {color: item.status.name === 'complete' ? COLORS.green : COLORS.red}]}>{translate(item.status.name)}</Text>
      </View>
      <View style={styles.transactionNameView}>
        <View style={styles.recipientView}>
          <Text style={styles.recipientHeading}>Transaction Type:</Text>
          <Text style={styles.transactionTypeName}> {item.transactionType.name.split("_").join(" ")}</Text>
        </View>
        {
          isCBL && item.userTransactions ?
          (item.userTransactions.length > 0 &&
            <View style={styles.transactionUserView}>
              <Text style={styles.transactionUserHeading}>{translate('user')}: </Text>
              <Text style={styles.transactionName}> {item.userTransactions[0].user.fullName}</Text>
            </View>
          ) : (
            <View/>
          )
        }
      </View>
    </View>
  );

  return (
    <LinearGradient style={{ flex: 1}} colors={gradientColors}>
    <View style={styles.container}>
      <View style={styles.balancesView}>
        <View style={styles.balancesContainer}>
          <Text style={styles.headingText}>{translate('balances')}</Text>
          <TouchableOpacity onPress={handleReload}>
            <Icon name="refresh" size={30} color={theme.black} />
          </TouchableOpacity>
        </View>
        <BalancesContainer/>
      </View>
      <TransactionSelectionView/>
      <View style={styles.flatlistView}>
        {selectedType === 'myTransactions' ? (
          <FlatList
            data={myTransactions}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{flexGrow: 1}}
            renderItem={({ item }) => (
              <TransactionView item={item} />
            )}
          />
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{flexGrow: 1}}
            renderItem={({ item }) => (
              <TransactionView item={item} />
            )}
          />
        )}
      </View>
    </View>
    </LinearGradient>
  );
}