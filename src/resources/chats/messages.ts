// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as MessagesAPI from '../messages';
import * as ChatsAPI from './chats';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Messages extends APIResource {
  /**
   * Retrieve messages from a specific chat with pagination support.
   *
   * @example
   * ```ts
   * const messages = await client.chats.messages.list(
   *   '550e8400-e29b-41d4-a716-446655440000',
   * );
   * ```
   */
  list(
    chatID: string,
    query: MessageListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<MessageListResponse> {
    return this._client.get(path`/v3/chats/${chatID}/messages`, { query, ...options });
  }

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
   * Current delivery status of a message
   */
  delivery_status: 'pending' | 'queued' | 'sent' | 'delivered' | 'failed';

  /**
   * Whether the message has been read
   */
  is_read: boolean;

  /**
   * Message parts in order (text and media)
   */
  parts: Array<MessagesAPI.TextPart | MessagesAPI.MediaPart>;

  /**
   * When the message was sent
   */
  sent_at: string;

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
  from_handle?: MessagesAPI.ChatHandle | null;

  /**
   * Preferred service for sending this message
   */
  preferred_service?: 'iMessage' | 'SMS' | 'RCS' | null;

  /**
   * Indicates this message is a threaded reply to another message
   */
  reply_to?: MessagesAPI.ReplyTo | null;

  /**
   * Service used to send this message
   */
  service?: 'iMessage' | 'SMS' | 'RCS' | null;
}

export interface MessageListResponse {
  /**
   * List of messages
   */
  messages: Array<MessagesAPI.Message>;

  /**
   * Cursor for fetching the next page of results. Null if there are no more results
   * to fetch. Pass this value as the `cursor` parameter in the next request.
   */
  next_cursor?: string | null;
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

export interface MessageListParams {
  /**
   * Pagination cursor from previous next_cursor response
   */
  cursor?: string;

  /**
   * Maximum number of messages to return
   */
  limit?: number;
}

export interface MessageSendParams {
  /**
   * Message content container. Groups all message-related fields together,
   * separating the "what" (message content) from the "where" (routing fields like
   * from/to).
   */
  message: ChatsAPI.MessageContent;
}

export declare namespace Messages {
  export {
    type SentMessage as SentMessage,
    type MessageListResponse as MessageListResponse,
    type MessageSendResponse as MessageSendResponse,
    type MessageListParams as MessageListParams,
    type MessageSendParams as MessageSendParams,
  };
}
