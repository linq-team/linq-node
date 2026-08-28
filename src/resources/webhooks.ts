// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as Shared from './shared';
import * as WebhookEventsAPI from './webhook-events';
import { Webhook } from 'standardwebhooks';

export class Webhooks extends APIResource {
  unwrap(
    body: string,
    { headers, key }: { headers: Record<string, string>; key?: string },
  ): UnwrapWebhookEvent {
    if (headers !== undefined) {
      const keyStr: string | null = key === undefined ? this._client.webhookSecret : key;
      if (keyStr === null) throw new Error('Webhook key must not be null in order to unwrap');
      const wh = new Webhook(keyStr);
      wh.verify(body, headers);
    }
    return JSON.parse(body) as UnwrapWebhookEvent;
  }
}

/**
 * Unified payload for message webhooks when using `webhook_version: "2026-02-03"`.
 *
 * This schema is used for message.sent, message.received, message.delivered, and
 * message.read events when the subscription URL includes `?version=2026-02-03`.
 *
 * Key differences from V1 (2025-01-01):
 *
 * - `direction`: "inbound" or "outbound" instead of `is_from_me` boolean
 * - `sender_handle`: Full handle object for the sender
 * - `chat`: Nested object with `id`, `is_group`, and `owner_handle`
 * - Message fields (`id`, `parts`, `effect`, etc.) are at the top level, not
 *   nested in `message`
 *
 * Timestamps indicate the message state:
 *
 * - `message.sent`: sent_at set, delivered_at=null, read_at=null
 * - `message.received`: sent_at set, delivered_at=null, read_at=null
 * - `message.delivered`: sent_at set, delivered_at set, read_at=null
 * - `message.read`: sent_at set, delivered_at set, read_at set
 */
export interface MessageEventV2 {
  /**
   * Message identifier
   */
  id: string;

  /**
   * Chat information
   */
  chat: MessageEventV2.Chat;

  /**
   * Message direction - "outbound" if sent by you, "inbound" if received
   */
  direction: 'inbound' | 'outbound';

  /**
   * Message parts (text and/or media)
   */
  parts: Array<
    | SchemasTextPartResponse
    | SchemasMediaPartResponse
    | MessageEventV2.SchemasLinkPartResponse
    | MessageEventV2.SchemasIMessageAppPartResponse
    | MessageEventV2.SchemasAppClipPartResponse
  >;

  /**
   * The handle that sent this message
   */
  sender_handle: Shared.ChatHandle;

  /**
   * Messaging service type
   */
  service: Shared.ServiceType;

  /**
   * When the message was delivered. Null if not yet delivered.
   */
  delivered_at?: string | null;

  /**
   * iMessage effect applied to a message (screen or bubble animation)
   */
  effect?: SchemasMessageEffect | null;

  /**
   * Idempotency key for deduplication of outbound messages.
   */
  idempotency_key?: string | null;

  /**
   * Preferred messaging service type. Includes "auto" for default fallback behavior.
   */
  preferred_service?: 'iMessage' | 'SMS' | 'RCS' | 'auto' | null;

  /**
   * When the message was read. Null if not yet read.
   */
  read_at?: string | null;

  /**
   * Present only when this message was recovered by reconciliation rather than
   * delivered live, and set to the time of that recovery. The field is omitted
   * entirely for normally-delivered messages, which is the overwhelming majority.
   * When present, expect `sent_at` to be substantially earlier than delivery of this
   * event: the message is genuine but is arriving late and out of real-time order,
   * so treat it as history rather than as a live inbound (for example, suppress
   * auto-replies).
   */
  reconciled_at?: string;

  /**
   * Reference to the message this is replying to (for threaded replies)
   */
  reply_to?: MessageEventV2.ReplyTo | null;

  /**
   * When the message was sent. Null if not yet sent.
   */
  sent_at?: string | null;
}

export namespace MessageEventV2 {
  /**
   * Chat information
   */
  export interface Chat {
    /**
     * Chat identifier
     */
    id: string;

    /**
     * **[BETA]** Current health for a chat. Always present — chats start at `HEALTHY`
     * and may shift based on engagement and delivery signals on the conversation. Many
     * `AT_RISK` or `CRITICAL` chats on a single line increase the risk of line
     * flagging.
     *
     * Switch on `status` to surface chat and line health in your UI — the enum is the
     * long-term contract. Each status carries a `doc_url` that deep-links to the
     * relevant section of the Chat Health guide. To gate a send, act on the response
     * rather than the status: a `403` is the authoritative answer.
     *
     * See the [Chat Health guide](/guides/chats/chat-health) for what each status
     * means and how to react.
     */
    health_status: Chat.HealthStatus;

    /**
     * Whether this is a group chat
     */
    is_group?: boolean | null;

    /**
     * Your phone number's handle. Always has is_me=true.
     */
    owner_handle?: Shared.ChatHandle | null;
  }

  export namespace Chat {
    /**
     * **[BETA]** Current health for a chat. Always present — chats start at `HEALTHY`
     * and may shift based on engagement and delivery signals on the conversation. Many
     * `AT_RISK` or `CRITICAL` chats on a single line increase the risk of line
     * flagging.
     *
     * Switch on `status` to surface chat and line health in your UI — the enum is the
     * long-term contract. Each status carries a `doc_url` that deep-links to the
     * relevant section of the Chat Health guide. To gate a send, act on the response
     * rather than the status: a `403` is the authoritative answer.
     *
     * See the [Chat Health guide](/guides/chats/chat-health) for what each status
     * means and how to react.
     */
    export interface HealthStatus {
      /**
       * Deep-link to the relevant section of the Chat Health guide for this status.
       */
      doc_url: string;

      /**
       * Current health bucket for the chat. See the
       * [Chat Health guide](/guides/chats/chat-health) for what each value means and how
       * to react. `doc_url` deep-links to the relevant section.
       *
       * `OPTED_OUT` — the recipient sent `STOP`, `UNSUBSCRIBE`, `OPTOUT`, `CANCEL`,
       * `END`, or `QUIT`. The keyword must be the whole trimmed message, never part of a
       * longer one: `STOP` counts, `please stop` does not. Most keywords must match
       * exactly, including case. `OPT OUT` is the exception — it matches in any casing,
       * with or without the space or a hyphen, so `opt out`, `Opt-Out` and `optout` all
       * count. It clears as soon as they reply again: any later message from them that
       * is not itself an opt-out keyword opts them back in immediately — a reply in any
       * conversation with you counts, the same way the block does.
       *
       * `OPTED_OUT` marks only the conversation the keyword arrived in. The block below
       * is wider than the mark, so a conversation still reading `HEALTHY` can be blocked
       * as well — gate on the `403`, not on the status. Group threads are never marked
       * and are never blocked.
       *
       * Linq enforces this: while a recipient is opted out, every send to them is
       * rejected with `403` (error code `2024`) before the message is queued, across
       * every chat and every line on your account. Nothing is delivered, including a
       * final courtesy message — to send one, set `override_optout: true` on that single
       * request.
       */
      status: 'HEALTHY' | 'AT_RISK' | 'CRITICAL' | 'OPTED_OUT';

      /**
       * When this status last changed.
       */
      updated_at: string;
    }
  }

  /**
   * A rich link preview part
   */
  export interface SchemasLinkPartResponse {
    /**
     * Indicates this is a rich link preview part
     */
    type: 'link';

    /**
     * The URL
     */
    value: string;
  }

  /**
   * An iMessage app card part.
   */
  export interface SchemasIMessageAppPartResponse {
    /**
     * Identifies the iMessage app (Messages app extension) that backs the card.
     */
    app: SchemasIMessageAppPartResponse.App;

    /**
     * Visible layout of the card.
     */
    layout: SchemasIMessageAppPartResponse.Layout;

    /**
     * Indicates this is an iMessage app card part.
     */
    type: 'imessage_app';

    /**
     * The URL the recipient's app opens when the user taps the card.
     */
    url: string;

    /**
     * Fallback text for surfaces that cannot render the card.
     */
    fallback_text?: string | null;
  }

  export namespace SchemasIMessageAppPartResponse {
    /**
     * Identifies the iMessage app (Messages app extension) that backs the card.
     */
    export interface App {
      /**
       * Bundle identifier of the Messages app extension.
       */
      bundle_id: string;

      /**
       * Display name of the app.
       */
      name: string;

      /**
       * The app's 10-character team identifier.
       */
      team_id: string;

      /**
       * The owning app's App Store id, when known.
       */
      app_store_id?: number | null;
    }

    /**
     * Visible layout of the card.
     */
    export interface Layout {
      /**
       * Primary label, top-left and bold.
       */
      caption?: string | null;

      /**
       * Secondary label, below caption on the left.
       */
      subcaption?: string | null;

      /**
       * Label shown top-right.
       */
      trailing_caption?: string | null;

      /**
       * Label shown below trailing_caption.
       */
      trailing_subcaption?: string | null;
    }
  }

  /**
   * An Apple Pay App Clip payment card part
   */
  export interface SchemasAppClipPartResponse {
    /**
     * Indicates this is an App Clip payment card part
     */
    type: 'app_clip';

    /**
     * The checkout link the card opens
     */
    value: string;

    /**
     * The card's summary line, composed by Linq from the checkout session
     */
    description?: string;

    /**
     * The card's preview image
     */
    image_url?: string;

    /**
     * The card's headline, composed by Linq from the checkout session
     */
    title?: string;
  }

  /**
   * Reference to the message this is replying to (for threaded replies)
   */
  export interface ReplyTo {
    /**
     * ID of the message being replied to
     */
    message_id?: string;

    /**
     * Index of the part being replied to
     */
    part_index?: number;
  }
}

/**
 * Message content nested within webhook events
 */
export interface MessagePayload {
  /**
   * Message identifier
   */
  id?: string;

  /**
   * When the message record was created
   */
  created_at?: string;

  /**
   * When the message was delivered
   */
  delivered_at?: string | null;

  /**
   * iMessage effect applied to a message (screen or bubble animation)
   */
  effect?: SchemasMessageEffect;

  /**
   * Whether the message has been delivered
   */
  is_delivered?: boolean;

  /**
   * Whether the message has been read
   */
  is_read?: boolean;

  /**
   * Message content parts (text and/or media)
   */
  parts?: Array<
    | SchemasTextPartResponse
    | SchemasMediaPartResponse
    | MessagePayload.SchemasLinkPartResponse
    | MessagePayload.SchemasIMessageAppPartResponse
    | MessagePayload.SchemasAppClipPartResponse
  >;

  /**
   * When the message was read
   */
  read_at?: string | null;

  /**
   * Present only when this message was recovered by reconciliation rather than
   * delivered live, and set to the time of that recovery. The field is omitted
   * entirely for normally-delivered messages, which is the overwhelming majority.
   * When present, expect `sent_at` to be substantially earlier than delivery of this
   * event: the message is genuine but is arriving late and out of real-time order,
   * so treat it as history rather than as a live inbound (for example, suppress
   * auto-replies).
   */
  reconciled_at?: string;

  /**
   * Reference to the message this is replying to
   */
  reply_to?: MessagePayload.ReplyTo;

  /**
   * When the message was sent
   */
  sent_at?: string | null;

  /**
   * When the message record was last updated
   */
  updated_at?: string;
}

export namespace MessagePayload {
  /**
   * A rich link preview part
   */
  export interface SchemasLinkPartResponse {
    /**
     * Indicates this is a rich link preview part
     */
    type: 'link';

    /**
     * The URL
     */
    value: string;
  }

