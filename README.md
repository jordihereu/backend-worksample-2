# Backend Engineer Work Sample

This project skeleton contains a basic Express setup one endpoint to create a user and one endpoint to fetch all users, as well as a basic empty unit test.

## Scripts 
`npm start` starts the server

`npm test` executes the tests

## Goal
1. Adjust POST /users that it accepts a user and stores it in a database.
    * The user should have a unique id, a name, a unique email address and a creation date
2. Adjust GET /users that it returns (all) users from the database.
   * This endpoint should be able to receive a query parameter `created` which sorts users by creation date ascending or descending.

Feel free to add or change this project as you like.


## Setup

- `npm install`
- npm install --save-dev @testcontainers/postgresql

## Testing

### Unit test

Services are tested at unit level in './test/unit' folder

### Integration test

Project use test containers. Running `npm test` will spin up the needed containers an run the tests.
Folder: './test/integration/'

## DB

Database structure is defined in './src/db/migrations'. New changes should be placed here.
There is a custom tool `mirgate.ts` in charge of running those scripts on application start (and when running the integration tests)

## ADRs

Architecture Decision Record can be found in './ADR'

## NEXT STEPS

Next steps can be found in './TODO.md'