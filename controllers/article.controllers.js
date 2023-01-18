const { fetchArticles, fetchArticleById } = require("../models/article.models"); 

const getArticles = (request, response, next) => {
    fetchArticles()
        .then(({ rows: results}) => {
            response.status(200).send({ articles: results });
        })
        .catch((err) => {
            next(err);
        });
}

const getArticleById = (request, response, next) => {
    const { article_id } = request.params;

    fetchArticleById(article_id)
        .then(({ rows: results, rowCount }) => {
            if (rowCount === 0) {
                return Promise.reject({ status: 404, msg: `Article with id ${article_id} Not Found` });
            }
            
            response.status(200).send({ articles: results });
        })
        .catch((err) => {
            next(err);
        });
};

module.exports = { getArticles, getArticleById }