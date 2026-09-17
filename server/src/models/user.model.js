import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "Username already exists"],
    required: [true, "Username is required"],
  },

  email: {
    type: String,
    required: true,
    unique: [true, "Email already exists"],
  },

  password: {
    type: String,
    required: true,
  },
});

const UserModel = mongoose.model("users", userSchema);

export default UserModel;