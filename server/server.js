// server.js
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const cors = require("cors");

server.use(middlewares);
server.use(router);
server.use(
  cors({
    origin: true,
    credentials: true,
    preflightContinue: false,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  })
);
server.options("*", cors());
server.listen(9001, () => {
  console.log("JSON Server is running");
});