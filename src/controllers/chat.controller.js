const catchAsyncError = require("../middlewares/function.middleware");
const ErrorHandle = require("../utils/error.util");
const messageModel = require("../models/message.model");
const roomModel = require("../models/room.model");
const moment = require("moment");

class Chat {
  allChat = async (roomId) => {
    try {
      let messages = await messageModel.find({ roomId: roomId });
      return messages;
    } catch (error) {
      console.log(error);
    }
  };
  roomAvailable = async (roomIds) => {
    let rooms = await messageModel.aggregate([
      {
        $match: {
          roomId: { $in: roomIds },
        },
      },
      {
        $sort: { roomId: 1, timestamp: -1 },
      },
      {
        $group: {
          _id: "$roomId",
          lastMessage: { $first: "$message" },
          timestamp: { $first: "$timestamp" },
          studentId: { $first: "$studentId" },
          teacherId: { $first: "$teacherId" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "studentId",
          foreignField: "_id",
          as: "studentInfo",
        },
      },
      {
        $unwind: "$studentInfo",
      },
      {
        $project: {
          _id: 1,
          lastMessage: 1,
          timestamp: 1,
          studentId: 1,
          studentName: "$studentInfo.name",
        },
      },
    ]);
    return rooms;
  };

  newMessage = async (studentId, teacherId, roomId, message, sendId) => {
    try {
      await messageModel.create({
        roomId: roomId,
        studentId: studentId,
        message: message,
        teacherId: teacherId,
        sendId: sendId
      });
    } catch (error) {
      console.log(error);
    }
  };
  getChatForStudent = catchAsyncError(async () => {});
}

module.exports = new Chat();
