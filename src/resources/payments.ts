// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * Let an agent pay on a customer's behalf with a single-use virtual card.
 * Connect a customer once, then create a payment — a virtual card is minted
 * scoped to that purchase and the card details are handed back for checkout.
 */
export class Payments extends APIResource {
  /**
   * Advances the pay flow for a connected customer handle and returns a `status`
   * describing where it is (`needs_connection`, `awaiting_user_action`, `ready`,
   * ...). A payment `id` appears once a card is minted. Idempotent on the
   * `Idempotency-Key` header.
   *
   * @example
   * ```ts
   * const payment = await client.payments.create({
   *   amount_cents: 2500,
   *   currency: 'usd',
   *   handle: '+14155550123',
   * });
   * ```
   */
  create(body: PaymentCreateParams, options?: RequestOptions): APIPromise<Payment> {
    return this._client.post('/v3/payments', { body, ...options });
  }

  /**
   * Get a payment
   *
   * @example
   * ```ts
   * const payment = await client.payments.retrieve('paymentId');
   * ```
   */
  retrieve(paymentID: string, options?: RequestOptions): APIPromise<Payment> {
    return this._client.get(path`/v3/payments/${paymentID}`, options);
  }

  /**
   * Closes the virtual card and cancels the payment.
   *
   * @example
   * ```ts
   * const payment = await client.payments.cancel('paymentId');
   * ```
   */
  cancel(paymentID: string, options?: RequestOptions): APIPromise<Payment> {
    return this._client.post(path`/v3/payments/${paymentID}/cancel`, options);
  }

  /**
   * Returns a short-lived handoff for a `ready` payment. Fetch the card credentials
   * **directly from the provider** with the returned `user_token` at `fetch_url` —
   * the card number never passes through Linq. Do not persist PAN/CVC.
   *
   * @example
   * ```ts
   * const response = await client.payments.credentials(
   *   'paymentId',
   * );
   * ```
   */
  credentials(paymentID: string, options?: RequestOptions): APIPromise<PaymentCredentialsResponse> {
    return this._client.get(path`/v3/payments/${paymentID}/credentials`, options);
  }
}

export interface Payment {
  id?: string;

  amount_cents?: number;

  /**
   * Present on `awaiting_user_action` once a card is on file and the charge needs
   * the customer's passkey. Re-send the create request with the same
   * `Idempotency-Key` to collect the payment after they approve.
   */
  approval_url?: string;

  /**
   * Present on `awaiting_user_action` when the customer has no card on file yet. A
   * hosted page — open it for them; it stays valid for about 48 hours. Not returned
   * on `needs_connection`: connect the handle first.
   */
  attach_url?: string;

  currency?: string;

  description?: string;

  handle?: string;

  /**
   * The merchant the card is minted against, echoed from the request.
   */
  merchant?: Payment.Merchant;

  /**
   * Your own key/values, echoed back from the request.
   */
  metadata?: { [key: string]: string };

  status?:
    | 'needs_connection'
    | 'connecting'
    | 'awaiting_user_action'
    | 'ready'
    | 'authorized'
    | 'succeeded'
    | 'declined'
    | 'canceled'
    | 'expired';
}

export namespace Payment {
  /**
   * The merchant the card is minted against, echoed from the request.
   */
  export interface Merchant {
    name?: string;

    url?: string;
  }
}

export interface PaymentCredentialsResponse {
  /**
   * Fetch the card directly from the provider with these — never through Linq.
   */
  handoff?: PaymentCredentialsResponse.Handoff;
}

export namespace PaymentCredentialsResponse {
  /**
   * Fetch the card directly from the provider with these — never through Linq.
   */
  export interface Handoff {
    card_ref?: string;

    fetch_url?: string;

    provider?: string;

    /**
     * Short-lived bearer to fetch the card from the provider.
     */
    user_token?: string;
  }
}

export interface PaymentCreateParams {
  amount_cents: number;

  currency: string;

  /**
   * Customer phone (E.164) or email.
   */
  handle: string;

  description?: string;

  merchant?: PaymentCreateParams.Merchant;

  metadata?: { [key: string]: string };
}

export namespace PaymentCreateParams {
  export interface Merchant {
    name?: string;

    url?: string;
  }
}

export declare namespace Payments {
  export {
    type Payment as Payment,
    type PaymentCredentialsResponse as PaymentCredentialsResponse,
    type PaymentCreateParams as PaymentCreateParams,
  };
}
