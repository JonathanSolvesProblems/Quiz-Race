import React, { useState } from 'react';

interface QuestionRendererProps {
  question: string;
  options: string[];
  correctAnswer: string;
  onCorrectAnswerSelected: () => void;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  options,
  correctAnswer,
  onCorrectAnswerSelected,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleAnswerSelect = (option: string) => {
    setSelectedAnswer(option);
    if (option === correctAnswer) {
      onCorrectAnswerSelected();
    }
  };

  return (
    <div className="question-container">
      <h2 className="question">{question}</h2>
      <ul className="options-list">
        {options.map((option, index) => (
          <li key={index}>
            <label className="option-label">
              <input
                type="radio"
                name="answer"
                value={option}
                checked={option === selectedAnswer}
                onChange={() => handleAnswerSelect(option)}
              />
              {option}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionRenderer;
