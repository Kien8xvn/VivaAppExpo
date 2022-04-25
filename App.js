import React, { useState, createContext } from 'react';
import COLORS from './src/consts/colors';
import { View, Text, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Loading from './screen/Loading';
import Login from './screen/Login';
import Register from './screen/Register';
import SkipLogin from './screen/SkipLogin';
import Policy from './screen/Policy';
import TabBar from './screen/TabBar';
import ItemDetail from './screen/ItemDetail';
import ServiceDetail from './screen/ServiceDetail';
import UserInfo from './screen/UserInfo';
import Promo from './screen/Promo';
import PromoInfo from './screen/PromoInfo';
import NewOrder from './screen/NewOrder';
import OrderDetail from './screen/OrderDetail';
import Welcome from './screen/Welcome';
import OrderHistory from './screen/OrderHistory';
import PromoNews from './screen/PromoNews';


export const Context = createContext();

const Stack = createNativeStackNavigator();

export default App = () => {
  const defaultUser = {
    name: 'BillGate',
  }
  const defaultOrder = {
    orderItems: [
    ],
    promo: 0,
    shipType: 'normal',
    value: {
      ship: 0,
      totalItems: 0,
      promo: 0,
      total: 0
    }
  }
  const [expoToken, setExpoToken] = useState('none')
  const [services, setServices] = useState([])
  const [system, setSystem] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [items, setItems] = useState([])
  const [promos, setPromos] = useState([])
  const [activePromo, setActivePromo] = useState(null)
  const [itemType, setItemType] = useState([])
  const [shops, setShops] = useState([])
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState({ name: 'test' })
  const [foodCart, setFoodCart] = useState([])
  const [goodCart, setGoodCart] = useState([])
  const [orders, setOrders] = useState([])
  const [ordersService, setOrdersService] = useState([])
  const [lastScreenIs, setLastScreenIs] = useState('food')
  const [ship, setShip] = useState('normal')
  const [value, setValue] = useState({ ship: 0, promo: 0, items: 0, total: 0 })
  const [newOrderCount, setNewOrderCount] = useState(0)
  const [newFoodOrderCount, setNewFoodOrderCount] = useState(0)
  const [newGoodOrderCount, setNewGoodOrderCount] = useState(0)
  const [newServiceOrderCount, setNewServiceOrderCount] = useState(0)


  return (
    <Context.Provider value={{
      isSignedIn, setIsSignedIn,
      currentUser, setCurrentUser,
      orders, setOrders,
      ordersService, setOrdersService,
      items, setItems,
      promos, setPromos,
      system, setSystem,
      itemType, setItemType,
      shops, setShops,
      lastScreenIs, setLastScreenIs,
      activePromo, setActivePromo,
      ship, setShip,
      isConnected, setIsConnected,
      foodCart, setFoodCart,
      goodCart, setGoodCart,
      value, setValue,
      users, setUsers,
      newOrderCount, setNewOrderCount,
      services, setServices,
      newFoodOrderCount, setNewFoodOrderCount,
      newGoodOrderCount, setNewGoodOrderCount,
      newServiceOrderCount, setNewServiceOrderCount,
      expoToken, setExpoToken,
    }}>
      <NavigationContainer>
        <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Loading" component={Loading} />
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="SkipLogin" component={SkipLogin} />
          <Stack.Screen name="Policy" component={Policy} />
          <Stack.Screen name="Home" component={TabBar} />
          <Stack.Screen name="ItemDetail" component={ItemDetail} />
          <Stack.Screen name="ServiceDetail" component={ServiceDetail} />
          <Stack.Screen name="UserInfo" component={UserInfo} />
          <Stack.Screen name="Promo" component={Promo} />
          <Stack.Screen name="PromoInfo" component={PromoInfo} />
          <Stack.Screen name="NewOrder" component={NewOrder} />
          <Stack.Screen name="OrderDetail" component={OrderDetail} />
          <Stack.Screen name="OrderHistory" component={OrderHistory} />
          <Stack.Screen name="PromoNews" component={PromoNews} />
        </Stack.Navigator>
      </NavigationContainer>
    </Context.Provider>

  );
};

