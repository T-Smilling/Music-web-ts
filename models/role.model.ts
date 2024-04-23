import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    permissions:{
      type: Array,
      default: []
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
const Role = mongoose.model("Role", RoleSchema, "Roles");
export default Role