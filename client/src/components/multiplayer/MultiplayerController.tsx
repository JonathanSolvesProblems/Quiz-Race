import React, { useState, useEffect } from 'react';
import QuestionRenderer from '../renderers/QuestionRenderer';
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

const MultiplayerController = ({
  loadQuestions,
  handleCorrectAnswerSelected,
  handleNextQuestion,
}) => {
  const createRoom = useMutation(api.rooms.createRoom);
  const waitingRoomQuery = useQuery(api.rooms.getWaitingRoom);
  // const updatedWaitingRoom = useQuery(api.rooms.getRoom, {
  //   id: waitingRoomQuery._id,
  // });

  const [updateRoom, setUpdateRoom] = useState<boolean>(false);
  const [clientReady, setClientReady] = useState<boolean>(false);

  // useEffect(() => {
  //   if (waitingRoomQuery && updateRoom) {
  //     const updatedWaitingRoom = useQuery(api.rooms.getRoom, {
  //       id: waitingRoomQuery._id,
  //     });

  //     if (updatedWaitingRoom) {
  //       console.log(updatedWaitingRoom.player1Ready);
  //       console.log(updatedWaitingRoom.player2Ready);
  //       setClientReady(
  //         updatedWaitingRoom.player1Ready && updatedWaitingRoom.player2Ready
  //       );
  //     }
  //   }
  // }, [updateRoom, waitingRoomQuery]);

  const updateRoomCapacity = useMutation(api.rooms.updateRoomCapacity);
  const [questions, setQuestions] = useState<string[]>([]);
  const [options, setOptions] = useState<string[][]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [player1_score, setPlayer1Score] = useState<number>(0);
  const [player2_score, setPlayer2Score] = useState<number>(0);
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [startGame, setStartGame] = useState<boolean>(false);
  const [playerWaiting, setPlayerWaiting] = useState<boolean>(false);

  const joinRoom = async () => {
    try {
      if (waitingRoomQuery) {
        const updatedRoom = await updateRoomCapacity({
          id: waitingRoomQuery._id,
        });

        setQuestions(waitingRoomQuery.questions);
        setOptions(waitingRoomQuery.options);
        setCorrectAnswers(waitingRoomQuery.correctAnswers);
        console.log('capacity ' + waitingRoomQuery.capacity);
      } else {
        const newRoom = {
          player1_score,
          player2_score,
          questions,
          options,
          correctAnswers,
        };

        createRoom(newRoom);
        setUpdateRoom(false);
      }
    } catch (error) {
      console.log(`Error creating the room: ${error}`);
      throw error;
    }
  };

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
  }, [loadQuestions]);

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
