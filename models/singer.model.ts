import mongoose from "mongoose";
import slug from 'mongoose-slug-updater';
mongoose.plugin(slug);

const singerSchema = new mongoose.Schema(
  {
    fullName: String,
    avatar: String,
    status: String,
    slug: {
      type:String,
      slug:"fullName",
      unique:true
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
    timestamps: true,
  }
);

const Singer = mongoose.model("Singer", singerSchema, "Singers");

export default Singer;