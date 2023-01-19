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

const addComment = (article_id, comment) => {
    if (!comment.body) {
        return Promise.reject({ 
            status: 400, 
            msg: "Bad request!" 
        });
    }
    if(typeof comment.body !== "string") {
        return Promise.reject({
            status: 400,
            msg: `Body of comment ${comment.body} should have a string type`,
        })
    }

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
        .then(({ rows }) => {
            return rows;
        })
};

const removeComment = (comment_id) => {
    if (!parseInt(comment_id)) {
        return Promise.reject({ 
            status: 400,
            msg: `You passed ${comment_id}. Comment id should be a number.` });
    }

    const removeComment = `
        DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *;
        `;

        return db.query(removeComment, [comment_id])
        .then(({ rowCount }) => {
            if (rowCount === 0) {
                return Promise.reject({ 
                    status: 404, 
                    msg: `Comment with id ${comment_id} does not exist in DB`});
            }

            return;
        });

}

module.exports = { fetchArticleComments, addComment, removeComment };