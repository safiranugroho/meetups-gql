import { ApolloServer } from 'apollo-server';

import typeDefs from './src/type-defs';
import resolvers from './src/resolvers';
import EventsDataSource from './src/events-data-source';
import GroupsDataSource from './src/groups-data-source';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ token: req.headers.authorization || '' }),
  dataSources: (): {} => ({
    events: new EventsDataSource(),
    groups: new GroupsDataSource(),
  }),
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
