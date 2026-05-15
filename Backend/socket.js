const socketIo = require("socket.io");

let io;

function initializeSocket(server) {

  io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {

    console.log(
      `New client connected: ${socket.id}`
    );

    socket.on("join", (data) => {

      const {
        userId,
        userType,
      } = data;

      // JOIN ROOM
      socket.join(userId);

      console.log(
        `[SOCKET] ${userType} ${userId} joined room`
      );

      console.log(
        "[SOCKET] User socket rooms:",
        Array.from(socket.rooms)
      );

      // Log all rooms in the server
      const allRooms = Array.from(io.sockets.adapter.rooms.keys());
      console.log("[SOCKET] All active rooms:", allRooms);

    });

    socket.on(
      "update-location-captain",
      async (data) => {

        const {
          userId,
          location,
        } = data;

        if (
          !location ||
          !location.lat ||
          !location.lng
        ) {

          return socket.emit(
            "error",
            {
              message:
                "Invalid location data",
            }
          );

        }

        const captainModel =
          require("./models/captain.model");

        await captainModel.findByIdAndUpdate(
          userId,
          {
            location: {
              lat: location.lat,
              lng: location.lng,
            },
          }
        );

      }
    );

    socket.on(
      "disconnect",
      () => {

        console.log(
          `Client disconnected: ${socket.id}`
        );

      }
    );

  });

  return io;
}

function sendMessageToSocketId(
  roomId,
  messageObject
) {

  console.log(
    `[SOCKET] Sending message to room: ${roomId}`,
    messageObject
  );

  if (io) {

    // Log all connected rooms for debugging
    const room = io.sockets.adapter.rooms.get(roomId);
    console.log(
      `[SOCKET] Room "${roomId}" has ${room ? room.size : 0} client(s)`
    );

    io.to(roomId).emit(
      messageObject.event,
      messageObject.data
    );

    console.log(
      `[SOCKET] Event "${messageObject.event}" emitted to room "${roomId}"`
    );

  } else {

    console.error(
      "[SOCKET] Socket.io not initialized"
    );

  }

}

module.exports = {
  initializeSocket,
  sendMessageToSocketId,
};