import HomeScreen from "../screens/Home/HomeScreen";
import ManualLineSale from "../screens/manual_sale/ManualLineSale";
import ProductSaleScreen from "../screens/Sale/ProductSaleScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import RegisterAgent from "../screens/AgentRegistration/RegisterAgent";
import SaleScreen from "../screens/Sale/SaleScreen";
import SellAirtimeScreen from "../screens/Sale/SellAirtimeScreen";
import StockAllocation from "../screens/StockAllocation/StockAllocation";
import StockScreen from "../screens/Stock/StockScreen";
import ViewAgentsScreen from "../screens/ViewAgents/ViewAgentsScreen";

const cblRoutes = [
  {
    name: "Home",
    component: HomeScreen,
    iconName: "home-outline",
  },
  {
    name: "Sell Airtime",
    component: SellAirtimeScreen,
    iconName: "cellphone",
  },
  {
    name: "My Stock",
    component: StockScreen,
    iconName: "file-outline",
  },
  {
    name: "Allocate Stock",
    component: StockAllocation,
    iconName: "file-export-outline",
  },
  {
    name: "Manual Line Sale",
    component: ManualLineSale,
    iconName: "account-cash-outline",
  },
  {
    name: "Register Agent",
    component: RegisterAgent,
    iconName: "account-plus-outline",
  },
  {
    name: "View Agents",
    component: ViewAgentsScreen,
    iconName: "account-group-outline",
  },
  {
    name: "Profile",
    component: ProfileScreen,
    iconName: "account-outline",
  },
];

const normalRoutes = [
  {
    name: "Home",
    component: HomeScreen,
    iconName: "home-outline",
  },
  {
    name: "Sell Airtime",
    component: SellAirtimeScreen,
    iconName: "cellphone",
  },
  {
    name: "My Stock",
    component: StockScreen,
    iconName: "file-outline",
  },
  {
    name: "Sell Line",
    component: SaleScreen,
    iconName: "cash-plus",
  },
  {
    name: "Profile",
    component: ProfileScreen,
    iconName: "account-outline",
  },
];

const mapemaCblRoutes = [
  {
    name: "Home",
    component: HomeScreen,
    iconName: "home-outline",
  },
  {
    name: "Sell Airtime",
    component: SellAirtimeScreen,
    iconName: "cellphone",
  },
  {
    name: "My Stock",
    component: StockScreen,
    iconName: "file-outline",
  },
  {
    name: "Allocate Stock",
    component: StockAllocation,
    iconName: "file-export-outline",
  },
  {
    name: "Register Agent",
    component: RegisterAgent,
    iconName: "account-plus-outline",
  },
  {
    name: "View Agents",
    component: ViewAgentsScreen,
    iconName: "account-group-outline",
  },
  {
    name: "Profile",
    component: ProfileScreen,
    iconName: "account-outline",
  },
];

const mapemaNormalRoutes = [
  {
    name: "Home",
    component: HomeScreen,
    iconName: "home-outline",
  },
  {
    name: "Sell Airtime",
    component: SellAirtimeScreen,
    iconName: "cellphone",
  },
  {
    name: "My Stock",
    component: StockScreen,
    iconName: "file-outline",
  },
  {
    name: "Sell Product",
    component: ProductSaleScreen,
    iconName: "cash-plus",
  },
  {
    name: "Profile",
    component: ProfileScreen,
    iconName: "account-outline",
  },
];

export { cblRoutes, normalRoutes, mapemaCblRoutes, mapemaNormalRoutes }