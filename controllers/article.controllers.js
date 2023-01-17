const { fetchArticleById } = require("../models/article.models"); 

const getArticleById = (request, response, next) => {
    const { article_id } = request.params;
    console.log(article_id);
    fetchArticleById(article_id)
        .then(({ rows: results }) => {
            response.status(200).send({ articles: results });
        })
        .catch((err) => {
            next(err);
        });
};

module.exports = { getArticleById }