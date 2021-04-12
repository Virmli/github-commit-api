# github-commit-api

Node.js Express API, using GitHub Public api to access repo commit information.
You need only docker to run this project.

## Run

With docker compose, this application is exposed on: http://localhost:8080/
Locally, this application is exposed on: http://localhost:4040/

Node.js development environment with hot reloading (see [package.json](https://github.com/Virmli/github-commit-api/blob/main/package.json)):

```bash
npm i
npm run redis:start
npm run dev
```

Docker environment (see [docker-compose.yml](https://github.com/Virmli/github-commit-api/blob/main/docker-compose.yml)):

```bash
docker-compose build
docker-compose up
```

## Test

The unit test can be run two ways localy and from docker compose file

```bash
docker-compose run teradici npm test
```
Unit testing without docker:

```bash
npm run test
```

## APIS

This service exposes two apis local npm run exposes ``port:4040``, and docker run exposes ``port:8080``
Returns the users for everyone that has committed code
to https://github.com/teradici/deploy during the period from June 1, 2019 - May 31,2020.
```
GET http://localhost:8080/api/v1/users
Response: [
            {
                name: string,
                email: string,
            }
          ]
```
This service returns the number of commits which occurred
from June 1, 2019 - May 31, 2020, associated with the author, and
and filters them to contain the top 5 committers.
```
GET http://localhost:8080/api/v1/most-frequent
Response: [
            {
                name: string, # author's name
                commits: integer # number commits
            }
          ]
```
