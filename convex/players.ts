import { query } from "./_generated/server";

export const getPlayerID = query({
  handler: async (ctx) => {
    const room = await ctx.db.query("rooms").filter((q) => q.eq(q.field("player2Ready"), true)).first();
  
    if (room) {
      return room.playerID;
    }
  }
})