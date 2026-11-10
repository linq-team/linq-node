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
export class PaymentProviders extends APIResource {
  /**
   * Returns your organization's onboarding status for a payment provider.
   *
   * @example
   * ```ts
   * const paymentProvider =
   *   await client.paymentProviders.retrieve('provider');
   * ```
   */
  retrieve(provider: string, options?: RequestOptions): APIPromise<PaymentProvider> {
    return this._client.get(path`/v3/payments/providers/${provider}`, options);
  }

  /**
   * Begins connecting your organization to a payment provider (e.g. `agentcard`).
   * Returns a hosted URL where an admin authorizes the connection; on completion the
   * provider redirects back and Linq stores your connected credentials.
   *
   * @example
   * ```ts
   * const response = await client.paymentProviders.connect(
   *   'provider',
   *   {
   *     return_url: 'https://partner.example/settings/payments',
   *   },
   * );
   * ```
   */
  connect(
    provider: string,
    body: PaymentProviderConnectParams,
    options?: RequestOptions,
  ): APIPromise<PaymentProviderConnectResponse> {
    return this._client.post(path`/v3/payments/providers/${provider}/connect`, { body, ...options });
  }
}

export interface PaymentProvider {
  provider?: string;

  status?: 'onboarding' | 'ready' | 'disabled';
}

export interface PaymentProviderConnectResponse {
  /**
   * Send the admin here to authorize the connection.
   */
  hosted_url?: string;

  session_id?: string;

  status?: string;
}

export interface PaymentProviderConnectParams {
  /**
   * Where to send the admin after they authorize the connection.
   */
  return_url: string;
}

export declare namespace PaymentProviders {
  export {
    type PaymentProvider as PaymentProvider,
    type PaymentProviderConnectResponse as PaymentProviderConnectResponse,
    type PaymentProviderConnectParams as PaymentProviderConnectParams,
  };
}
