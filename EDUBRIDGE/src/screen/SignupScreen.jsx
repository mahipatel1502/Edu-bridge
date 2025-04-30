import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";

const SignupScreen = () => {
  const navigation = useNavigation();
  const [secureEntry, setSecureEntry] = useState(true);
  const [userType, setUserType] = useState(null);
  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [currentJob, setCurrentJob] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleGoBack = () => {
    if (step > 1) setStep(step - 1);
    else navigation.goBack();
  };

  const handleNext = () => {
    if (step === 1 && !userType)
      return Alert.alert("Error", "Please select a user type.");
    if (step === 2 && (!name || !email))
      return Alert.alert("Error", "Please enter name and email.");
    if (
      step === 3 &&
      ((userType === "Student" && (!branch || !semester || !department)) ||
        (userType === "Mentor" &&
          (!department || !designation || !specialization)) ||
        (userType === "Alumni" &&
          (!graduationYear || !currentJob || !specialization)))
    )
      return Alert.alert("Error", "Please fill in all required fields.");
    setStep(step + 1);
  };

  const isNextEnabled = () => {
    if (step === 1) return !!userType;
    if (step === 2) return !!(name && email);
    if (step === 3) {
      if (userType === "Student") return !!(branch && semester && department);
      if (userType === "Mentor")
        return !!(department && designation && specialization);
      if (userType === "Alumni")
        return !!(graduationYear && currentJob && specialization);
    }
    return false;
  };

  const handleSignup = async () => {
    if (password !== confirmPassword)
      return Alert.alert("Error", "Passwords do not match!");

    const userData = {
      name,
      email,
      password,
      userType,
      branch: userType === "Student" ? branch : undefined,
      semester: userType === "Student" ? semester : undefined,
      department:
        userType === "Student" || userType === "Mentor" ? department : undefined,
      designation: userType === "Mentor" ? designation : undefined,
      specialization:
        userType === "Mentor" || userType === "Alumni"
          ? specialization
          : undefined,
      graduationYear: userType === "Alumni" ? graduationYear : undefined,
      currentJob: userType === "Alumni" ? currentJob : undefined,
    };

    try {
      const response = await fetch("http://192.168.215.205:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Account created successfully!");
        navigation.navigate("LOGIN");
      } else {
        Alert.alert("Error", data.error || "Signup failed.");
      }
    } catch (error) {
      Alert.alert("Error", "Signup failed: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButtonWrapper}
        onPress={handleGoBack}
      >
        <Ionicons name="arrow-back-outline" color={colors.primary} size={25} />
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.headingText}>Let's start</Text>
      </View>

      {step === 1 && (
        <>
          <Text style={styles.labelText}>Select User Type</Text>
          <View style={styles.userTypeContainer}>
            {["Student", "Mentor", "Alumni"].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.userTypeButton,
                  userType === type && styles.selectedUserType,
                ]}
                onPress={() => setUserType(type)}
              >
                <Text
                  style={[
                    styles.userTypeText,
                    userType === type && styles.selectedUserTypeText,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            disabled={!isNextEnabled()}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.labelText}>Enter your details</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={30} color={colors.secondary} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your Name"
              placeholderTextColor={colors.secondary}
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={30} color={colors.secondary} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your Email"
              placeholderTextColor={colors.secondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 3 && (
        <>
          {userType === "Student" && (
            <>
              <Text style={styles.labelText}>Student Details</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="school-outline" size={30} color={colors.secondary} />
                <View style={{ flex: 1 }}>
                  <RNPickerSelect
                    onValueChange={(val) => setBranch(val)}
                    items={[
                      { label: "CSE", value: "CSE" },
                      { label: "CE", value: "CE" },
                      { label: "IT", value: "IT" },
                    ]}
                    placeholder={{
                      label: "Select Branch",
                      value: null,
                      color: colors.secondary,
                    }}
                    value={branch}
                    useNativeAndroidPickerStyle={false}
                    style={{
                      inputAndroid: {
                        color: colors.primary,
                        fontSize: 16,
                        fontFamily: fonts.Light,
                      },
                      inputIOS: {
                        color: colors.primary,
                        fontSize: 16,
                        fontFamily: fonts.Light,
                      },
                      placeholder: {
                        color: colors.secondary,
                        fontSize: 16,
                        fontFamily: fonts.Light,
                      },
                    }}
                    Icon={() => (
                      <Ionicons
                        name="chevron-down-outline"
                        size={20}
                        color={colors.secondary}
                        style={{ position: "absolute", right: 10, top: 12 }}
                      />
                    )}
                  />
                </View>
              </View>
              <View style={styles.inputContainer}>
  <Ionicons name="layers-outline" size={30} color={colors.secondary} />
  <View style={{ flex: 1 }}>
    <RNPickerSelect
      onValueChange={(val) => setSemester(val)}
      items={[
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
        { label: "5", value: "5" },
        { label: "6", value: "6" },
        { label: "7", value: "7" },
        { label: "8", value: "8" },
      ]}
      placeholder={{
        label: "Select Semester",
        value: null,
        color: colors.secondary,
      }}
      value={semester}
      useNativeAndroidPickerStyle={false}
      style={{
        inputAndroid: {
          color: colors.primary,
          fontSize: 16,
          fontFamily: fonts.Light,
        },
        inputIOS: {
          color: colors.primary,
          fontSize: 16,
          fontFamily: fonts.Light,
        },
        placeholder: {
          color: colors.secondary,
          fontSize: 16,
          fontFamily: fonts.Light,
        },
      }}
      Icon={() => (
        <Ionicons
          name="chevron-down-outline"
          size={20}
          color={colors.secondary}
          style={{ position: "absolute", right: 10, top: 12 }}
        />
      )}
    />
  </View>
</View>
              <View style={styles.inputContainer}>
                <Ionicons name="business-outline" size={30} color={colors.secondary} />
                <View style={{ flex: 1 }}>
                  <RNPickerSelect
                    onValueChange={(val) => setDepartment(val)}
                    items={[
                      { label: "DEPSTAR", value: "DEPSTAR" },
                      { label: "CSPIT", value: "CSPIT" },
                    ]}
                    placeholder={{
                      label: "Select Department",
                      value: null,
                      color: colors.secondary,
                    }}
                    value={department}
                    useNativeAndroidPickerStyle={false}
                    style={{
                      inputAndroid: {
                        color: colors.primary,
                        fontSize: 16,
                        fontFamily: fonts.Light,
                      },
                      inputIOS: {
                        color: colors.primary,
                        fontSize: 16,
                        fontFamily: fonts.Light,
                      },
                      placeholder: {
                        color: colors.secondary,
                        fontSize: 16,
                        fontFamily: fonts.Light,
                      },
                    }}
                    Icon={() => (
                      <Ionicons
                        name="chevron-down-outline"
                        size={20}
                        color={colors.secondary}
                        style={{ position: "absolute", right: 10, top: 12 }}
                      />
                    )}
                  />
                </View>
              </View>
            </>
          )}

          {userType === "Mentor" && (
            <>
              <Text style={styles.labelText}>Mentor Details</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Department"
                  placeholderTextColor={colors.secondary}
                  value={department}
                  onChangeText={setDepartment}
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Designation"
                  placeholderTextColor={colors.secondary}
                  value={designation}
                  onChangeText={setDesignation}
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Specialization"
                  placeholderTextColor={colors.secondary}
                  value={specialization}
                  onChangeText={setSpecialization}
                />
              </View>
            </>
          )}

          {userType === "Alumni" && (
            <>
              <Text style={styles.labelText}>Alumni Details</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Graduation Year"
                  placeholderTextColor={colors.secondary}
                  value={graduationYear}
                  onChangeText={setGraduationYear}
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Current Job"
                  placeholderTextColor={colors.secondary}
                  value={currentJob}
                  onChangeText={setCurrentJob}
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Specialization"
                  placeholderTextColor={colors.secondary}
                  value={specialization}
                  onChangeText={setSpecialization}
                />
              </View>
            </>
          )}

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 4 && (
        <>
          <Text style={styles.labelText}>Set Password</Text>
          <View style={styles.inputContainer}>
            <SimpleLineIcons name="lock" size={30} color={colors.secondary} />
            <TextInput
              style={styles.textInput}
              placeholder="Create password"
              placeholderTextColor={colors.secondary}
              secureTextEntry={secureEntry}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setSecureEntry((p) => !p)}>
              <Ionicons
                name={secureEntry ? "eye-off" : "eye"}
                size={20}
                color={colors.secondary}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <SimpleLineIcons name="lock" size={30} color={colors.secondary} />
            <TextInput
              style={styles.textInput}
              placeholder="Confirm password"
              placeholderTextColor={colors.secondary}
              secureTextEntry={secureEntry}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setSecureEntry((p) => !p)}>
              <Ionicons
                name={secureEntry ? "eye-off" : "eye"}
                size={20}
                color={colors.secondary}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <Text style={styles.signupButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, padding: 20 },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: colors.gray,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: { marginVertical: 20 },
  headingText: {
    fontSize: 32,
    color: colors.primary,
    fontFamily: fonts.SemiBold,
  },
  labelText: {
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: 20,
  },
  userTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 50,
    marginTop: 20,
  },
  userTypeButton: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 100,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  userTypeText: {
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: colors.primary,
  },
  selectedUserType: { backgroundColor: colors.primary },
  selectedUserTypeText: {
    color: colors.white,
    fontFamily: fonts.Bold,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 100,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    height: 50,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontFamily: fonts.Light,
    color: colors.primary,
    height: 46,
  },
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    marginTop: 20,
    alignItems: "center",
    padding: 12,
  },
  nextButtonText: {
    color: colors.white,
    fontSize: 20,
    fontFamily: fonts.SemiBold,
    textAlign: "center",
  },
  signupButton: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    marginTop: 20,
    alignItems: "center",
    padding: 12,
  },
  signupButtonText: {
    color: colors.white,
    fontSize: 20,
    fontFamily: fonts.SemiBold,
    textAlign: "center",
  },

});

export default SignupScreen;