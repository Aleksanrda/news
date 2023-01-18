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

const fetchArticleById = (article_id) => {
    const selectArticleById = `
        SELECT * 
        FROM articles 
        WHERE article_id = $1;
        `;

    return db.query(selectArticleById, [article_id])
        .then(({ rowCount, rows }) => {
            if (rowCount === 0) {
                return Promise.reject({ 
                    status: 404, 
                    msg: `Comment for article with id ${article_id} Not Found`});
            } else {
                return rows[0];
            }
        });
};

module.exports = { fetchArticles, fetchArticleById };