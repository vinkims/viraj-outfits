import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";

import { COLORS } from "../../constants/theme";
import FormattingUtil from "../../utils/FormattingUtil";
import Loading from "../../components/Loading";
import LoggerUtil from "../../utils/LoggerUtil";
import NoStockMessage from "../../components/NoStockMessage";
import ServerCommunicationUtil from "../../utils/ServerCommunicationUtil";
import StorageUtil from "../../utils/StorageUtil";
import styles from "./stock.style";
import { useLanguage } from "../../utils/language/LanguageProvider";
import { useTheme } from "../../theme/ThemeContext";

export default function StockScreen({ navigation }) {
  const { theme } = useTheme();
  const { translate } = useLanguage();
  const [ loading, setLoading ] = useState(false);
  const [ stock, setStock ] = useState([]);

  const gradientColors = [theme.gradientStart, COLORS.white];

  useFocusEffect(
    useCallback(() => {
      getStock();
    }, [])
  )

  const getStock = async () => {
    try {
      setLoading(true);
      const userId = await StorageUtil.getUserId();
      let params = `q=assignedTo.idEQ${userId}&pgSize=10000`
      await ServerCommunicationUtil.getProductItems(params)
      .then(resp => {
        if (resp.status === 200) {
          setStock(resp.content.data);
        }
      })
    } catch (error) {
      LoggerUtil.logError("Error getting stock", error);
    } finally {
      setLoading(false);
    }
  }

  const viewProductItem = (id) => {
    navigation.navigate('StockDetails', {
      productItemId: id
    })
  }

  if (loading) {
    return (<Loading/>);
  }

  const DetailsView = ({ headingStyle, contentStyle, heading, content }) => (
    <View style={styles.detailsView}>
      <Text style={headingStyle}>{heading}: </Text>
      <Text style={contentStyle}>{content}</Text>
    </View>
  );

  const StockContainer = ({ item, navigation }) => (
    <TouchableOpacity style={styles.stockContainer} onPress={() => viewProductItem(item.id)}>
      <View style={styles.nameView}>
        <Text style={styles.nameText}>{item.product.name}</Text>
        <Text style={styles.nameText}>{item.product.serviceProvider.name}</Text>
      </View>
      <View style={styles.nameView}>
        <DetailsView headingStyle={styles.serialHeadingText} contentStyle={styles.serialText} heading={translate('serial')} content={item.serialNumber} />
        {item.batchNumber && <DetailsView headingStyle={styles.serialHeadingText} contentStyle={styles.serialText} heading={translate('batch')} content={item.batchNumber} />}
      </View>
      {item.dispatchDate && <DetailsView headingStyle={styles.dateHeadingText} contentStyle={styles.dateText} heading={translate('dateAllocated')} content={FormattingUtil.formatDate(item.dispatchDate)} />}
    </TouchableOpacity>
  );

  return (
    <LinearGradient style={{ flex: 1}} colors={gradientColors}>
    <View style={styles.container}>
      {stock.length === 0 &&
        <NoStockMessage/>
      }
      <FlatList
        data={stock}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StockContainer item={item} navigation={navigation} />
        )}
      />
    </View>
    </LinearGradient>
  );
}