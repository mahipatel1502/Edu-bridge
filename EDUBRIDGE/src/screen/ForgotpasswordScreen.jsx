import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSendOTP = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }
  
    try {
      console.log("Checking email:", email);
      const response = await fetch("http://192.168.13.200:5000/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
      console.log("Check-email API Response:", data);
  
      if (!data.registered) {
        Alert.alert("Error", data.message);
        return;
      }
  
      console.log("Sending OTP...");
      const otpResponse = await fetch("http://192.168.13.200:5000/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      const otpData = await otpResponse.json();
      console.log("Send-OTP API Response:", otpData);
  
      if (otpResponse.ok) {
        Alert.alert("Success", `OTP sent to ${email}`);
        navigation.navigat("otpScreen");
      } else {
        Alert.alert("Error", otpData.error);
      }
    } catch (error) {
      console.error("Network Error:", error.message);
      Alert.alert("Network Error", error.message);
    }
  };
  
  

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
        <Ionicons name={"arrow-back-outline"} color={colors.primary} size={25} />
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.headingText}>Forgot</Text>
        <Text style={styles.headingText}>Your Password?</Text>
        <Text style={styles.subText}>
          Enter your email to reset your password.
        </Text>
      </View>

      {/* Form Section */}
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name={"mail-outline"} size={30} color={colors.secondary} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your email"
            placeholderTextColor={colors.secondary}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <TouchableOpacity style={styles.loginButtonWrapper} onPress={handleSendOTP}>
          <Text style={styles.loginText}>Send OTP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: colors.gray,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginVertical: 20,
  },
  headingText: {
    fontSize: 32,
    color: colors.primary,
    fontFamily: fonts.SemiBold,
  },
  subText: {
    fontSize: 16,
    color: colors.secondary,
    fontFamily: fonts.Regular,
    marginTop: 10,
  },
  formContainer: {
    marginTop: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 100,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
    marginVertical: 10,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontFamily: fonts.Light,
    color: colors.primary,
  },
  loginButtonWrapper: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    marginTop: 20,
  },
  loginText: {
    color: colors.white,
    fontSize: 20,
    fontFamily: fonts.SemiBold,
    textAlign: "center",
    padding: 10,
  },
});