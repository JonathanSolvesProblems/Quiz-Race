import React from 'react';
import QuestionRenderer from '../renderers/QuestionRenderer';

interface Props {
  question: string;
  options: string[];
  correctAnswer: string;
  onCorrectAnswerSelected: () => void;
}

const QuestionsMultiplayer: React.FC<Props> = (props) => {
  return (
    <div>
      <h1>Multiplayer Questions</h1>
      <QuestionRenderer {...props} />
    </div>
  );
};

export default QuestionsMultiplayer;
