// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Capability extends APIResource {
  /**
   * Check whether a recipient address (phone number or email) is reachable via
   * iMessage.
   *
   * @example
   * ```ts
   * const response = await client.capability.checkImessage({
   *   address: '+15551234567',
   * });
   * ```
   */
  checkImessage(
    body: CapabilityCheckImessageParams,
    options?: RequestOptions,
  ): APIPromise<CapabilityCheckImessageResponse> {
    return this._client.post('/v3/capability/check_imessage', { body, ...options });
  }

  /**
   * Check whether a recipient address (phone number) supports RCS messaging.
   *
   * @example
   * ```ts
   * const response = await client.capability.checkRcs({
   *   address: '+15551234567',
   * });
   * ```
   */
  checkRcs(body: CapabilityCheckRcsParams, options?: RequestOptions): APIPromise<CapabilityCheckRcsResponse> {
    return this._client.post('/v3/capability/check_rcs', { body, ...options });
  }
}

export interface CapabilityCheckImessageResponse {
  /**
   * The recipient address that was checked
   */
  address: string;

  /**
   * Whether the recipient supports the checked messaging service
   */
  available: boolean;
}

export interface CapabilityCheckRcsResponse {
  /**
   * The recipient address that was checked
   */
  address: string;

  /**
   * Whether the recipient supports the checked messaging service
   */
  available: boolean;
}

export interface CapabilityCheckImessageParams {
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

export interface CapabilityCheckRcsParams {
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
    type CapabilityCheckImessageResponse as CapabilityCheckImessageResponse,
    type CapabilityCheckRcsResponse as CapabilityCheckRcsResponse,
    type CapabilityCheckImessageParams as CapabilityCheckImessageParams,
    type CapabilityCheckRcsParams as CapabilityCheckRcsParams,
  };
}
