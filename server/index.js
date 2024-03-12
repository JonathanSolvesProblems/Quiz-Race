import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();
app.use(cors());

const server = http.createServer(app);
const host = 'localhost';
const port = 5173;
const rooms = {};

const io = new Server(server, {
  cors: {
    origin: `http://${host}:${port}`,
    method: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`); // When convex, can add name of user

  socket.on('join_room', (room) => {
    socket.join(room);

    if (!rooms[room]) {
      rooms[room] = [];
    }

    rooms[room].push(socket.id);
    socket.to(room).emit('room_status', {
      players: rooms[room].length,
      maxPlayers: 2,
    });

    if (rooms[room].length === 2) {
      socket.to(room).emit('start_game');
    } else {
      socket.emit('waiting_for_player');
    }

    console.log(
      `User with ID: ${socket.id} joined room ${room} with number of players ${rooms[room].length}`
    );
  });

  socket.on('send_message', (data) => {
    // Only send data to defined room
    socket.to(data.room).emit('receive_message', data);
    console.log(`Message Received: ${data.message}`);
  });

  socket.on('disconnect', () => {
    // const rooms = Object.keys(socket.rooms);
    // rooms.forEach((room) => {
    //   const roomObj = io.sockets.adapter.rooms.get(room);
    //   const numOfPlayers = roomObj ? roomObj.size - 1 : 0;

    //   socket.to(room).emit('room_capacity', numOfPlayers);
    // });

    console.log('User Disconnected', socket.id);
  });
});

server.listen(3001, () => {
  console.log('Server started...');
});
