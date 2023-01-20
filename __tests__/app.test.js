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
    
    describe('/API/ARTICLES/:ARTTICLE_ID', () => {
        test('Status 200 - api point exists and responds', () => {
            return request(app).get("/api/articles/1").expect(200);
        });
        test('Status 200 - returns back an object and has a property called article', () => {
            return request(app)
                .get("/api/articles/1")
                .expect(200)
                .then(( { body }) => {
                    expect(body).toBeInstanceOf(Object);
                    expect(body).toHaveProperty("article");
                    expect(body.article).toBeInstanceOf(Object);
                })
        });
        test('Status 200 - returns back an array of objects with length = 1 and correct keys', () => {
            return request(app)
                .get("/api/articles/1")
                .expect(200)
                .then(({ body }) => {
                    const article = body.article;
                                       
                    expect(article).toHaveProperty("article_id", expect.any(Number));
                    expect(article).toHaveProperty("title", expect.any(String));
                    expect(article).toHaveProperty("topic", expect.any(String));
                    expect(article).toHaveProperty("author", expect.any(String));
                    expect(article).toHaveProperty("body", expect.any(String));
                    expect(article).toHaveProperty("created_at", expect.any(String));
                    expect(article).toHaveProperty("votes", expect.any(Number));
                    expect(article).toHaveProperty("article_img_url", expect.any(String));
                    expect(article).toHaveProperty("comment_count", expect.any(String));
                });
        });
        test('Status 200 - returns back existing article with index 1', () => {
            return request(app)
                .get("/api/articles/1")
                .expect(200)
                .then(({ body }) => {
                    const article = body.article;

                    expect(article.comment_count).toBe("11");
                })
        });
        test('Status 200 - returns back existing article with index 2 and comment_count 0', () => {
            return request(app)
                .get("/api/articles/2")
                .expect(200)
                .then(({ body }) => {
                    const article = body.article;

                    expect(article.article_id).toBe(2);
                    expect(article.title).toBe("Sony Vaio; or, The Laptop");
                    expect(article.topic).toBe("mitch");
                    expect(article.author).toBe("icellusedkars");
                    expect(article.body).toBe("Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.");
                    expect(article.created_at).toBe("2020-10-16T05:03:00.000Z");
                    expect(article.votes).toBe(0);
                    expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
                    expect(article.comment_count).toBe("0");
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
                    expect(body.msg).toBe("Article with id 1000 Not Found");
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

    describe('GET /API/ARTICLES QUERIES', () => {
        test('Status 200 - returns back an array of articles which have topic mitch', () => {
            return request(app)
                .get("/api/articles?topic=mitch")
                .expect(200)
                .then(({ body }) => {
                    body.articles.forEach((article) => {
                        expect(article.topic).toBe("mitch");
                      });
                })
        });
        test('Status 200 - returns back an array of articles which have topic cats', () => {
            return request(app)
                .get("/api/articles?topic=cats")
                .expect(200)
                .then(({ body }) => {
                    body.articles.forEach((article) => {
                        expect(article.topic).toBe("cats");
                      });
                })
        });
        test('Status 200 - returns back an array of sorted articles by votes', () => {
            return request(app)
                .get("/api/articles?sort_by=votes")
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toBeSortedBy("votes", { descending: true });
                })
        });
        test('Status 200 - returns back an array of sorted articles by created_at', () => {
            return request(app)
                .get("/api/articles?order=asc")
                .expect(200)
                .then(({ body }) => {
                    expect(body.articles).toBeSortedBy("created_at", { ascending: true });
                })
        });
        test("Status 400 - Sends back error msg when invalid sort_by parameter is used", () => {
            return request(app)
              .get("/api/articles?sort_by=topicsssss")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Invalid sort query");
              });
        });
        test("Status 400 - Sends back error msg when invalid order parameter is used", () => {
            return request(app)
              .get("/api/articles?order=bibabuu")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Invalid order query");
              });
        });
        test("Status 404 - Sends back error msg when the value of topic does not exist in DB", () => {
            return request(app)
              .get("/api/articles?topic=123cats123")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Articles were Not Found");
              });
        });
    });

    describe('GET /API/USERS', () => {
        test('Status 200 - api point exists and responds', () => {
            return request(app).get("/api/users").expect(200);
        });
        test('Status 200 - returns back an object and has a property called users', () => {
            return request(app)
                .get("/api/users")
                .expect(200)
                .then(({ body }) => {
                    expect(body).toBeInstanceOf(Object);
                    expect(body).toHaveProperty("users");
                    expect(body.users).toBeInstanceOf(Array);
                });
        });
        test('Status 200 - returns back an array of objects with the correct keys', () => {
            return request(app)
                .get("/api/users")
                .expect(200)
                .then(({ body }) => {
                    expect(body.users).toHaveLength(testData.userData.length);
                    
                    body.users.forEach( user => {
                        expect(user).toEqual(
                            expect.objectContaining({
                                username: user.username,
                                name: user.name,
                                avatar_url: user.avatar_url,
                            })
                        )
                    });
                });
        });
        test('Status 200 - returns back an array of users from DB', () => {
            return request(app)
                .get("/api/users")
                .expect(200)
                .then(({ body }) => {
                    const topUser = body.users[0];
                
                    expect(topUser.username).toBe("butter_bridge");
                    expect(topUser.name).toBe("jonny");
                    expect(topUser.avatar_url).toBe("https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg");
            });
        });
        test('Status 404 - returns back error Path not found', () => {
            return request(app)
                .get("/api/userss")
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("Path not found");
                });
        });
    });
    
    describe('PATCH /API/ARTICLES/:ARTICLE_ID', () => {
        test('Status 200 - api point exists and responds', () => {
            return request(app)
                .patch("/api/articles/1")
                .send({
                    "inc_votes": 1
                })
                .expect(200);
        });
        test('Status 200 - returns back an object and has a property called article', () => {
            return request(app)
                .patch("/api/articles/1")
                .send({
                    "inc_votes": 1,
                })
                .expect(200)
                .then(({ body }) => {
                    expect(body).toBeInstanceOf(Object);
                    expect(body).toHaveProperty("article");
                    expect(body.article).toBeInstanceOf(Object);
                });
        });
        test('Status 200 - returns back an article with the correct keys', () => {
            return request(app)
                .patch("/api/articles/1")
                .send({
                    "inc_votes": 1,
                })
                .expect(200)
                .then(({ body }) => {
                    const { article } = body;
                    
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
        test('Status 200 - returns back an article with votes property icreased on 1', () => {   
            return request(app)
                .patch("/api/articles/1")
                .send({
                    "inc_votes": 1
                })
                .expect(200)
                .then(({ body }) => {
                    const { article } = body;
    
                    expect(article.votes).toBe(101);
                });
        });
        test('Status 200 - returns back an article with votes property decreased on 10', () => {   
            return request(app)
                .patch("/api/articles/1")
                .send({
                    "inc_votes": -10
                })
                .expect(200)
                .then(({ body }) => {
                    const { article } = body;
    
                    expect(article.votes).toBe(90);
                });
        });
        test('Status 400 - returns back bad request', () => {
            return request(app)
                .patch("/api/articles/1")
                .send()
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("Bad request!");
                });
        });
        test('Status 400 - returns back bad request when inc_votes has a String type', () => {
            return request(app)
                .patch("/api/articles/1")
                .send({
                    "inc_votes": "123",
                })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("inc_votes 123 property should have a number type");
                });
        });
        test('Status 404 - returns back a bad request if article_id does not exist in DB', () => {
            return request(app)
                .patch("/api/articles/1000")
                .send({
                    "inc_votes": 1
                })
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("Article with id 1000 Not Found")
                })
        });
        test('Status 400 - returns back an error Invalid input', () => {
            return request(app)
                .patch("/api/articles/notAnId")
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("You passed notAnId. Article id should be a number.");
                })
        });
    });
 
    describe('POST /API/ARTICLES/:ARTICLE_ID/COMMENTS', () => {
        test('Status 201 - api point exists and returns', () => {
            return request(app)
            .post("/api/articles/1/comments")
            .send({
                "body": "This morning, I ate a banana.",
                "username": "lurker",
            })
            .expect(201);
        });
        test('Status 201 - returns back an object and has a property called comment', () => {
            return request(app)
                .post("/api/articles/1/comments")
                .send({
                    "body": "This morning, I ate a banana.",
                    "username": "lurker",
                })
                .expect(201)
                .then(( { body }) => {
                    expect(body).toBeInstanceOf(Object);
                    expect(body).toHaveProperty("comment");
                    expect(body.comment).toBeInstanceOf(Array);
                });
        });
        test('Status 201 - returns back an array of objects with length = 1 and correct keys', () => {
            return request(app)
                .post("/api/articles/1/comments")
                .expect(201)
                .send({
                    "body": "This morning, I ate a banana.",
                    "username": "lurker",
                })
                .then(({ body }) => {
                    expect(body.comment).toHaveLength(1);
                    
                    const comment = body.comment[0];
                                       
                    expect(comment).toHaveProperty("comment_id", expect.any(Number));
                    expect(comment).toHaveProperty("body", expect.any(String));
                    expect(comment).toHaveProperty("article_id", expect.any(Number));
                    expect(comment).toHaveProperty("author", expect.any(String));
                    expect(comment).toHaveProperty("votes", expect.any(Number));
                    expect(comment).toHaveProperty("created_at", expect.any(String));
                });
        });
        test('Status 201 - returns back created comment', () => {
            return request(app)
                .post("/api/articles/1/comments")
                .send({
                    "body": "This morning, I ate a coconut.",
                    "username": "lurker",
                })
                .expect(201)
                .then(({ body }) => {
                    const comment = body.comment[0];

                    expect(comment.body).toBe("This morning, I ate a coconut.");
                    expect(comment.author).toBe("lurker");
                    expect(comment.article_id).toBe(1);
                    expect(comment.votes).toBe(0);
                });
        });
        test('Status 400 - returns back bad request', () => {
            return request(app)
                .post("/api/articles/1/comments")
                .send({
                    "username": "lurker"
                })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("Bad request!");
                });
        });
        test('Status 400 - returns back bad request when username has a Number type', () => {
            return request(app)
                .post("/api/articles/1/comments")
                .send({
                    "username": 12345,
                })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("Username 12345 should have a string type.");
                });
        });
        test('Status 400 - returns back bad request when body of comment has a Number type', () => {
            return request(app)
                .post("/api/articles/1/comments")
                .send({
                    "username": "lurker",
                    "body": 12345,
                })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("Body of comment 12345 should have a string type");
                });
        });
        test('Status 404 - returns back a bad request if user is absent in DB', () => {
            return request(app)
                .post("/api/articles/1/comments")
                .send({
                    "username": "Anna12345",
                    "body": "Good day is today!",
                })
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("Username Anna12345 does not exist")
                })
        });
    });

    describe('GET /API', () => {
        test('Status 200 - api point exists and returns', () => {
            return request(app)
                .get("/api")
                .expect(200);
        });
        test('Status 200 - retuns back all existing endpoints', () => {
            return request(app)
                .get("/api")
                .expect(200)
                .then(({ body }) => {
                    const { endpoints } = body;

                    expect(endpoints).toHaveProperty("GET /api");
                    expect(endpoints).toHaveProperty("GET /api/topics");
                    expect(endpoints).toHaveProperty("GET /api/articles");
                    expect(endpoints).toHaveProperty("GET /api/articles/:article_id");
                    expect(endpoints).toHaveProperty("GET /api/articles/:article_id/comments");
                    expect(endpoints).toHaveProperty("POST /api/articles/:article_id/comments");
                    expect(endpoints).toHaveProperty("PATCH /api/articles/:article_id");
                    expect(endpoints).toHaveProperty("GET /api/users");
                    expect(endpoints).toHaveProperty("DELETE /api/comments/:comment_id");

                    for (const key in endpoints) {
                        expect(endpoints[key]).toHaveProperty("description");
                        expect(endpoints[key]).toHaveProperty("exampleResponse");
                        expect(endpoints[key]).toHaveProperty("queries");
                    }
                })
        });
    });
});
