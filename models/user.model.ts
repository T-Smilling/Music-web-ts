import mongoose from "mongoose";
import {generateRandomString}  from "../helpers/generate.helper";

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    password: String,
    email: String,
    token:{
      type:String,
      default: generateRandomString(30)
    },
    status:{
      type:String,
      default:"active"
    },
    deleted: {
      type: Boolean,
      default: false
    },
    deleteAt: Date
  },
  {
    timestamps:true
  }
);
const User = mongoose.model("User", userSchema, "User");
export default User;