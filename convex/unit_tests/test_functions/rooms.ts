import { getRooms, getWaitingRoom, getRoom, getGameReady, checkIfPlayerInSameRoom } from "../../rooms";

export const getRoomsTest = () => {
  const resultFound = getRooms;

  return resultFound.length > 0;
}

export const getWaitingRoomTest = () => {
  const resultFound = getWaitingRoom;

  return resultFound.length;
};

export const getRoomTest = () => {
  const resultFound = getRoom;

  return resultFound.length;
};

export const getGameReadyTest = () => {
  const resultFound = getGameReady;

  return resultFound.length; 
};

export const checkIfPlayerInSameRoomTest = () => {
  const resultFound = checkIfPlayerInSameRoom;

  return resultFound.length; 
};
