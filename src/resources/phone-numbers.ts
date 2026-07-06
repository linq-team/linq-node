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
     * @deprecated **[BETA]** Current reputation for a phone line. Always present —
     * lines start at `HEALTHY` and may shift based on aggregate engagement and
     * delivery signals across all conversations on the line.
     *
     * Unlike chat health, line reputation does not include `opted_out` — opt-out
     * applies to individual recipients, not the whole line.
     *
     * See the [Phone Reputation guide](/guides/phone-numbers/phone-reputation) for
     * what each status means and how to react.
     */
    health_status: PhoneNumber.HealthStatus;

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
     * @deprecated **[BETA]** Current reputation for a phone line. Always present —
     * lines start at `HEALTHY` and may shift based on aggregate engagement and
     * delivery signals across all conversations on the line.
     *
     * Unlike chat health, line reputation does not include `opted_out` — opt-out
     * applies to individual recipients, not the whole line.
     *
     * See the [Phone Reputation guide](/guides/phone-numbers/phone-reputation) for
     * what each status means and how to react.
     */
    export interface HealthStatus {
      /**
       * Deep-link to the relevant section of the Phone Reputation guide for this status.
       */
      doc_url: string;

      /**
       * Current reputation of this phone line as assessed by risk-service.
       *
       * - `HEALTHY` — No elevated risk detected.
       * - `AT_RISK` — Elevated risk indicators present; consider reducing send volume or
       *   reviewing messaging patterns.
       * - `CRITICAL` — High risk; further sending may result in line flagging or
       *   restriction.
       *
       * Defaults to `HEALTHY` for lines that have not yet been scored.
       */
      status: 'HEALTHY' | 'AT_RISK' | 'CRITICAL';
    }

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
       * Current reputation of this phone line as assessed by risk-service.
       *
       * - `HEALTHY` — No elevated risk detected.
       * - `AT_RISK` — Elevated risk indicators present; consider reducing send volume or
       *   reviewing messaging patterns.
       * - `CRITICAL` — High risk; further sending may result in line flagging or
       *   restriction.
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
