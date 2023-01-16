const { fetchTopics } = require("../models/topic.models.js");

const getTopics = (request, response) => {
    fetchTopics()
        .then(({ rows: results}) => {
            response.status(200).send({ topics: results });
        })
}

module.exports = { getTopics };