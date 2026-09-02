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

  /**
   * Returns the audit's status and, once complete, the report. Audits are scoped to
   * the line in the URL — an `auditId` started on a different line returns `404`.
   *
   * @example
   * ```ts
   * const reputationAudit =
   *   await client.phoneNumbers.getReputationAudit('auditId', {
   *     phoneNumber: 'phoneNumber',
   *   });
   * ```
   */
  getReputationAudit(
    auditID: string,
    params: PhoneNumberGetReputationAuditParams,
    options?: RequestOptions,
  ): APIPromise<ReputationAudit> {
    const { phoneNumber } = params;
    return this._client.get(path`/v3/phone_numbers/${phoneNumber}/reputation_audit/${auditID}`, options);
  }

  /**
   * Starts an asynchronous reputation audit for a line and returns an `audit_id`.
   * Poll the GET endpoint for the result.
   *
   * Rate limited per line: only one audit may run at a time. Starting one while
   * another is still running returns `202` with the running audit's `audit_id`
   * rather than an error, so a retried start picks that audit back up instead of
   * losing it — poll the id you were given.
   *
   * Once an audit finishes, a new one can't be started for the same line until a
   * cooldown elapses (`429`, with `Retry-After` carrying the wait). Keep the
   * `audit_id` from the original `202`: it stays readable on the GET endpoint for 24
   * hours, and the cooldown response does not repeat it.
   *
   * @example
   * ```ts
   * const reputationAuditStarted =
   *   await client.phoneNumbers.startReputationAudit(
   *     'phoneNumber',
   *   );
   * ```
   */
  startReputationAudit(phoneNumber: string, options?: RequestOptions): APIPromise<ReputationAuditStarted> {
    return this._client.post(path`/v3/phone_numbers/${phoneNumber}/reputation_audit`, options);
  }
}

export interface ReputationActionItem {
  detail?: string;

  expected_impact?: 'high' | 'medium' | 'low';

  /**
   * 1 = do first
   */
  priority?: number;

  title?: string;
}

export interface ReputationAudit {
  audit_id: string;

  /**
   * `pending` until the report is ready — poll until `complete` or `error`.
   */
  status: 'pending' | 'complete' | 'error';

  /**
   * Present only when `status` is `error`. Short, generic reason safe to display.
   */
  error?: string;

  /**
   * When the report was generated; signals reflect the line at this moment.
   */
  generated_at?: string;

  /**
   * The line audited, E.164.
   */
  phone?: string;

  /**
   * Present only when `status` is `complete`.
   */
  report?: ReputationReport;
}

export interface ReputationAuditStarted {
  /**
   * Identifier for this audit. Poll
   * `GET /v3/phone_numbers/{phoneNumber}/reputation_audit/{auditId}` until `status`
   * is `complete` or `error`.
   */
  audit_id: string;

  /**
   * A newly started audit is `pending`.
   */
  status: 'pending' | 'complete' | 'error';
}

export interface ReputationDriver {
  /**
   * Stable driver-category identifier — what is dragging the line, or one of its
   * conversations, down.
   *
   * - `low_engagement` — The conversation is one-sided: several messages sent, few
   *   or no replies back. Pause or rework outreach where recipients are not
   *   replying, and lead with messages that invite a response. Conversation-level:
   *   it appears on `evidence.unhealthy_chats[].driver_keys`, never in `drivers`.
   * - `overall_conversation_health` — A large share of the line's active
   *   conversations are trending unhealthy. Fix the unhealthy conversations first —
   *   review their content and timing, and whether recipients are engaging.
   * - `volume_spike` — The line's daily sending volume jumped far above its own
   *   normal level while few recipients were replying, or exceeded the recommended
   *   daily volume for a single line. Ramp volume gradually instead of spiking,
   *   prioritize people who have already engaged with you, and spread sustained high
   *   volume across additional lines.
   * - `new_conversation_rate` — The line is starting too many brand-new
   *   conversations in a single day. Spread new conversations out over time instead
   *   of starting many at once.
   * - `opt_out_handling` — Recipients asked this line to stop. Honor every stop
   *   request immediately: send nothing further to that recipient unless they opt
   *   back in. Every send to them is rejected with `403` (error code `2024`),
   *   including a final courtesy message — to send one telling them they can reply
   *   to resume, set `override_optout: true` on that single request.
   * - `flagged` — The line is currently restricted and its messages may not be
   *   reaching recipients. Move active traffic to a healthy line now, and let this
   *   one recover before sending more.
   * - `other` — Fallback for a signal without dedicated partner copy.
   */
  key?: ReputationDriverKey;

  /**
   * A specific observed figure when available; otherwise a short qualitative note.
   */
  metric?: string;

  /**
   * One plain-English sentence.
   */
  summary?: string;
}

