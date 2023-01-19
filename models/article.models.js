const db = require("../db/connection");

const fetchArticles = (topic, sort_by, order) => {
    const sortOption = sort_by ? sort_by : "created_at"
    const currentOrder = order ? order : "desc";

    const availableSortOptions = ['article_id', 'title', 'topic', 'author', 'body', 'created_at', 'votes', 'article_img_url'];
    if (!availableSortOptions.includes(sortOption)) {
        return Promise.reject({ status: 400, msg: 'Invalid sort query' });
    }
      
    if (!['asc', 'desc'].includes(currentOrder)) {
        return Promise.reject({ status: 400, msg: 'Invalid order query' });
    }

    let selectArticlesQuery = `
        SELECT A.author, A.title, A.article_id, A.topic, A.created_at,
        A.votes, A.article_img_url, COUNT(C.article_id) AS comment_count
        FROM articles A
        LEFT JOIN comments C
        ON C.article_id = A.article_id`;

    if (topic) {
        selectArticlesQuery += ` WHERE A.topic = '${topic}'`;
    }

    selectArticlesQuery += ` GROUP BY A.article_id ORDER BY A.${sortOption} ${currentOrder};`;

    return db.query(selectArticlesQuery)
        .then(({ rowCount, rows }) => {
            if (rowCount === 0) {
                return Promise.reject({ 
                    status: 404, 
                    msg: `Articles were Not Found`});
            } else {
                return rows;
            }
        });
};

const fetchArticleById = (article_id) => {
    if (!parseInt(article_id)) {
        return Promise.reject({ 
            status: 400,
            msg: `You passed ${article_id}. Article id should be a number.` });
    }

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
                msg: `Article with id ${article_id} Not Found`});
        } else {
            return rows[0];
        }
    });
};

module.exports = { fetchArticles, fetchArticleById };