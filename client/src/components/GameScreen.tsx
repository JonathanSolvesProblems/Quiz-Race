// GameScreen.tsx
import React, { useState, useEffect } from 'react';
import PlayBot from './PlayBot';
import PlayFriend from './PlayFriend';
import PlaySolo from './PlaySolo';
import QuestionRenderer from './QuestionRenderer';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface QuestionSchema {
  question: string;
  options: string[];
  correctAnswer: string;
}

const GameScreen: React.FC = () => {
  const [playBotClicked, setPlayBotClicked] = useState<boolean>(false);
  const [playFriendClicked, setPlayFriendClicked] = useState<boolean>(false);
  const [playSoloClicked, setPlaySoloClicked] = useState<boolean>(false);
  const [questions, setQuestions] = useState<QuestionSchema[]>();
  const questionTable = useQuery(api.questions.get);
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

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [winner, setWinner] = useState<boolean>(false);

  const handlePlaySoloClick = () => {
    setPlaySoloClicked(true);
    setPlayBotClicked(false);
    setPlayFriendClicked(false);
    if (questions !== undefined) setQuestions(shuffleArray(questions));
  };

  const handlePlayBotClick = () => {
    setPlayBotClicked(true);
    setPlayFriendClicked(false);
    setPlaySoloClicked(false);
    if (questions !== undefined) setQuestions(shuffleArray(questions));
  };

  const handlePlayFriendClick = () => {
    setPlayFriendClicked(true);
    setPlayBotClicked(false);
    setPlaySoloClicked(false);
    if (questions !== undefined) setQuestions(shuffleArray(questions));
  };

  const handleCorrectAnswerSelected = () => {
    setCorrectAnswersCount(correctAnswersCount + 1);
  };

  const handleNextQuestion = () => {
    if (questions !== undefined) {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setWinner(true);
      }
    }
  };

  const shuffleArray = (array: QuestionSchema[]) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }

    // Only display 5 questions per round
    return shuffledArray.slice(0, Math.min(5, shuffledArray.length));
  };

  return (
    <div>
      <h1>Quiz Race</h1>
      {!playBotClicked && !playFriendClicked && !playSoloClicked && (
        <div>
          <PlaySolo onClick={handlePlaySoloClick} />
          <PlayBot onClick={handlePlayBotClick} />
          <PlayFriend onClick={handlePlayFriendClick} />
        </div>
      )}

      {playSoloClicked &&
        !winner &&
        questions !== undefined &&
        currentQuestionIndex < questions.length && (
          <div>
            <QuestionRenderer
              question={questions[currentQuestionIndex].question}
              options={questions[currentQuestionIndex].options}
              correctAnswer={questions[currentQuestionIndex].correctAnswer}
              onCorrectAnswerSelected={handleCorrectAnswerSelected}
            />
            <button onClick={handleNextQuestion}>Next Question</button>
          </div>
        )}

      {winner && questions !== undefined && (
        <div>
          <p>
            You Win! Percentage of correct answers: $
            {((correctAnswersCount / questions.length) * 100).toFixed(2)}%
          </p>{' '}
        </div>
      )}
    </div>
  );
};

export default GameScreen;
