import React, { useEffect} from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthLoading from "./AuthLoading";
import DrawerNavigator from "./DrawerNavigator";
import LoginScreen from "../screens/Login/LoginScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import RegisterAgent from "../screens/AgentRegistration/RegisterAgent";
import ResetPasswordScreen from "../screens/ResetPassword/RestPasswordScreen";
import SaleScreen from "../screens/Sale/SaleScreen";
import ScanSerial from "../screens/Sale/ScanSerial/ScanSerial";
import SellAirtimeScreen from "../screens/Sale/SellAirtimeScreen";
import SplashScreen from "../screens/splash/SplashScreen";
import TopUpScreen from "../screens/TopUp/TopUpScreen";
import StockAllocation from "../screens/StockAllocation/StockAllocation";
import StockDetailsScreen from "../screens/ViewStock/StockDetailsScreen";
import ViewAgentsScreen from "../screens/ViewAgents/ViewAgentsScreen";
import ViewStockScreen from "../screens/ViewStock/ViewStockScreen";
import { useLanguage } from "../utils/language/LanguageProvider";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  const { translate } = useLanguage();
  
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AuthLoading"
        component={AuthLoading}
        options={{ headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={DrawerNavigator}
        options = {{ headerShown: false }}
      />
      <Stack.Screen
        name="Sell"
        component={SaleScreen}
        options={{ headerTitle: 'Sell Line' }}
      />
      <Stack.Screen
        name="SellAirtime"
        component={SellAirtimeScreen}
        options={{ headerTitle: 'Sell Airtime' }}
      />
      <Stack.Screen
        name="SellGiftCard"
        component={SellAirtimeScreen}
        options={{ headerTitle: 'Sell Gift Cards' }}
      />
      <Stack.Screen
        name="SellPayBill"
        component={SellAirtimeScreen}
        options={{ headerTitle: 'Sell PayBill' }}
      />
      <Stack.Screen
          name="sellDepositWithdraw"
          component={SellAirtimeScreen}
          options={{ headerTitle: 'Ellazo Deposit/Withdraw' }}
      />
      <Stack.Screen
        name="RegisterAgent"
        component={RegisterAgent}
        options={{ headerTitle: 'Register Agent'}}
      />
      <Stack.Screen
        name="StockAllocation"
        component={StockAllocation}
        options={{ headerTitle: 'Allocate Stock'}}
      />
      <Stack.Screen
        name="ScanSerial"
        component={ScanSerial}
        options={{ headerTitle: translate('scanSerial') }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{ headerTitle: 'Reset Password' }}
      />
      <Stack.Screen
        name="ViewAgents"
        component={ViewAgentsScreen}
        options={{ headerTitle: 'View Agents' }}
      />
      <Stack.Screen
        name="ViewStock"
        component={ViewStockScreen}
        options={{ headerTitle: translate('viewStock') }}
      />
      <Stack.Screen
        name="StockDetails"
        component={StockDetailsScreen}
        options={{ headerTitle: translate('stockDetails') }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
      />
      <Stack.Screen
        name="TopUp"
        component={TopUpScreen}
        options={{ headerTitle: 'Topup Float'}}
      />
    </Stack.Navigator>
  );
}