  /**
   * An iMessage app card part.
   */
  export interface SchemasIMessageAppPartResponse {
    /**
     * Identifies the iMessage app (Messages app extension) that backs the card.
     */
    app: SchemasIMessageAppPartResponse.App;

    /**
     * Visible layout of the card.
     */
    layout: SchemasIMessageAppPartResponse.Layout;

    /**
     * Indicates this is an iMessage app card part.
     */
    type: 'imessage_app';

    /**
     * The URL the recipient's app opens when the user taps the card.
     */
    url: string;

    /**
     * Fallback text for surfaces that cannot render the card.
     */
    fallback_text?: string | null;
  }

  export namespace SchemasIMessageAppPartResponse {
    /**
     * Identifies the iMessage app (Messages app extension) that backs the card.
     */
    export interface App {
      /**
       * Bundle identifier of the Messages app extension.
       */
      bundle_id: string;

      /**
       * Display name of the app.
       */
      name: string;

      /**
       * The app's 10-character team identifier.
       */
      team_id: string;

      /**
       * The owning app's App Store id, when known.
       */
      app_store_id?: number | null;
    }

    /**
     * Visible layout of the card.
     */
    export interface Layout {
      /**
       * Primary label, top-left and bold.
       */
      caption?: string | null;

      /**
       * Secondary label, below caption on the left.
       */
      subcaption?: string | null;

      /**
       * Label shown top-right.
       */
      trailing_caption?: string | null;

      /**
       * Label shown below trailing_caption.
       */
      trailing_subcaption?: string | null;
    }
  }

  /**
   * An Apple Pay App Clip payment card part
   */
  export interface SchemasAppClipPartResponse {
    /**
     * Indicates this is an App Clip payment card part
     */
    type: 'app_clip';

    /**
     * The checkout link the card opens
     */
    value: string;

    /**
     * The card's summary line, composed by Linq from the checkout session
     */
    description?: string;

    /**
     * The card's preview image
     */
    image_url?: string;

    /**
     * The card's headline, composed by Linq from the checkout session
     */
    title?: string;
  }

  /**
   * Reference to the message this is replying to
   */
  export interface ReplyTo {
    /**
     * The ID of the message being replied to
     */
    message_id?: string;

    /**
     * Index of the message part being replied to (0-based)
     */
    part_index?: number;
  }
}

export interface ReactionEventBase {
  /**
   * Whether this reaction was from the owner of the phone number (true) or from
   * someone else (false)
   */
  is_from_me: boolean;

  /**
   * Type of reaction. Standard iMessage tapbacks are love, like, dislike, laugh,
   * emphasize, question. Custom emoji reactions have type "custom" with the actual
   * emoji in the custom_emoji field. Sticker reactions have type "sticker" with
   * sticker attachment details in the sticker field.
   */
  reaction_type: Shared.ReactionType;

  /**
   * Chat identifier (UUID)
   */
  chat_id?: string;

  /**
   * The actual emoji when reaction_type is "custom". Null for standard tapbacks.
   */
  custom_emoji?: string | null;

  /**
   * @deprecated DEPRECATED: Use from_handle instead. Phone number or email address
   * of the person who added/removed the reaction.
   */
  from?: string;

  /**
   * The person who added/removed the reaction as a full handle object
   */
  from_handle?: Shared.ChatHandle;

  /**
   * Message identifier (UUID) that the reaction was added to or removed from
   */
  message_id?: string;

  /**
   * Index of the message part that was reacted to (0-based)
   */
  part_index?: number;

  /**
   * When the reaction was added or removed
   */
  reacted_at?: string;

  /**
   * Messaging service type
   */
  service?: Shared.ServiceType;

  /**
   * Sticker attachment details when reaction_type is "sticker". Null for non-sticker
   * reactions.
   */
  sticker?: ReactionEventBase.Sticker | null;
}

export namespace ReactionEventBase {
  /**
   * Sticker attachment details when reaction_type is "sticker". Null for non-sticker
   * reactions.
   */
  export interface Sticker {
    /**
     * Filename of the sticker
     */
    file_name?: string;

    /**
     * Sticker image height in pixels
     */
    height?: number;

    /**
     * MIME type of the sticker image
     */
    mime_type?: string;

    /**
     * Presigned URL for downloading the sticker image (expires in 1 hour).
     */
    url?: string;

    /**
     * Sticker image width in pixels
     */
    width?: number;
  }
}

/**
 * A media attachment part
 */
export interface SchemasMediaPartResponse {
  /**
   * Unique attachment identifier
   */
  id: string;

  /**
   * Original filename
   */
  filename: string;

  /**
   * MIME type of the file
   */
  mime_type: string;

  /**
   * File size in bytes
   */
  size_bytes: number;

  /**
   * Indicates this is a media attachment part
   */
  type: 'media';

  /**
   * Presigned URL for downloading the attachment (expires in 1 hour).
   */
  url: string;
}

/**
 * iMessage effect applied to a message (screen or bubble animation)
 */
export interface SchemasMessageEffect {
  /**
   * Effect name (confetti, fireworks, slam, gentle, etc.)
   */
  name?: string;

  /**
   * Effect category
   */
  type?: 'screen' | 'bubble';
}

/**
 * A text message part
 */
export interface SchemasTextPartResponse {
  /**
   * Indicates this is a text message part
   */
  type: 'text';

  /**
   * The text content
   */
  value: string;

  /**
   * @deprecated DEPRECATED: Use `mentions` instead. Handle (E.164 phone number or
   * Apple ID email) of the **first** mention on this part. A part may carry several
   * mentions; this field shows only the first in `value` order, so it cannot be used
   * to determine whether a given participant was mentioned. `null` when the part
   * carries no mention.
   */
  mention?: string | null;

  /**
   * @deprecated DEPRECATED: Use `mentions[].range` instead. Character range
   * `[start, end)` in `value` highlighted as the **first** mention only. `null` when
   * the range was omitted (the whole `value` is highlighted) or the part carries no
   * mention. _Characters are measured as UTF-16 code units. Most characters count as
   * 1; some emoji count as 2._
   */
  mention_range?: Array<number> | null;

  /**
   * Every mention on this part, in the order they appear in `value`. `null` when the
   * part carries no mention. A part can carry several mentions of different people —
   * check `is_me` to tell whether this line was one of them.
   *
   * Only iMessage carries mentions. On a received message this is populated when the
   * sender was on iMessage; SMS and RCS have no way to mark a mention, so a message
   * from an SMS or RCS participant arrives as plain text with `mentions` null, even
   * in a group where other participants are on iMessage.
   */
  mentions?: Array<SchemasTextPartResponse.Mention> | null;

  /**
   * Text decorations applied to character ranges in the value
   */
  text_decorations?: Array<Shared.TextDecoration> | null;
}

export namespace SchemasTextPartResponse {
  /**
   * One mention on a text part — who was mentioned, and which characters of `value`
   * are the mention. A part carries one of these per mention, in the order they
   * appear in the text, so a message naming two people has two entries.
   */
  export interface Mention {
    /**
     * Address of the mentioned participant, exactly as the device recorded it — an
     * E.164 phone number or an email address.
     */
    handle: string;

    /**
     * Whether the mentioned participant is this line.
     */
    is_me: boolean;

    /**
     * Character range `[start, end)` in `value` highlighted as this mention.
     * _Characters are measured as UTF-16 code units. Most characters count as 1; some
     * emoji count as 2._
     */
    range: Array<number>;
  }
}

/**
 * Complete webhook payload for message.sent events (2026-02-03 format)
 */
export interface MessageSentWebhookEvent {
  /**
   * API version for the webhook payload format
   */
  api_version: string;

  /**
   * When the event was created
   */
  created_at: string;

  /**
   * Unified payload for message webhooks when using `webhook_version: "2026-02-03"`.
   *
   * This schema is used for message.sent, message.received, message.delivered, and
   * message.read events when the subscription URL includes `?version=2026-02-03`.
   *
   * Key differences from V1 (2025-01-01):
   *
   * - `direction`: "inbound" or "outbound" instead of `is_from_me` boolean
   * - `sender_handle`: Full handle object for the sender
   * - `chat`: Nested object with `id`, `is_group`, and `owner_handle`
   * - Message fields (`id`, `parts`, `effect`, etc.) are at the top level, not
   *   nested in `message`
   *
   * Timestamps indicate the message state:
   *
   * - `message.sent`: sent_at set, delivered_at=null, read_at=null
   * - `message.received`: sent_at set, delivered_at=null, read_at=null
   * - `message.delivered`: sent_at set, delivered_at set, read_at=null
   * - `message.read`: sent_at set, delivered_at set, read_at set
   */
  data: MessageEventV2;

  /**
   * Unique identifier for this event (for deduplication)
   */
  event_id: string;

  /**
   * Valid webhook event types that can be subscribed to.
   *
   * **Note:** `message.edited` is only delivered to subscriptions using
   * `webhook_version: "2026-02-03"`. Subscribing to this event on a v2025
   * subscription will not produce any deliveries.
   */
  event_type: WebhookEventsAPI.WebhookEventType;

  /**
   * Partner identifier. Present on all webhooks for cross-referencing.
   */
  partner_id: string;

  /**
   * Trace ID for debugging and correlation across systems.
   */
  trace_id: string;

  /**
   * Date-based webhook payload version. Determined by the `?version=` query
   * parameter in your webhook subscription URL. If no version parameter is
   * specified, defaults based on subscription creation date.
   */
  webhook_version: string;
}

/**
 * Complete webhook payload for message.received events (2026-02-03 format)
 */
export interface MessageReceivedWebhookEvent {
  /**
   * API version for the webhook payload format
   */
  api_version: string;

  /**
   * When the event was created
   */
  created_at: string;

  /**
   * Unified payload for message webhooks when using `webhook_version: "2026-02-03"`.
   *
   * This schema is used for message.sent, message.received, message.delivered, and
   * message.read events when the subscription URL includes `?version=2026-02-03`.
   *
   * Key differences from V1 (2025-01-01):
   *
   * - `direction`: "inbound" or "outbound" instead of `is_from_me` boolean
   * - `sender_handle`: Full handle object for the sender
   * - `chat`: Nested object with `id`, `is_group`, and `owner_handle`
   * - Message fields (`id`, `parts`, `effect`, etc.) are at the top level, not
   *   nested in `message`
   *
   * Timestamps indicate the message state:
   *
   * - `message.sent`: sent_at set, delivered_at=null, read_at=null
   * - `message.received`: sent_at set, delivered_at=null, read_at=null
   * - `message.delivered`: sent_at set, delivered_at set, read_at=null
   * - `message.read`: sent_at set, delivered_at set, read_at set
   */
  data: MessageEventV2;

  /**
   * Unique identifier for this event (for deduplication)
   */
  event_id: string;

  /**
   * Valid webhook event types that can be subscribed to.
   *
   * **Note:** `message.edited` is only delivered to subscriptions using
   * `webhook_version: "2026-02-03"`. Subscribing to this event on a v2025
   * subscription will not produce any deliveries.
   */
  event_type: WebhookEventsAPI.WebhookEventType;

  /**
   * Partner identifier. Present on all webhooks for cross-referencing.
   */
  partner_id: string;

  /**
   * Trace ID for debugging and correlation across systems.
   */
  trace_id: string;

  /**
   * Date-based webhook payload version. Determined by the `?version=` query
   * parameter in your webhook subscription URL. If no version parameter is
   * specified, defaults based on subscription creation date.
   */
  webhook_version: string;
}

