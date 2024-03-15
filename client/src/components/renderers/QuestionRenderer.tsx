import React, { useState, useEffect } from 'react';

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

  useEffect(() => {
    // Check if the selected answer matches the correct answer
    if (selectedAnswer === correctAnswer) {
      onCorrectAnswerSelected();
    }
  }, [selectedAnswer, correctAnswer, onCorrectAnswerSelected]);

  const handleAnswerSelect = (option: string) => {
    setSelectedAnswer(option);
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
              <div className="option-button">{option}</div>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionRenderer;
