// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

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
