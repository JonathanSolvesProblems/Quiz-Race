import React, { useState, useEffect, lazy } from 'react';
import QuestionRenderer from '../renderers/QuestionRenderer';
// import Chat from './Chat';
// import QuestionsMultiplayer from './QuestionsMultiplayer';
// import io from 'socket.io-client';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface Props {
  question: string;
  options: string[];
  correctAnswer: string;
  onCorrectAnswerSelected: () => void;
}

interface QuestionSchema {
  question: string;
  options: string[];
  correctAnswer: string;
}

// const socket = io.connect('http://localhost:3001');

const MultiplayerController = ({
  loadQuestions,
  handleCorrectAnswerSelected,
  handleNextQuestion,
}) => {
  const createRoom = useMutation(api.rooms.createRoom);
  const waitingRoom = useQuery(api.rooms.getWaitingRoom);
  const updateRoomCapacity = useMutation(api.rooms.updateRoomCapacity);
  const [roomID, setRoomID] = useState<string>('');
  // const updatedRoom = useQuery(api.rooms.getRoom, { id: roomID });

  const [questions, setQuestions] = useState<string[]>([]);
  const [options, setOptions] = useState<string[][]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [clientReady, setClientReady] = useState<boolean>(false);

  const [player1_score, setPlayer1Score] = useState<number>(0);
  const [player2_score, setPlayer2Score] = useState<number>(0);

  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [startGame, setStartGame] = useState<boolean>(false);

  const [playerWaiting, setPlayerWaiting] = useState<boolean>(false);
  const [players, setPlayers] = useState<number>(0);

  // const handleAnswerSelect = (option: string) => {
  //   setSelectedAnswer(option);
  //   if (option === correctAnswer) {
  //     onCorrectAnswerSelected();
  //   }
  // };

  const joinRoom = async () => {
    // check if room already exists, will have to query for rooms
    // with at least for for capacity.

    try {
      // Load questions into it randomly from question table.
      // TODO Create new field to hold that information.
      if (waitingRoom) {
        await updateRoomCapacity({
          id: waitingRoom._id,
        });

        setQuestions(waitingRoom.questions);
        setOptions(waitingRoom.options);
        setCorrectAnswers(waitingRoom.correctAnswers);

        // if (updatedWaitingRoom) {
        //   setClientReady(
        //     updatedWaitingRoom.player1Ready && updatedWaitingRoom.player2Ready
        //   );
        // }
      } else {
        const newRoom = {
          player1_score,
          player2_score,
          questions,
          options,
          correctAnswers,
        };

        createRoom(newRoom);
      }
    } catch (error) {
      console.log(`Error creating the room: ${error}`);
      throw error;
    }
    // if (username !== '' && room !== '') {
    //   await socket.emit('join_room', room);
    // } else {
    //   console.log('Username and room must be provided');
    // }
  };

  useEffect(() => {
    // const updatedRoom = useQuery(api.rooms.getRoom, {});
    if (waitingRoom) {
      console.log(waitingRoom.player1Ready);
      console.log(waitingRoom.player2Ready);
      setClientReady(waitingRoom.player1Ready && waitingRoom.player2Ready);
    }
  }, [waitingRoom, clientReady]);

  useEffect(() => {
    if (loadQuestions) {
      const questionHolder: string[] = [];
      const optionsHolder: string[][] = [];
      const correctAnswersHolder: string[] = [];

      for (const index in loadQuestions) {
        if (Object.prototype.hasOwnProperty.call(loadQuestions, index)) {
          const item = loadQuestions[index];
          questionHolder.push(item.question);
          optionsHolder.push(item.options);
          correctAnswersHolder.push(item.correctAnswer);
        }
      }

      setQuestions(questionHolder);
      setOptions(optionsHolder);
      setCorrectAnswers(correctAnswersHolder);
    }

    // socket.on('room_status', ({ players, maxPlayers }: RoomCapacity) => {
    //   console.log(players, maxPlayers);
    //   setPlayers(players);
    // });
    // socket.on('waiting_for_player', () => {
    //   const waitingWarning = `There needs to be at least 2 players to start a game. Currently the number of players is ${players}`;
    //   console.log(waitingWarning);
    //   setPlayerWaiting(waitingWarning);
    // });
    // socket.on('start_game', () => {
    //   console.log(`${players} players have joined the lobby. Starting game...`);
    //   setPlayerWaiting('');
    //   setStartGame(true);
  }, [loadQuestions]);

  //   return () => {
  //     socket.off('room_status');
  //     socket.off('waiting_for_player');
  //     socket.off('start_game');
  //   };
  // }, [socket]);

  return (
    <div>
      {!clientReady ? (
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
              setPlayer1Score(0);
              setPlayer2Score(0);
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
          <QuestionRenderer
            question={questions[0]}
            options={options[0]}
            correctAnswer={correctAnswers[0]}
            onCorrectAnswerSelected={handleCorrectAnswerSelected}
          />
          <button onClick={handleNextQuestion}>Next Question</button>
          {/* <QuestionsMultiplayer
            socket={socket}
            username={username}
            room={room}
            questionContent={props}
          /> */}
          {/* <Chat socket={socket} username={username} room={room} /> */}
        </div>
      )}
    </div>
  );
};

export default MultiplayerController;
