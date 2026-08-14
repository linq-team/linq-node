// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

/**
 * Phone Numbers represent the phone numbers assigned to your partner account.
 *
 * Use the list phone numbers endpoint to discover which phone numbers are available
 * for sending messages.
 *
 * When creating chats, listing chats, or sending a voice memo, use one of your assigned phone numbers
 * in the `from` field.
 *
 * **Ineligible numbers.** A number can temporarily lose the ability to deliver messages.
 * While it is in that state, requests that would produce new activity on it — sending a
 * message, creating a chat, reacting, typing, group actions — are rejected with `403`
 * (error code `2027`) before anything is created. Reads keep working, so your existing
 * chats, messages, and history stay available. Omit `from` on `POST /v3/messages` and we
 * pick an eligible number for you, skipping ineligible ones; if none of your assigned
 * numbers are eligible, you get `409` (no `from` number was ever chosen, so there's no
 * specific number to blame with a `403`).
 */
export class Phonenumbers extends APIResource {
  /**
   * **Deprecated.** Use `GET /v3/phone_numbers` instead.
   *
   * @deprecated
   */
  list(options?: RequestOptions): APIPromise<PhonenumberListResponse> {
    return this._client.get('/v3/phonenumbers', options);
  }
}

export interface PhonenumberListResponse {
  /**
   * List of phone numbers assigned to the partner
   */
  phone_numbers: Array<PhonenumberListResponse.PhoneNumber>;
}

export namespace PhonenumberListResponse {
  export interface PhoneNumber {
    /**
     * Unique identifier for the phone number
     */
    id: string;

    /**
     * Phone number in E.164 format
     */
    phone_number: string;

    capabilities?: PhoneNumber.Capabilities;

    /**
     * Deprecated. Always null.
     */
    country_code?: string;

    /**
     * Deprecated. Always null.
     */
    type?: string | null;
  }

  export namespace PhoneNumber {
    export interface Capabilities {
      /**
       * Whether MMS messaging is supported
       */
      mms: boolean;

      /**
       * Whether SMS messaging is supported
       */
      sms: boolean;

      /**
       * Whether voice calls are supported
       */
      voice: boolean;
    }
  }
}

export declare namespace Phonenumbers {
  export { type PhonenumberListResponse as PhonenumberListResponse };
}
