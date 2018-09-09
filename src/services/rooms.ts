import { RoomModel } from '../models/rooms';

/**
 * Create a new Room
 * 
 * @param {string} name Name of the room being created
 * @param {int} totalSize Max size of players that can join the room
 * @param {Object-User} player User Object of the user who created the room 
 */
const createRoom = (name, totalSize, player) => {
  const roomInstance = new RoomModel({
    name,
    totalSize,
    owner: player,
    players: [player],
    currentSize: 1
  });

  return roomInstance.save(err => {
    if (err)
      console.error(`Room Instace failed to save: ${err}`)
  });
}

/**
 * Get Room by given ID
 * 
 * @param {*} roomId Id to look room up by
 */
const getRoomById = (roomId) => {
  return RoomModel.findOne({ _id: roomId });
}

/**
 * Get all Rooms in the Database
 */
const getAllRooms = () => {
  return RoomModel.find({})
    .then(rooms => rooms);
}

/**
 * Join a room specified by the room id.
 * 
 * @param {oid} roomId Room for player to join
 * @param {Object} player Player to join given room
 */
const joinRoom = async (roomId, player) => {
  let room = await RoomModel.findById(roomId);

  room.players = [...room.players, player];
  room.currentSize += 1;

  return room.save(err => {
    if (err)
      console.error(`Room instance failed to update: ${err}`);
  });
}

/**
 * Leave a given room.
 * 
 * @param {oid} roomId Room for player to leave
 * @param {Object} player Player to leave room of
 */
const leaveRoom = async (roomId, player) => {
  let room = await RoomModel.findById(roomId);

  room.players = room.players.filter(e => e._id != player._id);
  room.currentSize -= 1;

  return room.save(err => {
    if(err)
      console.error(`Could not leave room ${err}`);
  });
}

export { createRoom, getRoomById, joinRoom, leaveRoom, getAllRooms }
