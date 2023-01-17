const { fetchArticleComments } = require("../models/comment.models.js");

const getArticleComments = (request, response, next) => {
    const { article_id } = request.params;

    fetchArticleComments(article_id)
        .then(({ rows: results, rowCount}) => {
            if (rowCount === 0) {
                console.log("404 error");
                return Promise.reject({ status: 404, msg: `Comment for article with id ${article_id} Not Found` });
            }
            
            response.status(200).send({ comments: results });
        })
        .catch((err) => {
            console.log("404 error");
            next(err);
        })
};

module.exports = { getArticleComments };