/**
 * Complete webhook payload for message.read events (2026-02-03 format)
 */
export interface MessageReadWebhookEvent {
  /**
   * API version for the webhook payload format
   */
  api_version: string;

  /**
   * When the event was created
   */
  created_at: string;

  /**
   * Unified payload for message webhooks when using `webhook_version: "2026-02-03"`.
   *
   * This schema is used for message.sent, message.received, message.delivered, and
   * message.read events when the subscription URL includes `?version=2026-02-03`.
   *
   * Key differences from V1 (2025-01-01):
   *
   * - `direction`: "inbound" or "outbound" instead of `is_from_me` boolean
   * - `sender_handle`: Full handle object for the sender
   * - `chat`: Nested object with `id`, `is_group`, and `owner_handle`
   * - Message fields (`id`, `parts`, `effect`, etc.) are at the top level, not
   *   nested in `message`
   *
   * Timestamps indicate the message state:
   *
   * - `message.sent`: sent_at set, delivered_at=null, read_at=null
   * - `message.received`: sent_at set, delivered_at=null, read_at=null
   * - `message.delivered`: sent_at set, delivered_at set, read_at=null
   * - `message.read`: sent_at set, delivered_at set, read_at set
   */
  data: MessageEventV2;

  /**
   * Unique identifier for this event (for deduplication)
   */
  event_id: string;

  /**
   * Valid webhook event types that can be subscribed to.
   *
   * **Note:** `message.edited` is only delivered to subscriptions using
   * `webhook_version: "2026-02-03"`. Subscribing to this event on a v2025
   * subscription will not produce any deliveries.
   */
  event_type: WebhookEventsAPI.WebhookEventType;

  /**
   * Partner identifier. Present on all webhooks for cross-referencing.
   */
  partner_id: string;

  /**
   * Trace ID for debugging and correlation across systems.
   */
  trace_id: string;

  /**
   * Date-based webhook payload version. Determined by the `?version=` query
   * parameter in your webhook subscription URL. If no version parameter is
   * specified, defaults based on subscription creation date.
   */
  webhook_version: string;
}

/**
 * Complete webhook payload for message.delivered events (2026-02-03 format)
 */
export interface MessageDeliveredWebhookEvent {
  /**
   * API version for the webhook payload format
   */
  api_version: string;

  /**
   * When the event was created
   */
  created_at: string;

  /**
   * Unified payload for message webhooks when using `webhook_version: "2026-02-03"`.
   *
   * This schema is used for message.sent, message.received, message.delivered, and
   * message.read events when the subscription URL includes `?version=2026-02-03`.
   *
   * Key differences from V1 (2025-01-01):
   *
   * - `direction`: "inbound" or "outbound" instead of `is_from_me` boolean
   * - `sender_handle`: Full handle object for the sender
   * - `chat`: Nested object with `id`, `is_group`, and `owner_handle`
   * - Message fields (`id`, `parts`, `effect`, etc.) are at the top level, not
   *   nested in `message`
   *
   * Timestamps indicate the message state:
   *
   * - `message.sent`: sent_at set, delivered_at=null, read_at=null
   * - `message.received`: sent_at set, delivered_at=null, read_at=null
   * - `message.delivered`: sent_at set, delivered_at set, read_at=null
   * - `message.read`: sent_at set, delivered_at set, read_at set
   */
  data: MessageEventV2;

  /**
   * Unique identifier for this event (for deduplication)
   */
  event_id: string;

  /**
   * Valid webhook event types that can be subscribed to.
   *
   * **Note:** `message.edited` is only delivered to subscriptions using
   * `webhook_version: "2026-02-03"`. Subscribing to this event on a v2025
   * subscription will not produce any deliveries.
   */
  event_type: WebhookEventsAPI.WebhookEventType;

  /**
   * Partner identifier. Present on all webhooks for cross-referencing.
   */
  partner_id: string;

  /**
   * Trace ID for debugging and correlation across systems.
   */
  trace_id: string;

  /**
   * Date-based webhook payload version. Determined by the `?version=` query
   * parameter in your webhook subscription URL. If no version parameter is
   * specified, defaults based on subscription creation date.
   */
  webhook_version: string;
}

/**
 * Complete webhook payload for message.failed events
 */
export interface MessageFailedWebhookEvent {
  /**
   * API version for the webhook payload format
   */
  api_version: string;

  /**
   * When the event was created
   */
  created_at: string;

  /**
   * Error details for message.failed webhook events. See
   * [WebhookErrorCode](#/components/schemas/WebhookErrorCode) for the full error
   * code reference.
   *
   * In rare cases the message can still be delivered after this event fires — a
   * `message.delivered` webhook for the same message ID may follow.
   */
  data: MessageFailedWebhookEvent.Data;

  /**
   * Unique identifier for this event (for deduplication)
   */
  event_id: string;

  /**
   * Valid webhook event types that can be subscribed to.
   *
   * **Note:** `message.edited` is only delivered to subscriptions using
   * `webhook_version: "2026-02-03"`. Subscribing to this event on a v2025
   * subscription will not produce any deliveries.
   */
  event_type: WebhookEventsAPI.WebhookEventType;

  /**
   * Partner identifier. Present on all webhooks for cross-referencing.
   */
  partner_id: string;

  /**
   * Trace ID for debugging and correlation across systems.
   */
  trace_id: string;

  /**
   * Date-based webhook payload version. Determined by the `?version=` query
   * parameter in your webhook subscription URL. If no version parameter is
   * specified, defaults based on subscription creation date.
   */
  webhook_version: string;
}

export namespace MessageFailedWebhookEvent {
  /**
   * Error details for message.failed webhook events. See
   * [WebhookErrorCode](#/components/schemas/WebhookErrorCode) for the full error
   * code reference.
   *
   * In rare cases the message can still be delivered after this event fires — a
   * `message.delivered` webhook for the same message ID may follow.
   */
  export interface Data {
    /**
     * Error codes in webhook failure events. The possible set varies by event:
     * message.failed and poll.failed can carry 3007, 4001, 4002, 4005, 4006, 4007, or
     * 4008; the group update failure events (chat.group_name_update_failed,
     * chat.group_icon_update_failed) carry 3007 or 4001; chat.background_update_failed
     * carries 1005, 2011, 4001, or 5002.
     */
    code: number;

    /**
     * When the failure was detected
     */
    failed_at: string;

    /**
     * Chat identifier (UUID)
     */
    chat_id?: string;

    /**
     * Opaque diagnostic code identifying the specific failure class within `code`.
     * Values are not enumerated and may change without notice — log it and include it
     * in support requests, but do not branch on it.
     */
    detail_code?: number | null;

    /**
     * Message identifier (UUID)
     */
    message_id?: string;

    /**
     * Preferred messaging service type. Includes "auto" for default fallback behavior.
     */
    preferred_service?: 'iMessage' | 'SMS' | 'RCS' | 'auto' | null;

    /**
     * Human-readable description of the failure
     */
    reason?: string;

    /**
     * Messaging service type
     */
    service?: Shared.ServiceType | null;
  }
}

/**
 * Complete webhook payload for message.edited events (2026-02-03 format only)
 */
export interface MessageEditedWebhookEvent {
  /**
   * API version for the webhook payload format
   */
  api_version: string;

  /**
   * When the event was created
   */
  created_at: string;

  /**
   * Payload for `message.edited` events (2026-02-03 format).
   *
   * Describes which part of a message was edited and when. Only text parts can be
   * edited. Only available for subscriptions using `webhook_version: "2026-02-03"`.
   */
  data: MessageEditedWebhookEvent.Data;

  /**
   * Unique identifier for this event (for deduplication)
   */
  event_id: string;

  /**
   * Valid webhook event types that can be subscribed to.
   *
   * **Note:** `message.edited` is only delivered to subscriptions using
   * `webhook_version: "2026-02-03"`. Subscribing to this event on a v2025
   * subscription will not produce any deliveries.
   */
  event_type: WebhookEventsAPI.WebhookEventType;

  /**
   * Partner identifier. Present on all webhooks for cross-referencing.
   */
  partner_id: string;

  /**
   * Trace ID for debugging and correlation across systems.
   */
  trace_id: string;

  /**
   * Date-based webhook payload version. Determined by the `?version=` query
   * parameter in your webhook subscription URL. If no version parameter is
   * specified, defaults based on subscription creation date.
   */
  webhook_version: string;
}

export namespace MessageEditedWebhookEvent {
  /**
   * Payload for `message.edited` events (2026-02-03 format).
   *
   * Describes which part of a message was edited and when. Only text parts can be
   * edited. Only available for subscriptions using `webhook_version: "2026-02-03"`.
   */
  export interface Data {
    /**
     * Message identifier
     */
    id: string;

    /**
     * Chat context
     */
    chat: Data.Chat;

    /**
     * "outbound" if you sent the original message, "inbound" if you received it
     */
    direction: 'outbound' | 'inbound';

    /**
     * When the edit occurred
     */
    edited_at: string;

    /**
     * The edited part
     */
    part: Data.Part;

    /**
     * The handle that sent (and edited) this message
     */
    sender_handle: Shared.ChatHandle;
  }

  export namespace Data {
    /**
     * Chat context
     */
    export interface Chat {
      /**
       * Chat identifier
       */
      id: string;

      /**
       * **[BETA]** Current health for a chat. Always present — chats start at `HEALTHY`
       * and may shift based on engagement and delivery signals on the conversation. Many
       * `AT_RISK` or `CRITICAL` chats on a single line increase the risk of line
       * flagging.
       *
       * Switch on `status` to surface chat and line health in your UI — the enum is the
       * long-term contract. Each status carries a `doc_url` that deep-links to the
       * relevant section of the Chat Health guide. To gate a send, act on the response
       * rather than the status: a `403` is the authoritative answer.
       *
       * See the [Chat Health guide](/guides/chats/chat-health) for what each status
       * means and how to react.
       */
      health_status: Chat.HealthStatus;

      /**
       * Whether this is a group chat
       */
      is_group: boolean;

      /**
       * The handle that owns this chat (your phone number)
       */
      owner_handle: Shared.ChatHandle;
    }

    export namespace Chat {
      /**
       * **[BETA]** Current health for a chat. Always present — chats start at `HEALTHY`
       * and may shift based on engagement and delivery signals on the conversation. Many
       * `AT_RISK` or `CRITICAL` chats on a single line increase the risk of line
       * flagging.
       *
       * Switch on `status` to surface chat and line health in your UI — the enum is the
       * long-term contract. Each status carries a `doc_url` that deep-links to the
       * relevant section of the Chat Health guide. To gate a send, act on the response
       * rather than the status: a `403` is the authoritative answer.
       *
       * See the [Chat Health guide](/guides/chats/chat-health) for what each status
       * means and how to react.
       */
      export interface HealthStatus {
        /**
         * Deep-link to the relevant section of the Chat Health guide for this status.
         */
        doc_url: string;

