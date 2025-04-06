import React, { StrictMode } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AppNavigator } from "./navigations/AppNavigator";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "./contexts/AuthContext";

const App = () => {
  return (
    <StrictMode>
      <AuthProvider>
        <NavigationContainer>
          <GestureHandlerRootView>
            <AppNavigator />
          </GestureHandlerRootView>
        </NavigationContainer>
        <Toast />
      </AuthProvider>
    </StrictMode>
  )
}

export default App;