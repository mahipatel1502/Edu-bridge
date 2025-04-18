import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Store user session
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";

const AccountScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token"); // Get stored JWT token

        if (!token) {
          Alert.alert("Session Expired", "Please log in again.");
          navigation.replace("LOGIN");
          return;
        }

        // Fetch user data from the backend
        const response = await fetch("http://192.168.13.200:5000/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch user data.");
        }

        setUserData(result);
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token"); // Clear user session
      navigation.replace("LOGIN"); // Navigate to login screen
    } catch (error) {
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading user data...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load user data.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <Ionicons name="person-circle-outline" size={100} color={colors.primary} style={styles.icon} />

      <Text style={styles.userName}>{userData.name}</Text>
      <Text style={styles.userEmail}>{userData.email}</Text>

      <View style={styles.detailsContainer}>
        {userData.userType === "Student" && (
          <>
            <Text style={styles.detailText}>Branch: {userData.branch}</Text>
            <Text style={styles.detailText}>Semester: {userData.semester}</Text>
          </>
        )}

        {userData.userType === "Mentor" && (
          <>
            <Text style={styles.detailText}>Department: {userData.department}</Text>
            <Text style={styles.detailText}>Designation: {userData.designation}</Text>
            <Text style={styles.detailText}>Specialization: {userData.specialization}</Text>
          </>
        )}

        {userData.userType === "Alumni" && (
          <>
            <Text style={styles.detailText}>Graduation Year: {userData.graduationYear}</Text>
            <Text style={styles.detailText}>Current Job: {userData.currentJob}</Text>
            <Text style={styles.detailText}>Specialization: {userData.specialization}</Text>
          </>
        )}
      </View>
      <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate("EditProfile", { userData })}>
  <Text style={styles.editButtonText}>Edit Profile</Text>
</TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
  },
  userEmail: {
    fontSize: 16,
    color: colors.secondary,
    marginBottom: 10,
  },
  detailsContainer: {
    width: "100%",
    backgroundColor: colors.lightGray,
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
  },
  detailText: {
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: colors.primary,
    marginBottom: 5,
  },
  logoutButton: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    marginTop: 30,
    padding: 12,
    width: "80%",
    alignItems: "center",
  },
  logoutButtonText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.SemiBold,
  },
  loadingText: {
    fontSize: 18,
    fontFamily: fonts.Regular,
    color: colors.secondary,
  },
  errorText: {
    fontSize: 18,
    fontFamily: fonts.Regular,
    color: "red",
  },
  editButton: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    marginTop: 15,
    padding: 12,
    width: "80%",
    alignItems: "center",
  },
  editButtonText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.SemiBold,
  },  
});