const express = require("express");

const projectRouter = require("./api/projectRouter");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
    res.status(200).json(req.query);
});

server.use("/api/project", projectRouter);

module.exports = server;