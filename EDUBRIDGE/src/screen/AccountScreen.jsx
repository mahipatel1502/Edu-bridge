import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={100} color={colors.primary} />
        <Text style={styles.userName}>{userData.name}</Text>
        <Text style={styles.userEmail}>{userData.email}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Profile Details</Text>

        {userData.userType === "Student" && (
          <>
            <Text style={styles.detailText}>🏫 Department: {userData.department}</Text>
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

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("EditProfile", { userData })}
      >
        <Ionicons name="create-outline" size={18} color={colors.white} />
        <Text style={styles.buttonText}> Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={18} color={colors.white} />
        <Text style={styles.buttonText}> Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: colors.secondary,
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: "red",
  },
  header: {
    alignItems: "center",
    paddingVertical: 30,
  },
  userName: {
    fontSize: 22,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginTop: 10,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.secondary,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    // Shadow for both iOS and Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: 15,
  },
  detailText: {
    fontSize: 15,
    fontFamily: fonts.Regular,
    color: "#333",
    marginBottom: 8,
  },
  button: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  logoutButton: {
    backgroundColor: "#dc3545",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    color: colors.white,
    marginLeft: 8,
  },
});
