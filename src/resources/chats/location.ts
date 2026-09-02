// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * Request a contact's location, retrieve location for contacts sharing with you,
 * and subscribe to webhooks when someone starts or stops sharing.
 *
 * **Coordinates** are returned in [GeoJSON](https://datatracker.ietf.org/doc/html/rfc7946) format:
 * `[longitude, latitude]`.
 *
 * ### Reading location is poll-based
 *
 * Poll `GET /v3/chats/{chatId}/location` whenever you need the latest position.
 * **There is no webhook that pushes updated coordinates** — the
 * `location.sharing.started` / `location.sharing.stopped` webhooks fire only when a
 * contact begins or ends sharing, not on each position update. To track a moving
 * contact, poll the `GET` endpoint.
 *
 * ### Freshness
 *
 * Each feature's `properties.updated_at` tells you when that participant's
 * location was last updated — use it to judge freshness.
 *
 * ### Polling guidance
 *
 * Locations refresh on Apple's cadence, not per request — polling faster than a
 * participant's location actually updates just returns the same position. Poll at a
 * modest interval (for example, once every few minutes per chat) rather than
 * continuously.
 *
 * ### Why is location empty after `location.sharing.started` fired?
 *
 * If the contact started sharing from the **standalone Find My app** instead of the
 * Messages conversation, the share may be tied to their **Apple ID email** rather
 * than their phone number — the webhook's `shared_by` field shows the email in that
 * case. Location is readable only through a chat with the handle that shared, so
 * `GET /v3/chats/{chatId}/location` on the phone-number chat stays empty.
 *
 * The fix: have the contact stop sharing and re-share from **Find My inside the
 * Messages conversation** with your number.
 */
export class Location extends APIResource {
  /**
   * Retrieve the current location for contacts sharing with you in a chat.
   *
   * The response is wrapped in the standard `{ "success": true, "data": ... }`
   * envelope — the body is **not** a bare GeoJSON document. `data` is a
   * [GeoJSON](https://datatracker.ietf.org/doc/html/rfc7946) `FeatureCollection`
   * with a `Feature` for each participant actively sharing their location.
   *
   * Works for both 1:1 and group chats. In group chats, `data.features` contains a
   * separate feature for each participant who is sharing. Each feature's
   * `properties.handle` identifies the user.
   *
   * A participant appears as soon as their first position arrives, typically within
   * a second or two of sharing starting.
   *
   * Returns an empty `data.features` array if no one is sharing or no location data
   * is available yet. If sharing started but this stays empty, see the **Location
   * Sharing** overview.
   *
   * Poll this endpoint to track a moving contact. `properties.updated_at` reflects
   * when each participant's location was last updated. There is no coordinate-update
   * webhook. See the **Location Sharing** overview for polling guidance.
   *
   * @example
   * ```ts
   * const getChatLocationResponse =
   *   await client.chats.location.retrieve(
   *     '975d0776-bd17-4273-8337-f346b4c661b0',
   *   );
   * ```
   */
  retrieve(chatID: string, options?: RequestOptions): APIPromise<GetChatLocationResponse> {
    return this._client.get(path`/v3/chats/${chatID}/location`, {
      ...options,
      headers: buildHeaders([{ Accept: 'application/geo+json' }, options?.headers]),
    });
  }

  /**
   * Request a contact in a chat to share their location. They receive an iMessage
   * prompt and must accept before any location is available; once they do, read
   * their location coordinates with `GET /v3/chats/{chatId}/location`.
   *
   * The request is delivered asynchronously. The endpoint returns immediately with
   * `{ "success": true, "message": "Location request sent" }` and does not return
   * coordinates.
   *
   * Rejected with `409` if the recipient is already sharing — read their location
   * with `GET /v3/chats/{chatId}/location` instead of re-requesting.
   *
   * Rate limited per chat, since each request prompts the recipient's device.
   * Exceeding it returns `429` with a `Retry-After` header.
   *
   * Location requests only work in **1:1 iMessage chats** (Apple limitation):
   *
   * - Group chats (any service) return `409` with code `2016`
   *   (`GroupChatNotSupported`).
   * - 1:1 SMS and RCS chats return `409` with code `2017`
   *   (`ChatServiceNotSupported`).
   *
   * @example
   * ```ts
   * const locationRequestResponse =
   *   await client.chats.location.request(
   *     '975d0776-bd17-4273-8337-f346b4c661b0',
   *   );
   * ```
   */
  request(chatID: string, options?: RequestOptions): APIPromise<LocationRequestResponse> {
    return this._client.post(path`/v3/chats/${chatID}/location/request`, options);
  }
}

export interface GetChatLocationResponse {
  data: GetChatLocationResponse.Data;

  success: boolean;
}

export namespace GetChatLocationResponse {
  export interface Data {
    features: Array<Data.Feature>;

    type: 'FeatureCollection';
  }

  export namespace Data {
    export interface Feature {
      geometry: Feature.Geometry;

      properties: Feature.Properties;

      type: 'Feature';
    }

    export namespace Feature {
      export interface Geometry {
        /**
         * [longitude, latitude]
         */
        coordinates: Array<number>;

        type: 'Point';
      }

      export interface Properties {
        /**
         * Phone number or email of the person sharing their location
         */
        handle: string;

        /**
         * Full street address
         */
        address?: string;

        /**
         * City or locality name
         */
        locality?: string;

        /**
         * When the location was last updated
         */
        updated_at?: string;
      }
    }
  }
}

export interface LocationRequestResponse {
  message: string;

  success: boolean;
}

export declare namespace Location {
  export {
    type GetChatLocationResponse as GetChatLocationResponse,
    type LocationRequestResponse as LocationRequestResponse,
  };
}
