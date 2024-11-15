To create the backend for the login/signup functionality, we’ll use Node.js with Express and MongoDB to handle user data. Here’s a simple backend that supports user registration and login.

Prerequisites
Node.js and npm: Make sure Node.js is installed.
MongoDB: You can use a local MongoDB instance or MongoDB Atlas (for cloud hosting).
bcrypt: For password hashing.
jsonwebtoken: For generating JWT tokens for secure authentication.
Step 1: Set Up Project and Install Dependencies
Create a new directory for the backend, then navigate into it and initialize a Node.js project:
bash
Copy code
mkdir auth-backend
cd auth-backend
npm init -y
Install the required packages:
bash
Copy code
npm install express mongoose bcryptjs jsonwebtoken dotenv
Step 2: Create Project Structure
Your project structure should look like this:

arduino
Copy code
auth-backend/
├── .env
├── server.js
├── config/
│   └── db.js
├── models/
│   └── User.js
└── routes/
    └── auth.js
Step 3: Configure MongoDB Connection (config/db.js)
In config/db.js, connect to MongoDB using Mongoose.

javascript
Copy code
// config/db.js
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
Step 4: Define User Model (models/User.js)
In models/User.js, define a Mongoose schema for storing users.

javascript
Copy code
// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Password hashing before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
Step 5: Create Authentication Routes (routes/auth.js)
Create routes for login and signup in routes/auth.js.

javascript
Copy code
// routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
Step 6: Set Up Express Server (server.js)
In server.js, set up the Express server and include the authentication routes.

javascript
Copy code
// server.js
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use("/api/auth", authRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
Step 7: Configure Environment Variables (.env)
In your .env file, add MongoDB URI and JWT secret.

makefile
Copy code
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
Step 8: Test the API
Start the Server:
bash
Copy code
node server.js
Test the Endpoints using Postman or any API testing tool.
Signup:

URL: http://localhost:5000/api/auth/signup
Method: POST
Body: { "username": "user1", "email": "user@example.com", "password": "password123" }
Login:

URL: http://localhost:5000/api/auth/login
Method: POST
Body: { "email": "user@example.com", "password": "password123" }
Optional: Protect Routes Using JWT Middleware
To protect certain routes, you can create a middleware that checks for a valid token:

javascript
Copy code
// middleware/auth.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Access denied, token missing!" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid token" });
    }
};
Now you can use this middleware on routes that require authentication by adding it as a second argument:

javascript
Copy code
// Example usage in a route
app.get("/protected", authMiddleware, (req, res) => {
    res.send("This is a protected route");
});
Summary
This setup gives you a secure backend for user authentication with hashed passwords and JWT-based token authentication. You can now connect your frontend with this backend to handle user login and signup securely.











