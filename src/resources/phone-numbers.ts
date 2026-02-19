// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class PhoneNumbers extends APIResource {
  /**
   * Returns all phone numbers assigned to the authenticated partner. Use this
   * endpoint to discover which phone numbers are available for sending messages via
   * the `from` field in create chat and send message requests.
   */
  list(options?: RequestOptions): APIPromise<PhoneNumberListResponse> {
    return this._client.get('/v3/phone_numbers', options);
  }

  /**
   * **Deprecated.** Use `GET /v3/phone_numbers` instead.
   *
   * @deprecated Use `list` instead, which calls `GET /v3/phone_numbers`.
   */
  listDeprecated(options?: RequestOptions): APIPromise<PhoneNumberListDeprecatedResponse> {
    return this._client.get('/v3/phonenumbers', options);
  }
}

export interface PhoneNumberListResponse {
  /**
   * List of phone numbers assigned to the partner
   */
  phone_numbers: Array<PhoneNumberListResponse.PhoneNumber>;
}

export namespace PhoneNumberListResponse {
  export interface PhoneNumber {
    /**
     * Unique identifier for the phone number
     */
    id: string;

    /**
     * Phone number in E.164 format
     */
    phone_number: string;
  }
}

export interface PhoneNumberListDeprecatedResponse {
  /**
   * List of phone numbers assigned to the partner
   */
  phone_numbers: Array<PhoneNumberListDeprecatedResponse.PhoneNumber>;
}

export namespace PhoneNumberListDeprecatedResponse {
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

export declare namespace PhoneNumbers {
  export {
    type PhoneNumberListResponse as PhoneNumberListResponse,
    type PhoneNumberListDeprecatedResponse as PhoneNumberListDeprecatedResponse,
  };
}
