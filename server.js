const dbConnect = require("./src/configs/db.config");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const chatController = require("./src/controllers/chat.controller");
const app = require("./app");
const Redis = require("ioredis");
const redis = new Redis();
const PORT = process.env.PORT || 8888;

const server = createServer(app);
const io = new Server(server);
dbConnect();

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("roomAvailable", async (teacherId) => {
    let roomsString = await redis.get("room");
    let roomsArray = JSON.parse(roomsString ?? "[]");
    let filteredRooms = roomsArray
      .filter((room) => {
        return (
          room.status === 2 && (!room.teacherId || room.teacherId === teacherId)
        );
      })
      .map((item) => item.roomId);
    let rooms = await chatController.roomAvailable(filteredRooms);
    io.emit("roomAvailable", { rooms: rooms });
  });
  socket.on("studentJoinRoom", async (studentId) => {
    let roomsString = await redis.get("room");
    let roomsArray = JSON.parse(roomsString ?? "[]");
    roomsArray.push({
      roomId: socket.id,
      studentId: studentId,
      socketStudent: socket.id,
      status: 1,
    });
    await redis.set("room", JSON.stringify(roomsArray));
  });
  socket.on("teacherJoinRoom", async (teacherId, roomId) => {
    try {
      let roomsString = await redis.get("room");
      let roomsArray = JSON.parse(roomsString);
      let indexRoom = roomsArray.findIndex((item) => item.roomId == roomId);
      roomsArray[indexRoom]["teacherId"] = teacherId;
      roomsArray[indexRoom]["socketTeacher"] = socket.id;
      await redis.set("room", JSON.stringify(roomsArray));
    } catch (error) {
      console.error("Error when teacher joins:", error);
    }
  });
  socket.on("allMessageChat", async (roomId) => {
    let allMessage = await chatController.allChat(roomId);
    io.to(socket.id).emit("newMessage", { messages: allMessage });
  });
  socket.on("messageSent", async (message, studentId) => {});
  socket.on(
    "newMessage",
    async (message, studentId, teacherId, roomId, sendId) => {
      try {
        let roomIndex = roomId ?? socket.id;
        await chatController.newMessage(
          studentId,
          teacherId,
          roomIndex,
          message,
          sendId
        );
        let roomsString = await redis.get("room");
        let roomsArray = JSON.parse(roomsString);
        let indexRoom = roomsArray.findIndex(
          (item) => item.roomId == roomIndex
        );

        if (roomsArray[indexRoom].status == 1) {
          roomsArray[indexRoom].status = 2;
          await redis.set("room", JSON.stringify(roomsArray));
        }
        let allMessage = await chatController.allChat(roomIndex);
        io.to(roomsArray[indexRoom].socketStudent).emit("newMessage", {
          messages: allMessage,
        });
        io.to(roomsArray[indexRoom].socketTeacher).emit("newMessage", {
          messages: allMessage,
        });
        if (roomId == null) {
          let filteredRooms = roomsArray
            .filter((room) => {
              return (
                room.status === 2 &&
                (!room.teacherId || room.teacherId === teacherId)
              );
            })
            .map((item) => item.roomId);
          let rooms = await chatController.roomAvailable(filteredRooms);
          io.emit("roomAvailable", { rooms: rooms });
        }
      } catch (error) {
        console.error("Error creating new message:", error);
      }
    }
  );
  socket.on("disconnect", async () => {
    let roomsString = await redis.get("room");
    let roomsArray = JSON.parse(roomsString ?? "[]");
    let newRoomArray = roomsArray.filter((item) => item.socketStudent != socket.id);
    await redis.set("room", JSON.stringify(newRoomArray));
    io.emit("reloadRoomAvailable")
    console.log("user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
});
