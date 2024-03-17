import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Contains all questions in the database
  questions: defineTable({
    // Structure of a question
    question: v.string(), // Contains the question text itself
    options: v.array(v.string()), // An array of options associated with the question
    correctAnswer: v.string() // The correct answer of the question
  }).searchIndex("search_question", { // A search index that searches by the question text
    searchField: "question",
  }),
  // Contains all players in the database
  players: defineTable({
    name: v.string(), // Name of the player
  }),
  // Contains all multiplayer rooms in the database
  rooms: defineTable({
    status: v.string(), // Status of the game state in the room
    player1_score: v.number(), // score of player 1
    player2_score: v.number(), // score of player 2
    capacity:  v.number(), // number of players in the room
    questions: v.array(v.string()), // questions in the room
    options: v.array(v.array(v.string())), // associative options per questions in room
    correctAnswers: v.array(v.string()), // associative correct answer per question in room
    player1Ready: v.boolean(), // state to check readiness of player 1
    player2Ready: v.boolean(), // state to check readiness of player 2
    playerID: v.id("players"), // ID of player whom created the room
  }),
})