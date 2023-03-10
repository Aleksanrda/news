const { addComment, fetchArticleComments, removeComment } = require("../models/comment.models.js");
const { getUser } = require("../models/user.models");
const { fetchArticleById } = require("../models/article.models");

const getArticleComments = (request, response, next) => {
    const { article_id } = request.params;

    Promise.all([fetchArticleComments(article_id), fetchArticleById(article_id)])
        .then(([comments]) => {            
            response.status(200).send({ comments });
        })
        .catch(next);
};

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

const deleteComment = (request, response, next) => {
    const { comment_id } = request.params;

    removeComment(comment_id)
        .then(() => {
            return response.status(204).send();
        })
        .catch(next);
}

module.exports = { getArticleComments, postArticleComment, deleteComment};