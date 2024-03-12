import React, { useState, useEffect } from 'react';
import Chat from './Chat';
import QuestionsMultiplayer from './QuestionsMultiplayer';
import io from 'socket.io-client';

interface Props {
  question: string;
  options: string[];
  correctAnswer: string;
  onCorrectAnswerSelected: () => void;
}

interface RoomCapacity {
  players: number;
  maxPlayers: number;
}

const socket = io.connect('http://localhost:3001');

const MultiplayerController = (props: Props) => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [displayChat, setDisplayChat] = useState<boolean>(false);
  const [playerWaiting, setPlayerWaiting] = useState<string>('');
  const [players, setPlayers] = useState<number>(0);

  const joinRoom = async () => {
    if (username !== '' && room !== '') {
      await socket.emit('join_room', room);
    } else {
      console.log('Username and room must be provided');
    }
  };

  useEffect(() => {
    socket.on('room_status', ({ players, maxPlayers }: RoomCapacity) => {
      console.log(players, maxPlayers);
      setPlayers(players);
    });

    socket.on('waiting_for_player', () => {
      const waitingWarning = `There needs to be at least 2 players to start a game. Currently the number of players is ${players}`;
      console.log(waitingWarning);
      setPlayerWaiting(waitingWarning);
    });

    socket.on('start_game', () => {
      console.log(`${players} players have joined the lobby. Starting game...`);
      setPlayerWaiting('');
      setDisplayChat(true);
    });

    return () => {
      socket.off('room_status');
      socket.off('waiting_for_player');
      socket.off('start_game');
    };
  }, [socket]);

  return (
    <div>
      {!displayChat && !playerWaiting ? (
        <div className="chat-styling">
          <h3>Join Chat</h3>
          <input
            type="text"
            placeholder="Enter name"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID"
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join a Room</button>
        </div>
      ) : playerWaiting ? (
        <div>
          <p>{playerWaiting}</p>
        </div>
      ) : (
        <div>
          <QuestionsMultiplayer
            socket={socket}
            username={username}
            room={room}
            questionContent={props}
          />
          <Chat socket={socket} username={username} room={room} />
        </div>
      )}
    </div>
  );
};

export default MultiplayerController;
