import React from "react";
import { Image, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";

const Homepagee = () => {
  const navigation = useNavigation();

  const handleNavigation = (college) => {
    navigation.navigate("Role", { college });
  };

  return (
    <View style={styles.container}>
      {/* CHARUSAT Logo (local image) */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/Charotar_University_of_Science_and_Technology_CHARUSAT_Anand_logo_jpg_eb45ac6cc5.webp")}
          style={styles.localLogo}
        />
      </View>

      {/* Banner (remote image) */}
      <View style={styles.bannerContainer}>
        <Image
          source={{ uri: "https://i.ytimg.com/vi/fcMqd1jyTgw/maxresdefault.jpg" }}
          style={styles.bannerImage}
        />
      </View>

      <View style={styles.spacer} />

      {/* College Sections */}
      <View style={styles.collegeWrapper}>
        {/* DEPSTAR Section */}
        <View style={styles.collegeContainer}>
          <Image source={require("../assets/images.png")} style={styles.image} />
          <TouchableOpacity style={styles.box} onPress={() => handleNavigation("DEPSTAR")}>
            <Text style={styles.boxText}>DEPSTAR</Text>
          </TouchableOpacity>
        </View>

        {/* CSPIT Section */}
        <View style={styles.collegeContainer}>
          <Image source={require("../assets/cspit_logo.png")} style={styles.image} />
          <TouchableOpacity style={styles.box} onPress={() => handleNavigation("CSPIT")}>
            <Text style={styles.boxText}>CSPIT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Homepagee;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  logoContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 40,
  },
  localLogo: {
    width: 200,
    height: 100,
    resizeMode: "contain",
  },
  bannerContainer: {
    width: "100%",
    alignItems: "center",
  },
  bannerImage: {
    width:"80%",
    height: 200,
    resizeMode: "cover",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
    marginTop: 10,
    marginLeft: 40,
    marginRight: 40,
  },
  spacer: {
    height: 50,
  },
  collegeWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  collegeContainer: {
    alignItems: "center",
    marginHorizontal: 20,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 10,
  },
  box: {
    backgroundColor: colors.primary,
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  boxText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.Bold,
    textAlign: "center",
  },
});
