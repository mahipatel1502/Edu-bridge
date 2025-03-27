import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleLogin = () => {
    navigation.navigate("LOGIN");
  };

  const handleSignup = () => {
    navigation.navigate("SIGNUP");
  };

  return (
    <View style={styles.container}>
     
      <Image source={require("../assets/image.png")} style={styles.bannerImage} />
      <Text style={styles.titlee}>Edu-Bridge</Text>
      <Text style={styles.title}>Connecting Experience, Empowering Futures</Text>
      <Text style={styles.subTitle}>Welcome to our platform.</Text>

      {/* Fixed Button Container */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.loginButtonWrapper,
            { backgroundColor: colors.primary, width: "50%" },
          ]}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.signupButtonWrapper,
            { backgroundColor: colors.white, width: "50%" },
          ]}
          onPress={handleSignup}
        >
          <Text style={styles.signupButtonText}>Sign-up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
  },
  logo: {
    height: 40,
    width: 140,
    marginVertical: 30,
  },
  bannerImage: {
    marginVertical: 10,
    height: 300,
    width: 250,
  },
  titlee:{
    fontSize: 30,
    fontFamily: fonts.Bold,
    paddingHorizontal: 20,
    textAlign: "center",
    color: colors.primary,
    marginTop: -55,

  },
  title: {
    fontSize: 26,
    fontFamily: fonts.SemiBold,
    paddingHorizontal: 20,
    textAlign: "center",
    color: colors.primary,
    marginTop: 40,
  },
  subTitle: {
    fontSize: 18,
    paddingHorizontal: 20,
    textAlign: "center",
    color: colors.secondary,
    fontFamily: fonts.Medium,
    marginVertical: 20,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    borderWidth: 2,
    borderColor: colors.primary,
    width: "80%",
    height: 60,
    borderRadius: 100,
    overflow: "hidden", // Prevents layout issues
  },
  loginButtonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 98,
  },
  signupButtonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 98,

  },
  loginButtonText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.SemiBold,
  },
  signupButtonText: {
    fontSize: 18,
    fontFamily: fonts.SemiBold,
    color: colors.primary, // Ensuring visibility
  },
});