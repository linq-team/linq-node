// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * ## SIP configuration
 *
 * Your Linq representative provides the signaling and media IP ranges and
 * ports to allow through your firewall during onboarding.
 *
 * Set `primary_uri` to your endpoint as scheme + host — `sips:` for TLS or
 * `sip:` for UDP, with no user part (we add it). Each call arrives at your
 * endpoint as:
 *
 * ```
 * sip:<called-number>@<your-host>
 * ```
 *
 * so you can route on the dialed number. The caller's number is in the
 * `From` header in E.164.
 */
export class SipProfiles extends APIResource {
  /**
   * ## SIP configuration
   *
   * Your Linq representative provides the signaling and media IP ranges and ports to
   * allow through your firewall during onboarding.
   *
   * Set `primary_uri` to your endpoint as scheme + host — `sips:` for TLS or `sip:`
   * for UDP, with no user part (we add it). Each call arrives at your endpoint as:
   *
   * ```
   * sip:<called-number>@<your-host>
   * ```
   *
   * so you can route on the dialed number. The caller's number is in the `From`
   * header in E.164.
   *
   * ---
   *
   * Create a SIP routing profile for your inbound calls, then assign it to a phone
   * number to start routing calls to its SIP URI.
   *
   * @example
   * ```ts
   * const sipProfile = await client.sipProfiles.create({
   *   name: 'byoc-primary',
   *   primary_uri: 'sips:sip.partner.example',
   * });
   * ```
   */
  create(body: SipProfileCreateParams, options?: RequestOptions): APIPromise<SipProfile> {
    return this._client.post('/v3/sip-profiles', { body, ...options });
  }

  /**
   * Retrieve details for a specific SIP profile.
   *
   * @example
   * ```ts
   * const sipProfile = await client.sipProfiles.retrieve(
   *   'sip_8a3f9c2b1d4e4f5a9b8c7d6e5f4a3b2c',
   * );
   * ```
   */
  retrieve(sipProfileID: string, options?: RequestOptions): APIPromise<SipProfile> {
    return this._client.get(path`/v3/sip-profiles/${sipProfileID}`, options);
  }

  /**
   * Update a SIP profile. Only the fields you send are changed; omitted fields keep
   * their current value. Set `backup_uri` to an empty string to clear it.
   *
   * @example
   * ```ts
   * const sipProfile = await client.sipProfiles.update(
   *   'sip_8a3f9c2b1d4e4f5a9b8c7d6e5f4a3b2c',
   *   { name: 'byoc-east' },
   * );
   * ```
   */
  update(
    sipProfileID: string,
    body: SipProfileUpdateParams,
    options?: RequestOptions,
  ): APIPromise<SipProfile> {
    return this._client.put(path`/v3/sip-profiles/${sipProfileID}`, { body, ...options });
  }

  /**
   * Retrieve all SIP profiles for the authenticated partner.
   *
   * @example
   * ```ts
   * const sipProfiles = await client.sipProfiles.list();
   * ```
   */
  list(options?: RequestOptions): APIPromise<SipProfileListResponse> {
    return this._client.get('/v3/sip-profiles', options);
  }

  /**
   * Delete a SIP profile. The profile must not be assigned to any phone number;
   * unassign it first or the request is rejected.
   *
   * @example
   * ```ts
   * await client.sipProfiles.delete(
   *   'sip_8a3f9c2b1d4e4f5a9b8c7d6e5f4a3b2c',
   * );
   * ```
   */
  delete(sipProfileID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/v3/sip-profiles/${sipProfileID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * ## SIP configuration
   *
   * Your Linq representative provides the signaling and media IP ranges and ports to
   * allow through your firewall during onboarding.
   *
   * Set `primary_uri` to your endpoint as scheme + host — `sips:` for TLS or `sip:`
   * for UDP, with no user part (we add it). Each call arrives at your endpoint as:
   *
   * ```
   * sip:<called-number>@<your-host>
   * ```
   *
   * so you can route on the dialed number. The caller's number is in the `From`
   * header in E.164.
   *
   * ---
   *
   * Assign a SIP profile to route inbound calls to its SIP URI. This takes
   * precedence over an existing `forwarding_number` without clearing it. Send
   * `sip_profile_id: null` to remove the SIP assignment and resume existing
   * forwarding, if configured. Allow about 5 minutes for routing changes to
   * propagate. The phone number must belong to the authenticated partner.
   *
   * @example
   * ```ts
   * const response = await client.sipProfiles.assign(
   *   '+14254758217',
   *   {
   *     sip_profile_id: 'sip_8a3f9c2b1d4e4f5a9b8c7d6e5f4a3b2c',
   *   },
   * );
   * ```
   */
  assign(
    phoneNumber: string,
    body: SipProfileAssignParams,
    options?: RequestOptions,
  ): APIPromise<SipProfileAssignResponse> {
    return this._client.put(path`/v3/phone-numbers/${phoneNumber}/sip-profile`, { body, ...options });
  }
}

export interface SipProfile {
  /**
   * Unique identifier for the SIP profile
   */
  id: string;

  /**
   * How many phone numbers reference this profile
   */
  assigned_number_count: number;

  created_at: string;

  /**
   * Human-readable name
   */
  name: string;

  /**
   * Your SIP endpoint as scheme + host (`sip:` UDP / `sips:` TLS); no user part — we
   * set it to the called number on each call.
   */
  primary_uri: string;

  updated_at: string;

  /**
   * Monotonic version, incremented on each update
   */
  version: number;

  /**
   * Optional failover SIP URI. Null when unset.
   */
  backup_uri?: string | null;
}

export interface SipProfileListResponse {
  /**
   * The partner's SIP profiles
   */
  sip_profiles: Array<SipProfile>;
}

export interface SipProfileAssignResponse {
  /**
   * The phone number whose assignment changed
   */
  phone_number: string;

  /**
   * The assigned SIP profile id, or null when cleared
   */
  sip_profile_id: string | null;
}

export interface SipProfileCreateParams {
  name: string;

  /**
   * Your SIP endpoint as scheme + host, e.g. `sips:sip.partner.example`. Must start
   * with `sip:` (UDP) or `sips:` (TLS) — the scheme sets the transport. Do not
   * include a user part: we set it to the called number on each call
   * (`sip:<called-number>@<your-host>`). A bare host with no scheme is rejected.
   */
  primary_uri: string;

  /**
   * Optional failover SIP URI
   */
  backup_uri?: string;
}

export interface SipProfileUpdateParams {
  /**
   * Set to "" to clear the backup URI.
   */
  backup_uri?: string;

  name?: string;

  primary_uri?: string;
}

export interface SipProfileAssignParams {
  /**
   * The SIP profile to assign, or null to clear the number's current assignment.
   */
  sip_profile_id: string | null;
}

export declare namespace SipProfiles {
  export {
    type SipProfile as SipProfile,
    type SipProfileListResponse as SipProfileListResponse,
    type SipProfileAssignResponse as SipProfileAssignResponse,
    type SipProfileCreateParams as SipProfileCreateParams,
    type SipProfileUpdateParams as SipProfileUpdateParams,
    type SipProfileAssignParams as SipProfileAssignParams,
  };
}
