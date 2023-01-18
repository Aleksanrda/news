const { addComment } = require("../models/comment.models.js");
const { getUser } = require("../models/user.models");
const { fetchArticleById } = require("../models/article.models");

const postArticleComment = (request, response, next) => {
    const { article_id } = request.params;
    const comment = request.body;

    fetchArticleById(article_id)
        .then(() => {
            return getUser(comment.username);
        })
        .then(() => {
            return addComment(article_id, comment);
        })
        .then((comment) => {
            return response.status(201).send({ comment });
        })
        .catch(next);
};

module.exports = { postArticleComment };