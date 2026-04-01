// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

/**
 * Contact Card lets you set and share your contact information (name and profile photo) with chat participants via iMessage Name and Photo Sharing.
 *
 * Use `POST /v3/contact_card` to create or update a card for a phone number.
 * Use `PATCH /v3/contact_card` to update an existing active card.
 * Use `GET /v3/contact_card` to retrieve the active card(s) for your partner account.
 *
 * **Sharing behavior:** Sharing may not take effect in every chat due to limitations outside our control. We recommend calling the share endpoint once per day, after the first outbound activity.
 */
export class ContactCard extends APIResource {
  /**
   * Creates a contact card for a phone number. This endpoint is intended for
   * initial, one-time setup only.
   *
   * The contact card is stored in an inactive state first. Once it's applied
   * successfully, it is activated and `is_active` is returned as `true`. On failure,
   * `is_active` is `false`.
   *
   * **Note:** To update an existing contact card after setup, use
   * `PATCH /v3/contact_card` instead.
   *
   * @example
   * ```ts
   * const setContactCard = await client.contactCard.create({
   *   first_name: 'John',
   *   phone_number: '+15551234567',
   *   image_url:
   *     'https://cdn.linqapp.com/contact-card/example.jpg',
   *   last_name: 'Doe',
   * });
   * ```
   */
  create(body: ContactCardCreateParams, options?: RequestOptions): APIPromise<SetContactCard> {
    return this._client.post('/v3/contact_card', { body, ...options });
  }

  /**
   * Returns the contact card for a specific phone number, or all contact cards for
   * the authenticated partner if no `phone_number` is provided.
   *
   * @example
   * ```ts
   * const contactCard = await client.contactCard.retrieve();
   * ```
   */
  retrieve(
    query: ContactCardRetrieveParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ContactCardRetrieveResponse> {
    return this._client.get('/v3/contact_card', { query, ...options });
  }

  /**
   * Partially updates an existing active contact card for a phone number.
   *
   * Fetches the current active contact card and merges the provided fields. Only
   * fields present in the request body are updated; omitted fields retain their
   * existing values.
   *
   * Requires an active contact card to exist for the phone number.
   *
   * @example
   * ```ts
   * const setContactCard = await client.contactCard.update({
   *   phone_number: '+15551234567',
   *   first_name: 'John',
   *   image_url:
   *     'https://cdn.linqapp.com/contact-card/example.jpg',
   *   last_name: 'Doe',
   * });
   * ```
   */
  update(params: ContactCardUpdateParams, options?: RequestOptions): APIPromise<SetContactCard> {
    const { phone_number, ...body } = params;
    return this._client.patch('/v3/contact_card', { query: { phone_number }, body, ...options });
  }
}

export interface SetContactCard {
  /**
   * First name on the contact card
   */
  first_name: string;

  /**
   * Whether the contact card was successfully applied to the device
   */
  is_active: boolean;

  /**
   * The phone number the contact card is associated with
   */
  phone_number: string;

  /**
   * Image URL on the contact card
   */
  image_url?: string;

  /**
   * Last name on the contact card
   */
  last_name?: string;
}

export interface ContactCardRetrieveResponse {
  contact_cards: Array<ContactCardRetrieveResponse.ContactCard>;
}

export namespace ContactCardRetrieveResponse {
  export interface ContactCard {
    first_name: string;

    is_active: boolean;

    phone_number: string;

    image_url?: string;

    last_name?: string;
  }
}

export interface ContactCardCreateParams {
  /**
   * First name for the contact card. Required.
   */
  first_name: string;

  /**
   * E.164 phone number to associate the contact card with
   */
  phone_number: string;

  /**
   * URL of the profile image to rehost on the CDN. Only re-uploaded when a new value
   * is provided.
   */
  image_url?: string;

  /**
   * Last name for the contact card. Optional.
   */
  last_name?: string;
}

export interface ContactCardRetrieveParams {
  /**
   * E.164 phone number to filter by. If omitted, all my cards for the partner are
   * returned.
   */
  phone_number?: string;
}

export interface ContactCardUpdateParams {
  /**
   * Query param: E.164 phone number of the contact card to update
   */
  phone_number: string;

  /**
   * Body param: Updated first name. If omitted, the existing value is kept.
   */
  first_name?: string;

  /**
   * Body param: Updated profile image URL. If omitted, the existing image is kept.
   */
  image_url?: string;

  /**
   * Body param: Updated last name. If omitted, the existing value is kept.
   */
  last_name?: string;
}

export declare namespace ContactCard {
  export {
    type SetContactCard as SetContactCard,
    type ContactCardRetrieveResponse as ContactCardRetrieveResponse,
    type ContactCardCreateParams as ContactCardCreateParams,
    type ContactCardRetrieveParams as ContactCardRetrieveParams,
    type ContactCardUpdateParams as ContactCardUpdateParams,
  };
}
