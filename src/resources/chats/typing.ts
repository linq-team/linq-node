// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * A Chat is a conversation thread with one or more participants.
 *
 * To begin a chat, you must create a Chat with at least one recipient handle.
 * Including multiple handles creates a group chat.
 *
 * When creating a chat, the `from` field specifies which of your
 * authorized phone numbers the message originates from. Your authentication token grants
 * access to one or more phone numbers, but the `from` field determines the actual sender.
 *
 * **Handle Format:**
 * - Handles can be phone numbers or email addresses
 * - Phone numbers MUST be in E.164 format (starting with +)
 * - Phone format: `+[country code][subscriber number]`
 * - Example phone: `+12223334444` (US), `+442071234567` (UK), `+81312345678` (Japan)
 * - Example email: `user@example.com`
 * - No spaces, dashes, or parentheses in phone numbers
 */
export class Typing extends APIResource {
  /**
   * Send a typing indicator to show that someone is typing in the chat.
   *
   * **Note:** Group chat typing indicators are not currently supported.
   *
   * @example
   * ```ts
   * await client.chats.typing.start(
   *   '550e8400-e29b-41d4-a716-446655440000',
   * );
   * ```
   */
  start(chatID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.post(path`/v3/chats/${chatID}/typing`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Stop the typing indicator for the chat.
   *
   * **Note:** Typing indicators are automatically stopped when a message is sent, so
   * calling this endpoint after sending a message is unnecessary.
   *
   * **Note:** Group chat typing indicators are not currently supported.
   *
   * @example
   * ```ts
   * await client.chats.typing.stop(
   *   '550e8400-e29b-41d4-a716-446655440000',
   * );
   * ```
   */
  stop(chatID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/v3/chats/${chatID}/typing`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}
