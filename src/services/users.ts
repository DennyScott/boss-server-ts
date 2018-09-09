import { OAuthTokensModel, OAuthUsersModel } from '../models/auth';

const getUserFromAuthToken = authToken => {
  //Get userId here, then look up value in users model. Only return needed data (not password)
  return OAuthTokensModel.findOne({accessToken: authToken}).then(res => {
    return parseUser(res.user);
  });
}

const getUsersById = (userIds) => {
  return OAuthUsersModel.find({_id: { $in: userIds }})
    .then(users => users.map(user => parseUser(user)));
}

function parseUser(user) {
  const {firstname, lastname, username, email, _id} = user;
  return {
    firstname,
    lastname,
    username,
    email,
    _id
  }
}

export { getUserFromAuthToken, getUsersById }
