import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./src/screen/HomeScreen";
import LoginScreen from "./src/screen/LoginScreen";
import SignupScreen from "./src/screen/SignupScreen";
import homepage from "./src/screen/homepage";
import EditProfileScreen from "./src/screen/EditProfileScreen";
import ForgotPasswordScreen from "./src/screen/ForgotpasswordScreen";
import otpScreen from "./src/screen/OtpScreen";
import SearchScreen from "./src/screen/SearchScreen";
import ProfileScreen from "./src/screen/ProfileScreen"; 
import ResetPasswordScreen from "./src/screen/ResetPasswordScreen";
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name={"HOME"} component={HomeScreen} />
        <Stack.Screen name={"LOGIN"} component={LoginScreen} />
        <Stack.Screen name="SIGNUP" component={SignupScreen} />
        <Stack.Screen name="homepage" component={homepage}/>
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="ForgotpasswordScreen" component={ForgotPasswordScreen} />
        <Stack.Screen name="otpScreen" component={otpScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
      

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});