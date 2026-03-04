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
    type?: 'TWILIO' | 'APPLE_ID';
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
