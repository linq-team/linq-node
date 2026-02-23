// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as EventsAPI from './events';
import { EventListResponse, Events } from './events';
import * as SubscriptionsAPI from './subscriptions';
import {
  SubscriptionCreateParams,
  SubscriptionCreateResponse,
  SubscriptionListResponse,
  SubscriptionRetrieveResponse,
  SubscriptionUpdateParams,
  SubscriptionUpdateResponse,
  Subscriptions,
} from './subscriptions';

export class Webhooks extends APIResource {
  subscriptions: SubscriptionsAPI.Subscriptions = new SubscriptionsAPI.Subscriptions(this._client);
  events: EventsAPI.Events = new EventsAPI.Events(this._client);
}

Webhooks.Subscriptions = Subscriptions;
Webhooks.Events = Events;

export declare namespace Webhooks {
  export {
    Subscriptions as Subscriptions,
    type SubscriptionCreateResponse as SubscriptionCreateResponse,
    type SubscriptionRetrieveResponse as SubscriptionRetrieveResponse,
    type SubscriptionUpdateResponse as SubscriptionUpdateResponse,
    type SubscriptionListResponse as SubscriptionListResponse,
    type SubscriptionCreateParams as SubscriptionCreateParams,
    type SubscriptionUpdateParams as SubscriptionUpdateParams,
  };

  export { Events as Events, type EventListResponse as EventListResponse };
}
