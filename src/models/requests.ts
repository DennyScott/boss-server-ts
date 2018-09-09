import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

const RequestSchema = new Schema({
  type: String,
  name: String,
  requestedBy: String,
  skillAvatar: String,
  avatar: String,
  isNew: Boolean,
  to: Schema.Types.ObjectId,
  from: Schema.Types.ObjectId,
  roomId: Schema.Types.ObjectId
});

const RequestModel = monogoose.model("RequestModel", RequestSchema);

export { RequestModel };
