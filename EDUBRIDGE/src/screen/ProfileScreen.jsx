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
  try {
    const userId = await AsyncStorage.getItem("userId"); // ✅ Get logged-in user's ID

    if (!userId) {
      console.error("User ID not found. Please log in.");
      return;
    }

    const response = await fetch("http://192.168.31.34:5000/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mentorId: id, userId }),
    });

    const result = await response.json();
    console.log("Follow Response:", result);

    if (response.ok) {
      setIsFollowing(true);
      setRequestSent(true);
    } else {
      console.error("Server Error:", result.message);
    }
  } catch (error) {
    console.error("Network Error:", error);
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
          {isFollowing ? "Following" : "Follow"}
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
