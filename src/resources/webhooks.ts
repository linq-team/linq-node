// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as WebhooksAPI from './webhooks';
import * as Shared from './shared';
import * as WebhookEventsAPI from './webhook-events';

export class Webhooks extends APIResource {
  events(body: string): EventsWebhookEvent {
    return JSON.parse(body) as EventsWebhookEvent;
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
  parts: Array<SchemasTextPartResponse | SchemasMediaPartResponse | MessageEventV2.SchemasLinkPartResponse>;

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
     * Whether this is a group chat
     */
    is_group?: boolean | null;

    /**
     * Your phone number's handle. Always has is_me=true.
     */
    owner_handle?: Shared.ChatHandle | null;
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
  parts?: Array<SchemasTextPartResponse | SchemasMediaPartResponse | MessagePayload.SchemasLinkPartResponse>;

  /**
   * When the message was read
   */
  read_at?: string | null;

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
   * Text decorations applied to character ranges in the value
   */
  text_decorations?: Array<Shared.TextDecoration> | null;
}

/**
 * Complete webhook payload for message.sent events (2026-02-03 format)
 */
export interface MessageSentV2026_02_03WebhookEvent {
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
export interface MessageReceivedV2026_02_03WebhookEvent {
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
export interface MessageReadV2026_02_03WebhookEvent {
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
export interface MessageDeliveredV2026_02_03WebhookEvent {
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
export interface MessageFailedV2026_02_03WebhookEvent {
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
   */
  data: MessageFailedV2026_02_03WebhookEvent.Data;

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

export namespace MessageFailedV2026_02_03WebhookEvent {
  /**
   * Error details for message.failed webhook events. See
   * [WebhookErrorCode](#/components/schemas/WebhookErrorCode) for the full error
   * code reference.
   */
  export interface Data {
    /**
     * Error codes in webhook failure events (3007, 4001).
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
     * Message identifier (UUID)
     */
    message_id?: string;

    /**
     * Human-readable description of the failure
     */
    reason?: string;
  }
}

/**
 * Complete webhook payload for reaction.added events
 */
export interface ReactionAddedV2026_02_03WebhookEvent {
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
export interface ReactionRemovedV2026_02_03WebhookEvent {
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
 * Complete webhook payload for participant.added events
 */
export interface ParticipantAddedV2026_02_03WebhookEvent {
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
  data: ParticipantAddedV2026_02_03WebhookEvent.Data;

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

export namespace ParticipantAddedV2026_02_03WebhookEvent {
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
export interface ParticipantRemovedV2026_02_03WebhookEvent {
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
  data: ParticipantRemovedV2026_02_03WebhookEvent.Data;

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

export namespace ParticipantRemovedV2026_02_03WebhookEvent {
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
 * Complete webhook payload for chat.group_name_updated events
 */
export interface ChatGroupNameUpdatedV2026_02_03WebhookEvent {
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
  data: ChatGroupNameUpdatedV2026_02_03WebhookEvent.Data;

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

export namespace ChatGroupNameUpdatedV2026_02_03WebhookEvent {
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
export interface ChatGroupIconUpdatedV2026_02_03WebhookEvent {
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
  data: ChatGroupIconUpdatedV2026_02_03WebhookEvent.Data;

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

export namespace ChatGroupIconUpdatedV2026_02_03WebhookEvent {
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
export interface ChatGroupNameUpdateFailedV2026_02_03WebhookEvent {
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
  data: ChatGroupNameUpdateFailedV2026_02_03WebhookEvent.Data;

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

export namespace ChatGroupNameUpdateFailedV2026_02_03WebhookEvent {
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
     * Error codes in webhook failure events (3007, 4001).
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
export interface ChatGroupIconUpdateFailedV2026_02_03WebhookEvent {
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
  data: ChatGroupIconUpdateFailedV2026_02_03WebhookEvent.Data;

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

export namespace ChatGroupIconUpdateFailedV2026_02_03WebhookEvent {
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
     * Error codes in webhook failure events (3007, 4001).
     */
    error_code: number;

