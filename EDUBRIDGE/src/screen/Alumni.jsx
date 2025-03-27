import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";

const Alumni = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Career Options</Text>

      <ScrollView>
        <View style={styles.list}>
          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>GATE</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>CAT</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>UPSC / GPSC</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>Placements</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>IELTS</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>GRE</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>Research</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Alumni;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
    justifyContent: "center",
  },
  heading: {
    fontSize: 27,
    fontFamily: fonts.Bold,
    color: colors.primary,
    textAlign: "center",
    marginBottom: 30, // Added more space below the heading
    marginTop:30,
  },
  list: {
    flexDirection: "column",
    gap: 18, // Adds space between the options
  },
  option: {
    backgroundColor: colors.primary,
    paddingVertical: 17,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 1, height: 2 },
  },
  optionText: {
    fontSize: 18,
    fontFamily: fonts.SemiBold,
    color: colors.white,
    textAlign: "center",
  },
});