        /**
         * Current health bucket for the chat. See the
         * [Chat Health guide](/guides/chats/chat-health) for what each value means and how
         * to react. `doc_url` deep-links to the relevant section.
         *
         * `OPTED_OUT` — the recipient sent `STOP`, `UNSUBSCRIBE`, `OPTOUT`, `CANCEL`,
         * `END`, or `QUIT`. The keyword must be the whole trimmed message, never part of a
         * longer one: `STOP` counts, `please stop` does not. Most keywords must match
         * exactly, including case. `OPT OUT` is the exception — it matches in any casing,
         * with or without the space or a hyphen, so `opt out`, `Opt-Out` and `optout` all
         * count. It clears as soon as they reply again: any later message from them that
         * is not itself an opt-out keyword opts them back in immediately — a reply in any
         * conversation with you counts, the same way the block does.
         *
         * `OPTED_OUT` marks only the conversation the keyword arrived in. The block below
         * is wider than the mark, so a conversation still reading `HEALTHY` can be blocked
         * as well — gate on the `403`, not on the status. Group threads are never marked
         * and are never blocked.
         *
         * Linq enforces this: while a recipient is opted out, every send to them is
         * rejected with `403` (error code `2024`) before the message is queued, across
         * every chat and every line on your account. Nothing is delivered, including a
         * final courtesy message — to send one, set `override_optout: true` on that single
         * request.
         */
        status: 'HEALTHY' | 'AT_RISK' | 'CRITICAL' | 'OPTED_OUT';

        /**
         * When this status last changed.
         */
        updated_at: string;
      }
    }

    /**
     * The edited part
     */
    export interface Part {
      /**
       * Zero-based index of the edited part within the message
       */
      index: number;

      /**
       * New text content of the part
       */
      text: string;
    }
  }
}

/**
 * Complete webhook payload for reaction.added events
 */
export interface ReactionAddedWebhookEvent {
  /**
   * API version for the webhook payload format
   */
  api_version: string;

  /**
   * When the event was created
   */
  created_at: string;

  /**
   * Payload for reaction.added webhook events
   */
  data: ReactionEventBase;

  /**
   * Unique identifier for this event (for deduplication)
   */
  event_id: string;

  /**
   * Valid webhook event types that can be subscribed to.
   *
   * **Note:** `message.edited` is only delivered to subscriptions using
   * `webhook_version: "2026-02-03"`. Subscribing to this event on a v2025
   * subscription will not produce any deliveries.
   */
  event_type: WebhookEventsAPI.WebhookEventType;

  /**
   * Partner identifier. Present on all webhooks for cross-referencing.
   */
  partner_id: string;

  /**
   * Trace ID for debugging and correlation across systems.
   */
  trace_id: string;

  /**
   * Date-based webhook payload version. Determined by the `?version=` query
   * parameter in your webhook subscription URL. If no version parameter is
   * specified, defaults based on subscription creation date.
   */
  webhook_version: string;
}

/**
 * Complete webhook payload for reaction.removed events
 */
export interface ReactionRemovedWebhookEvent {
  /**
   * API version for the webhook payload format
   */
  api_version: string;

  /**
   * When the event was created
   */
  created_at: string;

  /**
   * Payload for reaction.removed webhook events
   */
  data: ReactionEventBase;

  /**
   * Unique identifier for this event (for deduplication)
   */
  event_id: string;

  /**
   * Valid webhook event types that can be subscribed to.
   *
   * **Note:** `message.edited` is only delivered to subscriptions using
   * `webhook_version: "2026-02-03"`. Subscribing to this event on a v2025
   * subscription will not produce any deliveries.
   */
  event_type: WebhookEventsAPI.WebhookEventType;

  /**
   * Partner identifier. Present on all webhooks for cross-referencing.
   */
  partner_id: string;

  /**
   * Trace ID for debugging and correlation across systems.
   */
  trace_id: string;

  /**
   * Date-based webhook payload version. Determined by the `?version=` query
   * parameter in your webhook subscription URL. If no version parameter is
   * specified, defaults based on subscription creation date.
   */
  webhook_version: string;
}

/**
 * Complete webhook payload for poll.received events
 */
export interface PollReceivedWebhookEvent {
  /**
   * API version for the webhook payload format
   */
  api_version: string;

  /**
   * When the event was created
   */
  created_at: string;

  /**
   * Payload for poll.received — a poll created by someone else and delivered to your
   * line. Carries the full poll snapshot (options, no voters yet) at receipt time.
   */
  data: PollReceivedWebhookEvent.Data;

  /**
   * Unique identifier for this event (for deduplication)
   */
  event_id: string;

  /**
   * Valid webhook event types that can be subscribed to.
   *
   * **Note:** `message.edited` is only delivered to subscriptions using
   * `webhook_version: "2026-02-03"`. Subscribing to this event on a v2025
   * subscription will not produce any deliveries.
   */
  event_type: WebhookEventsAPI.WebhookEventType;

  /**
   * Partner identifier. Present on all webhooks for cross-referencing.
   */
  partner_id: string;

  /**
   * Trace ID for debugging and correlation across systems.
   */
  trace_id: string;

  /**
   * Date-based webhook payload version. Determined by the `?version=` query
   * parameter in your webhook subscription URL. If no version parameter is
   * specified, defaults based on subscription creation date.
   */
  webhook_version: string;
}

export namespace PollReceivedWebhookEvent {
  /**
   * Payload for poll.received — a poll created by someone else and delivered to your
   * line. Carries the full poll snapshot (options, no voters yet) at receipt time.
   */
  export interface Data {
    /**
     * Chat info for poll webhook events.
     */
    chat: Data.Chat;

    created_at: string;

    direction: 'inbound' | 'outbound';

    message_id: string;

    poll: Data.Poll;

    received_at: string;

    service: string;

    updated_at: string;

    /**
     * The line that created the poll (is_me=false for an inbound poll).
     */
    sender_handle?: Shared.ChatHandle | null;
  }

  export namespace Data {
    /**
     * Chat info for poll webhook events.
     */
    export interface Chat {
      id: string;

      is_group?: boolean | null;

      owner_handle?: Shared.ChatHandle | null;
    }

    export interface Poll {
      options: Array<Poll.Option>;

      /**
       * Distinct participants across the whole poll.
       */
      total_voters: number;
    }

    export namespace Poll {
      export interface Option {
        can_be_edited: boolean;

        /**
         * The participant who added this option (poll creator for the initial options;
         * whoever added later ones). On a poll.updated this differs from the event's
         * `sender_handle` whenever a remote participant added the option. Null when
         * unknown.
         */
        creator_handle: Shared.ChatHandle;

        option_id: string;

        text: string;

        voters: Array<Option.Voter>;
      }

      export namespace Option {
        export interface Voter {
          handle: string;

          voted_at: string;
        }
      }
    }
  }
}

/**
 * Complete webhook payload for poll.sent events
 */
export interface PollSentWebhookEvent {
  /**
   * API version for the webhook payload format
   */
  api_version: string;

  /**
   * When the event was created
   */
  created_at: string;

  /**
   * Payload for poll.sent, poll.delivered, and poll.read webhook events. Timestamps
   * indicate state (null = not yet happened): sent → sent_at; delivered →
   * +delivered_at; read → +read_at.
   */
  data: PollSentWebhookEvent.Data;

  /**
   * Unique identifier for this event (for deduplication)
   */
  event_id: string;

  /**
   * Valid webhook event types that can be subscribed to.
   *
   * **Note:** `message.edited` is only delivered to subscriptions using
   * `webhook_version: "2026-02-03"`. Subscribing to this event on a v2025
   * subscription will not produce any deliveries.
   */
  event_type: WebhookEventsAPI.WebhookEventType;

  /**
   * Partner identifier. Present on all webhooks for cross-referencing.
   */
  partner_id: string;

  /**
   * Trace ID for debugging and correlation across systems.
   */
  trace_id: string;

  /**
   * Date-based webhook payload version. Determined by the `?version=` query
   * parameter in your webhook subscription URL. If no version parameter is
   * specified, defaults based on subscription creation date.
   */
  webhook_version: string;
}

export namespace PollSentWebhookEvent {
  /**
   * Payload for poll.sent, poll.delivered, and poll.read webhook events. Timestamps
   * indicate state (null = not yet happened): sent → sent_at; delivered →
   * +delivered_at; read → +read_at.
   */
  export interface Data {
    /**
     * Chat info for poll webhook events.
     */
    chat: Data.Chat;

    created_at: string;

    direction: 'inbound' | 'outbound';

    message_id: string;

    poll: Data.Poll;

    service: string;

    updated_at: string;

    delivered_at?: string | null;

    read_at?: string | null;

    /**
     * The handle that sent the poll.
     */
    sender_handle?: Shared.ChatHandle | null;

    sent_at?: string | null;
  }

  export namespace Data {
    /**
     * Chat info for poll webhook events.
     */
    export interface Chat {
      id: string;

      is_group?: boolean | null;

      owner_handle?: Shared.ChatHandle | null;
    }

    export interface Poll {
      options: Array<Poll.Option>;

      /**
       * Distinct participants across the whole poll.
       */
      total_voters: number;
    }

    export namespace Poll {
      export interface Option {
        can_be_edited: boolean;

        /**
         * The participant who added this option (poll creator for the initial options;
         * whoever added later ones). On a poll.updated this differs from the event's
         * `sender_handle` whenever a remote participant added the option. Null when
         * unknown.
         */
        creator_handle: Shared.ChatHandle;

        option_id: string;

        text: string;

        voters: Array<Option.Voter>;
      }

      export namespace Option {
        export interface Voter {
          handle: string;

          voted_at: string;
        }
      }
    }
  }
}

/**
 * Complete webhook payload for poll.delivered events
 */
export interface PollDeliveredWebhookEvent {
  /**
   * API version for the webhook payload format
   */
  api_version: string;

  /**
   * When the event was created
   */
  created_at: string;

  /**
   * Payload for poll.sent, poll.delivered, and poll.read webhook events. Timestamps
   * indicate state (null = not yet happened): sent → sent_at; delivered →
   * +delivered_at; read → +read_at.
   */
  data: PollDeliveredWebhookEvent.Data;

  /**
   * Unique identifier for this event (for deduplication)
   */
  event_id: string;

  /**
   * Valid webhook event types that can be subscribed to.
   *
   * **Note:** `message.edited` is only delivered to subscriptions using
   * `webhook_version: "2026-02-03"`. Subscribing to this event on a v2025
   * subscription will not produce any deliveries.
   */
  event_type: WebhookEventsAPI.WebhookEventType;

  /**
   * Partner identifier. Present on all webhooks for cross-referencing.
   */
  partner_id: string;

  /**
   * Trace ID for debugging and correlation across systems.
   */
  trace_id: string;

  /**
   * Date-based webhook payload version. Determined by the `?version=` query
   * parameter in your webhook subscription URL. If no version parameter is
   * specified, defaults based on subscription creation date.
   */
  webhook_version: string;
}

export namespace PollDeliveredWebhookEvent {
  /**
   * Payload for poll.sent, poll.delivered, and poll.read webhook events. Timestamps
   * indicate state (null = not yet happened): sent → sent_at; delivered →
   * +delivered_at; read → +read_at.
   */
  export interface Data {
    /**
     * Chat info for poll webhook events.
     */
    chat: Data.Chat;

    created_at: string;

    direction: 'inbound' | 'outbound';

    message_id: string;

    poll: Data.Poll;

    service: string;

    updated_at: string;

    delivered_at?: string | null;

    read_at?: string | null;

    /**
     * The handle that sent the poll.
     */
    sender_handle?: Shared.ChatHandle | null;

    sent_at?: string | null;
  }

  export namespace Data {
    /**
     * Chat info for poll webhook events.
     */
    export interface Chat {
      id: string;

      is_group?: boolean | null;

      owner_handle?: Shared.ChatHandle | null;
    }

    export interface Poll {
      options: Array<Poll.Option>;

      /**
       * Distinct participants across the whole poll.
       */
      total_voters: number;
    }

