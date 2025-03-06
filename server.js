const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust to your React FE address if needed
    methods: ["GET", "POST"],
  },
});

// Khi có client kết nối
io.on("connection", (socket) => {
  console.log("Một client đã kết nối:", socket.id);

  // Emit notification every 5 seconds
  const intervalId = setInterval(() => {
    socket.emit("notification", {
      message: "Đây là thông báo gửi mỗi 5 giây!",
    });
  }, 5000);

  // Lắng nghe sự kiện từ client (nếu cần)
  socket.on("sendNotification", (data) => {
    console.log("Nhận từ client:", data);
    // Phát lại thông báo cho tất cả client
    io.emit("notification", { message: data.message });
  });

  // Khi client ngắt kết nối
  socket.on("disconnect", () => {
    console.log("Client đã ngắt kết nối:", socket.id);
    clearInterval(intervalId);
  });
});

// Khởi động server
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server chạy trên port ${PORT}`);
});
