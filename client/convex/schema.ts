import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  questions: defineTable({
    question: v.string(),
    options: v.array(v.string()),
    correctAnswer: v.string()
  }).searchIndex("search_question", {
    searchField: "question",
  }),

  rooms: defineTable({
    status: v.string(),
    player1_score: v.number(),
    player2_score: v.number(),
    capacity:  v.number(),
    questions: v.array(v.string()),
    options: v.array(v.array(v.string())),
    correctAnswers: v.array(v.string()),
    player1Ready: v.boolean(),
    player2Ready: v.boolean()
  }),
})