import { ApolloServer } from 'apollo-server';

import typeDefs from './src/type-defs';
import resolvers from './src/resolvers';
import EventsDataSource from './src/data-source';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: (): {} => ({
    events: new EventsDataSource(),
  }),
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
