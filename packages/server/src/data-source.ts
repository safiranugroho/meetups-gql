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

const formatDate = (date: Date) => {
  const dateAsString = date.toISOString();
  return dateAsString.substring(0, dateAsString.length - 5);
};

class EventsDataSource extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://localhost:4001';
  }

  async getEvents(
    daysInAdvance = 7,
    category = '292',
  ): Promise<EventResponse[]> {
    const date = new Date(Date.now());
    date.setDate(date.getDate() + daysInAdvance);

    return this.get<EventsResponse>(`/find/upcoming_events`, {
      end_date_range: formatDate(date),
      topic_category: category,
    }).then(response => response.events);
  }
}

export default EventsDataSource;
