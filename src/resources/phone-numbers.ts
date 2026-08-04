// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

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
   * Updates the forwarding number for a phone number. The forwarding number is where
   * inbound calls will be forwarded to.
   *
   * Pass an empty string to clear the forwarding number.
   *
   * @example
   * ```ts
   * const phoneNumber = await client.phoneNumbers.update(
   *   '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
   *   { forwarding_number: '+12025559999' },
   * );
   * ```
   */
  update(
    phoneNumberID: string,
    body: PhoneNumberUpdateParams,
    options?: RequestOptions,
  ): APIPromise<PhoneNumberUpdateResponse> {
    return this._client.put(path`/v3/phone_numbers/${phoneNumberID}`, { body, ...options });
  }

  /**
   * Returns all phone numbers assigned to the authenticated partner. Use this
   * endpoint to discover which phone numbers are available for use as the `from`
   * field when creating a chat, listing chats, or sending a voice memo.
   *
   * @example
   * ```ts
   * const phoneNumbers = await client.phoneNumbers.list();
   * ```
   */
  list(options?: RequestOptions): APIPromise<PhoneNumberListResponse> {
    return this._client.get('/v3/phone_numbers', options);
  }
}

export interface PhoneNumberUpdateResponse {
  /**
   * Unique identifier for the phone number
   */
  id: string;

  /**
   * The forwarding number after the update. Null when cleared.
   */
  forwarding_number: string | null;

  /**
   * Phone number in E.164 format
   */
  phone_number: string;
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

    /**
     * **[BETA]** Current reputation for a phone line. Always present — lines start at
     * `HEALTHY` and may shift based on aggregate engagement and delivery signals
     * across all conversations on the line.
     *
     * Unlike chat health, line reputation does not include `opted_out` — opt-out
     * applies to individual recipients, not the whole line.
     *
     * See the [Phone Reputation guide](/guides/phone-numbers/phone-reputation) for
     * what each status means and how to react.
     */
    reputation: PhoneNumber.Reputation;

    /**
     * The forwarding number associated with this phone number, in E.164 format. Null
     * when no forwarding number is configured.
     */
    forwarding_number?: string | null;
  }

  export namespace PhoneNumber {
    /**
     * **[BETA]** Current reputation for a phone line. Always present — lines start at
     * `HEALTHY` and may shift based on aggregate engagement and delivery signals
     * across all conversations on the line.
     *
     * Unlike chat health, line reputation does not include `opted_out` — opt-out
     * applies to individual recipients, not the whole line.
     *
     * See the [Phone Reputation guide](/guides/phone-numbers/phone-reputation) for
     * what each status means and how to react.
     */
    export interface Reputation {
      /**
       * Deep-link to the relevant section of the Phone Reputation guide for this status.
       */
      doc_url: string;

      /**
       * Current reputation of this phone line.
       *
       * - `HEALTHY` — The line is in good standing. Send normally.
       * - `AT_RISK` — Warning signs on the line: engagement is low across many of its
       *   conversations, or it's starting too many brand-new conversations in a single
       *   day — and a spike in send volume can add to either. Slow the line's send pace,
       *   avoid opening many new conversations at once, and review your messaging
       *   patterns.
       * - `CRITICAL` — Strong signals that messages from this line aren't landing well.
       *   Pause outbound on the line until it recovers.
       *
       * Defaults to `HEALTHY` for lines that have not yet been scored.
       */
      status: 'HEALTHY' | 'AT_RISK' | 'CRITICAL';
    }
  }
}

export interface PhoneNumberUpdateParams {
  /**
   * The forwarding number in E.164 format. Set to null or empty string to clear.
   */
  forwarding_number: string | null;
}

export declare namespace PhoneNumbers {
  export {
    type PhoneNumberUpdateResponse as PhoneNumberUpdateResponse,
    type PhoneNumberListResponse as PhoneNumberListResponse,
    type PhoneNumberUpdateParams as PhoneNumberUpdateParams,
  };
}
