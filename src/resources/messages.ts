// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

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
   *   { chat_id: '94c6bf33-31d9-40e3-a0e9-f94250ecedb9' },
   * );
   * ```
   */
  delete(messageID: string, body: MessageDeleteParams, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/v3/messages/${messageID}`, {
      body,
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
   * const reaction = await client.messages.addReaction(
   *   '69a37c7d-af4f-4b5e-af42-e28e98ce873a',
   *   { operation: 'add', type: 'love' },
   * );
   * ```
   */
  addReaction(
    messageID: string,
    body: MessageAddReactionParams,
    options?: RequestOptions,
  ): APIPromise<Reaction> {
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
   * const response = await client.messages.retrieveThread(
   *   '69a37c7d-af4f-4b5e-af42-e28e98ce873a',
   * );
   * ```
   */
  retrieveThread(
    messageID: string,
    query: MessageRetrieveThreadParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<MessageRetrieveThreadResponse> {
    return this._client.get(path`/v3/messages/${messageID}/thread`, { query, ...options });
  }
}

export interface ChatHandle {
  /**
   * Unique identifier for this handle
   */
  id: string;

  /**
   * Phone number (E.164) or email address of the participant
   */
  handle: string;

  /**
   * When this participant joined the chat
   */
  joined_at: string;

  /**
   * Service type (iMessage, SMS, RCS, etc.)
   */
  service: 'iMessage' | 'SMS' | 'RCS';

  /**
   * Whether this handle belongs to the sender (your phone number)
   */
  is_me?: boolean | null;

  /**
   * When they left (if applicable)
   */
  left_at?: string | null;

  /**
   * Participant status
   */
  status?: 'active' | 'left' | 'removed' | null;
}

/**
 * A media attachment part
 */
export interface MediaPart {
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
   * Reactions on this message part
   */
  reactions: Array<Reaction> | null;

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
  from_handle?: ChatHandle | null;

  /**
   * Message parts in order (text and media)
   */
  parts?: Array<TextPart | MediaPart> | null;

  /**
   * Preferred service for sending this message
   */
  preferred_service?: 'iMessage' | 'SMS' | 'RCS' | null;

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
   * Service used to send/receive this message
   */
  service?: 'iMessage' | 'SMS' | 'RCS' | null;
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

export interface Reaction {
  handle: ChatHandle;

  /**
   * Whether this reaction is from the current user
   */
  is_me: boolean;

  /**
   * Type of reaction. Standard iMessage tapbacks are love, like, dislike, laugh,
   * emphasize, question. Custom emoji reactions have type "custom" with the actual
   * emoji in the custom_emoji field.
   */
  type: ReactionType;

  /**
   * Custom emoji if type is "custom", null otherwise
   */
  custom_emoji?: string | null;
}

/**
 * Type of reaction. Standard iMessage tapbacks are love, like, dislike, laugh,
 * emphasize, question. Custom emoji reactions have type "custom" with the actual
 * emoji in the custom_emoji field.
 */
export type ReactionType = 'love' | 'like' | 'dislike' | 'laugh' | 'emphasize' | 'question' | 'custom';

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

/**
 * A text message part
 */
export interface TextPart {
  /**
   * Reactions on this message part
   */
  reactions: Array<Reaction> | null;

  /**
   * Indicates this is a text message part
   */
  type: 'text';

  /**
   * The text content
   */
  value: string;
}

/**
 * Response containing messages in a thread with pagination
 */
export interface MessageRetrieveThreadResponse {
  /**
   * Messages in the thread, ordered by the specified order parameter
   */
  messages: Array<Message>;

  /**
   * Cursor for fetching the next page of results (null if no more results)
   */
  next_cursor?: string | null;
}

export interface MessageDeleteParams {
  /**
   * ID of the chat containing the message to delete
   */
  chat_id: string;
}

export interface MessageAddReactionParams {
  /**
   * Whether to add or remove the reaction
   */
  operation: 'add' | 'remove';

  /**
   * Type of reaction. Standard iMessage tapbacks are love, like, dislike, laugh,
   * emphasize, question. Custom emoji reactions have type "custom" with the actual
   * emoji in the custom_emoji field.
   */
  type: ReactionType;

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

export interface MessageRetrieveThreadParams {
  /**
   * Pagination cursor from previous next_cursor response
   */
  cursor?: string;

  /**
   * Maximum number of messages to return
   */
  limit?: number;

  /**
   * Sort order for messages (asc = oldest first, desc = newest first)
   */
  order?: 'asc' | 'desc';
}

export declare namespace Messages {
  export {
    type ChatHandle as ChatHandle,
    type MediaPart as MediaPart,
    type Message as Message,
    type MessageEffect as MessageEffect,
    type Reaction as Reaction,
    type ReactionType as ReactionType,
    type ReplyTo as ReplyTo,
    type TextPart as TextPart,
    type MessageRetrieveThreadResponse as MessageRetrieveThreadResponse,
    type MessageDeleteParams as MessageDeleteParams,
    type MessageAddReactionParams as MessageAddReactionParams,
    type MessageRetrieveThreadParams as MessageRetrieveThreadParams,
  };
}
