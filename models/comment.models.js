const db = require("../db/connection.js");

const fetchArticleComments = (article_id) => {
    if(!parseInt(article_id)) {
        return Promise.reject({ 
            status: 400,
            msg: `You passed ${article_id}. Article id should be a number.`});
    }

    const selectArticleCommentsQuery = `
    SELECT * FROM comments 
    WHERE comments.article_id = $1 
    ORDER BY created_at desc;`;

    return db.query(selectArticleCommentsQuery, [article_id])
        .then(({ rows }) => {
            return rows;
        })
}

module.exports = { fetchArticleComments };