    /**
     * When the failure was detected
     */
    failed_at: string;
  }
}

/**
 * Complete webhook payload for chat.created events
 */
export interface ChatCreatedV2026_02_03WebhookEvent {
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
  data: ChatCreatedV2026_02_03WebhookEvent.Data;

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

export namespace ChatCreatedV2026_02_03WebhookEvent {
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
}

/**
 * Complete webhook payload for chat.typing_indicator.started events
 */
export interface ChatTypingIndicatorStartedV2026_02_03WebhookEvent {
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
  data: ChatTypingIndicatorStartedV2026_02_03WebhookEvent.Data;

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

export namespace ChatTypingIndicatorStartedV2026_02_03WebhookEvent {
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
export interface ChatTypingIndicatorStoppedV2026_02_03WebhookEvent {
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
  data: ChatTypingIndicatorStoppedV2026_02_03WebhookEvent.Data;

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

export namespace ChatTypingIndicatorStoppedV2026_02_03WebhookEvent {
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
 * Complete webhook payload for message.edited events (2026-02-03 format only)
 */
export interface MessageEditedV2026_02_03WebhookEvent {
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
  data: MessageEditedV2026_02_03WebhookEvent.Data;

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

export namespace MessageEditedV2026_02_03WebhookEvent {
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
       * Whether this is a group chat
       */
      is_group: boolean;

      /**
       * The handle that owns this chat (your phone number)
       */
      owner_handle: Shared.ChatHandle;
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
 * Complete webhook payload for phone_number.status_updated events
 */
export interface PhoneNumberStatusUpdatedV2026_02_03WebhookEvent {
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
  data: PhoneNumberStatusUpdatedV2026_02_03WebhookEvent.Data;

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

export namespace PhoneNumberStatusUpdatedV2026_02_03WebhookEvent {
  /**
   * Payload for phone_number.status_updated webhook events
   */
  export interface Data {
    /**
     * When the status change occurred
     */
    changed_at: string;

    /**
     * The new service status
     */
    new_status: 'ACTIVE' | 'FLAGGED';

    /**
     * Phone number in E.164 format
     */
    phone_number: string;

    /**
     * The previous service status
     */
    previous_status: 'ACTIVE' | 'FLAGGED';
  }
}

/**
 * Complete webhook payload for message.sent events (2025-01-01 format)
 */
export interface MessageSentV2025_01_01WebhookEvent {
  /**
   * API version for the webhook payload format
   */
  api_version: string;

  /**
   * When the event was created
   */
  created_at: string;

  /**
   * Unified payload for message.sent and message.received webhook events (2025-01-01
   * format)
   */
  data: MessageSentV2025_01_01WebhookEvent.Data;

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

export namespace MessageSentV2025_01_01WebhookEvent {
  /**
   * Unified payload for message.sent and message.received webhook events (2025-01-01
   * format)
   */
  export interface Data {
    /**
     * Chat identifier
     */
    chat_id?: string;

    /**
     * @deprecated DEPRECATED: Use from_handle instead. Phone number or email address
     * of the message sender.
     */
    from?: string;

    /**
     * The sender of this message as a full handle object
     */
    from_handle?: Shared.ChatHandle;

    /**
     * Idempotency key for the message. Used for deduplication of outbound messages.
     */
    idempotency_key?: string | null;

    /**
     * Whether the message was sent by us (true for sent events, false for received
     * events)
     */
    is_from_me?: boolean;

    /**
     * Whether this is a group chat
     */
    is_group?: boolean;

    /**
     * Message content nested within webhook events
     */
    message?: WebhooksAPI.MessagePayload;

    /**
     * Preferred messaging service type. Includes "auto" for default fallback behavior.
     */
    preferred_service?: 'iMessage' | 'SMS' | 'RCS' | 'auto' | null;

    /**
     * When the message was received. Null for sent events.
     */
    received_at?: string | null;

    /**
     * Our phone number that received the message as a full handle object. Null for
     * sent events.
     */
    recipient_handle?: Shared.ChatHandle | null;

    /**
     * @deprecated DEPRECATED: Use recipient_handle instead. Our phone number that
     * received the message. Null for sent events.
     */
    recipient_phone?: string | null;

    /**
     * Messaging service type
     */
    service?: Shared.ServiceType | null;
  }
}

/**
 * Complete webhook payload for message.received events (2025-01-01 format)
 */
export interface MessageReceivedV2025_01_01WebhookEvent {
  /**
   * API version for the webhook payload format
   */
  api_version: string;

  /**
   * When the event was created
   */
  created_at: string;

  /**
   * Unified payload for message.sent and message.received webhook events (2025-01-01
   * format)
   */
  data: MessageReceivedV2025_01_01WebhookEvent.Data;

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

export namespace MessageReceivedV2025_01_01WebhookEvent {
  /**
   * Unified payload for message.sent and message.received webhook events (2025-01-01
   * format)
   */
  export interface Data {
    /**
     * Chat identifier
     */
    chat_id?: string;

