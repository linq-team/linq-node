// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Participants extends APIResource {
  /**
   * Add a new participant to an existing group chat.
   *
   * **Requirements:**
   *
   * - Group chats only (3+ existing participants)
   * - New participant must support the same messaging service as the group
   * - Cross-service additions not allowed (e.g., can't add RCS-only user to iMessage
   *   group)
   * - For cross-service scenarios, create a new chat instead
   *
   * @example
   * ```ts
   * const response = await client.chats.participants.add(
   *   '550e8400-e29b-41d4-a716-446655440000',
   *   { handle: '+12052499136' },
   * );
   * ```
   */
  add(
    chatID: string,
    body: ParticipantAddParams,
    options?: RequestOptions,
  ): APIPromise<ParticipantAddResponse> {
    return this._client.post(path`/v3/chats/${chatID}/participants`, { body, ...options });
  }

  /**
   * Remove a participant from an existing group chat.
   *
   * **Requirements:**
   *
   * - Group chats only
   * - Must have 3+ participants after removal
   *
   * @example
   * ```ts
   * const participant = await client.chats.participants.remove(
   *   '550e8400-e29b-41d4-a716-446655440000',
   *   { handle: '+12052499136' },
   * );
   * ```
   */
  remove(
    chatID: string,
    body: ParticipantRemoveParams,
    options?: RequestOptions,
  ): APIPromise<ParticipantRemoveResponse> {
    return this._client.delete(path`/v3/chats/${chatID}/participants`, { body, ...options });
  }
}

export interface ParticipantAddResponse {
  message?: string;

  status?: string;

  trace_id?: string;
}

export interface ParticipantRemoveResponse {
  message?: string;

  status?: string;

  trace_id?: string;
}

export interface ParticipantAddParams {
  /**
   * Phone number (E.164 format) or email address of the participant to add
   */
  handle: string;
}

export interface ParticipantRemoveParams {
  /**
   * Phone number (E.164 format) or email address of the participant to remove
   */
  handle: string;
}

export declare namespace Participants {
  export {
    type ParticipantAddResponse as ParticipantAddResponse,
    type ParticipantRemoveResponse as ParticipantRemoveResponse,
    type ParticipantAddParams as ParticipantAddParams,
    type ParticipantRemoveParams as ParticipantRemoveParams,
  };
}
