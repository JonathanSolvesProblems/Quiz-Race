import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
// import redisAdapter from 'socket.io-redis';

const app = express();
app.use(cors());

const server = http.createServer(app);
const host = 'localhost';
const port = 5173;

const io = new Server(server, {
  cors: {
    origin: `http://${host}:${port}`,
    method: ['GET', 'POST'],
  },
});

// io.adapter(redisAdapter({ host: host, port: 6379 }));

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`); // When convex, can add name of user

  socket.on('join_room', (data) => {
    socket.join(data);
    const room = io.sockets.adapter.rooms.get(data);

    const numOfPlayers = room ? room.size : 0;

    // Emits the number of players to all clients in a room
    socket.to(data).emit('room_capacity', numOfPlayers);

    console.log(
      `User with ID: ${socket.id} joined room ${data} with number of players ${numOfPlayers}`
    );
  });

  socket.on('send_message', (data) => {
    // Only send data to defined room
    socket.to(data.room).emit('receive_message', data);
    console.log(`Message Received: ${data.message}`);
  });

  socket.on('disconnect', () => {
    const rooms = Object.keys(socket.rooms);
    rooms.forEach((room) => {
      const roomObj = io.sockets.adapter.rooms.get(room);
      const numOfPlayers = roomObj ? roomObj.size - 1 : 0;

      socket.to(room).emit('room_capacity', numOfPlayers);
    });

    console.log('User Disconnected', socket.id);
  });
});

server.listen(3001, () => {
  console.log('Server started...');
});
