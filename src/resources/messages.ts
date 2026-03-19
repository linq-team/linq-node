// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as Shared from './shared';
import { APIPromise } from '../core/api-promise';
import { ListMessagesPagination, type ListMessagesPaginationParams, PagePromise } from '../core/pagination';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * Messages are individual text or multimedia communications within a chat thread.
 *
 * Messages can include text, attachments, special effects (like confetti or fireworks),
 * and reactions. All messages are associated with a specific chat and sent from a
 * phone number you own.
 *
 * Messages support delivery status tracking, read receipts, and editing capabilities.
 */
export class Messages extends APIResource {
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
   * Edit the text content of a specific part of a previously sent message.
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

  /**
   * Deletes a message from the Linq API only. This does NOT unsend or remove the
   * message from the actual chat - recipients will still see the message.
   *
   * Use this endpoint to remove messages from your records and prevent them from
   * appearing in API responses.
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
   * Whether the message has been delivered
   */
  is_delivered: boolean;

  /**
   * Whether this message was sent by the authenticated user
   */
  is_from_me: boolean;

  /**
   * Whether the message has been read
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
   * Message parts in order (text and media)
   */
  parts?: Array<Shared.TextPartResponse | Shared.MediaPartResponse> | null;

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

export interface TextDecoration {
  /**
   * Character range `[start, end)` in the `value` string where the decoration
   * applies. `start` is inclusive, `end` is exclusive. _Characters are measured as
   * UTF-16 code units. Most characters count as 1; some emoji count as 2._
   */
  range: Array<number>;

  /**
   * Animated text effect to apply. Mutually exclusive with `style`.
   */
  animation?: 'big' | 'small' | 'shake' | 'nod' | 'explode' | 'ripple' | 'bloom' | 'jitter';

  /**
   * Text style to apply. Mutually exclusive with `animation`.
   */
  style?: 'bold' | 'italic' | 'strikethrough' | 'underline';
}

export interface MessageAddReactionResponse {
  message?: string;

  status?: string;

  trace_id?: string;
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

export interface MessageListMessagesThreadParams extends ListMessagesPaginationParams {
  /**
   * Sort order for messages (asc = oldest first, desc = newest first)
   */
  order?: 'asc' | 'desc';
}

export declare namespace Messages {
  export {
    type Message as Message,
    type MessageEffect as MessageEffect,
    type ReplyTo as ReplyTo,
    type TextDecoration as TextDecoration,
    type MessageAddReactionResponse as MessageAddReactionResponse,
    type MessagesListMessagesPagination as MessagesListMessagesPagination,
    type MessageUpdateParams as MessageUpdateParams,
    type MessageAddReactionParams as MessageAddReactionParams,
    type MessageListMessagesThreadParams as MessageListMessagesThreadParams,
  };
}
