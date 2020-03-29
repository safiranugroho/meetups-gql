import moment from 'moment';
import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest';
import { EventResponse } from './events-data-source';

export type GroupResponse = {
  id: number;
  name: string;
  urlname: string;
  city: string;
  next_event?: EventResponse;
  category?: Category;
};

type Category = {
  id: number;
  name: string;
};

class GroupsDataSource extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.meetup.com';
  }

  willSendRequest(request: RequestOptions) {
    request.headers.set('Authorization', this.context.token);
  }

  async getGroups(category = 34, country = 'AU'): Promise<GroupResponse[]> {
    return this.get<GroupResponse[]>('/find/groups', {
      category,
      country,
    }).then(response => {
      const maxDateInMilliseconds = moment()
        .add(7, 'days')
        .valueOf();

      return response
        .filter(group => group.next_event)
        .filter(group => group.next_event.time <= maxDateInMilliseconds);
    });
  }

  async getGroupEvent(
    groupId: string,
    eventId: string,
  ): Promise<EventResponse> {
    return this.get<EventResponse>(`/${groupId}/events/${eventId}`);
  }
}

export default GroupsDataSource;
