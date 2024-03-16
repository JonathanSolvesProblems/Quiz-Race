import { getQuestionsTest, getRecentQuestionsTest, closestSimilarQuestionTest } from "./questions";

describe('Question Query Tests', () => {
  it('Checks if questions were successfully queried', () => {
    expect(getQuestionsTest).toBeGreaterThan(0);
  });

  it('Checks if five valid recent questions were queried', () => {
    expect(getRecentQuestionsTest).toStrictEqual(5);
  });

  it('Tests the search query to ensure a similar question is returned, based on search criteria', () => {
    expect(closestSimilarQuestionTest).toStrictEqual(5);
  });
});