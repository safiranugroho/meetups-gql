import { ApolloServer } from 'apollo-server';

import typeDefs from './type-defs';
import resolvers from './resolvers';
import EventsDataSource from './data-source';

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
