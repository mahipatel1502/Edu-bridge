import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = ({ route }) => {
  const {
    name,
    field,
    type,
    email,
    experience,
    currentSem,
    graduationYear,
    designation,
  } = route.params;

  const [status, setStatus] = useState("follow"); 
  // "follow", "requested", "connected"

  useEffect(() => {
    checkFollowStatus();
  }, []);

  const checkFollowStatus = async () => {
    const senderEmail = await AsyncStorage.getItem("email");

    if (!senderEmail) {
      alert("Email not found. Please log in.");
      return;
    }

    try {
      // First, check if already connected
      const followResponse = await fetch(`http://192.168.12.36:5000/check-follow?senderEmail=${senderEmail}&receiverEmail=${email}`);
      const followData = await followResponse.json();

      if (followResponse.ok && followData.isFollowing) {
        setStatus("connected");
        return;
      }

      // If not connected, check if request is pending
      const requestResponse = await fetch(`http://192.168.12.36:5000/check-request?senderEmail=${senderEmail}&receiverEmail=${email}`);
      const requestData = await requestResponse.json();

      if (requestResponse.ok && requestData.isRequested) {
        setStatus("requested");
      }
    } catch (error) {
      console.error("Check follow/request status error:", error);
    }
  };

  const handleFollowRequest = async () => {
    const senderEmail = await AsyncStorage.getItem("email");

    if (!senderEmail) {
      alert("Email not found. Please log in.");
      return;
    }

    try {
      console.log("Sending follow request...");
      const response = await fetch("http://192.168.12.36:5000/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ senderEmail, receiverEmail: email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("requested");
        alert("Follow request sent successfully!");
      } else {
        console.error("Error response from server:", data);
        alert(data.error || "Failed to send follow request.");
      }
    } catch (error) {
      console.error("Follow request error:", error);
      alert("An error occurred. Please check your connection and try again.");
    }
  };

  const renderButton = () => {
    if (status === "connected") {
      return (
        <View style={styles.connectedButton}>
          <Text style={styles.buttonText}>Connected</Text>
        </View>
      );
    } else if (status === "requested") {
      return (
        <View style={styles.requestedButton}>
          <Text style={styles.buttonText}>Request Sent</Text>
        </View>
      );
    } else {
      return (
        <TouchableOpacity style={styles.followButton} onPress={handleFollowRequest}>
          <Text style={styles.buttonText}>Follow</Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.roleType}>
        {type || "User"} {field ? `(${field})` : ""}
      </Text>

      {type === "Student" && currentSem && (
        <Text style={styles.detail}>Current Semester: {currentSem}</Text>
      )}

      {type === "Alumni" && graduationYear && (
        <Text style={styles.detail}>Graduation Year: {graduationYear}</Text>
      )}

      {type === "Mentor" && designation && (
        <Text style={styles.detail}>Designation: {designation}</Text>
      )}

      {experience && <Text style={styles.detail}>Experience: {experience}</Text>}
      <Text style={styles.detail}>Email: {email}</Text>

      {/* Button */}
      {renderButton()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "flex-start",
    backgroundColor: colors.white,
  },
  name: {
    fontSize: 26,
    fontFamily: fonts.Bold,
    color: colors.primary,
    marginBottom: 5,
  },
  roleType: {
    fontSize: 18,
    fontFamily: fonts.Medium,
    color: colors.secondary,
    marginBottom: 15,
  },
  detail: {
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: colors.primary,
    marginBottom: 6,
  },
  followButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 25,
    alignSelf: "center",
  },
  requestedButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 25,
    alignSelf: "center",
  },
  connectedButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 25,
    alignSelf: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.SemiBold,
  },
});

export default ProfileScreen;
