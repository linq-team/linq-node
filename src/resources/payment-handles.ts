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
export class PaymentHandles extends APIResource {
  /**
   * Starts connecting a customer (by phone/email) so an agent can pay on their
   * behalf. Linq drives the OTP + consent ceremony through the messaging channel;
   * this returns `pending` and a `connection.created` webhook fires once the
   * customer completes it.
   *
   * @example
   * ```ts
   * const paymentHandleConnection =
   *   await client.paymentHandles.connect('handle');
   * ```
   */
  connect(handle: string, options?: RequestOptions): APIPromise<PaymentHandleConnection> {
    return this._client.post(path`/v3/payments/handles/${handle}/connect`, options);
  }

  /**
   * Get a handle's connection status
   *
   * @example
   * ```ts
   * const paymentHandleConnection =
   *   await client.paymentHandles.connection('handle');
   * ```
   */
  connection(handle: string, options?: RequestOptions): APIPromise<PaymentHandleConnection> {
    return this._client.get(path`/v3/payments/handles/${handle}/connection`, options);
  }

  /**
   * Revokes this partner's grant for the customer. Only your grant is removed; the
   * customer's wallet at the provider is untouched.
   *
   * @example
   * ```ts
   * const paymentHandleConnection =
   *   await client.paymentHandles.revoke('handle');
   * ```
   */
  revoke(handle: string, options?: RequestOptions): APIPromise<PaymentHandleConnection> {
    return this._client.delete(path`/v3/payments/handles/${handle}/connection`, options);
  }

  /**
   * Completes the ceremony `connect` started: verifies the code, records the
   * customer's consent, and stores the connection. Returns `connected` on success,
   * after which payments for this handle no longer need the customer present.
   *
   * The code reaches you however your channel works — typically the customer replies
   * with it in the thread. Codes are single-use and short-lived; if one has expired,
   * call `connect` again for a fresh `connect_id`.
   *
   * @example
   * ```ts
   * const paymentHandleConnection =
   *   await client.paymentHandles.verify('handle', {
   *     code: '482913',
   *     connect_id: 'cs_01HZY8',
   *   });
   * ```
   */
  verify(
    handle: string,
    body: PaymentHandleVerifyParams,
    options?: RequestOptions,
  ): APIPromise<PaymentHandleConnection> {
    return this._client.post(path`/v3/payments/handles/${handle}/verify`, { body, ...options });
  }
}

export interface PaymentHandleConnection {
  /**
   * Returned only by `connect`, and only while the ceremony is pending. Nothing on
   * our side persists it — it comes back from the provider and is required again to
   * verify — so hold it until you submit the code.
   */
  connect_id?: string;

  handle?: string;

  status?: 'not_connected' | 'pending' | 'connected' | 'revoked';
}

export interface PaymentHandleVerifyParams {
  /**
   * The one-time code the customer received.
   */
  code: string;

  /**
   * The id returned by `connect`.
   */
  connect_id: string;
}

export declare namespace PaymentHandles {
  export {
    type PaymentHandleConnection as PaymentHandleConnection,
    type PaymentHandleVerifyParams as PaymentHandleVerifyParams,
  };
}
