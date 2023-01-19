const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topic.controllers.js");
const { getArticles, getArticleById, patchArticle} = require("./controllers/article.controllers.js");
const { getArticleComments, postArticleComment } = require("./controllers/comment.controllers.js");
const { getUsers } = require("./controllers/user.controllers.js");
const { getEndpoints } = require("./controllers/endpoint.controllers.js");

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getArticleComments);
app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", postArticleComment);

app.patch("/api/articles/:article_id", patchArticle);



app.use((req, res, next) => {
    res.status(404).send({ msg: "Path not found" });
});

app.use((err, req, res, next) => {
    if (err.status === 404) {
        res.status(404).send({ msg: err.msg });
    } else {
        next(err);
    }
});

app.use((err, req, res, next) => {
    if (err.status === 400) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err);
    }
})

app.use((err, req, res, next) => {
    res.status(500).send({ msg: "Internal Server Error! Contact Admins!"})
});

module.exports = app;