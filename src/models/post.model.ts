import mongoose, { Document, Schema, Types } from "mongoose";

interface IPostImage {
  public_id: string;
  url: string;
}

export interface IPost extends Document {
  title: string;
  image: IPostImage;
  owner: Types.ObjectId;
  createdAt: Date;
}

const postSchema = new mongoose.Schema<IPost>({
  title: {
    type: String,
    required: true,
  },
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  owner: {
    type: Schema.Types.ObjectId, // Corrected import
    ref: "User",
    required: true, // Added required property
  },
  createdAt: {
    type: Date,
    default: Date.now, // Use function for default value
  },
});

export const Post = mongoose.model<IPost>("Post", postSchema);
