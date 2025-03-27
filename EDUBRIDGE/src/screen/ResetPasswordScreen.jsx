import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage for clearing session
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";

const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params || {}; // Get email from navigation params

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureEntry, setSecureEntry] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert(
        "Password must be at least 8 characters long."
      );
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://192.168.31.34:5000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        // Clear JWT token and user session
        await AsyncStorage.removeItem("authToken"); // Remove the old token

        Alert.alert(
          "Password reset successfully.",
          [{ text: "OK", onPress: () => navigation.navigate("LOGIN") }]
        );
      } else {
        Alert.alert("Error", data.error);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Failed to reset password. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButtonWrapper}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back-outline" color={colors.primary} size={25} />
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.headingText}>Reset Password</Text>
      </View>

      <Text style={styles.labelText}>Enter your new password</Text>

      <View style={styles.inputContainer}>
        <SimpleLineIcons name="lock" size={25} color={colors.secondary} />
        <TextInput
          style={styles.textInput}
          placeholder="New Password"
          placeholderTextColor={colors.secondary}
          secureTextEntry={secureEntry}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity onPress={() => setSecureEntry((prev) => !prev)}>
          <Ionicons
            name={secureEntry ? "eye-off" : "eye"}
            size={20}
            color={colors.secondary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <SimpleLineIcons name="lock" size={25} color={colors.secondary} />
        <TextInput
          style={styles.textInput}
          placeholder="Confirm Password"
          placeholderTextColor={colors.secondary}
          secureTextEntry={secureEntry}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setSecureEntry((prev) => !prev)}>
          <Ionicons
            name={secureEntry ? "eye-off" : "eye"}
            size={20}
            color={colors.secondary}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.resetButton}
        onPress={handleResetPassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.resetButtonText}>Reset Password</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ResetPasswordScreen;

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
  labelText: {
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 100,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    marginVertical: 10,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontFamily: fonts.Light,
    color: colors.primary,
  },
  resetButton: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    marginTop: 20,
    alignItems: "center",
    padding: 12,
  },
  resetButtonText: {
    color: colors.white,
    fontSize: 20,
    fontFamily: fonts.SemiBold,
    textAlign: "center",
  },
});
