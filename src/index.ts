import { ApolloServer } from 'apollo-server';

import typeDefs from './type-defs';
import resolvers from './resolvers';
import { EVENTS, GROUPS } from './queries';

import EventsDataSource from './events-data-source';
import GroupsDataSource from './groups-data-source';

const endpoint = process.env.ENDPOINT || 'http://localhost:4000';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ token: req.headers.authorization || '' }),
  dataSources: (): {} => ({
    events: new EventsDataSource(),
    groups: new GroupsDataSource(),
  }),
  introspection: true,
  playground: {
    tabs: [
      { name: 'Events', endpoint, query: EVENTS },
      { name: 'Groups', endpoint, query: GROUPS },
    ],
  },
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
