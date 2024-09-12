const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const messageSchema = new mongoose.Schema({
  studentId: {
    type: ObjectId,
    ref: "users",
  },
  teacherId: {
    type: ObjectId,
    ref: "users",
  },
  roomId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const messageModel = mongoose.model("messages", messageSchema);
module.exports = messageModel;
