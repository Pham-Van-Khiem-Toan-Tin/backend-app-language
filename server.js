const dbConnect = require("./src/configs/db.config");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const app = require("./app");
const moment = require("moment");
const chatController = require("./src/controllers/chat.controller");
const PORT = process.env.PORT || 8888;

const server = createServer(app);
const io = new Server(server);
dbConnect();
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("newChat", async (studentId, message) => {
    try {
      let genRoomId = studentId + moment().format("x");
      await chatController.newMessage(studentId, null, genRoomId, message);
      socket.emit("chatCreated", { roomId: genRoomId });

      let allMessage = await chatController.allChat(genRoomId);

      socket.emit("newMessage", { messages: allMessage });
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  });
  socket.on("teacherJoin", async () => {
    
  })
  socket.on("messageSent", async (message, studentId) => {});
  socket.on("newMessage", async (message, roomId, studentId, teacherId) => {
    try {
      await chatController.newMessage(studentId, teacherId, roomId, message);
      let allMessage = await chatController.allChat(roomId);
      socket.emit("newMessage", { messages: allMessage });
    } catch (error) {
      console.error("Error creating new message:", error);
    }
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
server.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
});
