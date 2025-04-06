import { createStackNavigator } from '@react-navigation/stack';
import { TabNavigator } from './TabNavigator';
import { AuthScreen } from '../screens/Auth/AuthScreen';
import { PublishScreen } from '../screens/Publish/PublishScreen';
import { EditNavigation } from './EditNavigator';

const Stack = createStackNavigator();

export const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: true }}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Publish" component={PublishScreen}
        options={{
          headerShown: true,
          headerTitle: '发布',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen name="EditProfile" component={EditNavigation} />
    </Stack.Navigator>
  );
}
