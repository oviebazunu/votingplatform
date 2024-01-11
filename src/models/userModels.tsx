import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  fullName: {
    type: String,
    required: [true, "Please enter your full name"],
  },
  dateOfBirth: {
    type: Date,
    required: [true, "Please enter your date of birth"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  constituency: {
    type: String,
    required: [true, "Please enter one of the constituencies "],
  },
  uvc: {
    type: String,
    required: [true, "Please enter your unique UVC code"],
    unique: true,
  },
  voted: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
});

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
