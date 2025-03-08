import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userData, onProfileUpdate } = route.params;

  const [name, setName] = useState(userData.name);
  const [email, setEmail] = useState(userData.email);
  const [branch, setBranch] = useState(userData.branch || "");
  const [semester, setSemester] = useState(userData.semester || "");
 
const [graduationYear, setGraduationYear] = useState('');
const [currentJob, setCurrentJob] = useState('');
const [specialization, setSpecialization] = useState('');
const [department, setDepartment] = useState('');
const [designation, setDesignation] = useState('');

const handleUpdate = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Error", "User is not authenticated. Please log in again.");
      return;
    }

    let updateData = { name, email };

    if (userData.userType === "Student") {
      updateData.branch = branch;
      updateData.semester = semester;
    } else if (userData.userType === "Alumni") {
      updateData.graduationYear = graduationYear;
      updateData.currentJob = currentJob;
      updateData.specialization = specialization;
    } else if (userData.userType === "Mentor") {
      updateData.department = department;
      updateData.designation = designation;
      updateData.specialization = specialization;
    }

    const response = await fetch("http://192.168.32.135:5000/user/update", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to update profile.");
    }

    // Update AsyncStorage with new user data
    await AsyncStorage.setItem("user", JSON.stringify(result.updatedUser));

    // Call parent function to update the user state
    if (onProfileUpdate) {
      onProfileUpdate(result.updatedUser); // Pass updated data back
    }

    Alert.alert("Success", "Profile updated successfully!");
    navigation.goBack();
  } catch (error) {
    console.error("Error updating profile:", error);
    Alert.alert("Error", error.message);
  }
};



  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Email:</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />
      

      {userData.userType === "Student" && (
        <>
          <Text style={styles.label}>Branch:</Text>
          <TextInput style={styles.input} value={userData.branch} onChangeText={setBranch} />
          
          <Text style={styles.label}>Semester:</Text>
          <TextInput style={styles.input} value={userData.semester} onChangeText={setSemester} />
        </>
      )}
      {userData.userType === "Alumni" && (
  <>
    <Text style={styles.label}>Graduation Year:</Text>
    <TextInput style={styles.input} value={userData.graduationYear} onChangeText={setGraduationYear} />

    <Text style={styles.label}>Current Job:</Text>
    <TextInput style={styles.input} value={userData.currentJob} onChangeText={setCurrentJob} />

    <Text style={styles.label}>Specialization:</Text>
    <TextInput style={styles.input} value={userData.specialization} onChangeText={setSpecialization} />
  </>
)}

{userData.userType === "Mentor" && (
  <>
    <Text style={styles.label}>Department:</Text>
    <TextInput style={styles.input} value={userData.department} onChangeText={setDepartment} />

    <Text style={styles.label}>Designation:</Text>
    <TextInput style={styles.input} value={userData.designation} onChangeText={setDesignation} />

    <Text style={styles.label}>Specialization:</Text>
    <TextInput style={styles.input} value={userData.specialization} onChangeText={setSpecialization} />
  </>
)}

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    color: colors.primary,
  },
  updateButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  updateButtonText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.SemiBold,
  },
});
