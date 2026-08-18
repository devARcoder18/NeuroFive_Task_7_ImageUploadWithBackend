const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    width: { type: Number },
    height: { type: Number },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional, only if auth is wired up
  },
  { timestamps: true }
);

module.exports = mongoose.model("Upload", uploadSchema);
