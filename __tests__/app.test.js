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
                    const topTopic = body.topics[0];
                
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
    describe('/API/ARTICLES/:ARTTICLE_ID', () => {
        test('Status 200 - api point exists and responds', () => {
            return request(app).get("/api/articles/1").expect(200);
        });
        test('Status 200 - returns back an object and has a property called articles', () => {
            return request(app)
                .get("/api/articles/1")
                .expect(200)
                .then(( { body }) => {
                    expect(body).toBeInstanceOf(Object);
                    expect(body).toHaveProperty("articles");
                    expect(body.articles).toBeInstanceOf(Array);
                })
        });
        test('Status 200 - returns back an array of objects with length = 1 and correct keys', () => {
            return request(app)
                .get("/api/articles/1")
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toHaveLength(1);
                    
                    const article = body.articles[0];
                                       
                    expect(article).toHaveProperty("article_id", expect.any(Number));
                    expect(article).toHaveProperty("title", expect.any(String));
                    expect(article).toHaveProperty("topic", expect.any(String));
                    expect(article).toHaveProperty("author", expect.any(String));
                    expect(article).toHaveProperty("body", expect.any(String));
                    expect(article).toHaveProperty("created_at", expect.any(String));
                    expect(article).toHaveProperty("votes", expect.any(Number));
                    expect(article).toHaveProperty("article_img_url", expect.any(String));
                });
        });
        test('Status 200 - returns back existing article with index 1', () => {
            return request(app)
                .get("/api/articles/1")
                .expect(200)
                .then(({ body }) => {
                    console.log(body);
                    const article = body.articles[0];

                    console.log(article);

                    expect(article.article_id).toBe(1);
                    expect(article.title).toBe("Living in the shadow of a great man");
                    expect(article.topic).toBe("mitch");
                    expect(article.author).toBe("butter_bridge");
                    expect(article.body).toBe("I find this existence challenging");
                    expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
                    expect(article.votes).toBe(100);
                    expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
                })
        });
        test('Status 404 - returns back an error Article Not Found', () => {
            return request(app)
                .get("/api/articles/1000")
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("Article with id 1000 Not Found");
                })
        });
        test('Status 400 - returns back an error Invalid input', () => {
            return request(app)
                .get("/api/articles/notAnId")
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("You passed notAnId. Article id should be a number.");
                })
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
                comment_id: 5,
                body: 'I hate streaming noses',
                article_id: 1,
                author: 'icellusedkars',
                votes: 0,
                created_at: "2020-11-03T21:00:00.000Z"
              };

            return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({ body }) => {
                    const topBody = body.comments[0];

                    expect(topBody).toEqual(expectedTopComment);
                });
        });
        test('Status 200 - returns back an array of sorted comments in descending order', () => {
            return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({ body }) => {
                    expect(body.comments).toBeSortedBy("created_at", { descending: true });
                });
        });
        test('Status 200 - returns back an empty array of comments when article does not have any comments', () => {
            return request(app)
                .get("/api/articles/4/comments")
                .expect(200)
                .then(({ body }) => {
                    expect(body.comments).toEqual([]);
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