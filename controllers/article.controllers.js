const { fetchArticles } = require("../models/article.models.js");

const getArticles = (request, response, next) => {
    fetchArticles()
        .then(({ rows: results}) => {
            response.status(200).send({ articles: results });
        })
        .catch((err) => {
            next(err);
        });
}

module.exports = { getArticles };