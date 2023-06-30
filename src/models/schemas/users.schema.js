const mongoose = require("mongoose");

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
  },
  password: {
    type: String,
  },
  github_username: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "admin", "premium"],
    default: "user",
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },
});

module.exports = {
  UsersModel: mongoose.model(userCollection, userSchema),
};
