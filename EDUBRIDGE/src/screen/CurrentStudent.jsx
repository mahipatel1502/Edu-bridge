import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";

const CurrentStudent = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Heading */}
      <Text style={styles.heading}>Select Your Current Year</Text>

      {/* Year Selection Boxes */}
      <View style={styles.grid}>
        <TouchableOpacity style={styles.box}>
          <Text style={styles.boxText}>1st Year</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.box}>
          <Text style={styles.boxText}>2nd Year</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.box}>
          <Text style={styles.boxText}>3rd Year</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.box}>
          <Text style={styles.boxText}>4th Year</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CurrentStudent;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
      alignItems: "center",
      justifyContent: "center",
    },
    contentWrapper: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: [{ translateX: -150 }, { translateY: -100 }], // Adjust for exact centering
      alignItems: "center",
    },
    heading: {
      fontSize: 24,
      fontFamily: fonts.Bold,
      color: colors.primary,
      marginBottom: 20,
      textAlign: "center",
    },
    grid: {
      width: 300,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      gap: 20,
    },
    box: {
      width: 120, // Set fixed width for consistency
      backgroundColor: colors.primary,
      paddingVertical: 20,
      borderRadius: 12,
      alignItems: "center",
      elevation: 5,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowOffset: { width: 2, height: 2 },
    },
    boxText: {
      color: colors.white,
      fontSize: 18,
      fontFamily: fonts.SemiBold,
    },
  });