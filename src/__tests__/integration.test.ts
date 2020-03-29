import nock from 'nock';
import { ApolloServer, gql } from 'apollo-server';
import { createTestClient } from 'apollo-server-testing';

import typeDefs from '../type-defs';
import resolvers from '../resolvers';

import EventsDataSource from '../events-data-source';
import GroupsDataSource from '../groups-data-source';

import fakeGroup from './__fixtures__/group.json';
import fakeEvent from './__fixtures__/event.json';
import { EVENTS, GROUPS } from '../queries';

// TODO: Match date string to regex instead of mocking moment
jest.mock('moment', () => ({
  __esModule: true,
  default: () => ({
    add: () => ({
      // Sunday, April 5, 2020 5:30:50 PM GMT+10:00
      format: () => '2020-04-05T07:30:50',
      valueOf: () => 1586071850000,
    }),
  }),
}));

describe('server', () => {
  const meetupAPI = 'https://api.meetup.com';

  it('should query events according to schema', async () => {
    const GET_EVENTS = gql(EVENTS);

    nock(meetupAPI)
      .get('/find/upcoming_events')
      .query({
        topic_category: 292,
        end_date_range: '2020-04-05T07:30:50',
      })
      .reply(200, { events: [fakeEvent] });

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
      variables: { input: { category: 292, daysInAdvance: 7 } },
    });

    expect(response).toMatchSnapshot();
  });

  it('should query groups according to schema', async () => {
    const GET_GROUPS = gql(GROUPS);

    nock(meetupAPI)
      .get('/find/groups')
      .query({
        category: 34,
        country: 'AU',
      })
      .reply(200, [fakeGroup]);

    nock(meetupAPI)
      .get(`/${fakeGroup.urlname}/events/${fakeGroup.next_event.id}`)
      .reply(200, fakeEvent);

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      dataSources: () => ({
        groups: new GroupsDataSource(),
      }),
    });

    const { query } = createTestClient(server);
    const response = await query({
      query: GET_GROUPS,
      variables: { input: { category: 34, country: 'AU' } },
    });

    expect(response).toMatchSnapshot();
  });
});
