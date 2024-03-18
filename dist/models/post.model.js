import mongoose, { Schema } from "mongoose";
const postSchema = new mongoose.Schema({
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
export const Post = mongoose.model("Post", postSchema);
