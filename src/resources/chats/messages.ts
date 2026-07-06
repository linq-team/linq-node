// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as MessagesAPI from '../messages';
import { MessagesListMessagesPagination } from '../messages';
import * as Shared from '../shared';
import * as ChatsAPI from './chats';
import { APIPromise } from '../../core/api-promise';
import {
  ListMessagesPagination,
  type ListMessagesPaginationParams,
  PagePromise,
} from '../../core/pagination';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * Messages are individual communications within a chat thread.
 *
 * Messages can include text, media attachments, rich link previews, special effects
 * (like confetti or fireworks), and reactions. All messages are associated with a
 * specific chat and sent from a phone number you own.
 *
 * Messages support delivery status tracking, read receipts, and editing capabilities.
 *
 * ## Rich Link Previews
 *
 * Send a URL as a `link` part to deliver it with a rich preview card showing the
 * page's title, description, and image (when available). A `link` part must be the
 * **only** part in the message — it cannot be combined with text or media parts.
 * To send a URL without a preview card, include it in a `text` part instead.
 *
 * **Limitations:**
 * - A `link` part cannot be combined with other parts in the same message.
 * - Maximum URL length: 2,048 characters.
 *
 * ## Ephemeral Messages (Privacy Tier)
 *
 * For regulated or sensitive conversations, opt in to the **ephemeral messages** tier by contacting your Linq support contact. When enabled, every message on the covered phone numbers is automatically given a fixed **24-hour retention window** — after that window the platform permanently deletes the message from Linq storage. There is no per-message flag; ephemerality is applied automatically based on your configuration.
 *
 * You can request it at two scopes:
 *
 * | Scope | Effect |
 * |---|---|
 * | **Partner-wide** | Every outbound and inbound message on every phone number under your account is retained for 24 hours, then deleted. |
 * | **Per phone number** | Only the specified phone numbers have their messages auto-deleted. The rest follow the standard message-retention policy. |
 *
 * **Behavioral differences vs the standard default:**
 *
 * | Aspect | Standard | Ephemeral |
 * |---|---|---|
 * | Retention | Retained per the standard message-retention policy | **Hard backstop: 24 hours** from when the message is created |
 * | After expiry | Message stays retrievable | Message is permanently deleted — `GET /v3/messages/{messageId}` returns `404` and it no longer appears in `GET /v3/chats/{chatId}/messages` |
 * | Content on expiry | N/A | Text, formatting, and attachment references are scrubbed; the message is gone, not blanked out |
 * | Cross-partner isolation | Enforced | Enforced |
 *
 * **How the 24-hour window works:**
 *
 * - The window is fixed at **24 hours from message creation** (`created_at`) and cannot be configured per message.
 * - It mirrors the ephemeral *attachments* 1-day backstop, so a message and any media it carries expire together.
 * - Expiry is delivery-independent — the clock starts when the message is created, not when it is delivered or read.
 *
 * **What you observe:**
 *
 * - **No expiry timestamp is exposed.** API responses and webhook payloads do not include the deletion time. If you need it, compute `created_at + 24h` yourself.
 * - **No deletion webhook is sent.** There is no `message.deleted` event — a message simply stops being retrievable once its window passes.
 * - **Delivery is unaffected.** Ephemeral messages send, deliver, and fire the usual `message.sent` / `message.received` and status webhooks exactly like standard messages. Only retention changes.
 *
 * **When to choose ephemeral:**
 *
 * - You have a compliance requirement that the platform must not retain message content beyond a short window.
 * - The conversation is high-sensitivity (PHI, financial, identity verification) and you do not want it sitting in storage long-term.
 * - Your application is the system of record — you capture what you need from the delivery webhook in real time and do not rely on reading message history back from Linq later.
 *
 * **Important:** ephemeral applies in *both directions* — messages you send **and** messages received by the phone numbers in that scope. Because Linq can no longer return the message after 24 hours, persist anything you need to keep from the webhook payload at the time it is delivered.
 */
export class Messages extends APIResource {
  /**
   * Send a message to an existing chat. Use this endpoint when you already have a
   * chat ID and want to send additional messages to it.
   *
   * ## Message Effects
   *
   * You can add iMessage effects to make your messages more expressive. Effects are
   * optional and can be either screen effects (full-screen animations) or bubble
   * effects (message bubble animations).
   *
   * **Screen Effects:** `confetti`, `fireworks`, `lasers`, `sparkles`,
   * `celebration`, `hearts`, `love`, `balloons`, `happy_birthday`, `echo`,
   * `spotlight`
   *
   * **Bubble Effects:** `slam`, `loud`, `gentle`, `invisible`
   *
   * Only one effect type can be applied per message.
   *
   * ## Inline Text Decorations (iMessage only)
   *
   * Use the `text_decorations` array on a text part to apply styling and animations
   * to character ranges.
   *
   * Each decoration specifies a `range: [start, end)` and exactly one of `style` or
   * `animation`.
   *
   * **Styles:** `bold`, `italic`, `strikethrough`, `underline` **Animations:**
   * `big`, `small`, `shake`, `nod`, `explode`, `ripple`, `bloom`, `jitter`
   *
   * ```json
   * {
   *   "type": "text",
   *   "value": "Hello world",
   *   "text_decorations": [
   *     { "range": [0, 5], "style": "bold" },
   *     { "range": [6, 11], "animation": "shake" }
   *   ]
   * }
   * ```
   *
   * **Note:** Style ranges (bold, italic, etc.) may overlap, but animation ranges
   * must not overlap with other animations or styles. Text decorations only render
   * for iMessage recipients. For SMS/RCS, text decorations are not applied.
   *
   * @example
   * ```ts
   * const response = await client.chats.messages.send(
   *   '550e8400-e29b-41d4-a716-446655440000',
   *   {
   *     message: {
   *       parts: [{ type: 'text', value: 'Hello, world!' }],
   *     },
   *   },
   * );
   * ```
   */
  send(chatID: string, body: MessageSendParams, options?: RequestOptions): APIPromise<MessageSendResponse> {
    return this._client.post(path`/v3/chats/${chatID}/messages`, { body, ...options });
  }