    /**
     * @deprecated DEPRECATED: Use from_handle instead. Phone number or email address
     * of the message sender.
     */
    from?: string;

    /**
     * The sender of this message as a full handle object
     */
    from_handle?: Shared.ChatHandle;

    /**
     * Idempotency key for the message. Used for deduplication of outbound messages.
     */
    idempotency_key?: string | null;

    /**
     * Whether the message was sent by us (true for sent events, false for received
     * events)
     */
    is_from_me?: boolean;

    /**
     * Whether this is a group chat
     */
    is_group?: boolean;

    /**
     * Message content nested within webhook events
     */
    message?: WebhooksAPI.MessagePayload;

    /**
     * Preferred messaging service type. Includes "auto" for default fallback behavior.
     */
    preferred_service?: 'iMessage' | 'SMS' | 'RCS' | 'auto' | null;

    /**
     * When the message was received. Null for sent events.
     */
    received_at?: string | null;

    /**
     * Our phone number that received the message as a full handle object. Null for
     * sent events.
     */
    recipient_handle?: Shared.ChatHandle | null;

    /**
     * @deprecated DEPRECATED: Use recipient_handle instead. Our phone number that
     * received the message. Null for sent events.
     */
    recipient_phone?: string | null;

    /**
     * Messaging service type
     */
    service?: Shared.ServiceType | null;
  }
}

/**
 * Complete webhook payload for message.read events (2025-01-01 format)
 */
export interface MessageReadV2025_01_01WebhookEvent {
  /**
   * API version for the webhook payload format
   */
  api_version: string;

  /**
   * When the event was created
   */
  created_at: string;

  /**
   * Payload for message.read webhook events (2025-01-01 format). Extends
   * MessageEvent with read_at and message_id.
   */
  data: MessageReadV2025_01_01WebhookEvent.Data;

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

export namespace MessageReadV2025_01_01WebhookEvent {
  /**
   * Payload for message.read webhook events (2025-01-01 format). Extends
   * MessageEvent with read_at and message_id.
   */
  export interface Data {
    /**
     * When the message was read
     */
    read_at: string;

    /**
     * Chat identifier
     */
    chat_id?: string;

    /**
     * @deprecated DEPRECATED: Use from_handle instead. Phone number or email address
     * of the message sender.
     */
    from?: string;

    /**
     * The sender of this message as a full handle object
     */
    from_handle?: Shared.ChatHandle;

    /**
     * Idempotency key for the message. Used for deduplication of outbound messages.
     */
    idempotency_key?: string | null;

    /**
     * Whether the message was sent by us (true for sent events, false for received
     * events)
     */
    is_from_me?: boolean;

    /**
     * Whether this is a group chat
     */
    is_group?: boolean;

    /**
     * Message content nested within webhook events
     */
    message?: WebhooksAPI.MessagePayload;

    /**
     * Message identifier (UUID)
     */
    message_id?: string;

    /**
     * Preferred messaging service type. Includes "auto" for default fallback behavior.
     */
    preferred_service?: 'iMessage' | 'SMS' | 'RCS' | 'auto' | null;

    /**
     * When the message was received. Null for sent events.
     */
    received_at?: string | null;

    /**
     * Our phone number that received the message as a full handle object. Null for
     * sent events.
     */
    recipient_handle?: Shared.ChatHandle | null;

    /**
     * @deprecated DEPRECATED: Use recipient_handle instead. Our phone number that
     * received the message. Null for sent events.
     */
    recipient_phone?: string | null;

    /**
     * Messaging service type
     */
    service?: Shared.ServiceType | null;
  }
}

/**
 * Complete webhook payload for message.delivered events (2025-01-01 format)
 */
export interface MessageDeliveredV2025_01_01WebhookEvent {
  /**
   * API version for the webhook payload format
   */
  api_version: string;

  /**
   * When the event was created
   */
  created_at: string;

  /**
   * Payload for message.delivered webhook events (2025-01-01 format). Extends
   * MessageEvent with delivered_at and message_id.
   */
  data: MessageDeliveredV2025_01_01WebhookEvent.Data;

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

export namespace MessageDeliveredV2025_01_01WebhookEvent {
  /**
   * Payload for message.delivered webhook events (2025-01-01 format). Extends
   * MessageEvent with delivered_at and message_id.
   */
  export interface Data {
    /**
     * When the message was delivered to the recipient's device
     */
    delivered_at: string;

    /**
     * Chat identifier
     */
    chat_id?: string;

