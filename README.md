# Hack the North 2023 Backend Challenge

Some technologies used:

- Backend REST framework: Fastify
- Testing libraries: Jest, Supertest
- Linting: ESLint
- Language: TypeScript

## Getting Started

1. Install dependencies: `npm install`
2. Generate Prisma client: `npm run db:gen`
3. Initialize the database with some seed data: `npm run db:migrate` and `npm run db:seed`
4. Start!
   1. Development: `npm run dev`
   2. Production: `npm run build` and `npm start`

## Useful Scripts

In the project directory, you can run:

### `npm run dev`

To start the app in dev mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`

Compile TypeScript project into JavaScript.

### `npm start`

Start server for production. (Make sure to run `npm run build` first)

### `npm run test`

Run the test cases.

### `npm run lint`

Lint the whole project.

### `npm run db:gen`

Generate Prisma client (usually after a schema change).

### `npm run db:migrate`

During development, run this command whenever you change the (Prisma) database schema to update the database to match the new schema.

### `npm run db:studio`

Starts up Prisma studio (useful for looking at how the database looks like).

### Other Scripts

All other scripts that were not mentioned could be found in `package.json`. (They may or may not be useful)

## Code Structure

- /src -> REST API Server
- /tests -> API testing code
- /prisma
  - hackers.db -> SQLite database used (could be easily changed to use other databases supported by Prisma)
  - schema.prisma -> Defines schema used by Prisma
  - seed.ts -> Script that seeds the database with some pre-generated data

## Endpoints Implemented

- GET /users
- GET /users/:id
- PUT /users/:id
- GET /skills

## Improvement Ideas

| Feature Improvements | Endpoint Name          | Description                                    |
| :------------------: | :--------------------- | :--------------------------------------------- |
|   User management    | POST /users            | Register a new user.                           |
|    Team formation    | POST /teams            | Create a new team.                             |
|    Team formation    | GET /teams             | Get a list of all teams.                       |
|    Team formation    | GET /teams/:id         | Get the details of a specific team by ID.      |
|    Team formation    | PUT /teams/:id/members | Add or remove members from a team.             |
| Schedule and agenda  | GET /schedule          | Get the schedule and agenda for the hackathon. |

|         API Improvements         | Description                                                                                                             |
| :------------------------------: | :---------------------------------------------------------------------------------------------------------------------- |
|            Pagination            | Add pagination to reduce the amount of data returned in a single response and improve performance (e.g. in GET /users). |
|             Sorting              | Allow users to sort the results of their queries by specific fields.                                                    |
| Authentication and authorization | Add authentication and authorization mechanisms to protect user data and ensure only authorized users access it.        |
|          Error handling          | Improve error handling by providing more descriptive error messages and status codes for various error scenarios.       |
|            Filtering             | Allow users to filter the results of their queries based on specific criteria.                                          |
|            Searching             | Allow users to search for specific users or skills using a search query.                                                |
|         Batch operation          | Allow users to perform batch operations on multiple users or skills at once.                                            |
|            Versioning            | Add versioning to the API to support backward compatibility and avoid breaking changes.                                 |
|          Error logging           | Implement error logging to track and monitor errors that occur within the API.                                          |
|      Performance monitoring      | Monitor the performance of the API to identify bottlenecks and areas for improvement.                                   |
|        API documentation         | Provide clear and comprehensive documentation for the API to help developers understand how to use it.                  |
|          Rate limiting           | Implement rate limiting to prevent abuse or overuse of the API.                                                         |

| Miscellaneous Improvements | Description                                                                                     |
| :------------------------: | :---------------------------------------------------------------------------------------------- |
|      Containerization      | Define a Docker image for the API server so it could be easily deployed on most cloud platforms |
