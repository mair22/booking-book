const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    url: {
      type: String,
    },
    author: {
      type: String,
      require: true,
      default: "Anonymous",
    },
    chapter: {
      type: String,
    },
    status: {
      type: String,
      enum: ["CONTINUE", "FINISHED"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    attachment: String,
    likeCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("posts", PostSchema);
