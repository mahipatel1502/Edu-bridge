import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";

const AccountScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Session Expired", "Please log in again.");
        navigation.replace("LOGIN");
        return;
      }

      const response = await fetch("http://192.168.215.205:5000/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data.");
      }

      const result = await response.json();
      setUserData(result);
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      navigation.replace("LOGIN");
    } catch (error) {
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading user data...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Failed to load user data.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="person-circle" size={100} color={colors.white} />
        <Text style={styles.userName}>{userData.name}</Text>
        <Text style={styles.userEmail}>{userData.email}</Text>
      </View>

      {/* Info Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Profile Details</Text>

        {userData.userType === "Student" && (
          <>
            <Text style={styles.detailText}>🎓 Branch: {userData.branch}</Text>
            <Text style={styles.detailText}>📘 Semester: {userData.semester}</Text>
          </>
        )}
        {userData.userType === "Mentor" && (
          <>
            <Text style={styles.detailText}>🏫 Department: {userData.department}</Text>
            <Text style={styles.detailText}>👔 Designation: {userData.designation}</Text>
            <Text style={styles.detailText}>📚 Specialization: {userData.specialization}</Text>
          </>
        )}
        {userData.userType === "Alumni" && (
          <>
            <Text style={styles.detailText}>🎓 Graduation Year: {userData.graduationYear}</Text>
            <Text style={styles.detailText}>💼 Current Job: {userData.currentJob}</Text>
            <Text style={styles.detailText}>📚 Specialization: {userData.specialization}</Text>
          </>
        )}

        <Text style={styles.detailText}>
          🤝 Connections: {userData.connections?.length || 0}
        </Text>
      </View>

      {/* Buttons */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("EditProfile", { userData })}
      >
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AccountScreen;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  loadingText: {
    fontSize: 18,
    fontFamily: fonts.Regular,
    color: colors.secondary,
    marginTop: 10,
  },
  errorText: {
    fontSize: 18,
    fontFamily: fonts.Regular,
    color: "red",
  },
  header: {
    width: "100%",
    backgroundColor: colors.primary,
    alignItems: "center",
    paddingVertical: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  userName: {
    fontSize: 22,
    fontFamily: fonts.SemiBold,
    color: colors.white,
    marginTop: 10,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.white,
  },
  card: {
    width: "90%",
    backgroundColor: colors.lightGray,
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: 10,
    textAlign: "center",
  },
  detailText: {
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: colors.primary,
    marginBottom: 8,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 30,
    width: "80%",
    alignItems: "center",
    marginTop: 20,
    elevation: 2,
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.SemiBold,
  },
});