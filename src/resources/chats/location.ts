// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * Request and retrieve real-time location data via iMessage.
 *
 * Use these endpoints to request a contact's location, retrieve location data
 * for contacts who are sharing with you, and subscribe to webhooks when someone
 * starts or stops sharing their location.
 *
 * **Coordinates** are returned in [GeoJSON](https://datatracker.ietf.org/doc/html/rfc7946) format:
 * `[longitude, latitude]` or `[longitude, latitude, altitude]` if altitude is available.
 */
export class Location extends APIResource {
  /**
   * Send a location sharing request to a contact. They will receive an iMessage
   * prompt asking them to share their location.
   *
   * Location requests only work in **1:1 iMessage chats** (Apple limitation).
   * Attempting to request location in a group chat, or in an SMS or RCS chat,
   * returns `409` (Operation not supported on this chat's service type).
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

  /**
   * Retrieve the current location for contacts sharing with you in a chat.
   *
   * Returns a [GeoJSON](https://datatracker.ietf.org/doc/html/rfc7946)
   * `FeatureCollection` with a `Feature` for each participant actively sharing their
   * location.
   *
   * Works for both 1:1 and group chats. In group chats, returns a separate feature
   * for each participant who is sharing. Each feature's `properties.handle`
   * identifies the user.
   *
   * Returns an empty `features` array if no one is sharing or no location data is
   * available yet.
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
         * [longitude, latitude] or [longitude, latitude, altitude]
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
