// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class WebhookEvents extends APIResource {
  /**
   * Returns all available webhook event types that can be subscribed to. Use this
   * endpoint to discover valid values for the `subscribed_events` field when
   * creating or updating webhook subscriptions.
   */
  list(options?: RequestOptions): APIPromise<WebhookEventListResponse> {
    return this._client.get('/v3/webhook-events', options);
  }
}

/**
 * Valid webhook event types that can be subscribed to
 */
export type WebhookEventType =
  | 'message.sent'
  | 'message.received'
  | 'message.read'
  | 'message.delivered'
  | 'message.failed'
  | 'reaction.added'
  | 'reaction.removed'
  | 'participant.added'
  | 'participant.removed'
  | 'chat.created'
  | 'chat.group_name_updated'
  | 'chat.group_icon_updated'
  | 'chat.group_name_update_failed'
  | 'chat.group_icon_update_failed'
  | 'chat.typing_indicator.started'
  | 'chat.typing_indicator.stopped'
  | 'phone_number.status_updated';

export interface WebhookEventListResponse {
  /**
   * URL to the webhook events documentation
   */
  doc_url: 'https://apidocs.linqapp.com/documentation/webhook-events';

  /**
   * List of all available webhook event types
   */
  events: Array<WebhookEventType>;
}

export declare namespace WebhookEvents {
  export {
    type WebhookEventType as WebhookEventType,
    type WebhookEventListResponse as WebhookEventListResponse,
  };
}
