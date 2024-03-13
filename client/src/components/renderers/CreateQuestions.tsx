import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

const CreateQuestions = () => {
  const fetchRecentQuestions = useQuery(api.questions.getRecentQuestions);
  const insertQuestion = useMutation(api.questions.createQuestion);

  const [question, setQuestion] = useState<string>('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState<string>('');
  const [recentQuestions, setRecentQuestions] = useState<Question[]>([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<
    number | null
  >(null);

  useEffect(() => {
    setRecentQuestions(fetchRecentQuestions || []);
  }, [fetchRecentQuestions]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async () => {
    if (
      question.trim() === '' ||
      options.some((option) => option.trim() === '') ||
      correctAnswer.trim() === ''
    ) {
      alert('Please fill out all the fields before submitting.');
      return;
    }
    try {
      const newQuestion = {
        question,
        options,
        correctAnswer,
      };

      insertQuestion(newQuestion);
    } catch (error) {
      console.log(`Error saving the question: ${error}`);
      throw error;
    } finally {
      setQuestion('');
      setOptions(['', '', '', '']);
      setCorrectAnswer('');
    }
  };

  const handleQuestionClick = (index: number) => {
    setSelectedQuestionIndex(index === selectedQuestionIndex ? null : index);
  };

  return (
    <div>
      <h2>Create Your Own Questions</h2>
      <input
        type="text"
        placeholder="Enter question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      {options.map((option, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Option ${index + 1}`}
          value={option}
          onChange={(e) => handleOptionChange(index, e.target.value)}
        />
      ))}
      <input
        type="text"
        placeholder="Enter correct answer"
        value={correctAnswer}
        onChange={(e) => setCorrectAnswer(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
      <div className="recent-questions-container">
        <h2>Recent Questions</h2>
        {recentQuestions.map((question, index) => (
          <div
            key={index}
            className="question-item"
            onClick={() => handleQuestionClick(index)}
          >
            <h3>{question.question}</h3>
            {selectedQuestionIndex === index && (
              <div>
                <p>Options:</p>
                <ul>
                  {question.options.map((option, optionIndex) => (
                    <li key={optionIndex}>{option}</li>
                  ))}
                </ul>
                <p>Correct Answer: {question.correctAnswer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateQuestions;
