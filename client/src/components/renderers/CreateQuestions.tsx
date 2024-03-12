import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

const CreateQuestions = () => {
  const [question, setQuestion] = useState<string>('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState<string>('');
  const [recentQuestions, setRecentQuestions] = useState<Question[]>([]);
  const fetchRecentQuestions = useQuery(api.questions.getRecentQuestions);
  const insertQuestion = useMutation(api.questions.createQuestion);

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
          <div key={index} className="question-item">
            <h3>{question.question}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateQuestions;
