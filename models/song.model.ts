import mongoose from "mongoose";
import slug from "mongoose-slug-updater";

mongoose.plugin(slug);

const songSchema = new mongoose.Schema(
  {
    title: String,
    avatar: String,
    description: String,
    singerId: String,
    topicId: String,
    like: Array,
    tempLike:{
      type:Number,
      default:0
    },
    lyrics: String,
    audio: String,
    status: String,
    slug: {
      type: String,
      slug: "title",
      unique: true
    },
    listen: {
      type: Number,
      default: 0
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
    featured:String,
    updatedBy:[
      {
        account_id: String,
        accountFullName:String,
        updatedAt:Date
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Song = mongoose.model("Song", songSchema, "Songs");

export default Song;