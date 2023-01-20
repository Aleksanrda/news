const { fetchEndpoints } = require("../models/endpoint.models.js");

const getEndpoints = (request, response, next) => {
    fetchEndpoints()
        .then((endpoints) => {
            response.status(200).send({ endpoints });
        })
        .catch(next);
};

module.exports = { getEndpoints };