import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { fetchStudentsByYear } from "../utils/firebaseapi";

const StudentListScreen = ({ route }) => {
    const { year } = route.params;
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    // Determine which semesters to show
    const semesterRanges = {
        1: "Semester 1 & 2",
        2: "Semester 3 & 4",
        3: "Semester 5 & 6",
        4: "Semester 7 & 8"
    };

    useEffect(() => {
        const loadStudents = async () => {
            console.log("Fetching data for Year:", year);
            const data = await fetchStudentsByYear(year);
            console.log("Received Data:", data);
            setStudents(data);
            setLoading(false);
        };
    
        loadStudents();
    }, [year]);
    
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>{year}{year === 1 ? "st" : year === 2 ? "nd" : year === 3 ? "rd" : "th"} Year - {semesterRanges[year]}</Text>

            {loading ? <ActivityIndicator size="large" color="#333" /> : null}
            
            {(!loading && students.length === 0) && (
                <Text style={styles.noData}>No students found for this year.</Text>
            )}

            <FlatList
                data={students}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('StudentProfile', { student: item })}>
                        <View style={styles.card}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.info}>📧 {item.email}</Text>
                            <Text style={styles.info}>📚 {item.branch}</Text>
                            <Text style={styles.semester}>📅 Semester: {item.semester}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 20, 
        backgroundColor: "#F4F4F4",
    },
    heading: { 
        fontSize: 24, 
        fontWeight: "bold", 
        color: "#222", 
        textAlign: "center", 
        marginBottom: 20, 
    },
    card: { 
        padding: 15, 
        marginVertical: 8, 
        backgroundColor: "white", 
        borderRadius: 12, 
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 4, 
        elevation: 4, 
    },
    name: { 
        fontSize: 18, 
        fontWeight: "bold", 
        color: "#333",
        marginBottom: 5, 
    },
    info: { 
        fontSize: 16, 
        color: "#444", 
        marginBottom: 2,
    },
    noData: {
        fontSize: 18,
        textAlign: "center",
        color: "gray",
        marginTop: 20
    },
    semester: { 
        fontSize: 16, 
        fontWeight: "600", 
        color: "#005A9C",
        marginTop: 5, 
    }
});

export default StudentListScreen;