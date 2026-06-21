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
     * @deprecated **[BETA]** Current reputation for a phone line. Always present —
     * lines start at `HEALTHY` and may shift based on aggregate engagement and
     * delivery signals across all conversations on the line.
     *
     * Unlike chat health, line reputation does not include `opted_out` — opt-out
     * applies to individual recipients, not the whole line.
     *
     * See the [Phone Health guide](/guides/phone-numbers/phone-health) for what each
     * status means and how to react.
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
     * See the [Phone Health guide](/guides/phone-numbers/phone-health) for what each
     * status means and how to react.
     */
    reputation: PhoneNumber.Reputation;
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
     * See the [Phone Health guide](/guides/phone-numbers/phone-health) for what each
     * status means and how to react.
     */
    export interface HealthStatus {
      /**
       * Deep-link to the relevant section of the Phone Health guide for this status.
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
     * See the [Phone Health guide](/guides/phone-numbers/phone-health) for what each
     * status means and how to react.
     */
    export interface Reputation {
      /**
       * Deep-link to the relevant section of the Phone Health guide for this status.
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

export declare namespace PhoneNumbers {
  export { type PhoneNumberListResponse as PhoneNumberListResponse };
}
