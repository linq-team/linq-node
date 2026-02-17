// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as WebhookEventsAPI from './webhook-events';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class WebhookSubscriptions extends APIResource {
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
   * const webhookSubscription =
   *   await client.webhookSubscriptions.create({
   *     subscribed_events: [
   *       'message.sent',
   *       'message.delivered',
   *       'message.read',
   *     ],
   *     target_url: 'https://webhooks.example.com/linq/events',
   *   });
   * ```
   */
  create(
    body: WebhookSubscriptionCreateParams,
    options?: RequestOptions,
  ): APIPromise<WebhookSubscriptionCreateResponse> {
    return this._client.post('/v3/webhook-subscriptions', { body, ...options });
  }

  /**
   * Retrieve details for a specific webhook subscription including its target URL,
   * subscribed events, and current status.
   *
   * @example
   * ```ts
   * const webhookSubscription =
   *   await client.webhookSubscriptions.retrieve(
   *     'b2c3d4e5-f6a7-8901-bcde-f23456789012',
   *   );
   * ```
   */
  retrieve(subscriptionID: string, options?: RequestOptions): APIPromise<WebhookSubscription> {
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
   * const webhookSubscription =
   *   await client.webhookSubscriptions.update(
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
    body: WebhookSubscriptionUpdateParams,
    options?: RequestOptions,
  ): APIPromise<WebhookSubscription> {
    return this._client.put(path`/v3/webhook-subscriptions/${subscriptionID}`, { body, ...options });
  }

  /**
   * Retrieve all webhook subscriptions for the authenticated partner. Returns a list
   * of active and inactive subscriptions with their configuration and status.
   *
   * @example
   * ```ts
   * const webhookSubscriptions =
   *   await client.webhookSubscriptions.list();
   * ```
   */
  list(options?: RequestOptions): APIPromise<WebhookSubscriptionListResponse> {
    return this._client.get('/v3/webhook-subscriptions', options);
  }

  /**
   * Delete a webhook subscription.
   *
   * @example
   * ```ts
   * await client.webhookSubscriptions.delete(
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

export interface WebhookSubscription {
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
  subscribed_events: Array<WebhookEventsAPI.WebhookEventType>;

  /**
   * URL where webhook events will be sent
   */
  target_url: string;

  /**
   * When the subscription was last updated
   */
  updated_at: string;
}

/**
 * Response returned when creating a webhook subscription. Includes the signing
 * secret which is only shown once.
 */
export interface WebhookSubscriptionCreateResponse {
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
  subscribed_events: Array<WebhookEventsAPI.WebhookEventType>;

  /**
   * URL where webhook events will be sent
   */
  target_url: string;

  /**
   * When the subscription was last updated
   */
  updated_at: string;
}

export interface WebhookSubscriptionListResponse {
  /**
   * List of webhook subscriptions
   */
  subscriptions: Array<WebhookSubscription>;
}

export interface WebhookSubscriptionCreateParams {
  /**
   * List of event types to subscribe to
   */
  subscribed_events: Array<WebhookEventsAPI.WebhookEventType>;

  /**
   * URL where webhook events will be sent. Must be HTTPS.
   */
  target_url: string;
}

export interface WebhookSubscriptionUpdateParams {
  /**
   * Activate or deactivate the subscription
   */
  is_active?: boolean;

  /**
   * Updated list of event types to subscribe to
   */
  subscribed_events?: Array<WebhookEventsAPI.WebhookEventType>;

  /**
   * New target URL for webhook events
   */
  target_url?: string;
}

export declare namespace WebhookSubscriptions {
  export {
    type WebhookSubscription as WebhookSubscription,
    type WebhookSubscriptionCreateResponse as WebhookSubscriptionCreateResponse,
    type WebhookSubscriptionListResponse as WebhookSubscriptionListResponse,
    type WebhookSubscriptionCreateParams as WebhookSubscriptionCreateParams,
    type WebhookSubscriptionUpdateParams as WebhookSubscriptionUpdateParams,
  };
}
