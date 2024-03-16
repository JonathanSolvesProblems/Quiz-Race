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
  const getPlayerID = useQuery(api.players.getPlayerID);
  const [clientReady, setClientReady] = useState<boolean>(false);
  const [isGameReady, setIsGameReady] = useState<boolean>(false);

  const updateRoomCapacity = useMutation(api.rooms.updateRoomCapacity);
  const playerInSameRoom = useMutation(api.rooms.checkIfPlayerInSameRoom);
  const [questions, setQuestions] = useState<string[]>([]);
  const [options, setOptions] = useState<string[][]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [player1_score, setPlayer1Score] = useState<number>(0);
  const [player2_score, setPlayer2Score] = useState<number>(0);
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [startGame, setStartGame] = useState<boolean>(false);
  const [playerWaiting, setPlayerWaiting] = useState<boolean>(false);
  const [inSameRoom, setInSameRoom] = useState<boolean>(false);

  const checkGameReadyState = (gameReady: any) => {
    if (gameReady) {
      setQuestions(gameReady.questions);
      setOptions(gameReady.options);
      setCorrectAnswers(gameReady.correctAnswers);
      const startGame = gameReady.player1Ready && gameReady.player2Ready;

      return startGame;
    }
  };

  let gameReady: any;

  const joinRoom = async () => {
    try {
      if (waitingRoomQuery) {
        gameReady = await updateRoomCapacity({
          id: waitingRoomQuery._id,
        });
      } else {
        const newRoom = {
          player1_score,
          player2_score,
          questions,
          options,
          correctAnswers,
        };

        createRoom(newRoom);
        setPlayerWaiting(true);
      }

      if (waitingRoomQuery && getPlayerID) {
        const isPlayerInTheSameRoom = await playerInSameRoom({
          id: getPlayerID,
        });

        if (isPlayerInTheSameRoom) {
          const notifyClientsGameReady = checkGameReadyState(gameReady);
          setIsGameReady(notifyClientsGameReady);
          setPlayerWaiting(!notifyClientsGameReady);
          setInSameRoom(true);
        }
      }
    } catch (error) {
      console.log(`Error creating the room: ${error}`);
      throw error;
    }
  };

  useEffect(() => {
    setClientReady(inSameRoom);
  }, [isGameReady, inSameRoom]);

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

  useEffect(() => {
    if (gameReady) {
      const notifyClientsGameReady = checkGameReadyState(gameReady);
      setIsGameReady(notifyClientsGameReady);
      setPlayerWaiting(!notifyClientsGameReady);
    }
  }, [gameReady]);

  return (
    <div>
      {!clientReady && !playerWaiting ? (
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
          <p>"Waiting for player to join...</p>
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
        </div>
      )}
    </div>
  );
};

export default MultiplayerController;
