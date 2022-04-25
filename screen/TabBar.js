import React, { useState, useContext, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../src/consts/colors';
import { View } from 'react-native';
import FoodList from './FoodList';
import GoodList from './GoodList';
import Service from './Service';
import Setting from './Setting'
import Cart from './Cart';
import VALUES from '../src/consts/value';
import { Context } from '../App';

const Tab = createBottomTabNavigator();

const TabBar = () => {
  const { currentUser, orders } = useContext(Context)
  const { newOrderCount, setNewOrderCount } = useContext(Context)
  useEffect(() => {
    setNewOrderCount(
      orders.filter(order => {
        let check = false
        order.orderItems.map(item => {
          item.shopId == currentUser.id ? check = true : null /// kiểm tra đơn hàng của chủ shop
        })
        return check && order.status == 'pendding' /// kiểm tra đơn hàng trạng thái penđing
      }).length
    )
  }, [orders])
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBarOptions={{
        style: {
          height: 55,
          borderTopWidth: 0,
          elevation: 0,
        },
        activeTintColor: COLORS.primary,
        labelStyle: {
          fontSize: VALUES.textTab,
        }
      }}>
      <Tab.Screen
        name="Ăn Uống"
        component={FoodList}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="fastfood" color={color} size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="Siêu thị"
        component={GoodList}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="store" color={color} size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="Giỏ Hàng"
        component={Cart}

        options={{
          unmountOnBlur: false,
          tabBarIcon: ({ color }) => (
            <View
              style={{
                height: 60,
                width: 60,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: COLORS.white,
                borderColor: COLORS.primary,
                borderWidth: 2,
                borderRadius: 30,
                top: -15,
                elevation: 5,
              }}>
              <Icon name="shopping-cart" color={COLORS.primary} size={28} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Dịch Vụ"
        component={Service}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="construction" color={color} size={28} />
          ),
        }}
      />
      {currentUser.role == 'chủ shop' ?
        <Tab.Screen
          name="Đơn Hàng"
          component={Setting}
          options={{
            tabBarBadge: newOrderCount > 0 ? newOrderCount : null,
            tabBarIcon: ({ color }) => (
              <Icon name="receipt-long" color={color} size={28} />
            ),
          }}
        />
        :
        <Tab.Screen
          name="Cài Đặt"
          component={Setting}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="settings" color={color} size={28} />
            ),
          }}
        />
      }




    </Tab.Navigator>
  );
};

export default TabBar;
