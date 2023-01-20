const fs = require("fs/promises");

const fetchEndpoints = () => {
    return fs
        .readFile(__dirname + `/../endpoints.json`, "utf-8")
        .then((results) => {
            return JSON.parse(results);
        });
};

module.exports = { fetchEndpoints };