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

import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation(); // Get navigation object

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`http://192.168.31.34:5000/search?field=${searchQuery}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find Mentors & Alumni</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter field of interest..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultCard}
              onPress={() => navigation.navigate("Profile", item)} // Navigate to ProfileScreen
            >
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.field}>{item.field} ({item.type})</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.noResults}>No results found.</Text>}
        />
      )}
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 100,
    paddingHorizontal: 20,
    alignItems: "center",
    paddingVertical: 2,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.Light,
    color: colors.primary,
  },
  searchButton: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    paddingVertical: 5,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    
  },
  searchText: {
    color: colors.white,
    fontSize: 15,
    fontFamily: fonts.SemiBold,
  },
  resultCard: {
    backgroundColor: colors.grayLight,
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontFamily: fonts.Bold,
    color: colors.primary,
  },
  field: {
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: colors.secondary,
  },
  noResults: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: colors.secondary,
  },
});

