const db = require("../db/connection.js");

const fetchArticleComments = (article_id) => {
    if(!parseInt(article_id)) {
        return Promise.reject({ 
            status: 400,
            msg: `You passed ${article_id}. Article id should be a number.`});
    }

    const selectArticleCommentsQuery = `
    SELECT * FROM comments 
    WHERE comments.article_id = $1;`;

    return db.query(selectArticleCommentsQuery, [article_id])
        .then((results) => {
            console.log(results);
            return results;
        })
}

module.exports = { fetchArticleComments };