    export namespace Poll {
      export interface Option {
        can_be_edited: boolean;

        /**
         * The participant who added this option (poll creator for the initial options;
         * whoever added later ones). On a poll.updated this differs from the event's
         * `sender_handle` whenever a remote participant added the option. Null when
         * unknown.
         */
        creator_handle: Shared.ChatHandle;

        option_id: string;

        text: string;

        voters: Array<Option.Voter>;
      }

      export namespace Option {
        export interface Voter {
          handle: string;

          voted_at: string;
        }
      }
    }
  }
}

/**
 * Complete webhook payload for poll.read events
 */
export interface PollReadWebhookEvent {
  /**
   * API version for the webhook payload format
   */
  api_version: string;

  /**
   * When the event was created
   */
  created_at: string;

  /**
   * Payload for poll.sent, poll.delivered, and poll.read webhook events. Timestamps
   * indicate state (null = not yet happened): sent → sent_at; delivered →
   * +delivered_at; read → +read_at.
   */
  data: PollReadWebhookEvent.Data;

  /**
   * Unique identifier for this event (for deduplication)
   */
  event_id: string;

  /**
   * Valid webhook event types that can be subscribed to.
   *
   * **Note:** `message.edited` is only delivered to subscriptions using
   * `webhook_version: "2026-02-03"`. Subscribing to this event on a v2025
   * subscription will not produce any deliveries.
   */
  event_type: WebhookEventsAPI.WebhookEventType;

  /**
   * Partner identifier. Present on all webhooks for cross-referencing.
   */
  partner_id: string;

  /**
   * Trace ID for debugging and correlation across systems.
   */
  trace_id: string;

  /**
   * Date-based webhook payload version. Determined by the `?version=` query
   * parameter in your webhook subscription URL. If no version parameter is
   * specified, defaults based on subscription creation date.
   */
  webhook_version: string;
}

export namespace PollReadWebhookEvent {
  /**
   * Payload for poll.sent, poll.delivered, and poll.read webhook events. Timestamps
   * indicate state (null = not yet happened): sent → sent_at; delivered →
   * +delivered_at; read → +read_at.
   */
  export interface Data {
    /**
     * Chat info for poll webhook events.
     */
    chat: Data.Chat;

    created_at: string;

    direction: 'inbound' | 'outbound';

    message_id: string;

    poll: Data.Poll;

    service: string;

    updated_at: string;

    delivered_at?: string | null;

    read_at?: string | null;

    /**
     * The handle that sent the poll.
     */
    sender_handle?: Shared.ChatHandle | null;

    sent_at?: string | null;
  }

  export namespace Data {
    /**
     * Chat info for poll webhook events.
     */
    export interface Chat {
      id: string;

      is_group?: boolean | null;

      owner_handle?: Shared.ChatHandle | null;
    }

    export interface Poll {
      options: Array<Poll.Option>;

      /**
       * Distinct participants across the whole poll.
       */
      total_voters: number;
    }

    export namespace Poll {
      export interface Option {
        can_be_edited: boolean;

        /**
         * The participant who added this option (poll creator for the initial options;
         * whoever added later ones). On a poll.updated this differs from the event's
         * `sender_handle` whenever a remote participant added the option. Null when
         * unknown.
         */
        creator_handle: Shared.ChatHandle;

        option_id: string;

        text: string;

        voters: Array<Option.Voter>;
      }

      export namespace Option {
        export interface Voter {
          handle: string;

          voted_at: string;
        }
      }
    }
  }
}

/**
 * Complete webhook payload for poll.updated events
 */
export interface PollUpdatedWebhookEvent {
  /**
   * API version for the webhook payload format
   */
  api_version: string;

  /**
   * When the event was created
   */
  created_at: string;

  /**
   * Payload for poll.updated (option(s) added — add-only).
   */
  data: PollUpdatedWebhookEvent.Data;

  /**
   * Unique identifier for this event (for deduplication)
   */
  event_id: string;

  /**
   * Valid webhook event types that can be subscribed to.
   *
   * **Note:** `message.edited` is only delivered to subscriptions using
   * `webhook_version: "2026-02-03"`. Subscribing to this event on a v2025
   * subscription will not produce any deliveries.
   */
  event_type: WebhookEventsAPI.WebhookEventType;

  /**
   * Partner identifier. Present on all webhooks for cross-referencing.
   */
  partner_id: string;

  /**
   * Trace ID for debugging and correlation across systems.
   */
  trace_id: string;

  /**
   * Date-based webhook payload version. Determined by the `?version=` query
   * parameter in your webhook subscription URL. If no version parameter is
   * specified, defaults based on subscription creation date.
   */
  webhook_version: string;
}

export namespace PollUpdatedWebhookEvent {
  /**
   * Payload for poll.updated (option(s) added — add-only).
   */
  export interface Data {
    /**
     * Only the options this update added — never the ones the poll already had. Fetch
     * the poll to read its full option set.
     */
    added_options: Array<Data.AddedOption>;

    /**
     * Chat info for poll webhook events.
     */
    chat: Data.Chat;

    direction: 'inbound' | 'outbound';

    message_id: string;

    /**
     * Your line — the one that received or sent this update. Always present. On an
     * inbound update this is NOT who added the option: use
     * `added_options[].creator_handle` for that, which will be the remote participant.
     */
    sender_handle: Shared.ChatHandle;

    service: string;
  }

  export namespace Data {
    export interface AddedOption {
      can_be_edited: boolean;

      /**
       * The participant who added this option (poll creator for the initial options;
       * whoever added later ones). On a poll.updated this differs from the event's
       * `sender_handle` whenever a remote participant added the option. Null when
       * unknown.
       */
      creator_handle: Shared.ChatHandle;

      option_id: string;

      text: string;

      voters: Array<AddedOption.Voter>;
    }

    export namespace AddedOption {
      export interface Voter {
        handle: string;

        voted_at: string;
      }
    }

    /**
     * Chat info for poll webhook events.
     */
    export interface Chat {
      id: string;

      is_group?: boolean | null;

      owner_handle?: Shared.ChatHandle | null;
    }
  }
}

/**
 * Complete webhook payload for poll.failed events
 */
export interface PollFailedWebhookEvent {
  /**
   * API version for the webhook payload format
   */
  api_version: string;

  /**
   * When the event was created
   */
  created_at: string;

  /**
   * Payload for poll.failed — an outbound poll (or poll action) that failed to send.
   * Carries the poll snapshot at failure time plus the error and when it failed.
   */
  data: PollFailedWebhookEvent.Data;

  /**
   * Unique identifier for this event (for deduplication)
   */
  event_id: string;

  /**
   * Valid webhook event types that can be subscribed to.
   *
   * **Note:** `message.edited` is only delivered to subscriptions using
   * `webhook_version: "2026-02-03"`. Subscribing to this event on a v2025
   * subscription will not produce any deliveries.
   */
  event_type: WebhookEventsAPI.WebhookEventType;

  /**
   * Partner identifier. Present on all webhooks for cross-referencing.
   */
  partner_id: string;

  /**
   * Trace ID for debugging and correlation across systems.
   */
  trace_id: string;

  /**
   * Date-based webhook payload version. Determined by the `?version=` query
   * parameter in your webhook subscription URL. If no version parameter is
   * specified, defaults based on subscription creation date.
   */
  webhook_version: string;
}

export namespace PollFailedWebhookEvent {
  /**
   * Payload for poll.failed — an outbound poll (or poll action) that failed to send.
   * Carries the poll snapshot at failure time plus the error and when it failed.
   */
  export interface Data {
    /**
     * Chat info for poll webhook events.
     */
    chat: Data.Chat;

    direction: 'inbound' | 'outbound';

    error: Data.Error;

    failed_at: string;

    message_id: string;

    poll: Data.Poll;

    service: string;

    /**
     * Null on failure (the send never landed).
     */
    sender_handle?: Shared.ChatHandle | null;
  }

  export namespace Data {
    /**
     * Chat info for poll webhook events.
     */
    export interface Chat {
      id: string;

      is_group?: boolean | null;

      owner_handle?: Shared.ChatHandle | null;
    }

    export interface Error {
      /**
       * Error codes in webhook failure events. The possible set varies by event:
       * message.failed and poll.failed can carry 3007, 4001, 4002, 4005, 4006, 4007, or
       * 4008; the group update failure events (chat.group_name_update_failed,
       * chat.group_icon_update_failed) carry 3007 or 4001; chat.background_update_failed
       * carries 1005, 2011, 4001, or 5002.
       */
      code: number;

      message: string;
    }

    export interface Poll {
      options: Array<Poll.Option>;

      /**
       * Distinct participants across the whole poll.
       */
      total_voters: number;
    }

    export namespace Poll {
      export interface Option {
        can_be_edited: boolean;

        /**
         * The participant who added this option (poll creator for the initial options;
         * whoever added later ones). On a poll.updated this differs from the event's
         * `sender_handle` whenever a remote participant added the option. Null when
         * unknown.
         */
        creator_handle: Shared.ChatHandle;

        option_id: string;

        text: string;

        voters: Array<Option.Voter>;
      }

      export namespace Option {
        export interface Voter {
          handle: string;

          voted_at: string;
        }
      }
    }
  }
}

/**
 * Complete webhook payload for poll.vote.added events
 */
export interface PollVoteAddedWebhookEvent {
  /**
   * API version for the webhook payload format
   */
  api_version: string;

  /**
   * When the event was created
   */
  created_at: string;

  /**
   * Payload for poll.vote.added and poll.vote.removed (one option toggled).
   */
  data: PollVoteAddedWebhookEvent.Data;

  /**
   * Unique identifier for this event (for deduplication)
   */
  event_id: string;

  /**
   * Valid webhook event types that can be subscribed to.
   *
   * **Note:** `message.edited` is only delivered to subscriptions using
   * `webhook_version: "2026-02-03"`. Subscribing to this event on a v2025
   * subscription will not produce any deliveries.
   */
  event_type: WebhookEventsAPI.WebhookEventType;

  /**
   * Partner identifier. Present on all webhooks for cross-referencing.
   */
  partner_id: string;

  /**
   * Trace ID for debugging and correlation across systems.
   */
  trace_id: string;

  /**
   * Date-based webhook payload version. Determined by the `?version=` query
   * parameter in your webhook subscription URL. If no version parameter is
   * specified, defaults based on subscription creation date.
   */
  webhook_version: string;
}

export namespace PollVoteAddedWebhookEvent {
  /**
   * Payload for poll.vote.added and poll.vote.removed (one option toggled).
   */
  export interface Data {
    /**
     * Chat info for poll webhook events.
     */
    chat: Data.Chat;

    direction: 'inbound' | 'outbound';

    message_id: string;

    option_id: string;

    /**
     * The voter — always present.
     */
    sender_handle: Shared.ChatHandle;

    service: string;
  }

  export namespace Data {
    /**
     * Chat info for poll webhook events.
     */
    export interface Chat {
      id: string;

      is_group?: boolean | null;

      owner_handle?: Shared.ChatHandle | null;
    }
  }
}

/**
 * Complete webhook payload for poll.vote.removed events
 */
export interface PollVoteRemovedWebhookEvent {
  /**
   * API version for the webhook payload format
   */
  api_version: string;

  /**
   * When the event was created
   */
  created_at: string;

  /**
   * Payload for poll.vote.added and poll.vote.removed (one option toggled).
   */
  data: PollVoteRemovedWebhookEvent.Data;

  /**
   * Unique identifier for this event (for deduplication)
   */
  event_id: string;

