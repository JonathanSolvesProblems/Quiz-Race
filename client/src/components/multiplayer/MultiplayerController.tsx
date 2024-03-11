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

const socket = io.connect('http://localhost:3001');

const MultiplayerController = (props: Props) => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [displayChat, setDisplayChat] = useState<boolean>(false);
  const [playerWaiting, setPlayerWaiting] = useState<string>('');

  const joinRoom = () => {
    if (username !== '' && room !== '') {
      socket.emit('join_room', room);
    } else {
      console.log('Username and room must be provided');
    }
  };

  useEffect(() => {
    const handleRoomCapacity = (numOfPlayers: number) => {
      console.log(numOfPlayers);
      if (numOfPlayers > 1) {
        console.log(
          `${numOfPlayers} players have joined the lobby. Starting game...`
        );
        setPlayerWaiting('');
        setDisplayChat(true);
      } else {
        const waitingWarning = `There needs to be at least 2 players to start a game. Currently the number of players is ${numOfPlayers}`;
        console.log(waitingWarning);
        setPlayerWaiting(waitingWarning);
      }
    };

    socket.on('room_capacity', handleRoomCapacity);

    return () => {
      socket.off('room_capacity', handleRoomCapacity);
    };
  }, [socket, room]);

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