/**
 * Stable driver-category identifier — what is dragging the line, or one of its
 * conversations, down.
 *
 * - `low_engagement` — The conversation is one-sided: several messages sent, few
 *   or no replies back. Pause or rework outreach where recipients are not
 *   replying, and lead with messages that invite a response. Conversation-level:
 *   it appears on `evidence.unhealthy_chats[].driver_keys`, never in `drivers`.
 * - `overall_conversation_health` — A large share of the line's active
 *   conversations are trending unhealthy. Fix the unhealthy conversations first —
 *   review their content and timing, and whether recipients are engaging.
 * - `volume_spike` — The line's daily sending volume jumped far above its own
 *   normal level while few recipients were replying, or exceeded the recommended
 *   daily volume for a single line. Ramp volume gradually instead of spiking,
 *   prioritize people who have already engaged with you, and spread sustained high
 *   volume across additional lines.
 * - `new_conversation_rate` — The line is starting too many brand-new
 *   conversations in a single day. Spread new conversations out over time instead
 *   of starting many at once.
 * - `opt_out_handling` — Recipients asked this line to stop. Honor every stop
 *   request immediately: send nothing further to that recipient unless they opt
 *   back in. Every send to them is rejected with `403` (error code `2024`),
 *   including a final courtesy message — to send one telling them they can reply
 *   to resume, set `override_optout: true` on that single request.
 * - `flagged` — The line is currently restricted and its messages may not be
 *   reaching recipients. Move active traffic to a healthy line now, and let this
 *   one recover before sending more.
 * - `other` — Fallback for a signal without dedicated partner copy.
 */
export type ReputationDriverKey =
  | 'low_engagement'
  | 'overall_conversation_health'
  | 'volume_spike'
  | 'new_conversation_rate'
  | 'opt_out_handling'
  | 'flagged'
  | 'other';

/**
 * The specific conversations behind the drivers, so partners can verify every
 * claim against their own send logs. Each `chat_id` can be fetched via
 * `GET /v3/chats/{chatId}` — its current health appears there.
 */
export interface ReputationEvidence {
  /**
   * Worst first — most messages sent after the stop request; honor these
   * immediately.
   */
  opt_out_chats?: Array<ReputationOptOutChat>;

  /**
   * Up to 15, worst first.
   */
  unhealthy_chats?: Array<ReputationUnhealthyChat>;
}

export interface ReputationOptOutChat {
  chat_id?: string;

  /**
   * Outbound messages sent after the recipient asked to stop.
   */
  messages_after_stop?: number;
}

export interface ReputationReport {
  /**
   * Ordered by `priority`; 1 = do first.
   */
  action_items?: Array<ReputationActionItem>;

  /**
   * Ranked, highest impact first.
   */
  drivers?: Array<ReputationDriver>;

  /**
   * The specific conversations behind the drivers, so partners can verify every
   * claim against their own send logs. Each `chat_id` can be fetched via
   * `GET /v3/chats/{chatId}` — its current health appears there.
   */
  evidence?: ReputationEvidence;

  /**
   * The `key` of the most important driver. Empty string when the line has nothing
   * to act on — the report then carries a single reassurance action item. Its values
   * are the `ReputationDriverKey` vocabulary — see that schema for what each means
   * and what to do about it.
   */
  primary_driver?: string;

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
  severity?: 'HEALTHY' | 'AT_RISK' | 'CRITICAL';

  /**
   * Deterministic markdown rendering of this report, suitable for feeding directly
   * to automated systems and AI agents as investigation context. Rendered from the
   * structured fields above, which remain the source of truth.
   */
  summary_markdown?: string;
}

export interface ReputationUnhealthyChat {
  chat_id?: string;

  /**
   * What is dragging this conversation down, in the same vocabulary as the report's
   * drivers. Each key's meaning and the fix for it are documented on
   * `ReputationDriverKey`.
   */
  driver_keys?: Array<ReputationDriverKey>;

  /**
   * The conversation's current health — the same value `GET /v3/chats/{chatId}`
   * reports for it.
   */
  status?: 'AT_RISK' | 'CRITICAL' | 'OPTED_OUT';
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
     * See the
     * [Phone Reputation guide](/channel/imessage/guides/phone-numbers/phone-reputation)
     * for what each status means and how to react.
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
     * See the
     * [Phone Reputation guide](/channel/imessage/guides/phone-numbers/phone-reputation)
     * for what each status means and how to react.
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

export interface PhoneNumberGetReputationAuditParams {
  /**
   * The line in E.164 format.
   */
  phoneNumber: string;
}

export declare namespace PhoneNumbers {
  export {
    type ReputationActionItem as ReputationActionItem,
    type ReputationAudit as ReputationAudit,
    type ReputationAuditStarted as ReputationAuditStarted,
    type ReputationDriver as ReputationDriver,
    type ReputationDriverKey as ReputationDriverKey,
    type ReputationEvidence as ReputationEvidence,
    type ReputationOptOutChat as ReputationOptOutChat,
    type ReputationReport as ReputationReport,
    type ReputationUnhealthyChat as ReputationUnhealthyChat,
    type PhoneNumberUpdateResponse as PhoneNumberUpdateResponse,
    type PhoneNumberListResponse as PhoneNumberListResponse,
    type PhoneNumberUpdateParams as PhoneNumberUpdateParams,
    type PhoneNumberGetReputationAuditParams as PhoneNumberGetReputationAuditParams,
  };
}
