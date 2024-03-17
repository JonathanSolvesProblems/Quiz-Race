import React, { useState, useEffect, useCallback } from 'react';
// import PlayBot from './renderers/PlayBot';
import PlayFriend from './renderers/PlayFriend';
import PlaySolo from './renderers/PlaySolo';
import QuestionRenderer from './renderers/QuestionRenderer';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import CreateQuestions from './renderers/CreateQuestions';
import MultiplayerController from './multiplayer/MultiplayerController';

// Define the structure of a single trivia question
interface QuestionSchema {
  question: string;
  options: string[];
  correctAnswer: string;
}

/**
 * The GameController component manages the gameplay logic for Quiz Race.
 * It handles rendering different game modes, fetching questions from the database,
 * shuffling and displaying questions, managing user interactions, and determining
 * the winner of the game.
 */
const GameController: React.FC = () => {
  // State variables to manage different game modes and game state
  const [playBotClicked, setPlayBotClicked] = useState(false);
  const [playFriendClicked, setPlayFriendClicked] = useState(false);
  const [playSoloClicked, setPlaySoloClicked] = useState(false);
  const [createQuestionsClicked, setCreateQuestionsClicked] = useState(false);
  const [questions, setQuestions] = useState<QuestionSchema[]>([]);
  const questionTable = useQuery(api.questions.getRecentQuestions);

  // Fetch and set questions from the database when component mounts or questionTable updates
  useEffect(() => {
    if (questionTable) {
      const mappedData = questionTable.map(
        ({ question, options, correctAnswer }) => ({
          question,
          options,
          correctAnswer,
        })
      );
      setQuestions(mappedData);
    }
  }, [questionTable]);

  // State variables to track current question index, correct answers count, and winner status
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [winner, setWinner] = useState(false);

  // Function to shuffle an array of questions
  const shuffleArray = (array: QuestionSchema[]) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray.slice(0, Math.min(5, shuffledArray.length));
  };

  // Handle click event when user selects a game mode
  const handlePlayClick = (type: string) => {
    setPlayBotClicked(type === 'bot');
    setPlayFriendClicked(type === 'friend');
    setPlaySoloClicked(type === 'solo');
    setCreateQuestionsClicked(false);
    if (questions.length) setQuestions(shuffleArray(questions));
  };

  // Handle click event when user selects to create questions
  const handleCreateQuestionsClicked = () => {
    setCreateQuestionsClicked(true);
    setPlayFriendClicked(false);
    setPlayBotClicked(false);
    setPlaySoloClicked(false);
  };

  // Callback function to handle correct answer selection
  const handleCorrectAnswerSelected = useCallback(() => {
    setCorrectAnswersCount((prevCount) => prevCount + 1);
  }, []);

  // Function to handle moving to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setWinner(true);
    }
  };

  // Render the game components based on the game mode and game state
  return (
    <div className="container mt-5">
      <h1>Quiz Race</h1>
      {!playBotClicked &&
        !playFriendClicked &&
        !playSoloClicked &&
        !createQuestionsClicked && (
          <div className="row">
            <PlaySolo onClick={() => handlePlayClick('solo')} />
            {/* <PlayBot onClick={() => handlePlayClick('bot')} /> */}
            <PlayFriend onClick={() => handlePlayClick('friend')} />
            <button
              className="btn btn-primary ms-2"
              style={{ marginTop: '10px' }}
              onClick={handleCreateQuestionsClicked}
            >
              Create Questions
            </button>
          </div>
        )}

      {playSoloClicked &&
        !winner &&
        questions.length > 0 &&
        currentQuestionIndex < questions.length && (
          <div>
            <QuestionRenderer
              question={questions[currentQuestionIndex].question}
              options={questions[currentQuestionIndex].options}
              correctAnswer={questions[currentQuestionIndex].correctAnswer}
              onCorrectAnswerSelected={handleCorrectAnswerSelected}
            />
            <button
              className="btn btn-primary ms-2"
              onClick={handleNextQuestion}
            >
              Next Question
            </button>
          </div>
        )}

      {playFriendClicked && questions.length > 0 && (
        <div>
          <MultiplayerController
            loadQuestions={questions}
            handleCorrectAnswerSelected={handleCorrectAnswerSelected}
            handleNextQuestion={handleNextQuestion}
          />
        </div>
      )}

      {winner && questions.length > 0 && (
        <div>
          <p>
            {(correctAnswersCount / questions.length) * 100 >= 60 ? (
              <>
                You Win! Percentage of correct answers:{' '}
                <span>
                  {((correctAnswersCount / questions.length) * 100).toFixed(2)}%
                </span>
              </>
            ) : (
              <>
                You Lose! Percentage of correct answers:{' '}
                <span>
                  {((correctAnswersCount / questions.length) * 100).toFixed(2)}%
                </span>
              </>
            )}
          </p>
        </div>
      )}

      {createQuestionsClicked && <CreateQuestions />}
    </div>
  );
};

export default GameController;
