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
export class AvailableNumber extends APIResource {
  /**
   * Returns the best available line (E.164) to send from, applying smart number
   * assignment. Optionally pass `to` recipients to make the choice "sticky" —
   * reusing the line an existing chat with those recipients is already on. Without
   * `to`, the best available line is chosen, always preferring lines with a
   * healthier reputation.
   *
   * This does not reserve the line. Without `to`, the least-recently-used available
   * line is returned — suggestions and your own sends (including an explicit `from`
   * on chat creation) both count as use, so successive calls cycle through your
   * available lines and traffic spreads evenly. Pass the returned `phone_number` as
   * `from` when you create the chat to guarantee the same line.
   *
   * Also returns `vcf_url`: a time-limited link to a vCard (`.vcf`) for the chosen
   * line, carrying its contact card (name/photo) with the chosen number as the
   * primary `TEL` and the partner's other available lines as backups. Share it with
   * recipients so they can save the line as a contact. Lines you pass in
   * `exclude_from` are left out of the vCard too.
   */
  retrieve(
    query: AvailableNumberRetrieveParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<AvailableNumberRetrieveResponse> {
    return this._client.get('/v3/available_number', { query, ...options });
  }
}

/**
 * The line smart number assignment selected, plus a shareable vCard.
 */
export interface AvailableNumberRetrieveResponse {
  /**
   * The selected sending line in E.164 format.
   */
  phone_number: string;

  /**
   * Time-limited link to a vCard (`.vcf`) for the selected line. The card carries
   * the line's contact details with the selected number as the primary `TEL` and the
   * partner's other available lines as backups. The link expires; re-call this
   * endpoint to mint a fresh one.
   */
  vcf_url: string;
}

export interface AvailableNumberRetrieveParams {
  /**
   * Lines (E.164) to leave out of this selection. Applies to the returned
   * `phone_number`, to the sticky choice when `to` is given, and to the vCard's
   * backup numbers. Repeat the parameter for multiple lines; use `%2B` for the
   * leading `+`.
   *
   * Numbers that are not your lines are ignored. Every entry must be E.164 — a value
   * like `4155551234` is rejected rather than silently skipped. Excluding every one
   * of your available lines returns 400.
   */
  exclude_from?: Array<string>;

  /**
   * Recipient handles (E.164 or email) the message is destined for. When provided,
   * an existing chat with these recipients makes the choice sticky. Repeat the
   * parameter for multiple recipients.
   */
  to?: Array<string>;
}

export declare namespace AvailableNumber {
  export {
    type AvailableNumberRetrieveResponse as AvailableNumberRetrieveResponse,
    type AvailableNumberRetrieveParams as AvailableNumberRetrieveParams,
  };
}