    /**
     * @deprecated DEPRECATED: Use from_handle instead. Phone number or email address
     * of the message sender.
     */
    from?: string;

    /**
     * The sender of this message as a full handle object
     */
    from_handle?: Shared.ChatHandle;

    /**
     * Idempotency key for the message. Used for deduplication of outbound messages.
     */
    idempotency_key?: string | null;

    /**
     * Whether the message was sent by us (true for sent events, false for received
     * events)
     */
    is_from_me?: boolean;

    /**
     * Whether this is a group chat
     */
    is_group?: boolean;

    /**
     * Message content nested within webhook events
     */
    message?: WebhooksAPI.MessagePayload;

    /**
     * Message identifier (UUID)
     */
    message_id?: string;

    /**
     * Preferred messaging service type. Includes "auto" for default fallback behavior.
     */
    preferred_service?: 'iMessage' | 'SMS' | 'RCS' | 'auto' | null;

    /**
     * When the message was received. Null for sent events.
     */
    received_at?: string | null;

    /**
     * Our phone number that received the message as a full handle object. Null for
     * sent events.
     */
    recipient_handle?: Shared.ChatHandle | null;

    /**
     * @deprecated DEPRECATED: Use recipient_handle instead. Our phone number that
     * received the message. Null for sent events.
     */
    recipient_phone?: string | null;

    /**
     * Messaging service type
     */
    service?: Shared.ServiceType | null;
  }
}

/**
 * Complete webhook payload for message.failed events
 */
export interface MessageFailedV2025_01_01WebhookEvent {
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
   */
  data: MessageFailedV2025_01_01WebhookEvent.Data;

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

export namespace MessageFailedV2025_01_01WebhookEvent {
  /**
   * Error details for message.failed webhook events. See
   * [WebhookErrorCode](#/components/schemas/WebhookErrorCode) for the full error
   * code reference.
   */
  export interface Data {
    /**
     * Error codes in webhook failure events (3007, 4001).
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
     * Message identifier (UUID)
     */
    message_id?: string;

    /**
     * Human-readable description of the failure
     */
    reason?: string;
  }
}

/**
 * Complete webhook payload for reaction.added events
 */
export interface ReactionAddedV2025_01_01WebhookEvent {
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
export interface ReactionRemovedV2025_01_01WebhookEvent {
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
 * Complete webhook payload for participant.added events
 */
export interface ParticipantAddedV2025_01_01WebhookEvent {
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
  data: ParticipantAddedV2025_01_01WebhookEvent.Data;

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

export namespace ParticipantAddedV2025_01_01WebhookEvent {
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
export interface ParticipantRemovedV2025_01_01WebhookEvent {
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
  data: ParticipantRemovedV2025_01_01WebhookEvent.Data;

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

export namespace ParticipantRemovedV2025_01_01WebhookEvent {
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
 * Complete webhook payload for chat.group_name_updated events
 */
export interface ChatGroupNameUpdatedV2025_01_01WebhookEvent {
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
  data: ChatGroupNameUpdatedV2025_01_01WebhookEvent.Data;

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

export namespace ChatGroupNameUpdatedV2025_01_01WebhookEvent {
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
export interface ChatGroupIconUpdatedV2025_01_01WebhookEvent {
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
  data: ChatGroupIconUpdatedV2025_01_01WebhookEvent.Data;

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

export namespace ChatGroupIconUpdatedV2025_01_01WebhookEvent {
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
export interface ChatGroupNameUpdateFailedV2025_01_01WebhookEvent {
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
  data: ChatGroupNameUpdateFailedV2025_01_01WebhookEvent.Data;

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

export namespace ChatGroupNameUpdateFailedV2025_01_01WebhookEvent {
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
     * Error codes in webhook failure events (3007, 4001).
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
export interface ChatGroupIconUpdateFailedV2025_01_01WebhookEvent {
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
  data: ChatGroupIconUpdateFailedV2025_01_01WebhookEvent.Data;

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

export namespace ChatGroupIconUpdateFailedV2025_01_01WebhookEvent {
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
     * Error codes in webhook failure events (3007, 4001).
     */
    error_code: number;

