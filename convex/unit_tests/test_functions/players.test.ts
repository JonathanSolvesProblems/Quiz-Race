import { getPlayerIDTest } from "./players";

describe('PlayerModule', () => {
  it('Checks if a valid player was queried', () => {
    expect(getPlayerIDTest).toStrictEqual(1);
  });
});