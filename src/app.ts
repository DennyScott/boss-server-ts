import * as express from "express";
import * as path from "path";
import * as logger from "morgan";
import * as bodyParser from "body-parser";
import routes from "./routes";
import * as http from "http";
import bearerToken from "express-bearer-token";
import { init } from "./socket";
import * as socket from "socket.io";
import { connectMongoose } from "./models";
import OAuthServer from "express-oauth-server";
import * as authModel from "./services/auth";

const app = express();
app.disable("x-powered-by");

// View engine setup
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");

app.use(
  logger("dev", {
    skip: () => app.get("env") === "test"
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(bearerToken());

//Mongoose Setup
connectMongoose();
let oauth = new OAuthServer({
  model: authModel,
  requireClientAuthentication: { password: false }
});

app.post("/oauth/authorize", oauth.authorize());
app.post("/oauth/token", oauth.token());
app.post("/login", oauth.token());

app.use("/secure", oauth.authenticate());

//Sockets
const server = http.createServer(app);
const io = socket(server);
init(io);
server.listen(4321);
console.log("server listening on 4321");

app.get("/", (req, res) => {
  res.render("index", { title: "Express Babel" });
});

app.post("/register", (req, res) => {
  const { username, password, email, firstname, lastname } = req.body;

  const user = authModel.registerUser(
    username,
    password,
    email,
    firstname,
    lastname
  );
  res.json(user);
});

// Routes
app.use("/v1", oauth.authenticate(), routes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  next(err);
});

export default app;
