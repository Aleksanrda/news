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
        SELECT a.author, a.title, a.article_id, a.topic, a.created_at,
        a.votes, a.article_img_url, COUNT(c.article_id) AS comment_count
        FROM articles a
        LEFT JOIN comments c
        ON c.article_id = a.article_id`;

    if (topic) {
        selectArticlesQuery += ` WHERE a.topic = '${topic}'`;
    }

    selectArticlesQuery += ` GROUP BY a.article_id ORDER BY a.${sortOption} ${currentOrder};`;

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
        SELECT a.*,  COUNT(C.article_id) AS comment_count 
        FROM articles a 
        LEFT JOIN comments c 
        ON c.article_id = a.article_id 
        WHERE a.article_id = $1 
        GROUP BY a.article_id;
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


const updateVotesProperty = (article_id, articleBody) => {
    if (!parseInt(article_id)) {
        return Promise.reject({ 
            status: 400,
            msg: `You passed ${article_id}. Article id should be a number.` });
    }

    if (!articleBody.inc_votes) {
        return Promise.reject({
            status: 400,
            msg: "Bad request!",
        });
    }

    if (typeof articleBody.inc_votes !== "number") {
        return Promise.reject({
            status: 400,
            msg: `inc_votes ${articleBody.inc_votes} property should have a number type`
        });
    }

    const setNewVotes = `
        UPDATE articles 
        SET votes = votes + $1 
        WHERE article_id = $2 
        RETURNING *;
    `;

    return db.query(setNewVotes, [articleBody.inc_votes, article_id])
        .then(({ rowCount, rows }) => {
            if (rowCount === 0) {
                return Promise.reject({
                    status: 404,
                    msg: `Article with id ${article_id} Not Found`,
                });
            } else {
                return rows[0];
            }
        })
}

module.exports = { fetchArticles, fetchArticleById, updateVotesProperty };