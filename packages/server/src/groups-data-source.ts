import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest';
import { EventResponse } from './data-source';

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
    return this.get<GroupResponse[]>(`/find/groups`, {
      category,
      country,
    }).then(response => response);
  }
}

export default GroupsDataSource;
