import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    path: "/socket.io",
  });

  io.on("connection", (socket) => {
    console.log("connected:", socket.id);

    socket.on("patient-status", (data) => {
      io.emit("patient-live-status", data);
    });

    socket.on("patient-update", (data) => {
      io.emit("patient-live-data", data);
    });

    socket.on("disconnect", () => {
      console.log("disconnected:", socket.id);
    });
  });

  const PORT = process.env.PORT || 3000;

  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
