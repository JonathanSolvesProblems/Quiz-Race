// import { httpAction } from './_generated/server';
// import { internal } from './_generated/api';

// export const sendMultiplayerQuestion = httpAction(async (ctx, request) => {
//   const { author, body } = await request.json();

//   await ctx.runMutation(internal.questionContents.sendOne, {
//     body: `Sent via HTTP action: ${body}`,
//     author,
//   });

//   return new Response(null, {
//     status: 200,
//   });
// });
