// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

/**
 * Check whether a recipient address supports iMessage or RCS before sending a message.
 */
export class Capability extends APIResource {
  /**
   * Check whether a recipient address (phone number or email) is reachable via
   * iMessage.
   *
   * @example
   * ```ts
   * const handleCheckResponse =
   *   await client.capability.checkIMessage({
   *     address: '+15551234567',
   *   });
   * ```
   */
  checkIMessage(
    body: CapabilityCheckIMessageParams,
    options?: RequestOptions,
  ): APIPromise<HandleCheckResponse> {
    return this._client.post('/v3/capability/check_imessage', { body, ...options });
  }

  /**
   * Check whether a recipient address (phone number) supports RCS messaging.
   *
   * A `200` means the check ran and the answer is about the **recipient**. A `503`
   * means the check could not produce an answer because of a fault on the **sender**
   * line — `4004` (RCS not turned on for the line), `4009` (line has no RCS
   * account), or `4010` (the check could not run). Treat all three as "unknown",
   * never as "the recipient does not support RCS", and do not cache them as a
   * negative result.
   *
   * @example
   * ```ts
   * const handleCheckResponse =
   *   await client.capability.checkRCS({
   *     address: '+15551234567',
   *   });
   * ```
   */
  checkRCS(body: CapabilityCheckRCSParams, options?: RequestOptions): APIPromise<HandleCheckResponse> {
    return this._client.post('/v3/capability/check_rcs', { body, ...options });
  }
}

export interface HandleCheck {
  /**
   * The recipient phone number or email address to check
   */
  address: string;

  /**
   * Optional sender phone number. If omitted, an available phone from your pool is
   * used automatically.
   */
  from?: string;
}

export interface HandleCheckResponse {
  /**
   * The recipient address that was checked
   */
  address: string;

  /**
   * Whether the recipient supports the checked messaging service
   */
  available: boolean;

  /**
   * Why `available` is `false`. Only present on a negative result.
   *
   * `not_supported` is the only value returned with a `200`, and it means the check
   * completed and the recipient is genuinely not reachable over this service. On
   * `check_rcs`, sender-side faults do not return `200` — they return `503` with a
   * specific error code. `check_imessage` does not use this mapping.
   */
  reason?: 'not_supported';

  /**
   * The service that would actually carry a message to this address right now, which
   * is not always the service you checked — a recipient without RCS resolves to
   * `SMS`. Absent when the check could not determine one.
   */
  selected_service?: string;
}

export interface CapabilityCheckIMessageParams {
  /**
   * The recipient phone number or email address to check
   */
  address: string;

  /**
   * Optional sender phone number. If omitted, an available phone from your pool is
   * used automatically.
   */
  from?: string;
}

export interface CapabilityCheckRCSParams {
  /**
   * The recipient phone number or email address to check
   */
  address: string;

  /**
   * Optional sender phone number. If omitted, an available phone from your pool is
   * used automatically.
   */
  from?: string;
}

export declare namespace Capability {
  export {
    type HandleCheck as HandleCheck,
    type HandleCheckResponse as HandleCheckResponse,
    type CapabilityCheckIMessageParams as CapabilityCheckIMessageParams,
    type CapabilityCheckRCSParams as CapabilityCheckRCSParams,
  };
}
