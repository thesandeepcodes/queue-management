import watchEvent from "./controllers/watchEvent.js";
import watchNotification from "./controllers/watchNotification.js";
import watchQueues from "./controllers/watchQueues.js";

export default function handleSockets(socket, io) {
  watchEvent(socket);
  watchQueues(socket);
  watchNotification(socket);
}
