import mongoose from "mongoose";
import slug from "mongoose-slug-updater";

const TopicSchema = new mongoose.Schema(
  {
    title: String,
    avatar: String,
    description: String,
    status: String,
    slug: {
      type: String,
      slug: "title",
      unique: true
    },
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