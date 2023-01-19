const db = require("../db/connection");

const fetchArticles = () => {
    const selectArticlesQuery = `
        SELECT a.author, a.title, a.article_id, a.topic, a.created_at,
        a.votes, a.article_img_url, COUNT(c.article_id) AS comment_count
        FROM articles a
        LEFT JOIN comments c
        ON c.article_id = a.article_id 
        GROUP BY a.article_id 
        ORDER BY a.created_at DESC;`;

    return db.query(selectArticlesQuery)
        .then((results) => {
            return results;
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