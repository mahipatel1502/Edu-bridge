import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
const ChatboxScreen = ({ route }) => {
   // Receiver's email passed from previous screen
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [senderEmail, setSenderEmail] = useState("");

  useEffect(() => {
    const receiverEmail = route?.params?.receiverEmail || null;// Get sender email from AsyncStorage
    const fetchSenderEmail = async () => {
      const email = await AsyncStorage.getItem("email");
      if (email) {
        setSenderEmail(email);
        fetchMessages(email, receiverEmail);
      }
    };
    fetchSenderEmail();
  }, []);

  // 📌 Fetch messages from backend
  const fetchMessages = async (user1, user2) => {
    try {
      const response = await fetch(
        `http://192.168.31.34:5000/get-messages?user1=${user1}&user2=${user2}`
      );
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // 📌 Send message
  const sendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      const response = await fetch("http://192.168.31.34:5000/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderEmail,
          receiverEmail,
          text: messageText,
          messageType: "text",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessages([...messages, { sender: senderEmail, text: messageText }]);
        setMessageText("");
      } else {
        alert(data.error || "Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Chat Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={[styles.message, item.sender === senderEmail ? styles.sent : styles.received]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        inverted
      />

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={messageText}
          onChangeText={setMessageText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatboxScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  message: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    maxWidth: "70%",
  },
  sent: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-end",
  },
  received: {
    backgroundColor: "#e5e5ea",
    alignSelf: "flex-start",
  },
  messageText: {
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    color: colors.primary,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    color: colors.primary,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
