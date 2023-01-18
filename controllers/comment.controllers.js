const { addComment } = require("../models/comment.models.js");

const postArticleComment = (request, response, next) => {
    const { article_id } = request.params;
    const comment = request.body;

    addComment(article_id, comment)
        .then(({ rows: results}) => {
            return response.status(201).send({ comment: results});
        })
        .catch((err) => {
            next(err);
        });
};

module.exports = { postArticleComment };