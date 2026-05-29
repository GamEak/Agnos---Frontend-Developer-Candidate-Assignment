import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const app = next({ dev: true });
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
  });

  httpServer.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
});
