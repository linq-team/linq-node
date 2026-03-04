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
export class PhoneNumbers extends APIResource {
  /**
   * Returns all phone numbers assigned to the authenticated partner. Use this
   * endpoint to discover which phone numbers are available for use as the `from`
   * field when creating a chat, listing chats, or sending a voice memo.
   */
  list(options?: RequestOptions): APIPromise<PhoneNumberListResponse> {
    return this._client.get('/v3/phone_numbers', options);
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

export declare namespace PhoneNumbers {
  export { type PhoneNumberListResponse as PhoneNumberListResponse };
}
