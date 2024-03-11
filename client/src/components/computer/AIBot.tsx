import React, { useEffect, useState } from 'react';

interface Props {
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
}

const AIBot: React.FC<Props> = ({ questions }: Props) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  const selectRandomAnswer = (): string => {
    const randomIndex = Math.floor(
      Math.random() * questions[currentQuestionIndex].options.length
    );
    return questions[currentQuestionIndex].options[randomIndex];
  };

  useEffect(() => {
    if (currentQuestionIndex < questions.length) {
      const timer = setTimeout(() => {
        // Simulate AI thinking process with a delay
        selectRandomAnswer();
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 2000); // Delay of 2 seconds

      return () => clearTimeout(timer);
    }
  }, [currentQuestionIndex, questions]);

  return null;
};

export default AIBot;
