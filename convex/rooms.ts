import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { GameStatus } from "./common";

// Retrieves all rooms
export const getRooms = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("rooms").collect();
  },
});

// Retrieves a room in the waiting state if exists
export const getWaitingRoom = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("rooms").filter((q) => q.eq(q.field("capacity"), 1)).first();
  },
});

// Retrives a specific room by ID
export const getRoom = query({
  args: { id: v.id("rooms") },
  handler: async (ctx, args) => {
    return await ctx.db.query("rooms").filter((q) => q.eq(q.field("_id"), args.id)).first();
  },
});

// Retrieves a room with a game state of ready
export const getGameReady = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("rooms")
      .filter((q) =>
        q.and(
          q.eq(q.field("player1Ready"), true),
          q.eq(q.field("player2Ready"), true),
          q.eq(q.field("status"), GameStatus.WaitingForPlayers)
        )
      )
      .first();
  },
});

// Retrieves a room with a player in the same same room as the playing client
export const checkIfPlayerInSameRoom = mutation({
  args: { id: v.id("players") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("rooms")
      .filter((q) =>
        q.and(
          q.eq(q.field("playerID"), args.id),
          q.eq(q.field("player2Ready"), true),
        )
      )
      .first();
  },
});

// Creates a new room and connected with the player who created it
export const createRoom = mutation({
  args: { player1_score: v.number(), player2_score: v.number(), questions: v.array(v.string()), options: v.array(v.array(v.string())), correctAnswers: v.array(v.string()), username: v.string() },
  handler: async (ctx, args) => {
    const player_id = await ctx.db.insert("players", { name: args.username });
    
    return await ctx.db.insert("rooms", { status: GameStatus.WaitingForPlayers, player1_score: args.player1_score, player2_score: args.player2_score, capacity: 1, questions: args.questions, options: args.options, correctAnswers: args.correctAnswers, player1Ready: true, player2Ready: false, playerID: player_id });  
  },
});

// Updates the capacity of the room, as the second player joins
export const updateRoomCapacity = mutation({
  args: { id: v.id("rooms")},
  handler: async (ctx, args) => {
    const { id } = args;
    
    await ctx.db.patch(id, {capacity: 2, status: GameStatus.InProgress, player2Ready: true});
    const updatedRoom = await ctx.db.get(id);
    return updatedRoom;
  },
})