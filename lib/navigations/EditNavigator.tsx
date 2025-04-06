import { EditScreen } from "../screens/Profile/EditScreen";
import EditNickname from "../screens/Profile/EditNickname";
import EditIntro from "../screens/Profile/EditIntro";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export const EditNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="Main"
        component={EditScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Nickname" component={EditNickname} />
      <Stack.Screen name="Introduction" component={EditIntro} />
    </Stack.Navigator>
  )
}