const { fetchArticleById } = require("../models/article.models"); 

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

module.exports = { getArticleById }