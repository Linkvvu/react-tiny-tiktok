import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text } from 'react-native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';
import MsgScreen from '../screens/Msg/MsgScreen';
import { useAuth } from '../contexts/AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { PlatformPressable } from '@react-navigation/elements';

const Tab = createBottomTabNavigator();

export const TabNavigator: React.FC<{ navigation: StackNavigationProp<any> }> = ({ navigation }) => {
  const authCtx = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarIconStyle: styles.hiddenIcon,
        tabBarButton: (props) => (
          <PlatformPressable {...props} style={styles.tabBarButton} />
        ),
        tabBarLabel: ({ focused }) => (
          <Text style={[styles.tabBarLabel, { color: focused ? 'white' : '#ccc' }]}>
            {route.name}
          </Text>
        ),
      })}
    >
      <Tab.Screen name="首页" component={HomeScreen} />
      <Tab.Screen name="朋友" component={MsgScreen} />
      <Tab.Screen children={() => null} name="发布"
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault()
            const parent = navigation.getParent<StackNavigationProp<any>>()

            if (authCtx.authData) {
              parent.push('Publish')
            } else {
              parent.push('Auth');
            }
          }
        })}
        options={{
          tabBarButton: (props) => {
            return (
              <PlatformPressable
                {...props}
                style={[styles.tabBarButton, { alignItems: 'center' }]}
              >
                <FontAwesome6 name="square-plus" size={30} color="white" />
              </PlatformPressable>
            )
          },
        }}
      />

      <Tab.Screen name="消息" component={MsgScreen} />
      <Tab.Screen
        name="我"
        component={ProfileScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();

            if (authCtx.authData) {
              navigation.navigate('我');
            } else {
              navigation.getParent<StackNavigationProp<any>>().push('Auth');
            }
          },
        })}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#1D1B1B',
  },
  hiddenIcon: {
    display: 'none',
  },
  tabBarButton: {
    flex: 1,
    justifyContent: 'center',
  },
  tabBarLabel: {
    alignSelf: 'center',
  },
});