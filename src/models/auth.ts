/**
 * Module dependencies.
 */

import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

/**
 * Schema definitions.
 */

mongoose.model(
  "OAuthTokens",
  new Schema({
    accessToken: { type: String },
    accessTokenExpiresAt: { type: Date },
    client: { type: Object }, // `client` and `user` are required in multiple places, for example `getAccessToken()`
    clientId: { type: String },
    refreshToken: { type: String },
    refreshTokenExpiresAt: { type: Date },
    user: { type: Object },
    userId: { type: String }
  })
);

mongoose.model(
  "OAuthClients",
  new Schema({
    clientId: { type: String },
    clientSecret: { type: String },
    redirectUris: { type: Array }
  })
);

mongoose.model(
  "OAuthUsers",
  new Schema({
    email: { type: String, default: "" },
    firstname: { type: String },
    lastname: { type: String },
    password: { type: String },
    username: { type: String }
  })
);

const OAuthTokensModel = mongoose.model("OAuthTokens");
const OAuthClientsModel = mongoose.model("OAuthClients");
const OAuthUsersModel = mongoose.model("OAuthUsers");

export { OAuthTokensModel, OAuthClientsModel, OAuthUsersModel };
