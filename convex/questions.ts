import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("questions").collect();
  },
});

export const createQuestion = mutation({
  args: { question: v.string(), options: v.array(v.string()), correctAnswer: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("questions", { question: args.question, options: args.options, correctAnswer: args.correctAnswer });  
  },
});

export const getRecentQuestions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("questions").order("desc").take(5);
  },
});

export const closestSimilarQuestion = query({
  args: { enteredText: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query("questions").withSearchIndex("search_question", (q) => q.search("question", args.enteredText)).take(1);
  },
});