import React, { useState, useEffect } from 'react';
import QuestionRenderer from '../renderers/QuestionRenderer'; // Assuming correct path to QuestionRenderer component
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

// Define the props expected by the MultiplayerController component
interface Props {
  loadQuestions: QuestionSchema[];
  handleCorrectAnswerSelected: () => void;
  handleNextQuestion: () => void;
}

// Define the structure of a single trivia question
interface QuestionSchema {
  question: string;
  options: string[];
  correctAnswer: string;
}

/**
 * The MultiplayerController component manages the multiplayer gameplay logic for Quiz Race.
 * It handles joining a game room, waiting for another player to join, initializing game state,
 * loading questions from the database, rendering questions, and handling user interactions.
 */
const MultiplayerController: React.FC<Props> = ({
  loadQuestions,
  handleCorrectAnswerSelected,
  handleNextQuestion,
}) => {
  // Hooks for managing game state and interactions, as well as Convex functions for querying and updating data.
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
  const [playerWaiting, setPlayerWaiting] = useState<boolean>(false);
  const [inSameRoom, setInSameRoom] = useState<boolean>(false);

  // Check if the game is ready to start
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

  // Call back for when a player joins a room
  // Handles the creation of rooms and checks if existing rooms exist with player waiting
  const joinRoom = async () => {
    try {
      if (waitingRoomQuery) {
        gameReady = await updateRoomCapacity({
          id: waitingRoomQuery._id,
        });
        setPlayerWaiting(false);
      } else {
        const newRoom = {
          player1_score,
          player2_score,
          questions,
          options,
          correctAnswers,
          username,
        };

        createRoom(newRoom);
        setPlayerWaiting(true);
      }
    } catch (error) {
      console.log(`Error creating the room: ${error}`);
      throw error;
    }
  };

  // Updates client readiness based on game state and room status
  useEffect(() => {
    setClientReady(inSameRoom);
  }, [isGameReady, inSameRoom]);

  // Loads the randomize questions into a created room
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

  // Notifies all clients that the game is ready
  useEffect(() => {
    if (gameReady) {
      const notifyClientsGameReady = checkGameReadyState(gameReady);
      setIsGameReady(notifyClientsGameReady);
      setPlayerWaiting(!notifyClientsGameReady);
    }
  }, [gameReady]);

  // Validates if the client has another player in the same room as them
  useEffect(() => {
    const checkPlayerRoom = async () => {
      try {
        if (waitingRoomQuery && getPlayerID) {
          const isPlayerInTheSameRoom = await playerInSameRoom({
            id: getPlayerID,
          });
          console.log('here');
          if (isPlayerInTheSameRoom) {
            const notifyClientsGameReady = checkGameReadyState(gameReady);
            setIsGameReady(notifyClientsGameReady);
            setPlayerWaiting(!notifyClientsGameReady);
            setInSameRoom(notifyClientsGameReady);
          }
        }
      } catch (error) {
        console.error('Error checking player room:', error);
      }
    };

    checkPlayerRoom();
  }, [playerWaiting, waitingRoomQuery, gameReady]);

  // Renders the appropriate contents, based on the state of the game
  return (
    <div>
      {!clientReady && !playerWaiting ? (
        <div className="join-room-container">
          <input
            className="join-room-input"
            type="text"
            placeholder="Enter name"
            onChange={(event) => {
              setUsername(event.target.value);
              setPlayer1Score(0);
              setPlayer2Score(0);
            }}
          />
          <button
            className={`join-room-button ${!username ? 'disabled' : ''}`}
            onClick={joinRoom}
            disabled={!username}
          >
            Enter Game
          </button>
        </div>
      ) : playerWaiting ? (
        <div className="waiting-room-container">
          <p className="waiting-message">
            Waiting for player to join...
            <br />
            Please note that the multiplayer feature will be complete in a
            future release and is currently not available.
          </p>
        </div>
      ) : (
        <div className="question-container">
          <QuestionRenderer
            question={questions[0]}
            options={options[0]}
            correctAnswer={correctAnswers[0]}
            onCorrectAnswerSelected={handleCorrectAnswerSelected}
          />
          <button className="next-question-button" onClick={handleNextQuestion}>
            Next Question
          </button>
        </div>
      )}
    </div>
  );
};

export default MultiplayerController;
