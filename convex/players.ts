import { query } from "./_generated/server";
import { GameStatus } from "./common";

// Retrieves the player ID in an active room
export const getPlayerID = query({
  handler: async (ctx) => {
    const room = await ctx.db.query("rooms").filter((q) => q.and(q.eq(q.field("player2Ready"), false), q.eq(q.field("status"), GameStatus.InProgress))).first();
    
    if (room) {
      return room.playerID;
    }
  }
})

