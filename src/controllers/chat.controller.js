const catchAsyncError = require("../middlewares/function.middleware");
const ErrorHandle = require("../utils/error.util");
const messageModel = require("../models/message.model");

class Chat {
  allChat = async (roomId) => {
    try {
      let messages = await messageModel.find({ roomId: roomId });
      return messages;
    } catch (error) {
      console.log(error);
    }
  };
  allRoomNotResponse = async () => {
    try {
      let allRoom = await messageModel.aggregate([
        // Sắp xếp tin nhắn theo roomId và timestamp (tin nhắn mới nhất đứng đầu)
        {
          $sort: { roomId: 1, timestamp: -1 },
        },
        // Lấy ra tin nhắn cuối cùng của mỗi room
        {
          $group: {
            _id: "$roomId", // Nhóm theo roomId
            lastMessage: { $first: "$$ROOT" }, // Lấy tin nhắn đầu tiên trong mỗi nhóm (tức là tin nhắn mới nhất)
          },
        },
        {
          $match: {
            "lastMessage.teacherId": { $eq: null }, // Nếu teacherId bằng null thì có nghĩa là chưa có phản hồi từ giáo viên
            "lastMessage.studentId": { $ne: null }, // Đảm bảo tin nhắn cuối cùng được gửi bởi học sinh
          },
        },
        {
          $project: {
            roomId: "$_id",
            _id: 0,
          },
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  }
  newMessage = async (studentId, teacherId,roomId, message) => {
    try {
      let newChat = await messageModel.create({
        roomId: roomId,
        studentId: studentId,
        message: message,
        teacherId: null,
        timestamp: new Date(),
      });
    } catch (error) {
      console.log(error);
    }
  };
  getChatForStudent = catchAsyncError(async () => {});
}

module.exports = new Chat();
