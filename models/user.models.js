const db = require("../db/connection.js");

const fetchUsers = () => {
    const selectUsers = `SELECT * FROM users;`

    return db.query(selectUsers)
        .then((results) => {
            return results;
        });
};

module.exports = { fetchUsers };
