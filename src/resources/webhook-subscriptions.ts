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
 * ~25 minutes with exponential backoff. Each event includes a unique ID for
 * deduplication.
 *
 * ## Webhook Headers
 *
 * All webhook requests include two sets of headers. **If you have an existing integration
 * using the `X-Webhook-*` headers, nothing changes** — those headers are still sent on
 * every delivery and work exactly as before. The new `webhook-*` headers follow the
 * [Standard Webhooks](https://github.com/standard-webhooks/standard-webhooks) specification.
 * You can safely ignore them if your current verification code works and you don't want to use this convention.
 *
 * ### Standard Webhooks Headers (Recommended)
 *
 * Used by [our SDK](https://github.com/linq-team/linq-node) and any [Standard Webhooks library](https://github.com/standard-webhooks/standard-webhooks).
 *
 * | Header | Description |
 * |--------|-------------|
 * | `webhook-id` | Unique event identifier (use as idempotency key) |
 * | `webhook-timestamp` | Unix timestamp (seconds) when the webhook was sent |
 * | `webhook-signature` | Standard Webhooks signature (`v1,{base64}` format) |
 *
 * ### Legacy Headers (Deprecated)
 *
 * Still sent on every delivery for backwards compatibility. Existing verification code
 * using these headers continues to work — no changes required.
 *
 * | Header | Description |
 * |--------|-------------|
 * | `X-Webhook-Event` | *(deprecated)* Event type (e.g., `message.sent`) |
 * | `X-Webhook-Subscription-ID` | *(deprecated)* Webhook subscription ID |
 * | `X-Webhook-Timestamp` | *(deprecated)* Unix timestamp (seconds) |
 * | `X-Webhook-Signature` | *(deprecated)* HMAC-SHA256 signature (hex-encoded) |
 *
 * ## Signing Secrets
 *
 * Signing secrets use the Standard Webhooks format: a `whsec_` prefix followed
 * by base64-encoded random bytes (e.g., `whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw7Jxx2Oll+OE=`).
 *
 * Strip the `whsec_` prefix and base64-decode the remainder to get the raw key bytes.
 *
 * ## Verifying Webhook Signatures
 *
 * Webhooks are signed following the [Standard Webhooks specification](https://github.com/standard-webhooks/standard-webhooks).
 * You can use any [Standard Webhooks library](https://github.com/standard-webhooks/standard-webhooks) to verify
 * signatures, or implement verification manually:
 *
 * **Signed content:** `{webhook-id}.{webhook-timestamp}.{body}`
 *
 * **Verification Steps:**
 *
 * 1. Extract the `webhook-id`, `webhook-timestamp`, and `webhook-signature` headers
 * 2. Reject if the timestamp is more than 5 minutes old (replay protection)
 * 3. Get the raw request body bytes (do not parse and re-serialize)
 * 4. Construct signed content: `"{webhook-id}.{webhook-timestamp}.{body}"`
 * 5. Strip the `whsec_` prefix from your secret and base64-decode to get key bytes
 * 6. Compute HMAC-SHA256 using the key bytes over the signed content
 * 7. Base64-encode the result and compare with the value after `v1,` in `webhook-signature`
 * 8. Use constant-time comparison to prevent timing attacks
 *
 * **Example (Python):**
 *
 * ```python
 * import base64, hmac, hashlib
 *
 * def verify_webhook(secret, body, headers):
 *     msg_id = headers['webhook-id']
 *     timestamp = headers['webhook-timestamp']
 *     signature = headers['webhook-signature']
 *
 *     secret_str = secret.removeprefix('whsec_')
 *     key = base64.b64decode(secret_str)
 *
 *     signed_content = f"{msg_id}.{timestamp}.{body}"
 *     expected = base64.b64encode(
 *         hmac.new(key, signed_content.encode(), hashlib.sha256).digest()
 *     ).decode()
 *
 *     for sig in signature.split(' '):
 *         if sig.startswith('v1,') and hmac.compare_digest(expected, sig[3:]):
 *             return True
 *     return False
 * ```
 *
 * **Example (Node.js):**
 *
 * ```javascript
 * const crypto = require('crypto');
 *
 * function verifyWebhook(secret, rawBody, headers) {
 *   const msgId = headers['webhook-id'];
 *   const timestamp = headers['webhook-timestamp'];
 *   const signature = headers['webhook-signature'];
 *
 *   const secretStr = secret.startsWith('whsec_') ? secret.slice(6) : secret;
 *   const keyBytes = Buffer.from(secretStr, 'base64');
 *   const signedContent = `${msgId}.${timestamp}.${rawBody}`;
 *   const expected = crypto
 *     .createHmac('sha256', keyBytes)
 *     .update(signedContent)
 *     .digest('base64');
 *
 *   return signature.split(' ').some(sig => {
 *     if (!sig.startsWith('v1,')) return false;
 *     try {
 *       return crypto.timingSafeEqual(
 *         Buffer.from(expected, 'base64'),
 *         Buffer.from(sig.slice(3), 'base64')
 *       );
 *     } catch { return false; }
 *   });
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
   * **Phone Number Filtering:**
   *
   * - Optionally specify `phone_numbers` to only receive events for specific lines
   * - If omitted, events from all phone numbers are delivered (default behavior)
   * - Use multiple subscriptions with different `phone_numbers` to route different
   *   lines to different endpoints
   * - Each `target_url` can only be used once per account. To route different lines
   *   to different destinations, use a unique URL per subscription (e.g., append a
   *   query parameter: `https://example.com/webhook?line=1`)
   *
   * **Webhook Delivery:**
   *
   * - Events are sent via HTTP POST to the target URL
   * - Each request includes
   *   [Standard Webhooks](https://github.com/standard-webhooks/standard-webhooks)
   *   headers (`webhook-id`, `webhook-timestamp`, `webhook-signature`) for signature
   *   verification
   * - Legacy `X-Webhook-*` headers are also sent for backwards compatibility
   *   (deprecated)
   * - See
   *   [Verifying Webhook Signatures](https://docs.linqapp.com/guides/webhooks#verifying-webhook-signatures)
   *   for verification details
   * - Failed deliveries (5xx, 429, network errors) are retried up to 10 times over
   *   ~25 minutes with exponential backoff
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

  /**
   * Phone numbers this subscription filters for. If null or empty, events from all
   * phone numbers are delivered.
   */
  phone_numbers?: Array<string> | null;
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

  /**
   * Phone numbers this subscription filters for. If null or empty, events from all
   * phone numbers are delivered.
   */
  phone_numbers?: Array<string> | null;
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

  /**
   * Optional list of phone numbers to filter events for. Only events originating
   * from these phone numbers will be delivered to this subscription. If omitted or
   * empty, events from all phone numbers are delivered. Phone numbers must be in
   * E.164 format.
   */
  phone_numbers?: Array<string>;
}

export interface WebhookSubscriptionUpdateParams {
  /**
   * Activate or deactivate the subscription
   */
  is_active?: boolean;

  /**
   * Updated list of phone numbers to filter events for. Set to a non-empty array to
   * filter events to specific phone numbers. Set to an empty array or null to remove
   * the filter and receive events from all phone numbers. Phone numbers must be in
   * E.164 format.
   */
  phone_numbers?: Array<string> | null;

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
