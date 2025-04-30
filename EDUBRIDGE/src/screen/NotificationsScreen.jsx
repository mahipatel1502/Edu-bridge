import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const userEmail = await AsyncStorage.getItem("email");

      if (!userEmail) {
        Alert.alert("Please log in to see notifications.");
        return;
      }

      try {
        const response = await fetch(
          `http://192.168.215.205:5000/notifications?userEmail=${userEmail}`
        );
        const data = await response.json();

        if (response.ok) {
          setNotifications(data);
        } else {
          alert(data.error || "Failed to load notifications.");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        alert("An error occurred. Please try again.");
      }
    };

    fetchNotifications();
  }, []);

  const handleRequestResponse = async (notification, action) => {
    const userEmail = await AsyncStorage.getItem("email");

    if (!userEmail) {
      Alert.alert("Please log in to accept or reject requests.");
      return;
    }

    try {
      const url =
        action === "accept"
          ? "http://192.168.215.205:5000/accept-follow"
          : "http://192.168.12.36:5000/reject-follow";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderEmail: notification.senderEmail,
          receiverEmail: userEmail,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(action === "accept" ? "Request accepted!" : "Request rejected!");
        setNotifications((prevState) =>
          prevState.filter(
            (item) => item.senderEmail !== notification.senderEmail
          )
        );
      } else {
        alert(data.error || "Failed to process request.");
      }
    } catch (error) {
      console.error("Error responding to request:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Follow Requests</Text>

      {notifications.length === 0 ? (
        <Text style={styles.noNotifications}>No follow requests</Text>
      ) : (
        notifications.map((notification, index) => {
          const displayName =
            notification.senderName ||
            notification.sender?.name ||
            notification.senderEmail;

          return (
            <View key={index} style={styles.notificationCard}>
              <View style={styles.row}>
                <Text style={styles.notificationText}>{displayName}</Text>

                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => handleRequestResponse(notification, "accept")}
                  >
                    <Text style={styles.buttonText}>Accept</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => handleRequestResponse(notification, "reject")}
                  >
                    <Text style={styles.buttonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 25,
    backgroundColor: colors.white,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: 15,
  },
  noNotifications: {
    fontSize: 16,
    fontFamily: fonts.Medium,
    color: colors.primary,
    textAlign: "center",
    marginTop: 30,
  },
  notificationCard: {
    backgroundColor: colors.lightGray,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray,
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  notificationText: {
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: colors.primary,
    flex: 1,
    marginRight: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  acceptButton: {
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  rejectButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fonts.Medium,
  },
});

export default NotificationsScreen;
