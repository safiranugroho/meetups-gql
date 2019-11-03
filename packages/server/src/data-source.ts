import { RESTDataSource } from 'apollo-datasource-rest';

type EventsResponse = {
  events: EventResponse[];
};

export type EventResponse = {
  name: string;
  local_date: string;
  local_time: string;
  link: string;
  venue: Venue;
};

type Venue = {
  name: string;
  city: string;
};

class EventsDataSource extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://localhost:4001';
  }

  async getEvents(): Promise<EventResponse[]> {
    return this.get<EventsResponse>(`/find/upcoming_events`).then(response => response.events);
  }
}

export default EventsDataSource;
