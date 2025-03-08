import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Icon from "react-native-vector-icons/Ionicons";
import { StyleSheet } from "react-native";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
// Import screen components
import Homepagee from "./Homepagee";
import SearchScreen from "./SearchScreen";
import ChatboxScreen from "./ChatboxScreen";
import NotificationsScreen from "./NotificationsScreen";
import AccountScreen from "./AccountScreen";
import * as RNLocalize from "react-native-localize";

const locale = RNLocalize.getLocales()[0].languageTag;
console.log(locale); // Example: "en-US"
const Tab = createBottomTabNavigator();

const Homepage = () => {
  return (
    
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = "home-outline";
            } else if (route.name === "Search") {
              iconName = "search-outline";
            } else if (route.name === "Chatbox") {
              iconName = "chatbubble-outline";
            } else if (route.name === "Notifications") {
              iconName = "notifications-outline";
            } else if (route.name === "Account") {
              iconName = "person-outline";
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#6200EE",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Home" component={Homepagee} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Chatbox" component={ChatboxScreen} />
        <Tab.Screen name="Notifications" component={NotificationsScreen} />
        <Tab.Screen name="Account" component={AccountScreen} />
      </Tab.Navigator>
    
  );
};

export default Homepage;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: 20,
  },
  boxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  box: {
    backgroundColor: colors.primary,
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  boxText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.Bold,
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  logoutText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.Bold,
  },
});