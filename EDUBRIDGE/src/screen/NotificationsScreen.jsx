import React from "react";
import { View, Text, StyleSheet } from "react-native";

const NotificationsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>acc Screen</Text>
    </View>
  );
};

export default NotificationsScreen; // ✅ Ensure default export

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