    /**
     * When the failure was detected
     */
    failed_at: string;
  }
}

/**
 * Complete webhook payload for chat.created events
 */
export interface ChatCreatedV2025_01_01WebhookEvent {
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
  data: ChatCreatedV2025_01_01WebhookEvent.Data;

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

export namespace ChatCreatedV2025_01_01WebhookEvent {
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
}

/**
 * Complete webhook payload for chat.typing_indicator.started events
 */
export interface ChatTypingIndicatorStartedV2025_01_01WebhookEvent {
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
  data: ChatTypingIndicatorStartedV2025_01_01WebhookEvent.Data;

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

export namespace ChatTypingIndicatorStartedV2025_01_01WebhookEvent {
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
export interface ChatTypingIndicatorStoppedV2025_01_01WebhookEvent {
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
  data: ChatTypingIndicatorStoppedV2025_01_01WebhookEvent.Data;

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

export namespace ChatTypingIndicatorStoppedV2025_01_01WebhookEvent {
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
 * Complete webhook payload for phone_number.status_updated events
 */
export interface PhoneNumberStatusUpdatedV2025_01_01WebhookEvent {
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
  data: PhoneNumberStatusUpdatedV2025_01_01WebhookEvent.Data;

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

export namespace PhoneNumberStatusUpdatedV2025_01_01WebhookEvent {
  /**
   * Payload for phone_number.status_updated webhook events
   */
  export interface Data {
    /**
     * When the status change occurred
     */
    changed_at: string;

    /**
     * The new service status
     */
    new_status: 'ACTIVE' | 'FLAGGED';

    /**
     * Phone number in E.164 format
     */
    phone_number: string;