  /**
   * Valid webhook event types that can be subscribed to.
   *
   * **Note:** `message.edited` is only delivered to subscriptions using
   * `webhook_version: "2026-02-03"`. Subscribing to this event on a v2025
   * subscription will not produce any deliveries.
   */
  event_type: WebhookEventsAPI.WebhookEventType;

  /**
   * Partner identifier. Present on all webhooks for cross-referencing.
   */
  partner_id: string;

  /**
   * Trace ID for debugging and correlation across systems.
   */
  trace_id: string;

  /**
   * Date-based webhook payload version. Determined by the `?version=` query
   * parameter in your webhook subscription URL. If no version parameter is
   * specified, defaults based on subscription creation date.
   */
  webhook_version: string;
}

export namespace PollVoteRemovedWebhookEvent {
  /**
   * Payload for poll.vote.added and poll.vote.removed (one option toggled).
   */
  export interface Data {
    /**
     * Chat info for poll webhook events.
     */
    chat: Data.Chat;

    direction: 'inbound' | 'outbound';

    message_id: string;

    option_id: string;

    /**
     * The voter — always present.
     */
    sender_handle: Shared.ChatHandle;

    service: string;
  }

  export namespace Data {
    /**
     * Chat info for poll webhook events.
     */
    export interface Chat {
      id: string;

      is_group?: boolean | null;

      owner_handle?: Shared.ChatHandle | null;
    }
  }
}

/**
 * Complete webhook payload for poll.reaction.added events
 */
export interface PollReactionAddedWebhookEvent {
  /**
   * API version for the webhook payload format
   */
  api_version: string;

  /**
   * When the event was created
   */
  created_at: string;

  /**
   * Payload for poll.reaction.added — a reaction on a poll message. Same shape as
   * reaction.added; `message_id` is the poll-definition message's ID. Poll reactions
   * are stickers, which iMessage cannot remove, so there is no removal counterpart.
   */
  data: ReactionEventBase;

  /**
   * Unique identifier for this event (for deduplication)
   */
  event_id: string;

  /**
   * Valid webhook event types that can be subscribed to.
   *
   * **Note:** `message.edited` is only delivered to subscriptions using
   * `webhook_version: "2026-02-03"`. Subscribing to this event on a v2025
   * subscription will not produce any deliveries.
   */
  event_type: WebhookEventsAPI.WebhookEventType;

  /**
   * Partner identifier. Present on all webhooks for cross-referencing.
   */
  partner_id: string;

  /**
   * Trace ID for debugging and correlation across systems.
   */
  trace_id: string;

  /**
   * Date-based webhook payload version. Determined by the `?version=` query
   * parameter in your webhook subscription URL. If no version parameter is
   * specified, defaults based on subscription creation date.
   */
  webhook_version: string;
}

/**
 * Complete webhook payload for participant.added events
 */
export interface ParticipantAddedWebhookEvent {
  /**
   * API version for the webhook payload format
   */
  api_version: string;

  /**
   * When the event was created
   */
  created_at: string;

  /**
   * Payload for participant.added webhook events
   */
  data: ParticipantAddedWebhookEvent.Data;

  /**
   * Unique identifier for this event (for deduplication)
   */
  event_id: string;

  /**
   * Valid webhook event types that can be subscribed to.
   *
   * **Note:** `message.edited` is only delivered to subscriptions using
   * `webhook_version: "2026-02-03"`. Subscribing to this event on a v2025
   * subscription will not produce any deliveries.
   */
  event_type: WebhookEventsAPI.WebhookEventType;

  /**
   * Partner identifier. Present on all webhooks for cross-referencing.
   */
  partner_id: string;

  /**
   * Trace ID for debugging and correlation across systems.
   */
  trace_id: string;

  /**
   * Date-based webhook payload version. Determined by the `?version=` query
   * parameter in your webhook subscription URL. If no version parameter is
   * specified, defaults based on subscription creation date.
   */
  webhook_version: string;
}

export namespace ParticipantAddedWebhookEvent {
  /**
   * Payload for participant.added webhook events
   */
  export interface Data {
    /**
     * @deprecated DEPRECATED: Use participant instead. Handle (phone number or email
     * address) of the added participant.
     */
    handle: string;

    /**
     * When the participant was added
     */
    added_at?: string;

    /**
     * Chat identifier (UUID) of the group chat
     */
    chat_id?: string;

    /**
     * The added participant as a full handle object
     */
    participant?: Shared.ChatHandle;
  }
}

/**
 * Complete webhook payload for participant.removed events
 */
export interface ParticipantRemovedWebhookEvent {
  /**
   * API version for the webhook payload format
   */
  api_version: string;

  /**
   * When the event was created
   */
  created_at: string;

  /**
   * Payload for participant.removed webhook events
   */
  data: ParticipantRemovedWebhookEvent.Data;

  /**
   * Unique identifier for this event (for deduplication)
   */
  event_id: string;

  /**
   * Valid webhook event types that can be subscribed to.
   *
   * **Note:** `message.edited` is only delivered to subscriptions using
   * `webhook_version: "2026-02-03"`. Subscribing to this event on a v2025
   * subscription will not produce any deliveries.
   */
  event_type: WebhookEventsAPI.WebhookEventType;

  /**
   * Partner identifier. Present on all webhooks for cross-referencing.
   */
  partner_id: string;

  /**
   * Trace ID for debugging and correlation across systems.
   */
  trace_id: string;

  /**
   * Date-based webhook payload version. Determined by the `?version=` query
   * parameter in your webhook subscription URL. If no version parameter is
   * specified, defaults based on subscription creation date.
   */
  webhook_version: string;
}

export namespace ParticipantRemovedWebhookEvent {
  /**
   * Payload for participant.removed webhook events
   */
  export interface Data {
    /**
     * @deprecated DEPRECATED: Use participant instead. Handle (phone number or email
     * address) of the removed participant.
     */
    handle: string;

    /**
     * Chat identifier (UUID) of the group chat
     */
    chat_id?: string;

    /**
     * The removed participant as a full handle object
     */
    participant?: Shared.ChatHandle;

    /**
     * When the participant was removed
     */
    removed_at?: string;
  }
}

/**
 * Complete webhook payload for chat.created events
 */
export interface ChatCreatedWebhookEvent {
  /**
   * API version for the webhook payload format
   */
  api_version: string;

  /**
   * When the event was created
   */
  created_at: string;

  /**
   * Payload for chat.created webhook events. Matches GET /v3/chats/{chatId}
   * response.
   */
  data: ChatCreatedWebhookEvent.Data;

  /**
   * Unique identifier for this event (for deduplication)
   */
  event_id: string;

  /**
   * Valid webhook event types that can be subscribed to.
   *
   * **Note:** `message.edited` is only delivered to subscriptions using
   * `webhook_version: "2026-02-03"`. Subscribing to this event on a v2025
   * subscription will not produce any deliveries.
   */
  event_type: WebhookEventsAPI.WebhookEventType;

  /**
   * Partner identifier. Present on all webhooks for cross-referencing.
   */
  partner_id: string;

  /**
   * Trace ID for debugging and correlation across systems.
   */
  trace_id: string;

  /**
   * Date-based webhook payload version. Determined by the `?version=` query
   * parameter in your webhook subscription URL. If no version parameter is
   * specified, defaults based on subscription creation date.
   */
  webhook_version: string;
}

export namespace ChatCreatedWebhookEvent {
  /**
   * Payload for chat.created webhook events. Matches GET /v3/chats/{chatId}
   * response.
   */
  export interface Data {
    /**
     * Unique identifier for the chat
     */
    id: string;

    /**
     * When the chat was created
     */
    created_at: string;

    /**
     * Display name for the chat. Defaults to a comma-separated list of recipient
     * handles. Can be updated for group chats.
     */
    display_name: string | null;

    /**
     * List of chat participants with full handle details. Always contains at least two
     * handles (your phone number and the other participant).
     */
    handles: Array<Shared.ChatHandle>;

    /**
     * **[BETA]** Current health for a chat. Always present — chats start at `HEALTHY`
     * and may shift based on engagement and delivery signals on the conversation. Many
     * `AT_RISK` or `CRITICAL` chats on a single line increase the risk of line
     * flagging.
     *
     * Switch on `status` to surface chat and line health in your UI — the enum is the
     * long-term contract. Each status carries a `doc_url` that deep-links to the
     * relevant section of the Chat Health guide. To gate a send, act on the response
     * rather than the status: a `403` is the authoritative answer.
     *
     * See the [Chat Health guide](/guides/chats/chat-health) for what each status
     * means and how to react.
     */
    health_status: Data.HealthStatus;

    /**
     * Whether this is a group chat
     */
    is_group: boolean;

    /**
     * When the chat was last updated
     */
    updated_at: string;

    /**
     * Messaging service type
     */
    service?: Shared.ServiceType | null;
  }

  export namespace Data {
    /**
     * **[BETA]** Current health for a chat. Always present — chats start at `HEALTHY`
     * and may shift based on engagement and delivery signals on the conversation. Many
     * `AT_RISK` or `CRITICAL` chats on a single line increase the risk of line
     * flagging.
     *
     * Switch on `status` to surface chat and line health in your UI — the enum is the
     * long-term contract. Each status carries a `doc_url` that deep-links to the
     * relevant section of the Chat Health guide. To gate a send, act on the response
     * rather than the status: a `403` is the authoritative answer.
     *
     * See the [Chat Health guide](/guides/chats/chat-health) for what each status
     * means and how to react.
     */
    export interface HealthStatus {
      /**
       * Deep-link to the relevant section of the Chat Health guide for this status.
       */
      doc_url: string;

      /**
       * Current health bucket for the chat. See the
       * [Chat Health guide](/guides/chats/chat-health) for what each value means and how
       * to react. `doc_url` deep-links to the relevant section.
       *
       * `OPTED_OUT` — the recipient sent `STOP`, `UNSUBSCRIBE`, `OPTOUT`, `CANCEL`,
       * `END`, or `QUIT`. The keyword must be the whole trimmed message, never part of a
       * longer one: `STOP` counts, `please stop` does not. Most keywords must match
       * exactly, including case. `OPT OUT` is the exception — it matches in any casing,
       * with or without the space or a hyphen, so `opt out`, `Opt-Out` and `optout` all
       * count. It clears as soon as they reply again: any later message from them that
       * is not itself an opt-out keyword opts them back in immediately — a reply in any
       * conversation with you counts, the same way the block does.
       *
       * `OPTED_OUT` marks only the conversation the keyword arrived in. The block below
       * is wider than the mark, so a conversation still reading `HEALTHY` can be blocked
       * as well — gate on the `403`, not on the status. Group threads are never marked
       * and are never blocked.
       *
       * Linq enforces this: while a recipient is opted out, every send to them is
       * rejected with `403` (error code `2024`) before the message is queued, across
       * every chat and every line on your account. Nothing is delivered, including a
       * final courtesy message — to send one, set `override_optout: true` on that single
       * request.
       */
      status: 'HEALTHY' | 'AT_RISK' | 'CRITICAL' | 'OPTED_OUT';

      /**
       * When this status last changed.
       */
      updated_at: string;
    }
  }
}

/**
 * Complete webhook payload for chat.group_name_updated events
 */
export interface ChatGroupNameUpdatedWebhookEvent {
  /**
   * API version for the webhook payload format
   */
  api_version: string;

  /**
   * When the event was created
   */
  created_at: string;

