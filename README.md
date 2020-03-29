# weekly meetups
Fetches all upcoming meetups for the next week from technology-related groups in Meetup.com in the local area (defaults to Melbourne, Australia).

## Getting started
Here are instructions if you want to maintain your own version of weekly meetups.

### System requirements
* Node v8.15.0 or newer

### Running the application locally
* `yarn start` - Runs the application
* `yarn dev` - Runs the application with hot loading
* `yarn test` - Runs the tests

## Playground
The schema of this GraphQL server can be found in the playground here:
**https://weeklymeetups-gql.herokuapp.com/graphql**.
Currently, actually querying for the data is not available because you need to be an authenticated member of Meetup.com. This is meant to be consumed by a web client, such as in this project: https://github.com/safiranugroho/meetups.

## Built with
* [GraphQL](https://graphql.org/)
* [Apollo Server](https://www.apollographql.com/)
* [TypeScript](https://www.typescriptlang.org/)
