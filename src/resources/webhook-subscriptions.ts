// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as WebhookEventsAPI from './webhook-events';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * Webhook Subscriptions allow you to receive real-time notifications when events
 * occur on your account.
 *
 * Configure webhook endpoints to receive events such as messages sent/received,
 * delivery status changes, reactions, typing indicators, and more.
 *
 * Failed deliveries (5xx, 429, network errors) are retried up to 10 times over
 * ~2 hours with exponential backoff. Each event includes a unique ID for
 * deduplication.
 *
 * ## Webhook Headers
 *
 * Each webhook request includes the following headers:
 *
 * | Header | Description |
 * |--------|-------------|
 * | `X-Webhook-Event` | The event type (e.g., `message.sent`, `message.received`) |
 * | `X-Webhook-Subscription-ID` | Your webhook subscription ID |
 * | `X-Webhook-Timestamp` | Unix timestamp (seconds) when the webhook was sent |
 * | `X-Webhook-Signature` | HMAC-SHA256 signature for verification |
 *
 * ## Verifying Webhook Signatures
 *
 * All webhooks are signed using HMAC-SHA256. You should always verify the signature
 * to ensure the webhook originated from Linq and hasn't been tampered with.
 *
 * **Signature Construction:**
 *
 * The signature is computed over a concatenation of the timestamp and payload:
 *
 * ```
 * {timestamp}.{payload}
 * ```
 *
 * Where:
 * - `timestamp` is the value from the `X-Webhook-Timestamp` header
 * - `payload` is the raw JSON request body (exact bytes, not re-serialized)
 *
 * **Verification Steps:**
 *
 * 1. Extract the `X-Webhook-Timestamp` and `X-Webhook-Signature` headers
 * 2. Get the raw request body bytes (do not parse and re-serialize)
 * 3. Concatenate: `"{timestamp}.{payload}"`
 * 4. Compute HMAC-SHA256 using your signing secret as the key
 * 5. Hex-encode the result and compare with `X-Webhook-Signature`
 * 6. Use constant-time comparison to prevent timing attacks
 *
 * **Example (Python):**
 *
 * ```python
 * import hmac
 * import hashlib
 *
 * def verify_webhook(signing_secret, payload, timestamp, signature):
 *     message = f"{timestamp}.{payload.decode('utf-8')}"
 *     expected = hmac.new(
 *         signing_secret.encode('utf-8'),
 *         message.encode('utf-8'),
 *         hashlib.sha256
 *     ).hexdigest()
 *     return hmac.compare_digest(expected, signature)
 * ```
 *
 * **Example (Node.js):**
 *
 * ```javascript
 * const crypto = require('crypto');
 *
 * function verifyWebhook(signingSecret, payload, timestamp, signature) {
 *   const message = `${timestamp}.${payload}`;
 *   const expected = crypto
 *     .createHmac('sha256', signingSecret)
 *     .update(message)
 *     .digest('hex');
 *   return crypto.timingSafeEqual(
 *     Buffer.from(expected),
 *     Buffer.from(signature)
 *   );
 * }
 * ```
 *
 * **Security Best Practices:**
 *
 * - Reject webhooks with timestamps older than 5 minutes to prevent replay attacks
 * - Always use constant-time comparison for signature verification
 * - Store your signing secret securely (e.g., environment variable, secrets manager)
 * - Return a 2xx status code quickly, then process the webhook asynchronously
 */
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
   * - Failed deliveries (5xx, 429, network errors) are retried up to 10 times over
   *   ~2 hours with exponential backoff
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
