const db = require("../db/connection.js");

const getUser = (username) => {
    if (typeof username !== "string") {
        return Promise.reject({
            status: 400,
            msg: `Username ${username} should have a string type.`
        });
    }

    const selectUser = `
    SELECT * 
    FROM users 
    WHERE username = $1;
    `;

    return db.query(selectUser, [username])
        .then(({ rowCount, rows }) => {
            if (rowCount === 0) {
                return Promise.reject({
                    status: 404,
                    msg: `Username ${username} does not exist`,
                });
            } else {
                return rows[0];
            }
        })
};

module.exports = { getUser };