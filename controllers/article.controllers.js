const { fetchArticles, fetchArticleById } = require("../models/article.models"); 

const getArticles = (request, response, next) => {
    const { topic, sort_by, order } = request.query;

    fetchArticles(topic, sort_by, order)
        .then((articles) => {
            response.status(200).send({ articles });
        })
        .catch((err) => {
            next(err);
        });
}

const getArticleById = (request, response, next) => {
    const { article_id } = request.params;

    fetchArticleById(article_id)
        .then((article) => {
            response.status(200).send({ article });
        })
        .catch(next);
};

module.exports = { getArticles, getArticleById }