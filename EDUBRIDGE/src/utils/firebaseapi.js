export const fetchStudentsByYear = async (year) => {
    try {
        const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/edu-bridge-49b19/databases/(default)/documents/users`;
        const response = await fetch(`${FIRESTORE_URL}?pageSize=100`);
        const data = await response.json();

        console.log("Fetched Data:", JSON.stringify(data, null, 2)); // Debugging

        if (!data.documents) {
            console.log("No documents found!");
            return [];
        }

        const semesterToYear = {
            1: 1, 2: 1,
            3: 2, 4: 2,
            5: 3, 6: 3,
            7: 4, 8: 4
        };

        const filteredStudents = data.documents.filter(doc => {
            if (!doc.fields || !doc.fields.semester) {
                console.warn("Skipping user due to missing semester field:", doc);
                return false;
            }

            console.log("User fields:", JSON.stringify(doc.fields, null, 2)); // Debugging

            const studentSem = parseInt(doc.fields.semester.stringValue, 10);
            if (isNaN(studentSem)) {
                console.warn("Skipping user due to invalid semester value:", doc.fields.semester);
                return false;
            }

            const studentYear = semesterToYear[studentSem];
            return studentYear === year;
        });

        console.log("Filtered Students:", filteredStudents);

        return filteredStudents.map(doc => ({
            id: doc.name.split("/").pop(),
            name: doc.fields.name?.stringValue || "Unknown",
            email: doc.fields.email?.stringValue || "Unknown",
            branch: doc.fields.branch?.stringValue || "Unknown",
            semester: parseInt(doc.fields.semester.stringValue, 10) || "Unknown"
        }));
    } catch (error) {
        console.error("Error fetching students:", error);
        return [];
    }
};