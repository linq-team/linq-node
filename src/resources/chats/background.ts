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
export class Background extends APIResource {
  /**
   * Remove the transcript background from a chat, resetting it to the default.
   *
   * @example
   * ```ts
   * await client.chats.background.remove(
   *   '550e8400-e29b-41d4-a716-446655440000',
   * );
   * ```
   */
  remove(chatID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/v3/chats/${chatID}/background`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Set the transcript background for a chat.
   *
   * Provide one of: a **color** (a named preset or a custom 2-stop gradient), a
   * **dynamic** animated style, or a **photo** (by URL). The request is accepted
   * asynchronously; the terminal result arrives via the `chat.background_updated`
   * webhook on success, or `chat.background_update_failed` on failure.
   *
   * **Group chats are supported.** Requests for RCS or SMS chats are accepted
   * (`202`) but no background is applied and no `chat.background_updated` webhook
   * fires.
   *
   * @example
   * ```ts
   * await client.chats.background.set(
   *   '550e8400-e29b-41d4-a716-446655440000',
   *   { type: 'color', variant: 'mango' },
   * );
   * ```
   */
  set(chatID: string, body: BackgroundSetParams, options?: RequestOptions): APIPromise<void> {
    return this._client.post(path`/v3/chats/${chatID}/background`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export interface BackgroundSetParams {
  /**
   * The background family.
   */
  type: 'color' | 'dynamic' | 'photo';

  /**
   * Photo: the image URL to embed in the background. Must be an absolute `https` URL
   * pointing at an image (`.jpg`, `.png`, `.heic`, `.webp`), and the image is
   * fetched and re-hosted on our CDN before the request is accepted — the same way
   * `group_chat_icon` works. A URL we cannot fetch, or one that isn't an image, is
   * rejected with a `400` (`5007`/`5006`) rather than failing later on the device.
   *
   * Example: `https://cdn.linqapp.com/u/bg.jpg`.
   */
  image_url?: string;

  /**
   * Color with `variant: custom`: the two gradient stops as hex, top then bottom —
   * e.g. `["#F2C4E1", "#F5A623"]`. Ignored for named color variants (they carry
   * their own two colors).
   */
  shades?: Array<string>;

  /**
   * Dynamic: the animated style — `sky`, `water`, or `aurora`.
   */
  style?: 'sky' | 'water' | 'aurora';

  /**
   * Color: a named swatch — `mango`, `ice`, `plum`, `deep_sea`, `green_apple`,
   * `cherry`, `bubblegum`, `tangerine`, `magenta`, `lime`, `silver`, `carbon`,
   * `stone` — or `custom` (supply `shades`). Omitting `variant` is equivalent to
   * `custom`, so it still requires `shades`.
   *
   * Dynamic: required — the variant within the `style`. `sky`: `dusk`, `haze`,
   * `sunset`, `clear`, `sunrise`, `dawn`. `water`: `light`, `dark`. `aurora`:
   * `green`, `purple`, `pink`.
   *
   * An unrecognized value is rejected with `400`.
   */
  variant?: string;
}

export declare namespace Background {
  export { type BackgroundSetParams as BackgroundSetParams };
}
