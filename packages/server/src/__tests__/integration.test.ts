import nock from 'nock';
import { ApolloServer, gql } from 'apollo-server';
import { createTestClient } from 'apollo-server-testing';

import typeDefs from '../type-defs';
import resolvers from '../resolvers';
import EventsDataSource from '../data-source';

// TODO: Match date string to regex instead of mocking moment
jest.mock('moment', () => ({
  __esModule: true,
  default: () => ({
    add: () => ({
      format: () => '2019-11-10T07:00:00',
    }),
  }),
}));

describe('server', () => {
  const meetupAPI = 'https://api.meetup.com';

  it('should query events according to schema', async () => {
    const GET_EVENTS = gql`
      query($input: EventsInput!) {
        events(input: $input) {
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

    nock(meetupAPI)
      .get('/find/upcoming_events')
      .query({
        topic_category: 292,
        end_date_range: '2019-11-10T07:00:00',
      })
      .reply(200, fakeEventsResponse);

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      dataSources: () => ({
        events: new EventsDataSource(),
      }),
    });

    const { query } = createTestClient(server);
    const response = await query({
      query: GET_EVENTS,
      variables: { input: { category: '292', daysInAdvance: 7 } },
    });

    expect(response).toMatchSnapshot();
  });
});
