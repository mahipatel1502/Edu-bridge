import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { colors } from "../utils/colors";

const ChatboxScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [connections, setConnections] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [receiverEmail, setReceiverEmail] = useState(route?.params?.receiverEmail || null);
  const [receiverName, setReceiverName] = useState(route?.params?.receiverName || null);

  useEffect(() => {
    const fetchSenderEmail = async () => {
      const email = await AsyncStorage.getItem("email");
      if (email) {
        setSenderEmail(email);

        if (receiverEmail) {
          fetchMessages(email, receiverEmail);
        } else {
          fetchConnections(email);
        }
      }
    };
    fetchSenderEmail();
  }, [receiverEmail]);

  const fetchConnections = async (email) => {
    try {
      const response = await fetch(`http://192.168.215.205:5000/get-connections?email=${email}`);
      const data = await response.json();
      setConnections(data);
    } catch (error) {
      console.error("Error fetching connections:", error);
    }
  };

  const fetchMessages = async (user1, user2) => {
    try {
      const response = await fetch(
        `http://192.168.215.205:5000/get-messages?user1=${user1}&user2=${user2}`
      );
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      const response = await fetch("http://192.168.215.205:5000/send-message", {
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

  const openChat = (connectionEmail, connectionName) => {
    setReceiverEmail(connectionEmail);
    setReceiverName(connectionName);
  };

  const goBackToConnections = () => {
    setReceiverEmail(null);
    setReceiverName(null);
    setMessages([]);
    setMessageText("");
  };

  return (
    <View style={styles.container}>
      {receiverEmail ? (
        <>
          {/* 🔥 Chat Header with Back Button and Name */}
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={goBackToConnections}>
              <Text style={{ color: "#007AFF", fontSize: 16 }}>⬅️</Text>
            </TouchableOpacity>
            <Text style={styles.chatTitle}>{receiverName || receiverEmail}</Text>
          </View>

          {/* 🔥 Chat Messages */}
          <FlatList
            data={[...messages].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={[styles.message, item.sender === senderEmail ? styles.sent : styles.received]}>
                <Text style={styles.messageText}>{item.text}</Text>
              </View>
            )}
          />

          {/* 🔥 Message Input */}
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
        </>
      ) : (
        <>
          {/* 🔥 Connections List */}
          <Text style={styles.heading}>Your Connections</Text>
          <FlatList
            data={connections}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.connectionItem}
                onPress={() => openChat(item.email, item.name)}
              >
                <Text style={styles.connectionText}>{item.name || item.email}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}
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
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.primary,
  },
  connectionItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  connectionText: {
    fontSize: 16,
    color: colors.primary,
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: colors.primary,
  },
  message: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    maxWidth: "70%",
  },
  sent: {
    backgroundColor: colors.primary,
    alignSelf: "flex-end",
  },
  received: {
    backgroundColor: colors.primary,
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
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 8,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