  /**
   * Payload for chat.group_name_updated webhook events
   */
  data: ChatGroupNameUpdatedWebhookEvent.Data;

  /**
   * Unique identifier for this event (for deduplication)
   */
  event_id: string;

  /**
   * Valid webhook event types that can be subscribed to.
   *
   * **Note:** `message.edited` is only delivered to subscriptions using
   * `webhook_version: "2026-02-03"`. Subscribing to this event on a v2025
   * subscription will not produce any deliveries.
   */
  event_type: WebhookEventsAPI.WebhookEventType;

  /**
   * Partner identifier. Present on all webhooks for cross-referencing.
   */
  partner_id: string;

  /**
   * Trace ID for debugging and correlation across systems.
   */
  trace_id: string;

  /**
   * Date-based webhook payload version. Determined by the `?version=` query
   * parameter in your webhook subscription URL. If no version parameter is
   * specified, defaults based on subscription creation date.
   */
  webhook_version: string;
}

export namespace ChatGroupNameUpdatedWebhookEvent {
  /**
   * Payload for chat.group_name_updated webhook events
   */
  export interface Data {
    /**
     * Chat identifier (UUID) of the group chat
     */
    chat_id: string;

    /**
     * When the update occurred
     */
    updated_at: string;

    /**
     * The handle who made the change.
     */
    changed_by_handle?: Shared.ChatHandle | null;

    /**
     * New group name (null if the name was removed)
     */
    new_value?: string | null;

    /**
     * Previous group name (null if no previous name)
     */
    old_value?: string | null;
  }
}

/**
 * Complete webhook payload for chat.group_icon_updated events
 */
export interface ChatGroupIconUpdatedWebhookEvent {
  /**
   * API version for the webhook payload format
   */
  api_version: string;

  /**
   * When the event was created
   */
  created_at: string;

  /**
   * Payload for chat.group_icon_updated webhook events
   */
  data: ChatGroupIconUpdatedWebhookEvent.Data;

  /**
   * Unique identifier for this event (for deduplication)
   */
  event_id: string;

  /**
   * Valid webhook event types that can be subscribed to.
   *
   * **Note:** `message.edited` is only delivered to subscriptions using
   * `webhook_version: "2026-02-03"`. Subscribing to this event on a v2025
   * subscription will not produce any deliveries.
   */
  event_type: WebhookEventsAPI.WebhookEventType;

  /**
   * Partner identifier. Present on all webhooks for cross-referencing.
   */
  partner_id: string;

  /**
   * Trace ID for debugging and correlation across systems.
   */
  trace_id: string;

  /**
   * Date-based webhook payload version. Determined by the `?version=` query
   * parameter in your webhook subscription URL. If no version parameter is
   * specified, defaults based on subscription creation date.
   */
  webhook_version: string;
}

export namespace ChatGroupIconUpdatedWebhookEvent {
  /**
   * Payload for chat.group_icon_updated webhook events
   */
  export interface Data {
    /**
     * Chat identifier (UUID) of the group chat
     */
    chat_id: string;

    /**
     * When the update occurred
     */
    updated_at: string;

    /**
     * The handle who made the change.
     */
    changed_by_handle?: Shared.ChatHandle | null;

    /**
     * New icon URL (null if the icon was removed)
     */
    new_value?: string | null;

    /**
     * Previous icon URL (null if no previous icon)
     */
    old_value?: string | null;
  }
}

/**
 * Complete webhook payload for chat.group_name_update_failed events
 */
export interface ChatGroupNameUpdateFailedWebhookEvent {
  /**
   * API version for the webhook payload format
   */
  api_version: string;

  /**
   * When the event was created
   */
  created_at: string;

  /**
   * Error details for chat.group_name_update_failed webhook events. See
   * [WebhookErrorCode](#/components/schemas/WebhookErrorCode) for the full error
   * code reference.
   */
  data: ChatGroupNameUpdateFailedWebhookEvent.Data;

  /**
   * Unique identifier for this event (for deduplication)
   */
  event_id: string;

  /**
   * Valid webhook event types that can be subscribed to.
   *
   * **Note:** `message.edited` is only delivered to subscriptions using
   * `webhook_version: "2026-02-03"`. Subscribing to this event on a v2025
   * subscription will not produce any deliveries.
   */
  event_type: WebhookEventsAPI.WebhookEventType;

  /**
   * Partner identifier. Present on all webhooks for cross-referencing.
   */
  partner_id: string;

  /**
   * Trace ID for debugging and correlation across systems.
   */
  trace_id: string;

  /**
   * Date-based webhook payload version. Determined by the `?version=` query
   * parameter in your webhook subscription URL. If no version parameter is
   * specified, defaults based on subscription creation date.
   */
  webhook_version: string;
}

export namespace ChatGroupNameUpdateFailedWebhookEvent {
  /**
   * Error details for chat.group_name_update_failed webhook events. See
   * [WebhookErrorCode](#/components/schemas/WebhookErrorCode) for the full error
   * code reference.
   */
  export interface Data {
    /**
     * Chat identifier (UUID) of the group chat
     */
    chat_id: string;

    /**
     * Error codes in webhook failure events. The possible set varies by event:
     * message.failed and poll.failed can carry 3007, 4001, 4002, 4005, 4006, 4007, or
     * 4008; the group update failure events (chat.group_name_update_failed,
     * chat.group_icon_update_failed) carry 3007 or 4001; chat.background_update_failed
     * carries 1005, 2011, 4001, or 5002.
     */
    error_code: number;

    /**
     * When the failure was detected
     */
    failed_at: string;
  }
}

/**
 * Complete webhook payload for chat.group_icon_update_failed events
 */
export interface ChatGroupIconUpdateFailedWebhookEvent {
  /**
   * API version for the webhook payload format
   */
  api_version: string;

  /**
   * When the event was created
   */
  created_at: string;

  /**
   * Error details for chat.group_icon_update_failed webhook events. See
   * [WebhookErrorCode](#/components/schemas/WebhookErrorCode) for the full error
   * code reference.
   */
  data: ChatGroupIconUpdateFailedWebhookEvent.Data;

  /**
   * Unique identifier for this event (for deduplication)
   */
  event_id: string;

  /**
   * Valid webhook event types that can be subscribed to.
   *
   * **Note:** `message.edited` is only delivered to subscriptions using
   * `webhook_version: "2026-02-03"`. Subscribing to this event on a v2025
   * subscription will not produce any deliveries.
   */
  event_type: WebhookEventsAPI.WebhookEventType;

  /**
   * Partner identifier. Present on all webhooks for cross-referencing.
   */
  partner_id: string;

  /**
   * Trace ID for debugging and correlation across systems.
   */
  trace_id: string;

  /**
   * Date-based webhook payload version. Determined by the `?version=` query
   * parameter in your webhook subscription URL. If no version parameter is
   * specified, defaults based on subscription creation date.
   */
  webhook_version: string;
}

export namespace ChatGroupIconUpdateFailedWebhookEvent {
  /**
   * Error details for chat.group_icon_update_failed webhook events. See
   * [WebhookErrorCode](#/components/schemas/WebhookErrorCode) for the full error
   * code reference.
   */
  export interface Data {
    /**
     * Chat identifier (UUID) of the group chat
     */
    chat_id: string;

    /**
     * Error codes in webhook failure events. The possible set varies by event:
     * message.failed and poll.failed can carry 3007, 4001, 4002, 4005, 4006, 4007, or
     * 4008; the group update failure events (chat.group_name_update_failed,
     * chat.group_icon_update_failed) carry 3007 or 4001; chat.background_update_failed
     * carries 1005, 2011, 4001, or 5002.
     */
    error_code: number;

    /**
     * When the failure was detected
     */
    failed_at: string;
  }
}

/**
 * Complete webhook payload for chat.typing_indicator.started events
 */
export interface ChatTypingIndicatorStartedWebhookEvent {
  /**
   * API version for the webhook payload format
   */
  api_version: string;

  /**
   * When the event was created
   */
  created_at: string;

  /**
   * Payload for chat.typing_indicator.started webhook events
   */
  data: ChatTypingIndicatorStartedWebhookEvent.Data;

  /**
   * Unique identifier for this event (for deduplication)
   */
  event_id: string;

  /**
   * Valid webhook event types that can be subscribed to.
   *
   * **Note:** `message.edited` is only delivered to subscriptions using
   * `webhook_version: "2026-02-03"`. Subscribing to this event on a v2025
   * subscription will not produce any deliveries.
   */
  event_type: WebhookEventsAPI.WebhookEventType;

  /**
   * Partner identifier. Present on all webhooks for cross-referencing.
   */
  partner_id: string;

  /**
   * Trace ID for debugging and correlation across systems.
   */
  trace_id: string;

  /**
   * Date-based webhook payload version. Determined by the `?version=` query
   * parameter in your webhook subscription URL. If no version parameter is
   * specified, defaults based on subscription creation date.
   */
  webhook_version: string;
}

export namespace ChatTypingIndicatorStartedWebhookEvent {
  /**
   * Payload for chat.typing_indicator.started webhook events
   */
  export interface Data {
    /**
     * Chat identifier
     */
    chat_id: string;
  }
}

/**
 * Complete webhook payload for chat.typing_indicator.stopped events
 */
export interface ChatTypingIndicatorStoppedWebhookEvent {
  /**
   * API version for the webhook payload format
   */
  api_version: string;

  /**
   * When the event was created
   */
  created_at: string;

  /**
   * Payload for chat.typing_indicator.stopped webhook events
   */
  data: ChatTypingIndicatorStoppedWebhookEvent.Data;

  /**
   * Unique identifier for this event (for deduplication)
   */
  event_id: string;

  /**
   * Valid webhook event types that can be subscribed to.
   *
   * **Note:** `message.edited` is only delivered to subscriptions using
   * `webhook_version: "2026-02-03"`. Subscribing to this event on a v2025
   * subscription will not produce any deliveries.
   */
  event_type: WebhookEventsAPI.WebhookEventType;

  /**
   * Partner identifier. Present on all webhooks for cross-referencing.
   */
  partner_id: string;

  /**
   * Trace ID for debugging and correlation across systems.
   */
  trace_id: string;

  /**
   * Date-based webhook payload version. Determined by the `?version=` query
   * parameter in your webhook subscription URL. If no version parameter is
   * specified, defaults based on subscription creation date.
   */
  webhook_version: string;
}

export namespace ChatTypingIndicatorStoppedWebhookEvent {
  /**
   * Payload for chat.typing_indicator.stopped webhook events
   */
  export interface Data {
    /**
     * Chat identifier
     */
    chat_id: string;
  }
}

/**
 * Complete webhook payload for chat.background_updated events
 */
export interface ChatBackgroundUpdatedWebhookEvent {
  /**
   * API version for the webhook payload format
   */
  api_version: string;

  /**
   * When the event was created
   */
  created_at: string;

  /**
   * Payload for chat.background_updated webhook events.
   */
  data: ChatBackgroundUpdatedWebhookEvent.Data;

  /**
   * Unique identifier for this event (for deduplication)
   */
  event_id: string;

  /**
   * Valid webhook event types that can be subscribed to.
   *
   * **Note:** `message.edited` is only delivered to subscriptions using
   * `webhook_version: "2026-02-03"`. Subscribing to this event on a v2025
   * subscription will not produce any deliveries.
   */
  event_type: WebhookEventsAPI.WebhookEventType;

  /**
   * Partner identifier. Present on all webhooks for cross-referencing.
   */
  partner_id: string;

