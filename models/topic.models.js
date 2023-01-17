const db = require("../db/connection");

const fetchTopics = () => {
    const selectTopicsQuery = `SELECT * 
    FROM topics;`

    return db.query(selectTopicsQuery)
        .then((results) => {
            return results;
        })
};

module.exports = { fetchTopics };