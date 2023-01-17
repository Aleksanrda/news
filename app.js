const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topic.controllers.js");

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
    if (err.status === 400) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err);
    }
})

app.use((req, res, next) => {
    res.status(404).send({ msg: "Path not found" });
});

app.use((err, req, res, next) => {
    res.status(500).send({ msg: "Internal Server Error! Contact Admins!"})
})

module.exports = app;