  /**
   * Trace ID for debugging and correlation across systems.
   */
  trace_id: string;

  /**
   * Date-based webhook payload version. Determined by the `?version=` query
   * parameter in your webhook subscription URL. If no version parameter is
   * specified, defaults based on subscription creation date.
   */
  webhook_version: string;
}

export namespace ChatBackgroundUpdatedWebhookEvent {
  /**
   * Payload for chat.background_updated webhook events.
   */
  export interface Data {
    /**
     * Chat information
     */
    chat: Data.Chat;

    /**
     * Who changed it. `is_me` is true when your own number set it.
     */
    actor_handle?: Shared.ChatHandle | null;

    /**
     * A chat transcript background. Fields are populated per `type`.
     */
    background?: Data.Background | null;
  }

  export namespace Data {
    /**
     * Chat information
     */
    export interface Chat {
      /**
       * Chat identifier
       */
      id: string;

      /**
       * Whether this is a group chat
       */
      is_group?: boolean | null;

      /**
       * Your phone number's handle. Always has is_me=true.
       */
      owner_handle?: Shared.ChatHandle | null;
    }

    /**
     * A chat transcript background. Fields are populated per `type`.
     */
    export interface Background {
      /**
       * The background family.
       */
      type: 'color' | 'dynamic' | 'photo';

      /**
       * Photo: a hosted URL for the background image, whether you set it or a
       * participant did. Apple stores the image, not the URL it came from, so the image
       * is re-hosted and this is our URL rather than the one you supplied. `null` only
       * if the image could not be hosted.
       */
      image_url?: string | null;

      /**
       * Color: the two gradient stops as hex, top then bottom.
       */
      shades?: Array<string> | null;

      /**
       * Dynamic: the animated style.
       */
      style?: 'sky' | 'water' | 'aurora' | 'glitter' | null;

      /**
       * Color: `custom` (the stored two colors) or a named swatch. Dynamic: the variant
       * within the `style` (e.g. `sunrise`).
       */
      variant?: string | null;
    }
  }
}

/**
 * Complete webhook payload for chat.background_update_failed events
 */
export interface ChatBackgroundUpdateFailedWebhookEvent {
  /**
   * API version for the webhook payload format
   */
  api_version: string;

  /**
   * When the event was created
   */
  created_at: string;

  /**
   * Error details for chat.background_update_failed webhook events. See
   * [WebhookErrorCode](#/components/schemas/WebhookErrorCode) for the full error
   * code reference.
   */
  data: ChatBackgroundUpdateFailedWebhookEvent.Data;

  /**
   * Unique identifier for this event (for deduplication)
   */
  event_id: string;

  /**
   * Valid webhook event types that can be subscribed to.
   *
   * **Note:** `message.edited` is only delivered to subscriptions using
   * `webhook_version: "2026-02-03"`. Subscribing to this event on a v2025
   * subscription will not produce any deliveries.
   */
  event_type: WebhookEventsAPI.WebhookEventType;

  /**
   * Partner identifier. Present on all webhooks for cross-referencing.
   */
  partner_id: string;

  /**
   * Trace ID for debugging and correlation across systems.
   */
  trace_id: string;

  /**
   * Date-based webhook payload version. Determined by the `?version=` query
   * parameter in your webhook subscription URL. If no version parameter is
   * specified, defaults based on subscription creation date.
   */
  webhook_version: string;
}

export namespace ChatBackgroundUpdateFailedWebhookEvent {
  /**
   * Error details for chat.background_update_failed webhook events. See
   * [WebhookErrorCode](#/components/schemas/WebhookErrorCode) for the full error
   * code reference.
   */
  export interface Data {
    /**
     * Chat identifier (UUID) whose background update failed
     */
    chat_id: string;

    /**
     * Error codes in webhook failure events. The possible set varies by event:
     * message.failed and poll.failed can carry 3007, 4001, 4002, 4005, 4006, 4007, or
     * 4008; the group update failure events (chat.group_name_update_failed,
     * chat.group_icon_update_failed) carry 3007 or 4001; chat.background_update_failed
     * carries 1005, 2011, 4001, or 5002.
     */
    error_code: number;

    /**
     * When the failure was detected
     */
    failed_at: string;
  }
}

/**
 * Complete webhook payload for phone_number.status_updated events
 */
export interface PhoneNumberStatusUpdatedWebhookEvent {
  /**
   * API version for the webhook payload format
   */
  api_version: string;

  /**
   * When the event was created
   */
  created_at: string;

  /**
   * Payload for phone_number.status_updated webhook events
   */
  data: PhoneNumberStatusUpdatedWebhookEvent.Data;

  /**
   * Unique identifier for this event (for deduplication)
   */
  event_id: string;

  /**
   * The type of event
   */
  event_type:
    | 'message.sent'
    | 'message.received'
    | 'message.read'
    | 'message.delivered'
    | 'message.failed'
    | 'message.edited'
    | 'reaction.added'
    | 'reaction.removed'
    | 'poll.received'
    | 'poll.failed'
    | 'poll.sent'
    | 'poll.delivered'
    | 'poll.read'
    | 'poll.updated'
    | 'poll.vote.added'
    | 'poll.vote.removed'
    | 'poll.reaction.added'
    | 'participant.added'
    | 'participant.removed'
    | 'chat.created'
    | 'chat.group_name_updated'
    | 'chat.group_icon_updated'
    | 'chat.group_name_update_failed'
    | 'chat.group_icon_update_failed'
    | 'chat.background_updated'
    | 'chat.background_update_failed'
    | 'chat.typing_indicator.started'
    | 'chat.typing_indicator.stopped'
    | 'phone_number.status_updated'
    | 'contact_card.received'
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
    | 'payment.expired'
    | 'payment.declined'
    | 'payment.authorized'
    | 'connection.created'
    | 'connection.revoked';

  /**
   * Partner identifier. Present on all webhooks for cross-referencing.
   */
  partner_id: string;

  /**
   * Trace ID for debugging and correlation across systems.
   */
  trace_id: string;

  /**
   * Date-based webhook payload version. Determined by the `?version=` query
   * parameter in your webhook subscription URL. If no version parameter is
   * specified, defaults based on subscription creation date.
   */
  webhook_version: string;
}

export namespace PhoneNumberStatusUpdatedWebhookEvent {
  /**
   * Payload for phone_number.status_updated webhook events
   */
  export interface Data {
    /**
     * When the status change occurred
     */
    changed_at: string;

    /**
     * The new line reputation
     */
    new_reputation: 'HEALTHY' | 'AT_RISK' | 'CRITICAL';

    /**
     * The new service status
     */
    new_status: 'ACTIVE' | 'FLAGGED';

    /**
     * Phone number in E.164 format
     */
    phone_number: string;

    /**
     * The previous line reputation
     */
    previous_reputation: 'HEALTHY' | 'AT_RISK' | 'CRITICAL';

    /**
     * The previous service status
     */
    previous_status: 'ACTIVE' | 'FLAGGED';
  }
}

/**
 * Complete webhook payload for message.sent events (2026-02-03 format)
 */
export type UnwrapWebhookEvent =
  | MessageSentWebhookEvent
  | MessageReceivedWebhookEvent
  | MessageReadWebhookEvent
  | MessageDeliveredWebhookEvent
  | MessageFailedWebhookEvent
  | MessageEditedWebhookEvent
  | ReactionAddedWebhookEvent
  | ReactionRemovedWebhookEvent
  | PollReceivedWebhookEvent
  | PollSentWebhookEvent
  | PollDeliveredWebhookEvent
  | PollReadWebhookEvent
  | PollUpdatedWebhookEvent
  | PollFailedWebhookEvent
  | PollVoteAddedWebhookEvent
  | PollVoteRemovedWebhookEvent
  | PollReactionAddedWebhookEvent
  | ParticipantAddedWebhookEvent
  | ParticipantRemovedWebhookEvent
  | ChatCreatedWebhookEvent
  | ChatGroupNameUpdatedWebhookEvent
  | ChatGroupIconUpdatedWebhookEvent
  | ChatGroupNameUpdateFailedWebhookEvent
  | ChatGroupIconUpdateFailedWebhookEvent
  | ChatTypingIndicatorStartedWebhookEvent
  | ChatTypingIndicatorStoppedWebhookEvent
  | ChatBackgroundUpdatedWebhookEvent
  | ChatBackgroundUpdateFailedWebhookEvent
  | PhoneNumberStatusUpdatedWebhookEvent;

export declare namespace Webhooks {
  export {
    type MessageEventV2 as MessageEventV2,
    type MessagePayload as MessagePayload,
    type ReactionEventBase as ReactionEventBase,
    type SchemasMediaPartResponse as SchemasMediaPartResponse,
    type SchemasMessageEffect as SchemasMessageEffect,
    type SchemasTextPartResponse as SchemasTextPartResponse,
    type MessageSentWebhookEvent as MessageSentWebhookEvent,
    type MessageReceivedWebhookEvent as MessageReceivedWebhookEvent,
    type MessageReadWebhookEvent as MessageReadWebhookEvent,
    type MessageDeliveredWebhookEvent as MessageDeliveredWebhookEvent,
    type MessageFailedWebhookEvent as MessageFailedWebhookEvent,
    type MessageEditedWebhookEvent as MessageEditedWebhookEvent,
    type ReactionAddedWebhookEvent as ReactionAddedWebhookEvent,
    type ReactionRemovedWebhookEvent as ReactionRemovedWebhookEvent,
    type PollReceivedWebhookEvent as PollReceivedWebhookEvent,
    type PollSentWebhookEvent as PollSentWebhookEvent,
    type PollDeliveredWebhookEvent as PollDeliveredWebhookEvent,
    type PollReadWebhookEvent as PollReadWebhookEvent,
    type PollUpdatedWebhookEvent as PollUpdatedWebhookEvent,
    type PollFailedWebhookEvent as PollFailedWebhookEvent,
    type PollVoteAddedWebhookEvent as PollVoteAddedWebhookEvent,
    type PollVoteRemovedWebhookEvent as PollVoteRemovedWebhookEvent,
    type PollReactionAddedWebhookEvent as PollReactionAddedWebhookEvent,
    type ParticipantAddedWebhookEvent as ParticipantAddedWebhookEvent,
    type ParticipantRemovedWebhookEvent as ParticipantRemovedWebhookEvent,
    type ChatCreatedWebhookEvent as ChatCreatedWebhookEvent,
    type ChatGroupNameUpdatedWebhookEvent as ChatGroupNameUpdatedWebhookEvent,
    type ChatGroupIconUpdatedWebhookEvent as ChatGroupIconUpdatedWebhookEvent,
    type ChatGroupNameUpdateFailedWebhookEvent as ChatGroupNameUpdateFailedWebhookEvent,
    type ChatGroupIconUpdateFailedWebhookEvent as ChatGroupIconUpdateFailedWebhookEvent,
    type ChatTypingIndicatorStartedWebhookEvent as ChatTypingIndicatorStartedWebhookEvent,
    type ChatTypingIndicatorStoppedWebhookEvent as ChatTypingIndicatorStoppedWebhookEvent,
    type ChatBackgroundUpdatedWebhookEvent as ChatBackgroundUpdatedWebhookEvent,
    type ChatBackgroundUpdateFailedWebhookEvent as ChatBackgroundUpdateFailedWebhookEvent,
    type PhoneNumberStatusUpdatedWebhookEvent as PhoneNumberStatusUpdatedWebhookEvent,
    type UnwrapWebhookEvent as UnwrapWebhookEvent,
  };
}
