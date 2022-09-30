const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    tilte: {
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
    createAt: {
      type: Date,
      default: Date.now,
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
      ref: "users",
    },
    likeCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("posts", PostSchema);
