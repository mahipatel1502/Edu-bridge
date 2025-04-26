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
import Role from "./src/screen/Role"
import Mentor from "./src/screen/Mentor"
import CurrentStudent from "./src/screen/CurrentStudent";
import Alumni from "./src/screen/Alumni";
import Studentlist from "./src/screen/Studentlist";
import StudentProfile from "./src/screen/StudentProfile";
import ChatboxScreen from './src/screen/ChatboxScreen';
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
        <Stack.Screen name="Role" component={Role} />
        <Stack.Screen name="CurrentStudent" component={CurrentStudent} />
        <Stack.Screen name="Alumni" component={Alumni} />
        <Stack.Screen name="Mentor" component={Mentor} />
        <Stack.Screen name="Studentlist" component={Studentlist} />
        <Stack.Screen name="StudentProfile" component={StudentProfile} />
        <Stack.Screen name="ChatboxScreen" component={ChatboxScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});