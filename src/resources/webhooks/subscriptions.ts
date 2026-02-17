// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Subscriptions extends APIResource {
  /**
   * Create a new webhook subscription to receive events at a target URL. Upon
   * creation, a signing secret is generated for verifying webhook authenticity.
   * **Store this secret securely — it cannot be retrieved later.**
   *
   * **Webhook Delivery:**
   *
   * - Events are sent via HTTP POST to the target URL
   * - Each request includes `X-Webhook-Signature` and `X-Webhook-Timestamp` headers
   * - Signature is HMAC-SHA256 over `{timestamp}.{payload}` — see
   *   [Webhook Events](/docs/webhook-events) for verification details
   * - Failed deliveries (5xx, 429, network errors) are retried up to 6 times with
   *   exponential backoff: 2s, 4s, 8s, 16s, 30s
   * - Client errors (4xx except 429) are not retried
   *
   * @example
   * ```ts
   * const subscription =
   *   await client.webhooks.subscriptions.create({
   *     subscribed_events: [
   *       'message.sent',
   *       'message.delivered',
   *       'message.read',
   *     ],
   *     target_url: 'https://webhooks.example.com/linq/events',
   *   });
   * ```
   */
  create(body: SubscriptionCreateParams, options?: RequestOptions): APIPromise<SubscriptionCreateResponse> {
    return this._client.post('/v3/webhook-subscriptions', { body, ...options });
  }

  /**
   * Retrieve details for a specific webhook subscription including its target URL,
   * subscribed events, and current status.
   *
   * @example
   * ```ts
   * const subscription =
   *   await client.webhooks.subscriptions.retrieve(
   *     'b2c3d4e5-f6a7-8901-bcde-f23456789012',
   *   );
   * ```
   */
  retrieve(subscriptionID: string, options?: RequestOptions): APIPromise<SubscriptionRetrieveResponse> {
    return this._client.get(path`/v3/webhook-subscriptions/${subscriptionID}`, options);
  }

  /**
   * Update an existing webhook subscription. You can modify the target URL,
   * subscribed events, or activate/deactivate the subscription.
   *
   * **Note:** The signing secret cannot be changed via this endpoint.
   *
   * @example
   * ```ts
   * const subscription =
   *   await client.webhooks.subscriptions.update(
   *     'b2c3d4e5-f6a7-8901-bcde-f23456789012',
   *     {
   *       target_url:
   *         'https://webhooks.example.com/linq/events',
   *     },
   *   );
   * ```
   */
  update(
    subscriptionID: string,
    body: SubscriptionUpdateParams,
    options?: RequestOptions,
  ): APIPromise<SubscriptionUpdateResponse> {
    return this._client.put(path`/v3/webhook-subscriptions/${subscriptionID}`, { body, ...options });
  }

  /**
   * Retrieve all webhook subscriptions for the authenticated partner. Returns a list
   * of active and inactive subscriptions with their configuration and status.
   *
   * @example
   * ```ts
   * const subscriptions =
   *   await client.webhooks.subscriptions.list();
   * ```
   */
  list(options?: RequestOptions): APIPromise<SubscriptionListResponse> {
    return this._client.get('/v3/webhook-subscriptions', options);
  }

  /**
   * Delete a webhook subscription.
   *
   * @example
   * ```ts
   * await client.webhooks.subscriptions.delete(
   *   'b2c3d4e5-f6a7-8901-bcde-f23456789012',
   * );
   * ```
   */
  delete(subscriptionID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/v3/webhook-subscriptions/${subscriptionID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

/**
 * Response returned when creating a webhook subscription. Includes the signing
 * secret which is only shown once.
 */
export interface SubscriptionCreateResponse {
  /**
   * Unique identifier for the webhook subscription
   */
  id: string;

  /**
   * When the subscription was created
   */
  created_at: string;

  /**
   * Whether this subscription is currently active
   */
  is_active: boolean;

  /**
   * Secret for verifying webhook signatures. Store this securely - it cannot be
   * retrieved again.
   */
  signing_secret: string;

  /**
   * List of event types this subscription receives
   */
  subscribed_events: Array<
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
    | 'phone_number.status_updated'
  >;

  /**
   * URL where webhook events will be sent
   */
  target_url: string;

  /**
   * When the subscription was last updated
   */
  updated_at: string;
}

export interface SubscriptionRetrieveResponse {
  /**
   * Unique identifier for the webhook subscription
   */
  id: string;

  /**
   * When the subscription was created
   */
  created_at: string;

  /**
   * Whether this subscription is currently active
   */
  is_active: boolean;

  /**
   * List of event types this subscription receives
   */
  subscribed_events: Array<
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
    | 'phone_number.status_updated'
  >;

  /**
   * URL where webhook events will be sent
   */
  target_url: string;

  /**
   * When the subscription was last updated
   */
  updated_at: string;
}

export interface SubscriptionUpdateResponse {
  /**
   * Unique identifier for the webhook subscription
   */
  id: string;

  /**
   * When the subscription was created
   */
  created_at: string;

  /**
   * Whether this subscription is currently active
   */
  is_active: boolean;

  /**
   * List of event types this subscription receives
   */
  subscribed_events: Array<
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
    | 'phone_number.status_updated'
  >;

  /**
   * URL where webhook events will be sent
   */
  target_url: string;

  /**
   * When the subscription was last updated
   */
  updated_at: string;
}

export interface SubscriptionListResponse {
  /**
   * List of webhook subscriptions
   */
  subscriptions: Array<SubscriptionListResponse.Subscription>;
}

export namespace SubscriptionListResponse {
  export interface Subscription {
    /**
     * Unique identifier for the webhook subscription
     */
    id: string;

    /**
     * When the subscription was created
     */
    created_at: string;

    /**
     * Whether this subscription is currently active
     */
    is_active: boolean;

    /**
     * List of event types this subscription receives
     */
    subscribed_events: Array<
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
      | 'phone_number.status_updated'
    >;

    /**
     * URL where webhook events will be sent
     */
    target_url: string;

    /**
     * When the subscription was last updated
     */
    updated_at: string;
  }
}

export interface SubscriptionCreateParams {
  /**
   * List of event types to subscribe to
   */
  subscribed_events: Array<
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
    | 'phone_number.status_updated'
  >;

  /**
   * URL where webhook events will be sent. Must be HTTPS.
   */
  target_url: string;
}

export interface SubscriptionUpdateParams {
  /**
   * Activate or deactivate the subscription
   */
  is_active?: boolean;

  /**
   * Updated list of event types to subscribe to
   */
  subscribed_events?: Array<
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
    | 'phone_number.status_updated'
  >;

  /**
   * New target URL for webhook events
   */
  target_url?: string;
}

export declare namespace Subscriptions {
  export {
    type SubscriptionCreateResponse as SubscriptionCreateResponse,
    type SubscriptionRetrieveResponse as SubscriptionRetrieveResponse,
    type SubscriptionUpdateResponse as SubscriptionUpdateResponse,
    type SubscriptionListResponse as SubscriptionListResponse,
    type SubscriptionCreateParams as SubscriptionCreateParams,
    type SubscriptionUpdateParams as SubscriptionUpdateParams,
  };
}
