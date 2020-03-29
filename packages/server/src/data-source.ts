import moment from 'moment';
import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest';

export type EventResponse = {
  id: string;
  name: string;
  time: number;
  local_date?: string;
  local_time?: string;
  link?: string;
  venue?: Venue;
  group?: Group;
};

type EventsResponse = {
  events: EventResponse[];
};

type Venue = {
  name: string;
  city: string;
};

type Group = {
  name: string;
};

class EventsDataSource extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.meetup.com';
  }

  willSendRequest(request: RequestOptions) {
    request.headers.set('Authorization', this.context.token);
  }

  async getEvents(category = 292, daysInAdvance = 7): Promise<EventResponse[]> {
    return this.get<EventsResponse>(`/find/upcoming_events`, {
      topic_category: category,
      end_date_range: moment()
        .add(daysInAdvance, 'days')
        .format('YYYY-MM-DDTHH:mm:ss'),
    }).then(response => response.events);
  }
}

export default EventsDataSource;
