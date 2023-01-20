# News

## 1. Link to the app

https://news-1a1w.onrender.com

## 2. Background:

The news programme allows you to browse articles, post and delete comments, search for users and topics, select articles based on topics, and sort articles.

The back-end component currently consists of the following ennpoints::
 
- GET /api
- GET /api/topics
- GET /api articles
- GET /api/articles/:article_id
- GET /api/articles/:article_id/comments
- GET /api/users
- GET /api/articles (queries: topic, sort_by, order)
- POST /api/articles/:article_id/comments
- PATCH /api/articles/:article_id
- DELETE /api/comments/:comment_id

## 3. Instructions:

- to your github account fork the repo https://github.com/Aleksanrda/news.git

- copy the link of created repo and clone it in the terminal

- in order to successfully connect to the two databases locally add two next files and into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (the database names can be found in "/db/setup.sql):

    .env.development

    .env.test

check if the following dependencies exist in package.json file:

    1) dotenv
    2) express
    3) pg
    4) pg-format

check if the following devDependencies exist in package.json file:

    1) husky
    2) jest
    3) jest-extended
    4) jest-sorted
    5) supertest

- run all scripts stored in package.json file

- run tests => use npm test app.test.js command

## 4. Minimum versions needed to run the project:

 - Node.js v19.1.0

 - Postgres 14.5