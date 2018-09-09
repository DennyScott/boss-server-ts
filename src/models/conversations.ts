import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

export type ConversationModel = mongoose.Document & {
  users: [
    {
      firstname: string;
      lastname: string;
      username: string;
      email: string;
      _id: string;
      unreadMessages: Number;
    }
  ];
  messages: [
    {
      content: string;
      createdAt: Date;
      createdBy: {
        firstname: string;
        lastname: string;
        username: string;
        email: string;
      };
    }
  ];
  createdAt: Date;
};

const ConversationSchema = new Schema({
  roomId: { type: Schema.Types.ObjectId, required: true },
  users: [
    {
      firstname: String,
      lastname: String,
      username: String,
      email: String,
      _id: Schema.Types.ObjectId,
      unreadMessages: Number
    }
  ],
  messages: [
    {
      content: String,
      createdAt: { type: Date, default: Date.now },
      createdBy: {
        firstname: String,
        lastname: String,
        username: String,
        _id: Schema.Types.ObjectId,
        email: String
      }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});
const Conversation = mongoose.model("ConversationModel", ConversationSchema);

export default Conversation;
