// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as Shared from './shared';

export class Webhooks extends APIResource {}

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

export declare namespace Webhooks {
  export {
    type MessageEventV2 as MessageEventV2,
    type MessagePayload as MessagePayload,
    type ReactionEventBase as ReactionEventBase,
    type SchemasMediaPartResponse as SchemasMediaPartResponse,
    type SchemasMessageEffect as SchemasMessageEffect,
    type SchemasTextPartResponse as SchemasTextPartResponse,
  };
}
