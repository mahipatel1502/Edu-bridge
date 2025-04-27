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
import { useNavigation } from "@react-navigation/native";

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
  
    setLoading(true);
    try {
      const response = await fetch(`http://192.168.12.36:5000/search?name=${searchQuery}`);
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
          placeholder="Enter name..."
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
              onPress={() => navigation.navigate("Profile", item)}
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
    fontSize: 22,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 50,
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: colors.lightGray,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: colors.primary,
    paddingVertical: 10,
  },
  searchButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 50,
    marginLeft: 10,
  },
  searchText: {
    color: colors.white,
    fontSize: 15,
    fontFamily: fonts.SemiBold,
  },
  resultCard: {
    backgroundColor: colors.lightGray,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  name: {
    fontSize: 17,
    fontFamily: fonts.Medium,
    color: colors.primary,
    marginBottom: 4,
  },
  field: {
    fontSize: 15,
    fontFamily: fonts.Regular,
    color: colors.secondary,
  },
  type: {
    fontFamily: fonts.Light,
    color: colors.gray,
  },
  noResults: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: colors.secondary,
  },
});
