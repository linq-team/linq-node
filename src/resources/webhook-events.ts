// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

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
 * Valid webhook event types that can be subscribed to.
 *
 * **Note:** `message.edited` is only delivered to subscriptions using
 * `webhook_version: "2026-02-03"`. Subscribing to this event on a v2025
 * subscription will not produce any deliveries.
 */
export type WebhookEventType =
  | 'message.sent'
  | 'message.received'
  | 'message.read'
  | 'message.delivered'
  | 'message.failed'
  | 'message.edited'
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
  | 'call.initiated'
  | 'call.ringing'
  | 'call.answered'
  | 'call.ended'
  | 'call.failed'
  | 'call.declined'
  | 'call.no_answer';

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
