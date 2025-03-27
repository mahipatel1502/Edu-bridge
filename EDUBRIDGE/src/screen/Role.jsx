import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";

const NextScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Heading at the top */}
      <Text style={styles.heading}>Discover Your Community</Text>

      {/* Current Student Section */}
      <View style={styles.roleContainer}>
        <Image source={require("../assets/reading.png")} style={styles.icon} />
        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate("CurrentStudent")}>
          <Text style={styles.boxText}>Current Student</Text>
        </TouchableOpacity>
      </View>

      {/* Alumni Section */}
      <View style={styles.roleContainer}>
        <Image source={require("../assets/graduated.png")} style={styles.icon} />
        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate("Alumni")}>
          <Text style={styles.boxText}>Alumni</Text>
        </TouchableOpacity>
      </View>

      {/* Mentor Section */}
      <View style={styles.roleContainer}>
        <Image source={require("../assets/mentorship.png")} style={styles.icon} />
        <TouchableOpacity style={styles.box} onPress={() => navigation.navigate("Mentor")}>
          <Text style={styles.boxText}>Mentor</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NextScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingTop: 60, // Increased top padding
  },
  heading: {
    fontSize: 26,
    fontFamily: fonts.Bold,
    color: colors.primary,
    marginBottom: 50, // More space after heading
  },
  roleContainer: {
    alignItems: "center",
    marginBottom: 40, // Increased space between each section
  },
  icon: {
    width: 80, // Increased size
    height: 80, // Increased size
    resizeMode: "contain",
    marginBottom: 15, // More space between icon and box
  },
  box: {
    width: 260, // Slightly wider boxes
    backgroundColor: colors.primary,
    paddingVertical: 22, // Slightly taller boxes
    borderRadius: 12,
    alignItems: "center",
    elevation: 6, // Stronger shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOpacity: 0.3,
    shadowOffset: { width: 3, height: 3 },
  },
  boxText: {
    color: colors.white,
    fontSize: 20, // Slightly larger text
    fontFamily: fonts.SemiBold,
  },
});