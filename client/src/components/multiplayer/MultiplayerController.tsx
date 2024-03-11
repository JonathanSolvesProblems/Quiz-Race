import React, { useState } from 'react';
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

const MultiplayerController = ({
  question,
  options,
  correctAnswer,
  onCorrectAnswerSelected,
}: Props) => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [displayChat, setDisplayChat] = useState<boolean>(false);

  const joinRoom = () => {
    if (username !== '' && room !== '') {
      socket.emit('join_room', room);
      setDisplayChat(true);
    }
  };

  return (
    <div>
      {!displayChat ? (
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
      ) : (
        <div>
          <QuestionsMultiplayer
            question={question}
            options={options}
            correctAnswer={correctAnswer}
            onCorrectAnswerSelected={onCorrectAnswerSelected}
          />
          <Chat socket={socket} username={username} room={room} />
        </div>
      )}
    </div>
  );
};

export default MultiplayerController;
