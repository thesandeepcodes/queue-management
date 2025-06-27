import jwt from "jsonwebtoken";

export default function authorizeSocket(socket) {
  const { token } = socket.handshake.auth;

  if (!token) {
    socket.emit("error", "Unauthorized: Authorization token is missing");
    socket.disconnect();
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = user;
  } catch (error) {
    socket.emit("error", "Unauthorized: Invalid token");
    socket.disconnect();
  }
}
