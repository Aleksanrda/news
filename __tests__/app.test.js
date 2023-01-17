const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const app = require("../app");
const testData = require("../db/data/test-data/index.js");
const request = require("supertest");

beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    if (db.end) {
        db.end();
    }
});

describe('API', () => {
    describe('/api/topics', () => {
        test('Status 200 - api point exists and responds', () => {
            return request(app).get("/api/topics").expect(200);
        });
        test('Status 200 - returns back an object and has a property called topics', () => {
            return request(app)
                .get("/api/topics")
                .expect(200)
                .then(({ body }) => {
                    expect(body).toBeInstanceOf(Object);
                    expect(body).toHaveProperty("topics");
                    expect(body.topics).toBeInstanceOf(Array);
                });
        });
        test('Status 200 - returns back an array of objects with the correct keys', () => {
            return request(app)
                .get("/api/topics")
                .expect(200)
                .then(({ body }) => {
                    expect(body.topics).toHaveLength(testData.topicData.length);
                    
                    body.topics.forEach((topic) => {
                        expect(topic).toHaveProperty("slug", expect.any(String));
                        expect(topic).toHaveProperty("description", expect.any(String));
                    });
                });
        });
        test('Status 200 - returns back an array of objects from DB', () => {
            return request(app)
                .get("/api/topics")
                .expect(200)
                .then(({ body }) => {
                    topTopic = body.topics[0];
                
                    expect(topTopic.slug).toBe("mitch");
                    expect(topTopic.description).toBe("The man, the Mitch, the legend");
            });
        });
        test('Status 404 - returns back error Path not found', () => {
            return request(app)
                .get("/api/topicss")
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("Path not found");
                });
        });
    });
});