    /**
     * The previous service status
     */
    previous_status: 'ACTIVE' | 'FLAGGED';
  }
}

/**
 * Complete webhook payload for message.sent events (2026-02-03 format)
 */
export type EventsWebhookEvent =
  | MessageSentV2026_02_03WebhookEvent
  | MessageReceivedV2026_02_03WebhookEvent
  | MessageReadV2026_02_03WebhookEvent
  | MessageDeliveredV2026_02_03WebhookEvent
  | MessageFailedV2026_02_03WebhookEvent
  | ReactionAddedV2026_02_03WebhookEvent
  | ReactionRemovedV2026_02_03WebhookEvent
  | ParticipantAddedV2026_02_03WebhookEvent
  | ParticipantRemovedV2026_02_03WebhookEvent
  | ChatGroupNameUpdatedV2026_02_03WebhookEvent
  | ChatGroupIconUpdatedV2026_02_03WebhookEvent
  | ChatGroupNameUpdateFailedV2026_02_03WebhookEvent
  | ChatGroupIconUpdateFailedV2026_02_03WebhookEvent
  | ChatCreatedV2026_02_03WebhookEvent
  | ChatTypingIndicatorStartedV2026_02_03WebhookEvent
  | ChatTypingIndicatorStoppedV2026_02_03WebhookEvent
  | MessageEditedV2026_02_03WebhookEvent
  | PhoneNumberStatusUpdatedV2026_02_03WebhookEvent
  | MessageSentV2025_01_01WebhookEvent
  | MessageReceivedV2025_01_01WebhookEvent
  | MessageReadV2025_01_01WebhookEvent
  | MessageDeliveredV2025_01_01WebhookEvent
  | MessageFailedV2025_01_01WebhookEvent
  | ReactionAddedV2025_01_01WebhookEvent
  | ReactionRemovedV2025_01_01WebhookEvent
  | ParticipantAddedV2025_01_01WebhookEvent
  | ParticipantRemovedV2025_01_01WebhookEvent
  | ChatGroupNameUpdatedV2025_01_01WebhookEvent
  | ChatGroupIconUpdatedV2025_01_01WebhookEvent
  | ChatGroupNameUpdateFailedV2025_01_01WebhookEvent
  | ChatGroupIconUpdateFailedV2025_01_01WebhookEvent
  | ChatCreatedV2025_01_01WebhookEvent
  | ChatTypingIndicatorStartedV2025_01_01WebhookEvent
  | ChatTypingIndicatorStoppedV2025_01_01WebhookEvent
  | PhoneNumberStatusUpdatedV2025_01_01WebhookEvent;

export declare namespace Webhooks {
  export {
    type MessageEventV2 as MessageEventV2,
    type MessagePayload as MessagePayload,
    type ReactionEventBase as ReactionEventBase,
    type SchemasMediaPartResponse as SchemasMediaPartResponse,
    type SchemasMessageEffect as SchemasMessageEffect,
    type SchemasTextPartResponse as SchemasTextPartResponse,
    type MessageSentV2026_02_03WebhookEvent as MessageSentV2026_02_03WebhookEvent,
    type MessageReceivedV2026_02_03WebhookEvent as MessageReceivedV2026_02_03WebhookEvent,
    type MessageReadV2026_02_03WebhookEvent as MessageReadV2026_02_03WebhookEvent,
    type MessageDeliveredV2026_02_03WebhookEvent as MessageDeliveredV2026_02_03WebhookEvent,
    type MessageFailedV2026_02_03WebhookEvent as MessageFailedV2026_02_03WebhookEvent,
    type ReactionAddedV2026_02_03WebhookEvent as ReactionAddedV2026_02_03WebhookEvent,
    type ReactionRemovedV2026_02_03WebhookEvent as ReactionRemovedV2026_02_03WebhookEvent,
    type ParticipantAddedV2026_02_03WebhookEvent as ParticipantAddedV2026_02_03WebhookEvent,
    type ParticipantRemovedV2026_02_03WebhookEvent as ParticipantRemovedV2026_02_03WebhookEvent,
    type ChatGroupNameUpdatedV2026_02_03WebhookEvent as ChatGroupNameUpdatedV2026_02_03WebhookEvent,
    type ChatGroupIconUpdatedV2026_02_03WebhookEvent as ChatGroupIconUpdatedV2026_02_03WebhookEvent,
    type ChatGroupNameUpdateFailedV2026_02_03WebhookEvent as ChatGroupNameUpdateFailedV2026_02_03WebhookEvent,
    type ChatGroupIconUpdateFailedV2026_02_03WebhookEvent as ChatGroupIconUpdateFailedV2026_02_03WebhookEvent,
    type ChatCreatedV2026_02_03WebhookEvent as ChatCreatedV2026_02_03WebhookEvent,
    type ChatTypingIndicatorStartedV2026_02_03WebhookEvent as ChatTypingIndicatorStartedV2026_02_03WebhookEvent,
    type ChatTypingIndicatorStoppedV2026_02_03WebhookEvent as ChatTypingIndicatorStoppedV2026_02_03WebhookEvent,
    type MessageEditedV2026_02_03WebhookEvent as MessageEditedV2026_02_03WebhookEvent,
    type PhoneNumberStatusUpdatedV2026_02_03WebhookEvent as PhoneNumberStatusUpdatedV2026_02_03WebhookEvent,
    type MessageSentV2025_01_01WebhookEvent as MessageSentV2025_01_01WebhookEvent,
    type MessageReceivedV2025_01_01WebhookEvent as MessageReceivedV2025_01_01WebhookEvent,
    type MessageReadV2025_01_01WebhookEvent as MessageReadV2025_01_01WebhookEvent,
    type MessageDeliveredV2025_01_01WebhookEvent as MessageDeliveredV2025_01_01WebhookEvent,
    type MessageFailedV2025_01_01WebhookEvent as MessageFailedV2025_01_01WebhookEvent,
    type ReactionAddedV2025_01_01WebhookEvent as ReactionAddedV2025_01_01WebhookEvent,
    type ReactionRemovedV2025_01_01WebhookEvent as ReactionRemovedV2025_01_01WebhookEvent,
    type ParticipantAddedV2025_01_01WebhookEvent as ParticipantAddedV2025_01_01WebhookEvent,
    type ParticipantRemovedV2025_01_01WebhookEvent as ParticipantRemovedV2025_01_01WebhookEvent,
    type ChatGroupNameUpdatedV2025_01_01WebhookEvent as ChatGroupNameUpdatedV2025_01_01WebhookEvent,
    type ChatGroupIconUpdatedV2025_01_01WebhookEvent as ChatGroupIconUpdatedV2025_01_01WebhookEvent,
    type ChatGroupNameUpdateFailedV2025_01_01WebhookEvent as ChatGroupNameUpdateFailedV2025_01_01WebhookEvent,
    type ChatGroupIconUpdateFailedV2025_01_01WebhookEvent as ChatGroupIconUpdateFailedV2025_01_01WebhookEvent,
    type ChatCreatedV2025_01_01WebhookEvent as ChatCreatedV2025_01_01WebhookEvent,
    type ChatTypingIndicatorStartedV2025_01_01WebhookEvent as ChatTypingIndicatorStartedV2025_01_01WebhookEvent,
    type ChatTypingIndicatorStoppedV2025_01_01WebhookEvent as ChatTypingIndicatorStoppedV2025_01_01WebhookEvent,
    type PhoneNumberStatusUpdatedV2025_01_01WebhookEvent as PhoneNumberStatusUpdatedV2025_01_01WebhookEvent,
    type EventsWebhookEvent as EventsWebhookEvent,
  };
}
