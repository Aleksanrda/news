const { fetchTopics } = require("../models/topic.models.js");

const getTopics = (request, response) => {
    fetchTopics()
        .then(({ rows: results}) => {
            response.status(200).send({ topics: results });
        })
        .catch((err) => {
            next(err);
        });
}

module.exports = { getTopics };