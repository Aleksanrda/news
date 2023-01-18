const db = require("../db/connection.js");

const addComment = (article_id, comment) => {
    const commentData = [
        comment.body,
        article_id,
        comment.username,
    ];

    const insertArticleComment = `
        INSERT INTO comments 
        (body, article_id, author) 
        VALUES ($1, $2, $3) RETURNING *;
        `;
    
    return db.query(insertArticleComment, commentData)
        .then((results) => {
            return results;
        })
};

module.exports = { addComment };