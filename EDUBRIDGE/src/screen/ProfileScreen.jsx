import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = ({ route }) => {
  const { name, field, type, email, experience, bio, id } = route.params;
  const [isFollowing, setIsFollowing] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const handleFollowRequest = async () => {
    const senderEmail = await AsyncStorage.getItem("email"); // Get sender's email from AsyncStorage
    console.log("Stored Sender Email:", senderEmail);

    if (!senderEmail) {
      alert("Email not found. Please log in.");
      return;
    }

    try {
      const response = await fetch("http://192.168.59.118:5000/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ senderEmail, receiverEmail: email }), // Send emails instead of user IDs
      });

      const data = await response.json();
      console.log("Follow Response:", data);

      if (response.ok) {
        setRequestSent(true);
        alert("Follow request sent successfully!");
      } else {
        alert(data.error || "Failed to send follow request.");
      }
    } catch (error) {
      console.error("Follow request error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.detail}>
        {field} ({type})
      </Text>
      <Text style={styles.detail}>Experience: {experience}</Text>
      <Text style={styles.detail}>Email: {email}</Text>
      <Text style={styles.bio}>{bio}</Text>

      <TouchableOpacity
        style={isFollowing ? styles.followingButton : styles.followButton}
        onPress={handleFollowRequest}
        disabled={requestSent}
      >
        <Text style={styles.buttonText}>
          {isFollowing ? "Following" : requestSent ? "Request Sent" : "Follow"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.white,
  },
  name: {
    fontSize: 24,
    fontFamily: fonts.Bold,
    marginBottom: 10,
    color: colors.primary,
  },
  detail: {
    fontSize: 18,
    fontFamily: fonts.Regular,
    marginBottom: 5,
    color: colors.primary,
  },
  bio: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: colors.secondary,
  },
  followButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  followingButton: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.SemiBold,
  },
});
