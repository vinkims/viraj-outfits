import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { COLORS, mainTheme } from "../constants/theme";
import DrawerMenu from "../components/DrawerMenu";
import HomeScreen from "../screens/Home/HomeScreen";
import LoggerUtil from "../utils/LoggerUtil";
import ManualLineSale from "../screens/manual_sale/ManualLineSale";
import RegisterAgent from "../screens/AgentRegistration/RegisterAgent";
import SaleScreen from "../screens/Sale/SaleScreen";
import SellAirtimeScreen from "../screens/Sale/SellAirtimeScreen";
import StockAllocation from "../screens/StockAllocation/StockAllocation";
import StockScreen from "../screens/Stock/StockScreen";
import StorageUtil from "../utils/StorageUtil";
import ViewAgentsScreen from "../screens/ViewAgents/ViewAgentsScreen";
import { useLanguage } from "../utils/language/LanguageProvider";
import { useTheme } from "../theme/ThemeContext";

const Drawer = createDrawerNavigator();

const renderDrawerScreen = (route) => (
  <Drawer.Screen
    key={route.name}
    name={route.name}
    component={route.component}
    options={{
      drawerIcon: ({}) => (
        <Icon name={route.iconName} size={20} color={COLORS.black} />
      )
    }}
  />
);

const renderDrawerRoutes = (routes) => (
  routes.map((route) => renderDrawerScreen(route))
);

const DrawerNavigator = () => {
  const { changeTheme } = useTheme();
  const { translate } = useLanguage();
  const [ isCBL, setIsCBL ] = useState(false);
  const [ clientName, setClientName ] = useState('');
  const [ clientTheme, setClientTheme ] = useState(null);
  
  useEffect(() => {
    const getUserRoles = async () => {
      try {
        const userRoles = await StorageUtil.getUserRoles();
        userRoles?.map(role => {
          if (role.name === 'CBL') {
            setIsCBL(true);
          }
        });
      } catch (error) {
        LoggerUtil.logError("Error getting user role", error);
      }
    }
    getUserRoles();
  },[]);

  useEffect(() => {
    const getClientName = async () => {
      try {
        const client = await StorageUtil.getClientName();
        if (client) {
          setClientName(client);
        }
      } catch (error) {
        LoggerUtil.logError("Error getting client name", error);
      }
    }

    getClientName();
  }, []);

  useEffect(() => {
    const getClientTheme = async () => {
      try {
        const themeStr = await StorageUtil.getClientTheme();
        if (themeStr) {
          const theme = JSON.parse(themeStr);
          setClientTheme(theme);
        }
      } catch (error) {
        LoggerUtil.logError("Error getting client theme", error);
      }
    }

    getClientTheme();
  }, []);

  useEffect(() => {
    if (clientTheme && clientTheme.primaryColor) {
      changeTheme(clientTheme);
    } else {
      const initialTheme = mainTheme;
      changeTheme(initialTheme);
    }
  }, [changeTheme, clientName, clientTheme]);

  const cblRoutes = [
    {
      name: translate('home'),
      component: HomeScreen,
      iconName: "home-outline",
    },
    {
      name: translate('sellAirtime'),
      component: SellAirtimeScreen,
      iconName: "cellphone",
    },
    {
      name: translate('sellGiftCard'),
      component: SellAirtimeScreen,
      iconName: "wallet-giftcard",
    },
    {
      name: translate('sellPayBill'),
      component: SellAirtimeScreen,
      iconName: "receipt",
    },
    {
      name: translate('sellDepositWithdraw'),
      component: SellAirtimeScreen,
      iconName: "cash",
    },
    {
      name: translate('myStock'),
      component: StockScreen,
      iconName: "file-outline",
    },
    {
      name: translate('allocateStock'),
      component: StockAllocation,
      iconName: "file-export-outline",
    },
    {
      name: translate('manualLineSale'),
      component: ManualLineSale,
      iconName: "account-cash-outline",
    },
    {
      name: translate('registerAgent'),
      component: RegisterAgent,
      iconName: "account-plus-outline",
    },
    {
      name: translate('viewAgents'),
      component: ViewAgentsScreen,
      iconName: "account-group-outline",
    },
  ];

  const normalRoutes = [
    {
      name: translate('home'),
      component: HomeScreen,
      iconName: "home-outline",
    },
    {
      name: translate('sellAirtime'),
      component: SellAirtimeScreen,
      iconName: "cellphone",
    },
    {
      name: translate('sellGiftCard'),
      component: SellAirtimeScreen,
      iconName: "wallet-giftcard",
    },
    {
      name: translate('sellPayBill'),
      component: SellAirtimeScreen,
      iconName: "receipt",
    },
    {
      name: translate('sellDepositWithdraw'),
      component: SellAirtimeScreen,
      iconName: "cash",
    },
    {
      name: translate('myStock'),
      component: StockScreen,
      iconName: "file-outline",
    },
    {
      name: translate('sellLine'),
      component: SaleScreen,
      iconName: "cash-plus",
    },
  ];

  return (
    <Drawer.Navigator
      drawerContent={props => <DrawerMenu {...props} />}
      screenOptions={({ navigation }) => ({
        drawerActiveBackgroundColor: clientTheme?.primaryColor || mainTheme.primaryColor,
        drawerActiveTintColor: COLORS.black,
        drawerInactiveTintColor: COLORS.black,
        drawerInactiveBackgroundColor: COLORS.lightGrey,
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={{marginRight: 20}}>
            <Icon name="account-outline" size={25} color={COLORS.black} />
          </TouchableOpacity>
        )

      })}
    >
      {
        isCBL ? renderDrawerRoutes(cblRoutes) : renderDrawerRoutes(normalRoutes)
      }
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;