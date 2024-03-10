/*import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

app.use(cors());

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(socket.id); // logs id

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});

server.listen(3001, () => {
  console.log('Server started...');
});
*/
