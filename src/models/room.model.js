const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const roomSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  studentId: {
    type: ObjectId,
    ref: "users",
    required: true
  },
  teacherId: {
    type: ObjectId,
    ref: "users",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isOpen: {
    type: Boolean,
    default: true,
  },
});

const roomModel = mongoose.model("rooms", roomSchema);
module.exports = roomModel;
