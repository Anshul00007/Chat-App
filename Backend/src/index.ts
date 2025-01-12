import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8081 });
const rooms = new Set();
const everySocket: { socket: WebSocket; room: string }[] = [];

wss.on("connection", (socket) => {
  console.log("New connection established");

  socket.on("message", (message) => {
    try {
      const parsedMessage = JSON.parse(message.toString());

      if (parsedMessage.type === "create") {
        const roomName = parsedMessage.payload.roomName;

        if (!roomName) {
          socket.send(
            JSON.stringify({ type: "error", message: "Room name cannot be empty." })
          );
          return;
        }

        if (rooms.has(roomName)) {
          socket.send(
            JSON.stringify({ type: "error", message: "Room already exists." })
          );
        } else {
          rooms.add(roomName);
          everySocket.push({ socket, room: roomName });
          socket.send(
            JSON.stringify({ type: "success", message: `Room "${roomName}" created.` })
          );
          console.log(`Room "${roomName}" created`);
        }
      } else if (parsedMessage.type === "join") {
        const roomId = parsedMessage.payload.roomId;

        if (rooms.has(roomId)) {
          everySocket.push({ socket, room: roomId });
          console.log(`User joined room: ${roomId}`);
          socket.send(
            JSON.stringify({ type: "joined", message: `Joined room ${roomId}` })
          );
        } else {
          socket.send(JSON.stringify({ type: "error", message: "Room does not exist." }));
        }
      } else if (parsedMessage.type === "chat") {
        const chatMessage = parsedMessage.payload.message;
        let currentUserRoom = null;

        for (let i = 0; i < everySocket.length; i++) {
          if (everySocket[i].socket === socket) {
            currentUserRoom = everySocket[i].room;
            break;
          }
        }

        if (currentUserRoom) {
          for (let i = 0; i < everySocket.length; i++) {
          
            if (everySocket[i].room === currentUserRoom && everySocket[i].socket !== socket) {
              everySocket[i].socket.send(
                JSON.stringify({ type: "chat", sender: "someone", message: chatMessage })
              );
            }
          }

          socket.send(
            JSON.stringify({ type: "chat", sender: "me", message: chatMessage })
          );
        } else {
          socket.send(
            JSON.stringify({ type: "error", message: "You are not in a room." })
          );
        }
      }
    } catch (err) {
      console.error("Error processing message:", err);
      socket.send(JSON.stringify({ type: "error", message: "Invalid message format." }));
    }
  });

  socket.on("close", () => {
    const index = everySocket.findIndex((user) => user.socket === socket);
    if (index !== -1) {
      everySocket.splice(index, 1);
    }
    console.log("Connection closed");
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});
