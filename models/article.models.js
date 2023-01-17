const db = require("../db/connection");

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
      .then((results) => {
        return results;
      });
  };

module.exports = { fetchArticleById };