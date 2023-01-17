const db = require("../db/connection");

const fetchArticles = () => {
    const selectArticlesQuery = `
        SELECT A.author, A.title, A.article_id, A.topic, A.created_at,
        A.votes, A.article_img_url, COUNT(C.article_id) AS comment_count
        FROM articles A
        LEFT JOIN comments C
        ON C.article_id = A.article_id 
        GROUP BY A.article_id 
        ORDER BY A.created_at DESC;`;

    return db.query(selectArticlesQuery)
        .then((results) => {
            return results;
        });
};

module.exports = { fetchArticles }