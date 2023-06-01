const { Schema, model } = require("mongoose");

const User = new Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: null },
  status: {
    type: String,
    enum: ["active", "blocked"],
    default: "active",
  },
});

module.exports = model("User", User);
