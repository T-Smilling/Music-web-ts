import mongoose from "mongoose";
import {generateRandomString}  from "../helpers/generate.helper";

const AccountSchema = new mongoose.Schema(
  {
    fullName: String,
    password: String,
    avatar: String,
    email: String,
    token:{
      type:String,
      default: generateRandomString(20)
    },
    phone:String,
    role_id:String,
    status:String,
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
const Account = mongoose.model("Account", AccountSchema, "Accounts");
export default Account