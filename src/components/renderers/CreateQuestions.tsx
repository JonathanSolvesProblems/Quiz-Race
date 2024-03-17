import { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

const NO_RESULT_FOUND = 'No result found';

/**
 * The CreateQuestions component allows users to create their own trivia questions,
 * submit them to the database, and search for existing questions.
 * It also displays recent questions from the database for reference.
 */
const CreateQuestions = () => {
  // Hooks for fetching recent questions and inserting new questions, as well as
  // state variables for manager user inputs and fetched data
  const fetchRecentQuestions = useQuery(api.questions.getRecentQuestions);
  const insertQuestion = useMutation(api.questions.createQuestion);
  const [enteredText, setEnteredText] = useState<string>(''); // State to store the entered text
  const fetchRelatedQuestion = useQuery(api.questions.closestSimilarQuestion, {
    enteredText: enteredText, // Using the entered text as a parameter
  });
  const [searchedQuestion, setSearchedQuestion] = useState<string>('');
  const [searchedQuestionClicked, setSearchedQuestionClicked] =
    useState<boolean>(false);

  const [question, setQuestion] = useState<string>('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState<string>('');
  const [recentQuestions, setRecentQuestions] = useState<Question[]>([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<
    number | null
  >(null);

  // Updates state variable with most recent question from the database
  useEffect(() => {
    setRecentQuestions(fetchRecentQuestions || []);
  }, [fetchRecentQuestions]);

  // Handles changes into the option state variable
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // Handles the search for displaying a question, as per the user's search criteria
  const handleSearchQuestion = async () => {
    if (fetchRelatedQuestion && fetchRelatedQuestion[0]) {
      setSearchedQuestion(fetchRelatedQuestion[0].question);
    } else {
      setSearchedQuestion(NO_RESULT_FOUND);
    }
  };

  // Handles the validation and submission of a question
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

  // Handles the logic to display further details of a question when clicked
  const handleQuestionClick = (index: number) => {
    setSelectedQuestionIndex(index === selectedQuestionIndex ? null : index);
  };

  // Renders the UI for creating and searching questions
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4">
          <div className="recent-questions-container">
            <h2 className="mb-4">Recent Questions</h2>
            {recentQuestions.map((question, index) => (
              <div key={index} className="mb-4">
                <div
                  className="question-item border rounded p-3 shadow-sm"
                  onClick={() => handleQuestionClick(index)}
                >
                  <h3 className="mb-3" style={{ wordWrap: 'break-word' }}>
                    {question.question}
                  </h3>
                  {selectedQuestionIndex === index && (
                    <div>
                      <p className="mb-2">Options:</p>
                      <ul className="list-unstyled mb-3">
                        {question.options.map((option, optionIndex) => (
                          <li key={optionIndex}>{option}</li>
                        ))}
                      </ul>
                      <p className="mb-0">
                        Correct Answer: {question.correctAnswer}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-8">
          <div className="create-questions">
            <h2>Create Your Own Questions</h2>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Enter question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            {options.map((option, index) => (
              <input
                key={index}
                type="text"
                className="form-control mb-3"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
            ))}
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Enter correct answer"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
            />
            <button
              className="btn btn-primary mb-3"
              onClick={handleSubmit}
              disabled={!question || options.some((option) => !option)}
            >
              Submit
            </button>
          </div>
          <div className="recent-questions-container">
            <h2 className="mb-4">Search for a question that already exists</h2>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Enter text"
              value={enteredText}
              onChange={(e) => {
                setEnteredText(e.target.value);
                handleSearchQuestion();
              }}
            />

            <div
              className="question-item border rounded p-3 shadow-sm"
              onClick={() =>
                setSearchedQuestionClicked(!searchedQuestionClicked)
              }
            >
              <h3 className="mb-3" style={{ wordWrap: 'break-word' }}>
                {searchedQuestion}
              </h3>

              {searchedQuestionClicked && (
                <div>
                  {fetchRelatedQuestion &&
                    fetchRelatedQuestion[0] &&
                    searchedQuestion !== NO_RESULT_FOUND && (
                      <>
                        <p className="mb-2">Options:</p>
                        <ul className="list-unstyled mb-3">
                          {fetchRelatedQuestion[0].options.map(
                            (option, optionIndex) => (
                              <li key={optionIndex}>{option}</li>
                            )
                          )}
                        </ul>
                        <p className="mb-0">
                          Correct Answer:{' '}
                          {fetchRelatedQuestion[0].correctAnswer}
                        </p>
                      </>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuestions;
