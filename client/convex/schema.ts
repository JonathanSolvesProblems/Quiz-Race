import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  questions: defineTable({
    question: v.string(),
    options: v.array(v.string()),
    correctAnswer: v.string()
  }),
})