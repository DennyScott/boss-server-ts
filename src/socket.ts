import { getUserFromAuthToken } from './services/users';
import * as authModel from './services/auth';
import OAuth2Server from'oauth2-server';
import { 
  getConversationById, 
  getConversationsByUserId, 
  sendMessage,
  createConversation
} from './services/conversations';


const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;

const init = (io) => {
  io.use((socket, next) => {
    let token = socket.handshake.query.token;
    const oauth = new OAuth2Server({
      model: authModel,
      requireClientAuthentication: { password: false}
    });

    let request = new Request({
      method: 'GET',
      query: {},
      headers: {Authorization: `Bearer ${token}`}
    });

    let response = new Response({
      headers: {},
    });

    oauth.authenticate(request, response)
      .then(token => {
        const {firstname, lastname, email, username, _id} = token.user;
        socket.user = {
          firstname,
          lastname,
          email,
          username,
          _id
        };
        return next();
      })
      .catch(err => next(new Error("Socket was not authenticated")));
  });
  
  io.on('connection', socket => {

    socket.on('joinChats', data => {
      getConversationsByUserId(socket.user, data.roomId)
        .then(conversations => {
          conversations.forEach(conversation => {
            socket.join(conversation._id);
          });
        });
    });

    socket.on("leaveChats", data => {
      getConversationsByUserId(socket.user, data.roomId)
        .then(conversations => {
          conversations.forEach(conversation => {
            socket.leave(conversation._id);
          });
        });
    });

    /** 
     * Create Conversation
     * 
     * {
     *   data.users: List of users to create conversation with,
     *   data.roomId: Room Id to create the conversation to
     * }
     * 
     **/
    socket.on('createConversation', data => {
      createConversation(data.users, data.roomId)
        .then(conversation => {
          findSockets(conversation.users.map(user => user._id))
            .forEach(socket => {
              socket.emit("conversationCreated", conversation);
              socket.join(conversation._id);
            })
        })
    });

    socket.on('sendMessage', data => { 
      sendMessage(data.conversationId, data.user, data.message)
        .then(conversation => {
          socket.to(conversation._id).emit('receiveMessage', conversation);
        });
    });

    socket.on('joinGameState', data => {
      
    })
  });
}

function findSockets(userIdsToFind) {
  return io.sockets.filter(socket => {
    return userIdsToFind.includes(userId => socket.user._id === userId);
  });
}

export {init};
