// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * Read the carrier (BYOC) voice calls received on your phone numbers. Each
 * record is the durable form of the `call_voice.*` webhooks for that call and
 * shares the same `id`, so you can look a call up by the id a webhook
 * delivered. See SIP Profiles for routing inbound calls to your endpoint.
 */
export class CallVoice extends APIResource {
  /**
   * Retrieve a single carrier voice call by its `id` — the same id delivered in the
   * `call_voice.*` webhooks and returned by the list endpoint. The call must belong
   * to the authenticated partner.
   */
  retrieve(callVoiceID: string, options?: RequestOptions): APIPromise<CallVoiceRecord> {
    return this._client.get(path`/v3/call-voice/${callVoiceID}`, options);
  }

  /**
   * List the carrier voice calls received on one of your phone numbers, newest
   * first, with cursor pagination. Each record is the durable form of the
   * `call_voice.*` webhooks for that call; the `id` is the same id those webhooks
   * carry. Results are scoped to the authenticated partner — a number that isn't
   * yours (or simply has no calls) returns `200` with an empty `call_voice` array,
   * not an error.
   */
  list(
    phoneNumber: string,
    query: CallVoiceListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<CallVoiceListResponse> {
    return this._client.get(path`/v3/phone-numbers/${phoneNumber}/call-voice`, { query, ...options });
  }
}

/**
 * A carrier (BYOC) inbound voice call. Mirrors the call_voice.\* webhook payload.
 */
export interface CallVoiceRecord {
  /**
   * Stable call id, identical to the id in the call_voice.\* webhooks.
   */
  id: string;

  direction: 'inbound';

  /**
   * External caller, E.164.
   */
  from: string;

  /**
   * Terminal call outcome. Null while the call is still in progress; set once it
   * ends.
   */
  status: 'completed' | 'busy' | 'no_answer' | 'failed' | 'canceled' | null;

  /**
   * Your line that was called, E.164.
   */
  to: string;

  /**
   * When the call ended. Null while still in progress.
   */
  ended_at?: string | null;

  /**
   * When the call was answered. Null if it never connected.
   */
  started_at?: string | null;
}

export interface CallVoiceListResponse {
  /**
   * Calls for the phone number, newest first.
   */
  call_voice: Array<CallVoiceRecord>;

  /**
   * Cursor for the next page of results. Null when there are no more. Pass this
   * value as the `cursor` parameter in the next request.
   */
  next_cursor?: string | null;
}

export interface CallVoiceListParams {
  /**
   * Pagination cursor from a previous next_cursor response
   */
  cursor?: string;

  /**
   * Maximum number of calls to return
   */
  limit?: number;
}

export declare namespace CallVoice {
  export {
    type CallVoiceRecord as CallVoiceRecord,
    type CallVoiceListResponse as CallVoiceListResponse,
    type CallVoiceListParams as CallVoiceListParams,
  };
}
