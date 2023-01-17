const db = require("../db/connection");

const fetchArticleById = (article_id) => {
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