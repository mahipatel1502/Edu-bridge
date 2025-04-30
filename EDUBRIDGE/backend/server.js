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
      department, // Department for students will also be passed
      designation,
      specialization,
      graduationYear,
      currentJob,
    } = req.body;

    // Validate required fields
    if (!name || !email || !password || !userType) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Check if the email is in the approved_students collection
    const approvedStudentRef = db.collection("approved_students").doc(email);
    const approvedStudentDoc = await approvedStudentRef.get();

    if (!approvedStudentDoc.exists) {
      return res
        .status(403)
        .json({ error: "Signup restricted. Email not found in approved students." });
    }

    // Create user in Firebase Authentication
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    // Prepare user data to store in Firestore
    let userData = {
      name,
      email,
      userType,
      department, // Store the department name here for all user types
    };

    if (userType === "Student") {
      userData.branch = branch || null;
      userData.semester = semester || null;
      userData.department = department || null; // Ensure department is stored for students
    } else if (userType === "Mentor") {
      userData.department = department || null;
      userData.designation = designation || null;
      userData.specialization = specialization || null;
    } else if (userType === "Alumni") {
      userData.graduationYear = graduationYear || null;
      userData.currentJob = currentJob || null;
      userData.specialization = specialization || null;
    }

    // Remove undefined fields
    Object.keys(userData).forEach(
      (key) => userData[key] === undefined && delete userData[key]
    );

    // Save user data to Firestore under the users collection
    await db.collection("users").doc(userRecord.uid).set(userData, {
      merge: true,
    });

    return res.status(201).json({
      message: "User registered successfully",
      uid: userRecord.uid,
    });
  } catch (error) {
    console.error("Signup Error:", error.message);
    return res.status(500).json({ error: error.message });
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
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ error: "Name is required." });
    }

    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();

    const results = snapshot.docs
      .map((doc) => ({ _id: doc.id, ...doc.data() }))
      .filter((user) =>
        user.name?.toLowerCase().includes(name.toLowerCase())
      );

    if (results.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }

    res.json(results);
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.post("/follow", async (req, res) => {
  const { senderEmail, receiverEmail } = req.body;
  console.log("Follow Request Body:", req.body);

  if (!senderEmail || !receiverEmail) {
    return res.status(400).json({ error: "Sender and receiver email are required." });
  }

  try {
    const db = admin.firestore();

    // Find receiver (the user who will receive the request)
    const receiverSnapshot = await db.collection("users").where("email", "==", receiverEmail).get();
    if (receiverSnapshot.empty) {
      return res.status(404).json({ error: "Receiver not found" });
    }
    const receiverDoc = receiverSnapshot.docs[0];
    const receiverRef = receiverDoc.ref;
    const receiverData = receiverDoc.data();

    // Add sender to receiver's "follow_requests" array
    const updatedFollowRequests = receiverData.follow_requests
      ? [...receiverData.follow_requests, senderEmail]
      : [senderEmail];

    await receiverRef.update({ follow_requests: updatedFollowRequests });

    res.json({ message: "Follow request sent successfully!" });

  } catch (error) {
    console.error("Follow Request Server Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});



app.post("/accept-follow", async (req, res) => {
  const { senderEmail, receiverEmail } = req.body;
  console.log("Accept Follow Request Body:", req.body);

  if (!senderEmail || !receiverEmail) {
    return res.status(400).json({ error: "Sender and receiver email are required." });
  }

  try {
    const db = admin.firestore();

    // Get receiver (who is accepting the request)
    const receiverSnapshot = await db.collection("users").where("email", "==", receiverEmail).get();
    if (receiverSnapshot.empty) {
      return res.status(404).json({ error: "Receiver not found" });
    }
    const receiverDoc = receiverSnapshot.docs[0];
    const receiverRef = receiverDoc.ref;
    const receiverData = receiverDoc.data();

    // Get sender (who sent the request)
    const senderSnapshot = await db.collection("users").where("email", "==", senderEmail).get();
    if (senderSnapshot.empty) {
      return res.status(404).json({ error: "Sender not found" });
    }
    const senderDoc = senderSnapshot.docs[0];
    const senderRef = senderDoc.ref;
    const senderData = senderDoc.data();

    // Merge into "connections"
    const updatedReceiverConnections = receiverData.connections
      ? [...new Set([...receiverData.connections, senderEmail])]
      : [senderEmail];

    const updatedSenderConnections = senderData.connections
      ? [...new Set([...senderData.connections, receiverEmail])]
      : [receiverEmail];

    await receiverRef.update({ connections: updatedReceiverConnections });
    await senderRef.update({ connections: updatedSenderConnections });

    // Remove request from receiver's "follow_requests" array
    if (receiverData.follow_requests) {
      const updatedFollowRequests = receiverData.follow_requests.filter(email => email !== senderEmail);
      await receiverRef.update({ follow_requests: updatedFollowRequests });
    }

    res.json({ message: "Follow request accepted, connections updated!" });

  } catch (error) {
    console.error("Accept Follow Request Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/reject-follow", async (req, res) => {
  const { senderEmail, receiverEmail } = req.body;

  try {
    // Same as accept but no need to add to followers
    const receiverDocRef = await db.collection("users").where("email", "==", receiverEmail).get();
    const receiverDocId = receiverDocRef.docs[0].id;
    const receiverData = receiverDocRef.docs[0].data();

    const updatedRequests = (receiverData.follow_requests || []).filter(email => email !== senderEmail);

    await db.collection("users").doc(receiverDocId).update({
      follow_requests: updatedRequests,
    });

    res.status(200).json({ message: "Follow request rejected" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to reject follow request" });
  }
});

app.post("/send-message", async (req, res) => {
  const { senderEmail, receiverEmail, text, messageType = "text" } = req.body;

  if (!senderEmail || !receiverEmail || !text) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const db = admin.firestore();

    // Generate a unique chatId (sorted emails ensure the same ID for both users)
    const chatId = [senderEmail, receiverEmail].sort().join("_");

    // Reference to the chat document
    const chatRef = db.collection("chats").doc(chatId);

    // Check if chat exists, otherwise create it
    const chatDoc = await chatRef.get();
    if (!chatDoc.exists) {
      await chatRef.set({ users: [senderEmail, receiverEmail] });
    }

    // Add message to the messages subcollection
    const messageData = {
      sender: senderEmail,
      text,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      seen: false,
      messageType,
    };

    await chatRef.collection("messages").add(messageData);

    res.json({ message: "Message sent successfully!" });

  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/get-messages", async (req, res) => {
  const { user1, user2 } = req.query;

  if (!user1 || !user2) {
    return res.status(400).json({ error: "Both user emails are required." });
  }

  try {
    const db = admin.firestore();
    const chatId = [user1, user2].sort().join("_");
    const messagesRef = db.collection("chats").doc(chatId).collection("messages").orderBy("timestamp", "asc");

    const messagesSnapshot = await messagesRef.get();
    const messages = messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.json(messages);
  } catch (error) {
    console.error("Get Messages Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/mark-as-seen", async (req, res) => {
  const { chatId, messageId } = req.body;

  if (!chatId || !messageId) {
    return res.status(400).json({ error: "Chat ID and Message ID are required." });
  }

  try {
    const db = admin.firestore();
    const messageRef = db.collection("chats").doc(chatId).collection("messages").doc(messageId);

    await messageRef.update({ seen: true });

    res.json({ message: "Message marked as seen." });
  } catch (error) {
    console.error("Mark as Seen Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/user-chats", async (req, res) => {
  const { userEmail } = req.query;

  if (!userEmail) {
    return res.status(400).json({ error: "User email is required." });
  }

  try {
    const db = admin.firestore();
    const chatsRef = db.collection("chats").where("users", "array-contains", userEmail);
    
    const chatsSnapshot = await chatsRef.get();
    const chats = chatsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.json(chats);
  } catch (error) {
    console.error("User Chats Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/get-connections", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    console.log("Fetching connections for:", email);

    // Find user document by email field (not document ID)
    const usersCollection = db.collection("users");
    const querySnapshot = await usersCollection.where("email", "==", email).get();

    if (querySnapshot.empty) {
      console.log("User not found in Firestore:", email);
      return res.status(404).json({ error: "User not found" });
    }

    // Get the first matching document (assuming email is unique)
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    console.log("User data:", userData);

    const connections = userData.connections || [];
    console.log("Connections:", connections);

    // Fetch connection details
    const connectionDetails = await Promise.all(
      connections.map(async (connEmail) => {
        const connSnapshot = await usersCollection.where("email", "==", connEmail).get();
        if (!connSnapshot.empty) {
          const connDoc = connSnapshot.docs[0];
          return { email: connEmail, name: connDoc.data().name };
        }
        return null;
      })
    );

    res.json(connectionDetails.filter((conn) => conn !== null));
  } catch (error) {
    console.error("Error fetching connections:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Express Route to fetch notifications for a user
// Assuming you have 'users' collection where email -> name
app.get("/notifications", async (req, res) => {
  const userEmail = req.query.userEmail;

  const userDoc = await db.collection("users").where("email", "==", userEmail).get();
  if (userDoc.empty) {
    return res.status(404).json({ error: "User not found." });
  }

  const userData = userDoc.docs[0].data();
  const followRequests = userData.follow_requests || [];

  // Get names of all follow_request users
  const requestsWithName = await Promise.all(
    followRequests.map(async (email) => {
      const senderDoc = await db.collection("users").where("email", "==", email).get();
      if (!senderDoc.empty) {
        const senderData = senderDoc.docs[0].data();
        return {
          senderEmail: email,
          senderName: senderData.name || "",
        };
      } else {
        return {
          senderEmail: email,
          senderName: "",
        };
      }
    })
  );

  res.json(requestsWithName);
});

app.get("/check-follow", async (req, res) => {
  const { senderEmail, receiverEmail } = req.query;

  try {
    // Find user document by email
    const usersRef = db.collection("users");
    const querySnapshot = await usersRef.where("email", "==", senderEmail).get();

    if (querySnapshot.empty) {
      return res.status(404).json({ isFollowing: false, message: "Sender not found" });
    }

    // Assuming email is unique, so get first doc
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    const connections = userData.connections || [];

    const isFollowing = connections.includes(receiverEmail);

    res.json({ isFollowing });
  } catch (error) {
    console.error("Error checking follow:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/check-request", async (req, res) => {
  const { senderEmail, receiverEmail } = req.query;

  try {
    const usersRef = db.collection("users");
    const querySnapshot = await usersRef.where("email", "==", receiverEmail).get();

    if (querySnapshot.empty) {
      return res.status(404).json({ isRequested: false, message: "Receiver not found" });
    }

    const receiverDoc = querySnapshot.docs[0];
    const receiverData = receiverDoc.data();

    const followRequests = receiverData.follow_requests || [];

    const isRequested = followRequests.includes(senderEmail);

    res.json({ isRequested });
  } catch (error) {
    console.error("Error checking request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//  Start Server
const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0"; // Allows connections from any device on the network

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});