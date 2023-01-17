const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const app = require("../app");
const testData = require("../db/data/test-data/index.js");
const request = require("supertest");
const jestSorted = require("jest-sorted");

beforeEach(() => {
    return seed(testData);
});

afterAll(() => {
    if (db.end) {
        db.end();
    }
});

describe('API', () => {
    describe('/API/TOPICS', () => {
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
    
    describe('/API/ARTICLES', () => {
        test('Status 200 - api point exists and responds', () => {
            return request(app).get("/api/articles").expect(200);
        });
        test('Status 200 - returns back an object and has a property called articles', () => {
            return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({ body }) => {
                    expect(body).toBeInstanceOf(Object);
                    expect(body).toHaveProperty("articles");
                    expect(body.articles).toBeInstanceOf(Array);
                });
        });
        test('Status 200 - returns back an array of objects with the correct keys', () => {
            return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toHaveLength(testData.articleData.length);
    
                    body.articles.forEach((article) => {
                        expect(article).toHaveProperty("article_id", expect.any(Number));
                        expect(article).toHaveProperty("author", expect.any(String));
                        expect(article).toHaveProperty("title", expect.any(String));
                        expect(article).toHaveProperty("topic", expect.any(String));
                        expect(article).toHaveProperty("created_at", expect.any(String));
                        expect(article).toHaveProperty("votes", expect.any(Number));
                        expect(article).toHaveProperty("article_img_url", expect.any(String));
                        expect(article).toHaveProperty("comment_count", expect.anything(Number));
                    });
                });
        });
        test('Status 200 - returns back an array of objects sorted by date in descending order', () => {
            return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toBeSortedBy("created_at", { descending: true });
                })
        });
        test('Status 404 - returns back error Path not found', () => {
            return request(app)
                .get("/api/articless")
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("Path not found");
                });
        });
    });

    describe('/API/ARTICLES/:ARTICLE_ID/COMMENTS', () => {
        test('Status 200 - api point exists and responds', () => {
            return request(app).get("/api/articles/1/comments").expect(200);
        });
        test('Status 200 - returns back an object and has a property called comments', () => {
            return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({ body }) => {
                    expect(body).toBeInstanceOf(Object);
                    expect(body).toHaveProperty("comments");
                    expect(body.comments).toBeInstanceOf(Array);
                });
        });
        test('Status 200 - returns back an array of objects with the correct keys', () => {
            return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({ body }) => {
                    const { comments } = body;

                    expect(comments).toHaveLength(11);
                    
                    comments.forEach( comment => {
                        expect(comment).toEqual(
                            expect.objectContaining({
                                comment_id: comment.comment_id,
                                body: comment.body,
                                article_id: comment.article_id,
                                author: comment.author,
                                votes: comment.votes,
                                created_at: comment.created_at,
                            })
                        )
                    });
                });
        });
        test('Status 200 - returns back an array of comments from DB', () => {
            const expectedTopComment = {
                comment_id: 2,
                body: 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
                article_id: 1,
                author: 'butter_bridge',
                votes: 14,
                created_at: "2020-10-31T03:03:00.000Z"
              };

            return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({ body }) => {
                    const topBody = body.comments[0];

                    expect(topBody).toEqual(expectedTopComment);
                });
        });
        test('Status 404 - returns back an error Comment for article with id 1000 Not Found', () => {
            return request(app)
                .get("/api/articles/1000/comments")
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("Comment for article with id 1000 Not Found");
                });
        });
        test('Status 400 - returns back an error Invalid input', () => {
            return request(app)
            .get("/api/articles/notAnId/comments")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("You passed notAnId. Article id should be a number.");
            })
        });
    });
});
