const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const nodemailer = require("nodemailer");
const crypto = require("crypto");


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Access Denied. No Token Provided." });
  }

  const token = authHeader.split(" ")[1]; // Extract token after 'Bearer'

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach decoded user info to request
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or Expired Token" });
  }
};
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
// Configure Nodemailer (for sending OTP emails)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "khyatithakkar723@gmail.com",// Your email
    pass: "ranylknsthydwise", // Your email password (or app password)
  },
});

app.put("/user/update", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid; // Extract from JWT Token
    const { name, email, branch, semester, graduationYear, currentJob, specialization, department, designation } = req.body;

    // Fetch user from Firestore
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userDoc.data();

    // Construct update object based on userType
    let updateFields = { name, email };

    if (userData.userType === "Student") {
      updateFields.branch = branch || userData.branch;
      updateFields.semester = semester || userData.semester;
    } else if (userData.userType === "Alumni") {
      updateFields.graduationYear = graduationYear || userData.graduationYear;
      updateFields.currentJob = currentJob || userData.currentJob;
      updateFields.specialization = specialization || userData.specialization;
    } else if (userData.userType === "Mentor") {
      updateFields.department = department || userData.department;
      updateFields.designation = designation || userData.designation;
      updateFields.specialization = specialization || userData.specialization;
    }

    // Remove undefined fields
    Object.keys(updateFields).forEach((key) => updateFields[key] === undefined && delete updateFields[key]);

    // Update user in Firestore
    await userRef.update(updateFields);

    res.status(200).json({ message: "Profile updated successfully", updatedUser: updateFields });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// -------------------------- Forgot Password Flow -------------------------- //

/**
 * Check if Email is Registered
 */


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require("./firebase-adminsdk.json")),
  });
}
app.post("/check-email", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  try {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (snapshot.empty) {
      return res.json({ registered: false, message: "Email is not registered." });
    }

    res.json({ registered: true, message: "Email is registered." });
  } catch (error) {
    console.error("Error checking email:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});


/**
 * Send OTP for Password Reset
 */
app.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  try {
    const userRecord = await auth.getUserByEmail(email);

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiry

    // Store OTP in Firestore
    await db.collection("otp").doc(email).set({ otp, expiresAt });

    const storedOtp = await db.collection("otp").doc(email).get();
    if (!storedOtp.exists) {
      return res.status(500).json({ error: "OTP storage failed." });
    }

    // Send OTP via Email
    await transporter.sendMail({
      from: "khyatithakkar723@gmail.com",
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It will expire in 5 minutes.`,

    }, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: "Failed to send OTP email." });
      } else {
        console.log("Email sent: " + info.response);
        return res.json({ message: "OTP sent successfully." });
      }
    });

  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Failed to send OTP. Ensure email is registered." });
  }
});

/**
 * Verify OTP and Reset Password
 */

app.post("/verify-password", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required." });
    }

    // Retrieve OTP from Firestore
    const otpDoc = await db.collection("otp").doc(email).get();

    if (!otpDoc.exists || otpDoc.data().otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP or OTP expired." });
    }

    res.status(200).json({ success: true, message: "OTP verified successfully" });

  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ error: "Failed to verify OTP." });
  }
});

app.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ error: "Email and new password are required." });
    }

    // Retrieve user from Firestore
    const usersRef = db.collection("users").where("email", "==", email);
    const userSnapshot = await usersRef.get();

    if (userSnapshot.empty) {
      return res.status(404).json({ error: "User not found." });
    }

    const userRecord = await auth.getUserByEmail(email);

    // Update password in Firebase Authentication
    await auth.updateUser(userRecord.uid, { password: newPassword });

    // Invalidate all existing tokens by revoking refresh tokens
    await auth.revokeRefreshTokens(userRecord.uid);

    // Optional: Remove any stored OTP after successful reset
    await db.collection("otp").doc(email).delete().catch(() => {});

    res.json({ success: true, message: "Password reset successful. You must log in again with your new password." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ error: "Failed to reset password. Try again later." });
  }
});


app.get("/search", async (req, res) => {
  try {
    const { field } = req.query;
    if (!field) {
      return res.status(400).json({ error: "Field is required." });
    }

    const mentorsRef = db.collection("users").where("userType", "==", "Mentor");
    const alumniRef = db.collection("users").where("userType", "==", "Alumni");

    // Perform searches using Firestore where() and filter by specialization/department
    const [mentorsSnap, alumniSnap] = await Promise.all([
      mentorsRef.get(),
      alumniRef.get(),
    ]);

    const mentors = mentorsSnap.docs
      .map((doc) => doc.data())
      .filter(
        (user) =>
          user.specialization?.toLowerCase().includes(field.toLowerCase()) ||
          user.department?.toLowerCase().includes(field.toLowerCase())
      );

    const alumni = alumniSnap.docs
      .map((doc) => doc.data())
      .filter((user) =>
        user.specialization?.toLowerCase().includes(field.toLowerCase())
      );

    const results = [...mentors, ...alumni];

    if (results.length === 0) {
      return res.status(404).json({ message: "No mentors or alumni found." });
    }

    res.json(results);
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/follow", async (req, res) => {
  const { senderId, receiverId } = req.body;

  if (!senderId || !receiverId) {
    return res.status(400).json({ error: "Sender and Receiver IDs are required" });
  }

  try {
    const requestRef = db.collection("followRequests").doc(`${senderId}_${receiverId}`);
    const requestDoc = await requestRef.get();

    if (requestDoc.exists) {
      return res.status(400).json({ error: "Follow request already sent" });
    }

    await requestRef.set({
      senderId,
      receiverId,
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ message: "Follow request sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  Start Server
const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0"; // Allows connections from any device on the network

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});