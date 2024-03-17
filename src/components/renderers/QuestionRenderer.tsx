import React, { useState, useEffect } from 'react';

interface QuestionRendererProps {
  question: string;
  options: string[];
  correctAnswer: string;
  onCorrectAnswerSelected: () => void;
}

/**
 * The QuestionRenderer component renders a single trivia question with multiple options.
 * It allows users to select an option and notifies the parent component when the correct
 * answer is selected.
 */
const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  options,
  correctAnswer,
  onCorrectAnswerSelected,
}) => {
  // tracks the selected answer
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // Validates if the selected answer matches the correct answer of the question
  useEffect(() => {
    // Check if the selected answer matches the correct answer
    if (selectedAnswer === correctAnswer) {
      onCorrectAnswerSelected();
    }
  }, [selectedAnswer, correctAnswer, onCorrectAnswerSelected]);

  // Sets the selected answer
  const handleAnswerSelect = (option: string) => {
    setSelectedAnswer(option);
  };

  // Renders the question and options
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