  /**
   * Retrieve messages from a specific chat with pagination support.
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const message of client.chats.messages.list(
   *   '550e8400-e29b-41d4-a716-446655440000',
   * )) {
   *   // ...
   * }
   * ```
   */
  list(
    chatID: string,
    query: MessageListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<MessagesListMessagesPagination, MessagesAPI.Message> {
    return this._client.getAPIList(
      path`/v3/chats/${chatID}/messages`,
      ListMessagesPagination<MessagesAPI.Message>,
      { query, ...options },
    );
  }
}

/**
 * A message that was sent (used in CreateChat and SendMessage responses)
 */
export interface SentMessage {
  /**
   * Message identifier (UUID)
   */
  id: string;

  /**
   * When the message was created
   */
  created_at: string;

  /**
   * Current delivery status of a message
   */
  delivery_status: 'pending' | 'queued' | 'sent' | 'delivered' | 'received' | 'read' | 'failed';

  /**
   * @deprecated DEPRECATED: Use `delivery_status == "read"` instead. Whether the
   * message has been read.
   */
  is_read: boolean;

  /**
   * Message parts in order (text, media, and link)
   */
  parts: Array<
    | Shared.TextPartResponse
    | Shared.MediaPartResponse
    | Shared.LinkPartResponse
    | SentMessage.IMessageAppPartResponse
  >;

  /**
   * When the message was actually sent (null if still queued)
   */
  sent_at: string | null;

  /**
   * When the message was delivered
   */
  delivered_at?: string | null;

  /**
   * iMessage effect applied to a message (screen or bubble effect)
   */
  effect?: MessagesAPI.MessageEffect | null;

  /**
   * The sender of this message as a full handle object
   */
  from_handle?: Shared.ChatHandle | null;

  /**
   * Messaging service type
   */
  preferred_service?: Shared.ServiceType | null;

  /**
   * Indicates this message is a threaded reply to another message
   */
  reply_to?: MessagesAPI.ReplyTo | null;

  /**
   * Messaging service type
   */
  service?: Shared.ServiceType | null;
}

export namespace SentMessage {
  /**
   * An iMessage app card part.
   */
  export interface IMessageAppPartResponse {
    /**
     * Identifies the iMessage app (Messages app extension) that backs the card.
     */
    app: IMessageAppPartResponse.App;

    /**
     * Visible layout of the card. At least one of `caption`, `subcaption`,
     * `trailing_caption`, or `trailing_subcaption` must be set, otherwise the card
     * renders as an empty bubble. Any image on the card is drawn by the recipient's
     * installed app extension; it cannot be supplied here.
     */
    layout: IMessageAppPartResponse.Layout;

    /**
     * Reactions on this message part
     */
    reactions: Array<Shared.Reaction> | null;

    /**
     * Indicates this is an iMessage app card part.
     */
    type: 'imessage_app';

    /**
     * The URL delivered to the iMessage app on tap.
     */
    url: string;

    /**
     * Fallback text for surfaces that cannot render the card.
     */
    fallback_text?: string | null;
  }

  export namespace IMessageAppPartResponse {
    /**
     * Identifies the iMessage app (Messages app extension) that backs the card.
     */
    export interface App {
      /**
       * Bundle identifier of the Messages app extension. Must not contain `:`.
       */
      bundle_id: string;

      /**
       * Display name of the app, shown by Messages' fallback UI.
       */
      name: string;

      /**
       * The app's 10-character uppercase alphanumeric team identifier.
       */
      team_id: string;

      /**
       * The owning app's App Store id (optional). When set, recipients without the
       * iMessage app installed see a "Get the app" affordance.
       */
      app_store_id?: number;
    }

    /**
     * Visible layout of the card. At least one of `caption`, `subcaption`,
     * `trailing_caption`, or `trailing_subcaption` must be set, otherwise the card
     * renders as an empty bubble. Any image on the card is drawn by the recipient's
     * installed app extension; it cannot be supplied here.
     */
    export interface Layout {
      /**
       * Primary label, top-left and bold.
       */
      caption?: string;

      /**
       * Secondary label, below `caption` on the left.
       */
      subcaption?: string;

      /**
       * Label shown top-right.
       */
      trailing_caption?: string;

      /**
       * Label shown below `trailing_caption`, on the right.
       */
      trailing_subcaption?: string;
    }
  }
}

/**
 * Response for sending a message to a chat
 */
export interface MessageSendResponse {
  /**
   * Unique identifier of the chat this message was sent to
   */
  chat_id: string;

  /**
   * A message that was sent (used in CreateChat and SendMessage responses)
   */
  message: SentMessage;
}

export interface MessageSendParams {
  /**
   * Message content container. Groups all message-related fields together,
   * separating the "what" (message content) from the "where" (routing fields like
   * from/to).
   */
  message: ChatsAPI.MessageContent;
}

export interface MessageListParams extends ListMessagesPaginationParams {}

export declare namespace Messages {
  export {
    type SentMessage as SentMessage,
    type MessageSendResponse as MessageSendResponse,
    type MessageSendParams as MessageSendParams,
    type MessageListParams as MessageListParams,
  };
}

export { type MessagesListMessagesPagination };
