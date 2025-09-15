// sockets/admin.socket.js
export const initAdminSocket = (nsp) => {
  nsp.on("connection", (socket) => {
    console.log(`🛡️ Admin connected: ${socket.id}`);

    socket.on("broadcastMessage", (message) => {
      console.log(`Admin message: ${message}`);
      nsp.emit("adminMessage", message);
    });

    socket.on("disconnect", () => console.log(`❌ Admin disconnected: ${socket.id}`));
  });

};
