import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";

const Homepagee = () => {
  const navigation = useNavigation();

 

  return (
    <View style={styles.container}>

      {/* Boxes for DEPSTAR and CSPIT */}
      <View style={styles.boxContainer}>
        <TouchableOpacity style={styles.box}>
          <Text style={styles.boxText}>DEPSTAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box}>
          <Text style={styles.boxText}>CSPIT</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default Homepagee;

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