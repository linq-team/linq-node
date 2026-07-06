// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as Shared from './shared';
import { APIPromise } from '../core/api-promise';
import { ListMessagesPagination, type ListMessagesPaginationParams, PagePromise } from '../core/pagination';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

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
   * Retrieve all messages in a conversation thread. Given any message ID in the
   * thread, returns the originator message and all replies in chronological order.
   *
   * If the message is not part of a thread, returns just that single message.
   *
   * Supports pagination and configurable ordering.
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const message of client.messages.listMessagesThread(
   *   '69a37c7d-af4f-4b5e-af42-e28e98ce873a',
   * )) {
   *   // ...
   * }
   * ```
   */
  listMessagesThread(
    messageID: string,
    query: MessageListMessagesThreadParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<MessagesListMessagesPagination, Message> {
    return this._client.getAPIList(path`/v3/messages/${messageID}/thread`, ListMessagesPagination<Message>, {
      query,
      ...options,
    });
  }

  /**
   * Retrieve a specific message by its ID. This endpoint returns the full message
   * details including text, attachments, reactions, and metadata.
   *
   * @example
   * ```ts
   * const message = await client.messages.retrieve(
   *   '69a37c7d-af4f-4b5e-af42-e28e98ce873a',
   * );
   * ```
   */
  retrieve(messageID: string, options?: RequestOptions): APIPromise<Message> {
    return this._client.get(path`/v3/messages/${messageID}`, options);
  }

  /**
   * Deletes a message from the Linq API only. This does NOT unsend or remove the
   * message from the actual chat — recipients will still see the message.
   *
   * @example
   * ```ts
   * await client.messages.delete(
   *   '69a37c7d-af4f-4b5e-af42-e28e98ce873a',
   * );
   * ```
   */
  delete(messageID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/v3/messages/${messageID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Add or remove emoji reactions to messages. Reactions let users express their
   * response to a message without sending a new message.
   *
   * **Supported Reactions:**
   *
   * - love ❤️
   * - like 👍
   * - dislike 👎
   * - laugh 😂
   * - emphasize ‼️
   * - question ❓
   * - custom - any emoji (use `custom_emoji` field to specify)
   *
   * @example
   * ```ts
   * const response = await client.messages.addReaction(
   *   '69a37c7d-af4f-4b5e-af42-e28e98ce873a',
   *   { operation: 'add', type: 'love' },
   * );
   * ```
   */
  addReaction(
    messageID: string,
    body: MessageAddReactionParams,
    options?: RequestOptions,
  ): APIPromise<MessageAddReactionResponse> {
    return this._client.post(path`/v3/messages/${messageID}/reactions`, { body, ...options });
  }

  /**
   * Edit the text content of a specific part of a previously sent message.
   *
   * **Note:** A message can be edited up to 5 times, and only within 15 minutes of
   * when it was originally sent.
   *
   * @example
   * ```ts
   * const message = await client.messages.update(
   *   '69a37c7d-af4f-4b5e-af42-e28e98ce873a',
   *   { text: 'This is the edited message content' },
   * );
   * ```
   */
  update(messageID: string, body: MessageUpdateParams, options?: RequestOptions): APIPromise<Message> {
    return this._client.patch(path`/v3/messages/${messageID}`, { body, ...options });
  }
}

export type MessagesListMessagesPagination = ListMessagesPagination<Message>;

export interface Message {
  /**
   * Unique identifier for the message
   */
  id: string;

  /**
   * ID of the chat this message belongs to
   */
  chat_id: string;

  /**
   * When the message was created
   */
  created_at: string;

  /**
   * Current delivery status of a message
   */
  delivery_status: 'pending' | 'queued' | 'sent' | 'delivered' | 'received' | 'read' | 'failed';

  /**
   * @deprecated DEPRECATED: Use `delivery_status` instead (true when
   * `delivery_status` is `delivered` or `read`). Whether the message has been
   * delivered.
   */
  is_delivered: boolean;

  /**
   * Whether this message was sent by the authenticated user
   */
  is_from_me: boolean;

  /**
   * @deprecated DEPRECATED: Use `delivery_status == "read"` instead. Whether the
   * message has been read.
   */
  is_read: boolean;

  /**
   * When the message was last updated
   */
  updated_at: string;

  /**
   * When the message was delivered
   */
  delivered_at?: string | null;

  /**
   * iMessage effect applied to a message (screen or bubble effect)
   */
  effect?: MessageEffect | null;

  /**
   * @deprecated DEPRECATED: Use from_handle instead. Phone number of the message
   * sender.
   */
  from?: string | null;

  /**
   * The sender of this message as a full handle object
   */
  from_handle?: Shared.ChatHandle | null;

  /**
   * Message parts in order (text, media, and link)
   */
  parts?: Array<
    | Shared.TextPartResponse
    | Shared.MediaPartResponse
    | Shared.LinkPartResponse
    | Message.IMessageAppPartResponse
  > | null;

  /**
   * Messaging service type
   */
  preferred_service?: Shared.ServiceType | null;

  /**
   * When the message was read
   */
  read_at?: string | null;

  /**
   * Indicates this message is a threaded reply to another message
   */
  reply_to?: ReplyTo | null;

  /**
   * When the message was sent
   */
  sent_at?: string | null;

  /**
   * Messaging service type
   */
  service?: Shared.ServiceType | null;
}

export namespace Message {
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
 * iMessage effect applied to a message (screen or bubble effect)
 */
export interface MessageEffect {
  /**
   * Name of the effect. Common values:
   *
   * - Screen effects: confetti, fireworks, lasers, sparkles, celebration, hearts,
   *   love, balloons, happy_birthday, echo, spotlight
   * - Bubble effects: slam, loud, gentle, invisible
   */
  name?: string;

  /**
   * Type of effect
   */
  type?: 'screen' | 'bubble';
}

/**
 * Indicates this message is a threaded reply to another message
 */
export interface ReplyTo {
  /**
   * The ID of the message to reply to
   */
  message_id: string;

  /**
   * The specific message part to reply to (0-based index). Defaults to 0 (first
   * part) if not provided. Use this when replying to a specific part of a multipart
   * message.
   */
  part_index?: number;
}

export interface MessageAddReactionResponse {
  message?: string;

  status?: string;

  trace_id?: string;
}

export interface MessageListMessagesThreadParams extends ListMessagesPaginationParams {
  /**
   * Sort order for messages (asc = oldest first, desc = newest first)
   */
  order?: 'asc' | 'desc';
}

export interface MessageAddReactionParams {
  /**
   * Whether to add or remove the reaction
   */
  operation: 'add' | 'remove';

  /**
   * Type of reaction. Standard iMessage tapbacks are love, like, dislike, laugh,
   * emphasize, question. Custom emoji reactions have type "custom" with the actual
   * emoji in the custom_emoji field. Sticker reactions have type "sticker" with
   * sticker attachment details in the sticker field.
   */
  type: Shared.ReactionType;

  /**
   * Custom emoji string. Required when type is "custom".
   */
  custom_emoji?: string;

  /**
   * Optional index of the message part to react to. If not provided, reacts to the
   * entire message (part 0).
   */
  part_index?: number;
}

export interface MessageUpdateParams {
  /**
   * New text content for the message part
   */
  text: string;

  /**
   * Index of the message part to edit. Defaults to 0.
   */
  part_index?: number;
}

export declare namespace Messages {
  export {
    type Message as Message,
    type MessageEffect as MessageEffect,
    type ReplyTo as ReplyTo,
    type MessageAddReactionResponse as MessageAddReactionResponse,
    type MessagesListMessagesPagination as MessagesListMessagesPagination,
    type MessageListMessagesThreadParams as MessageListMessagesThreadParams,
    type MessageAddReactionParams as MessageAddReactionParams,
    type MessageUpdateParams as MessageUpdateParams,
  };
}
