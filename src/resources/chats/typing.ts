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
   * ## Behavior
   *
   * Typing indicators are best-effort signals that behave as follows:
   *
   * - **iMessage chats only:** Typing indicators are only supported for iMessage
   *   chats. Requests for RCS or SMS chats are accepted (`204`) but no indicator is
   *   delivered.
   *
   * - **Send a message first for reliable delivery:** Typing indicators are
   *   best-effort. If you have not sent a message in this chat recently (roughly the
   *   **last 5 minutes**), a typing indicator may not reach the recipient — the
   *   request is still accepted (`204`), but delivery is not deterministic. Once you
   *   have sent a message in the chat, typing indicators reliably reach the
   *   recipient.
   *
   * - **No delivery guarantee:** Even for active chats, a `204` response only
   *   indicates the request was accepted for processing.
   *
   * - **Direct and group chats:** Typing indicators work in both direct and group
   *   chats.
   *
   * ## Duration & keeping it visible
   *
   * - A single call shows the indicator for about **85–90 seconds**, then it clears
   *   automatically.
   *
   * - To keep it visible longer, call this endpoint again every **60 seconds**. Each
   *   call refreshes the indicator so it stays visible continuously.
   *
   * - Sending a message clears the indicator.
   *
   * - To resume typing after sending a message, call this endpoint again.
   *
   * - Incoming messages do not affect the indicator.
   *
   * ## Recipient re-opening the chat
   *
   * If the recipient brings their messaging app to the foreground while the chat has
   * an unread message, their device clears any showing typing indicator. Calling
   * this endpoint again on its own may not bring it back. To make it reappear,
   * either send a message, or call `DELETE /v3/chats/{chatId}/typing` (stop) and
   * then call start typing again.
   *
   * ## Recommended usage
   *
   * Call this endpoint when composing begins, call it again every 60 seconds while
   * composing, and send the message to clear the indicator. To clear the indicator
   * without sending a message, call `DELETE /v3/chats/{chatId}/typing`.
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
   * Immediately clears the typing indicator for the chat, without sending a message.
   *
   * The typing indicator also clears automatically when you send a message, or about
   * 85–90 seconds after the last `POST /v3/chats/{chatId}/typing` (start typing)
   * request.
   *
   * See the start typing endpoint (`POST /v3/chats/{chatId}/typing`) above for
   * behavior details.
   *
   * **Note:** Works in both direct and group chats.
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
