import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";

const CurrentStudent = () => {
  const navigation = useNavigation()

  // Function to navigate with the selected year
  const handleYearSelection = (year) => {
    navigation.navigate("Studentlist", { year });
  };

  return (
    <View style={styles.container}>
        <Text style={styles.heading}>Select Your Current Year</Text>

        <View style={styles.grid}>
            <TouchableOpacity style={styles.box} onPress={() => handleYearSelection(1)}>
                <Text style={styles.boxText}>1st Year</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.box} onPress={() => handleYearSelection(2)}>
                <Text style={styles.boxText}>2nd Year</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.box} onPress={() => handleYearSelection(3)}>
                <Text style={styles.boxText}>3rd Year</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.box} onPress={() => handleYearSelection(4)}>
                <Text style={styles.boxText}>4th Year</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.white, alignItems: "center", justifyContent: "center" },
    heading: { fontSize: 24, fontFamily: fonts.Bold, color: colors.primary, marginBottom: 20, textAlign: "center" },
    grid: { width: 300, flexDirection: "row", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 20 },
    box: { width: 120, backgroundColor: colors.primary, paddingVertical: 20, borderRadius: 12, alignItems: "center", elevation: 5 },
    boxText: { color: colors.white, fontSize: 18, fontFamily: fonts.SemiBold },
});

export default CurrentStudent;