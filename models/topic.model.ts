import mongoose from "mongoose";

const TopicSchema = new mongoose.Schema(
  {
    title: String,
    avatar: String,
    description: String,
    status: String,
    slug: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps:true
  }
);
const Topic = mongoose.model("Topic", TopicSchema, "Topics");
export default Topic;