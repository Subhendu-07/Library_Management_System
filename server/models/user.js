// Importing modules
const mongoose = require("mongoose");
const crypto = require("crypto");

// Creating user schema
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // prevent duplicate users
      lowercase: true,
      trim: true,
    },
    dob: {
      type: Date,
    },
    phone: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false, // better than required:true
    },
    photoUrl: {
      type: String, // not required, optional
    },
    hash: String,
    salt: String,
  },
  { timestamps: true }
);

// Method to set salt and hash the password for a user
UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
};

// Method to check whether the entered password is correct or not
UserSchema.methods.isValidPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
  return this.hash === hash;
};

module.exports = mongoose.model("User", UserSchema);
