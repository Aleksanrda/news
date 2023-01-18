const { fetchArticleComments } = require("../models/comment.models.js");
const { fetchArticleById } = require("../models/article.models.js");

const getArticleComments = (request, response, next) => {
    const { article_id } = request.params;

    Promise.all([fetchArticleComments(article_id), fetchArticleById(article_id)])
        .then(([comments]) => {            
            response.status(200).send({ comments });
        })
        .catch(next);
};

module.exports = { getArticleComments };