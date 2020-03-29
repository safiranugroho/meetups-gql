import nock from 'nock';
import { ApolloServer, gql } from 'apollo-server';
import { createTestClient } from 'apollo-server-testing';

import typeDefs from '../type-defs';
import resolvers from '../resolvers';

import EventsDataSource from '../events-data-source';
import GroupsDataSource from '../groups-data-source';

// TODO: Match date string to regex instead of mocking moment
jest.mock('moment', () => ({
  __esModule: true,
  default: () => ({
    add: () => ({
      // Saturday, November 10, 2019 7:00:00 AM GMT+10:00 (for events query)
      format: () => '2019-11-10T07:00:00',
      // Sunday, April 5, 2020 5:30:50 PM GMT+10:00 (for groups query)
      valueOf: () => 1586071850000,
    }),
    format: () => 'Thursday',
  }),
}));

describe('server', () => {
  const meetupAPI = 'https://api.meetup.com';

  it('should query events according to schema', async () => {
    const GET_EVENTS = gql`
      query($input: EventsInput!) {
        events(input: $input) {
          id
          name
          day
          date
          time
          timeInMilliseconds
          venue
          link
          group
        }
      }
    `;

    const fakeEventsResponse = {
      events: [
        {
          id: 'fake-id',
          name: 'fake-event',
          local_date: '2019-11-28',
          local_time: '18:00',
          time: 1585809000000,
          link: 'http://fake.link',
          venue: {
            name: 'fake-venue',
            city: 'Melbourne',
          },
          group: {
            name: 'fake-group',
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
      variables: { input: { category: 292, daysInAdvance: 7 } },
    });

    expect(response).toMatchSnapshot();
  });

  it('should query groups according to schema', async () => {
    const GET_GROUPS = gql`
      query($input: GroupsInput!) {
        groups(input: $input) {
          name
          url
          city
          category
          nextEvent {
            id
            name
            timeInMilliseconds
          }
        }
      }
    `;

    const fakeGroupsResponse = [
      {
        id: 1785640,
        name: 'Melbourne Silicon Beach',
        urlname: 'Melbourne-Silicon-Beach',
        city: 'Melbourne',
        next_event: {
          id: '269253587',
          name: 'Silicon Beach Pitch Night - April 2020 (Online Event!)',
          time: 1585809000000,
        },
        category: {
          id: 34,
          name: 'Tech',
          shortname: 'tech',
          sort_name: 'Tech',
        },
      },
    ];

    nock(meetupAPI)
      .get('/find/groups')
      .query({
        category: 34,
        country: 'AU',
      })
      .reply(200, fakeGroupsResponse);

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
