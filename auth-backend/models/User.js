// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Check if the model already exists to avoid OverwriteModelError
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

// Only compile model if it doesn't already exist
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
