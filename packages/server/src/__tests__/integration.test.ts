import nock from 'nock';
import { ApolloServer, gql } from 'apollo-server';
import { createTestClient } from 'apollo-server-testing';

import typeDefs from '../type-defs';
import resolvers from '../resolvers';
import EventsDataSource from '../data-source';

describe('server', () => {
  it('should query events according to schema', async () => {
    const GET_EVENTS = gql`
      query {
        events {
          name
          date
          time
          venue
          link
        }
      }
    `;

    const fakeEventsResponse = {
      events: [
        {
          name: 'fake-event',
          local_date: '2019-11-28',
          local_time: '18:00',
          link: 'http://fake.link',
          venue: {
            name: 'fake-venue',
            city: 'Melbourne',
          },
        },
      ],
    };

    nock('http://localhost:4001')
      .get('/find/upcoming_events')
      .reply(200, fakeEventsResponse);

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      dataSources: () => ({
        events: new EventsDataSource(),
      }),
    });

    const { query } = createTestClient(server);
    const response = await query({ query: GET_EVENTS });

    expect(response).toMatchSnapshot();
  });
});