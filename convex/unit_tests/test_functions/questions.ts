import { get, getRecentQuestions, closestSimilarQuestion } from "../../questions";

export const getQuestionsTest = () => {
  const result = get;

  return result.length;
};

export const getRecentQuestionsTest = () => {
  const result = getRecentQuestions;

  return result.length; // 5
};

export const closestSimilarQuestionTest = () => {
  const result = closestSimilarQuestion;

  return result.length; // 1
};