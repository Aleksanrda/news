const { fetchUsers } = require("../models/user.models.js");

const getUsers = (request, response, next) => {
    fetchUsers()
        .then(({ rows: results}) => {
            response.status(200).send({ users: results });
        })
        .catch(next);
}

module.exports = { getUsers }