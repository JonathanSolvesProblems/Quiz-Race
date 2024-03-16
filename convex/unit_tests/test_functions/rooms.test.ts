import { getRoomsTest, getWaitingRoomTest, getRoomTest, getGameReadyTest, checkIfPlayerInSameRoomTest} from "./rooms";

describe('Room Query Tests', () => {
  it('Checks rooms were successfully queried', () => {
    expect(getRoomsTest).toBeGreaterThan(0);
  });

  it('Checks waiting room successfully queried', () => {
    expect(getWaitingRoomTest).toStrictEqual(1);
  });

  it('Checks room successfully queried', () => {
    expect(getRoomTest).toStrictEqual(1);
  });
  
  it('Checks room with game ready state successfully queried', () => {
    expect(getGameReadyTest).toStrictEqual(1);
  });

  it('Checks player in same room successfully queried', () => {
    expect(checkIfPlayerInSameRoomTest).toStrictEqual(1);
  });
});
