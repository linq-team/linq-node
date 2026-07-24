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
  | 'chat.background_updated'
  | 'chat.typing_indicator.started'
  | 'chat.typing_indicator.stopped'
  | 'phone_number.status_updated'
  | 'call.initiated'
  | 'call.ringing'
  | 'call.answered'
  | 'call.ended'
  | 'call.failed'
  | 'call.declined'
  | 'call.no_answer'
  | 'location.sharing.started'
  | 'location.sharing.stopped'
  | 'payment.succeeded'
  | 'payment.canceled'
  | 'payment.expired';

export interface WebhookEventListResponse {
  /**
   * URL to the webhook events documentation
   */
  doc_url: 'https://docs.linqapp.com/guides/webhooks/events';

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
