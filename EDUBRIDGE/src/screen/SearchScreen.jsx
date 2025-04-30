import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
  
    setLoading(true);
    try {
      const response = await fetch(
        `http://192.168.215.205:5000/search?name=${searchQuery}`
      );
      const data = await response.json();
  
      setResults(data); // Keep full user objects
    } catch (error) {
      console.error("Search Error:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("StudentProfile", { student: item })}>
  
    
      <Text style={styles.avatar}>👤</Text>
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 Find Mentors & Alumni</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Search by name..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.noResults}>No matching users found.</Text>
          }
        />
      )}
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.Bold,
    color: colors.primary,
    textAlign: "center",
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
    elevation: 2,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: "#333",
  },
  searchBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 30,
    marginLeft: 10,
  },
  searchText: {
    color: "#fff",
    fontFamily: fonts.SemiBold,
    fontSize: 15,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    borderColor: "#eee",
    borderWidth: 1,
  },
  avatar: {
    fontSize: 22,
    marginRight: 12,
  },
  name: {
    fontSize: 17,
    fontFamily: fonts.Medium,
    color: "#222",
  },
  noResults: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: "#777",
  },
});
