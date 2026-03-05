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
   * const response = await client.capability.checkiMessage({
   *   address: '+15551234567',
   * });
   * ```
   */
  checkiMessage(
    body: CapabilityCheckiMessageParams,
    options?: RequestOptions,
  ): APIPromise<CapabilityCheckiMessageResponse> {
    return this._client.post('/v3/capability/check_imessage', { body, ...options });
  }

  /**
   * Check whether a recipient address (phone number) supports RCS messaging.
   *
   * @example
   * ```ts
   * const response = await client.capability.checkRCS({
   *   address: '+15551234567',
   * });
   * ```
   */
  checkRCS(body: CapabilityCheckRCSParams, options?: RequestOptions): APIPromise<CapabilityCheckRCSResponse> {
    return this._client.post('/v3/capability/check_rcs', { body, ...options });
  }
}

export interface CapabilityCheckiMessageResponse {
  /**
   * The recipient address that was checked
   */
  address: string;

  /**
   * Whether the recipient supports the checked messaging service
   */
  available: boolean;
}

export interface CapabilityCheckRCSResponse {
  /**
   * The recipient address that was checked
   */
  address: string;

  /**
   * Whether the recipient supports the checked messaging service
   */
  available: boolean;
}

export interface CapabilityCheckiMessageParams {
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
    type CapabilityCheckiMessageResponse as CapabilityCheckiMessageResponse,
    type CapabilityCheckRCSResponse as CapabilityCheckRCSResponse,
    type CapabilityCheckiMessageParams as CapabilityCheckiMessageParams,
    type CapabilityCheckRCSParams as CapabilityCheckRCSParams,
  };
}
