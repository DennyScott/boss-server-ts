import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

const gamestateSchema = new Schema({
  availableRoles: [{ role: String }],
  players: [
    {
      id: Schema.Types.ObjectId,
      name: String,
      isAlive: Boolean,
      avatar: String,
      role: String,
      skills: [
        {
          name: String,
          isAvailable: Boolean,
          triggerPhase: String,
          targetId: Schema.Types.ObjectId
        }
      ]
    }
  ],
  currentPhase: {
    current: { type: String, default: "Day" },
    number: { type: String, default: "1" }
  },
  roomId: Schema.Types.ObjectId
});

const GameStateModel = mongoose.model("GameStateModel", gamestateSchema);
export { GameStateModel };
