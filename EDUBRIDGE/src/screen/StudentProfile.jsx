import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StudentProfile = ({ route }) => {
  const { student } = route.params;
  const [status, setStatus] = useState("follow"); // "follow", "requested", "connected"
  const [senderEmail, setSenderEmail] = useState("");

  useEffect(() => {
    const fetchEmailAndCheckStatus = async () => {
      const email = await AsyncStorage.getItem("email");
      if (email) {
        setSenderEmail(email);
        await checkFollowStatus(email);
      }
    };

    fetchEmailAndCheckStatus();
  }, []);

  const checkFollowStatus = async (senderEmail) => {
    try {
      const followRes = await fetch(
        `http://192.168.215.205:5000/check-follow?senderEmail=${senderEmail}&receiverEmail=${student.email}`
      );
      const followData = await followRes.json();

      if (followRes.ok && followData.isFollowing) {
        setStatus("connected");
        return;
      }

      const reqRes = await fetch(
        `http://192.168.215.205:5000/check-request?senderEmail=${senderEmail}&receiverEmail=${student.email}`
      );
      const reqData = await reqRes.json();

      if (reqRes.ok && reqData.isRequested) {
        setStatus("requested");
      }
    } catch (error) {
      console.error("Error checking follow/request status:", error);
    }
  };

  const handleFollow = async () => {
    if (!senderEmail) {
      Alert.alert("Error", "Your email is missing. Please log in again.");
      return;
    }

    try {
      const response = await fetch("http://192.168.215.205:5000/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderEmail,
          receiverEmail: student.email,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus("requested");
        Alert.alert("Success", "Follow request sent successfully!");
      } else {
        Alert.alert("Error", data.error || "Failed to follow.");
      }
    } catch (error) {
      console.error("Follow Request Error:", error);
      Alert.alert("Error", "Network error. Please try again.");
    }
  };

  const renderFollowButton = () => {
    if (status === "connected") {
      return (
        <View style={[styles.button, styles.connected]}>
          <Text style={styles.buttonText}>Connected</Text>
        </View>
      );
    } else if (status === "requested") {
      return (
        <View style={[styles.button, styles.requested]}>
          <Text style={styles.buttonText}>Request Sent</Text>
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          style={[styles.button, styles.notFollowing]}
          onPress={handleFollow}
        >
          <Text style={styles.buttonText}>Follow ➕</Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>{student.name}</Text>
        <Text style={styles.info}>
          📧 <Text style={styles.bold}>Email:</Text> {student.email}
        </Text>
        <Text style={styles.info}>
          🏛 <Text style={styles.bold}>Department:</Text> {student.department}
        </Text>
        <Text style={styles.info}>
          📚 <Text style={styles.bold}>Branch:</Text> {student.branch}
        </Text>
        <Text style={styles.semester}>
          📅 <Text style={styles.bold}>Semester:</Text> {student.semester}
        </Text>

        {renderFollowButton()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F4F4F4",
  },
  card: {
    width: "100%",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 15,
    textAlign: "center",
    textTransform: "uppercase",
  },
  info: {
    fontSize: 18,
    color: "#444",
    marginBottom: 10,
    textAlign: "center",
  },
  semester: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#005A9C",
    marginTop: 10,
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
    color: "#222",
  },
  button: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  notFollowing: {
    backgroundColor: "#888",
  },
  requested: {
    backgroundColor: "#555",
  },
  connected: {
    backgroundColor: "#006400",
  },
});

export default StudentProfile;
