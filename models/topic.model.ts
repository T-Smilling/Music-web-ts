import mongoose from "mongoose";
import slug from "mongoose-slug-updater";
mongoose.plugin(slug)

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
    createdBy:{
      account_id: String,
      createAt:{
        type:Date,
        default: Date.now
      }
    },
    deletedBy:{
      account_id: String,
      deletedAt:Date
    },
    updatedBy:[
      {
        account_id: String,
        updatedAt:Date
      },
    ],
  },
  {
    timestamps:true
  }
);

const Topic = mongoose.model("Topic", TopicSchema, "Topics");
export default Topic;