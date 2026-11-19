// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';

/**
 * Block handles — phone numbers, email addresses, SMS short codes, or
 * sender IDs. Inbound messages from a blocked handle are dropped before
 * they reach your webhooks, and direct sends to a blocked handle are
 * rejected with `403` (error code `2026`). Group sends that include
 * unblocked members are not restricted.
 */
export class BlockedHandles extends APIResource {
  /**
   * Returns all handles you have blocked. Inbound messages from a blocked handle are
   * dropped and produce no webhooks, and direct sends to a blocked handle are
   * rejected with `403` (error code `2026`). Group sends that include unblocked
   * members are not restricted.
   *
   * @example
   * ```ts
   * const blockedHandles = await client.blockedHandles.list();
   * ```
   */
  list(options?: RequestOptions): APIPromise<BlockedHandleListResponse> {
    return this._client.get('/v3/blocked_handles', options);
  }

  /**
   * Blocks a handle — an E.164 phone number, an email address (iMessage sender), an
   * SMS short code (e.g. `262966`), or an alphanumeric sender ID. Inbound messages
   * from it are dropped and produce no webhooks, and direct sends to it are rejected
   * with `403` (error code `2026`); group sends that include unblocked members are
   * not restricted. Blocking is idempotent — re-blocking an already blocked handle
   * returns the existing entry.
   *
   * @example
   * ```ts
   * const response = await client.blockedHandles.block({
   *   handle: '+12025551234',
   *   reason: 'spam',
   * });
   * ```
   */
  block(body: BlockedHandleBlockParams, options?: RequestOptions): APIPromise<BlockedHandleBlockResponse> {
    return this._client.post('/v3/blocked_handles', { body, ...options });
  }

  /**
   * Removes a handle from your blocklist. Inbound messages from it will be delivered
   * again and sends to it are allowed again. The handle goes in the request body,
   * mirroring block — no URL encoding needed.
   *
   * @example
   * ```ts
   * await client.blockedHandles.unblock({
   *   handle: '+12025551234',
   * });
   * ```
   */
  unblock(body: BlockedHandleUnblockParams, options?: RequestOptions): APIPromise<void> {
    return this._client.delete('/v3/blocked_handles', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export interface BlockedHandleEntry {
  /**
   * When the handle was blocked
   */
  blocked_at: string;

  /**
   * The blocked handle, normalized (E.164 phone, lowercased email, short code, or
   * sender ID)
   */
  handle: string;

  /**
   * Optional note recorded when the handle was blocked
   */
  reason?: string;
}

export interface BlockedHandleListResponse {
  /**
   * All handles blocked by the partner, newest first
   */
  blocked_handles: Array<BlockedHandleEntry>;
}

export interface BlockedHandleBlockResponse {
  blocked_handle: BlockedHandleEntry;
}

export interface BlockedHandleBlockParams {
  /**
   * The handle to block: an E.164 phone number, an email address, an SMS short code
   * (3-8 digits), or an alphanumeric sender ID.
   */
  handle: string;

  /**
   * Optional free-text note on why the handle was blocked
   */
  reason?: string;
}

export interface BlockedHandleUnblockParams {
  /**
   * The handle to unblock
   */
  handle: string;
}

export declare namespace BlockedHandles {
  export {
    type BlockedHandleEntry as BlockedHandleEntry,
    type BlockedHandleListResponse as BlockedHandleListResponse,
    type BlockedHandleBlockResponse as BlockedHandleBlockResponse,
    type BlockedHandleBlockParams as BlockedHandleBlockParams,
    type BlockedHandleUnblockParams as BlockedHandleUnblockParams,
  };
}
