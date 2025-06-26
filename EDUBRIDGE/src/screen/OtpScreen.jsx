import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
  } from "react-native";
  import React, { useState } from "react";
  import { useNavigation, useRoute } from "@react-navigation/native";
  import { colors } from "../utils/colors";
  import { fonts } from "../utils/fonts";
  
  const EnterOTPScreen = () => { // ✅ FIXED COMPONENT NAME
    const navigation = useNavigation();
    const route = useRoute();
    const email = route.params?.email || ""; // ✅ Avoid crash if email is undefined
  
    const [otp, setOtp] = useState("");
  
    const handleVerifyOTP = async () => {
        if (!email) {
            Alert.alert("Error", "Email is missing. Please go back and try again.");
            return;
        }
    
        if (!otp) {
            Alert.alert("Error", "Please enter the OTP.");
            return;
        }
    
        const requestBody = JSON.stringify({ email, otp });
        console.log("Sending request with body:", requestBody);
    
        try {
            const response = await fetch("http://192.168.215.205:5000/verify-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: requestBody,
            });
    
            const text = await response.text();
            console.log("Raw Response from Server:", text);
    
            const data = JSON.parse(text);
            console.log("OTP Verification Response:", data);
    
            if (data.success) {
                Alert.alert("Success", "OTP Verified Successfully!");
                navigation.navigate("ResetPasswordScreen", { email });
            } else {
                Alert.alert("Error", data.error || "Invalid OTP. Please try again.");
            }
        } catch (error) {
            console.error("Network Error:", error.message);
            Alert.alert("Network Error", "Please check your connection and try again.");
        }
    };
    
    
  
    return (
      <View style={styles.container}>
        <Text style={styles.headingText}>Enter OTP</Text>
        <Text style={styles.subText}>
          Please enter the OTP sent to {email}
        </Text>
  
        <TextInput
          style={styles.textInput}
          placeholder="Enter OTP"
          placeholderTextColor={colors.secondary}
          keyboardType="number-pad"
          value={otp}
          onChangeText={setOtp}
        />
  
        <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
          <Text style={styles.buttonText}>Verify OTP</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  export default EnterOTPScreen; // ✅ FIXED EXPORT NAME
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
      padding: 20,
      justifyContent: "center",
      alignItems: "center",
      
    },
    headingText: {
      fontSize: 28,
      color: colors.primary,
      fontFamily: fonts.SemiBold,
      marginBottom: 10,
    },
    subText: {
      fontSize: 16,
      color: colors.primary,
      fontFamily: fonts.Regular,
      marginBottom: 20,
      textAlign: "center",
    },
    textInput: {
      width: "100%",
      borderWidth: 1,
      borderColor: colors.secondary,
      borderRadius: 100,
      paddingHorizontal: 20,
      fontFamily: fonts.Light,
      height: 50,
      marginBottom: 20,
      textAlign: "center",
      color: colors.primary,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 100,
      width: "100%",
      alignItems: "center",
      padding: 15,
    },
    buttonText: {
      color: colors.white,
      fontSize: 18,
      fontFamily: fonts.SemiBold,
    },
  });