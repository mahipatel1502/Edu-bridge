const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.firestore();
const auth = admin.auth();
const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// Secret Key for JWT
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

/**
 * User Signup
 * - Creates a Firebase Authentication user.
 * - Stores user details in Firestore.
 */
app.post("/signup", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      userType,
      branch,
      semester,
      department,
      designation,
      specialization,
      graduationYear,
      currentJob,
    } = req.body;

    if (!name || !email || !password || !userType) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Create user in Firebase Authentication
    const userRecord = await auth.createUser({
      email,
      password, // Firebase handles password hashing
      displayName: name,
    });

    // Prepare user data object
    let userData = {
      name,
      email,
      userType,
    };

    if (userType === "Student") {
      userData.branch = branch || null;
      userData.semester = semester || null;
    } else if (userType === "Mentor") {
      userData.department = department || null;
      userData.designation = designation || null;
      userData.specialization = specialization || null;
    } else if (userType === "Alumni") {
      userData.graduationYear = graduationYear || null;
      userData.currentJob = currentJob || null;
      userData.specialization = specialization || null;
    }

    // Remove undefined values from userData
    Object.keys(userData).forEach(
      (key) => userData[key] === undefined && delete userData[key]
    );

    // Save user details in Firestore (without password)
    await db.collection("users").doc(userRecord.uid).set(userData, {
      merge: true, // Ensures partial updates without overwriting
    });

    res
      .status(201)
      .json({ message: "User registered successfully", uid: userRecord.uid });
  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});



/**
 *  User Login
 * - Uses JWT for authentication.
 * - Firebase Authentication should handle password validation on the frontend.
 */
app.post("/login", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    // Retrieve user from Firestore
    const userSnapshot = await db.collection("users").where("email", "==", email).get();
    if (userSnapshot.empty) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const userData = userSnapshot.docs[0].data();
    const userId = userSnapshot.docs[0].id;

    // Generate JWT Token
    const token = jwt.sign({ uid: userId, email: userData.email, userType: userData.userType }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { uid: userId, name: userData.name, email: userData.email, userType: userData.userType },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Protected User Route (Requires JWT)
 * - Retrieves user data.
 */
app.get("/user", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await db.collection("users").doc(decoded.uid).get();

    if (!user.exists) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(user.data());
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
});

//  Start Server
const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0"; // Allows connections from any device on the network

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
