// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';

export class LinkPayments extends APIResource {}

export interface LinkPayment {
  id?: string;

  amount_cents?: number;

  /**
   * Link's approval ceremony URL, when approval is pending.
   */
  approval_url?: string;

  /**
   * Where the end-user adds a card, when none is on file.
   */
  attach_url?: string;

  /**
   * The App Clip / hosted checkout link to send the end-user.
   */
  checkout_url?: string;

  currency?: string;

  handle?: string;

  metadata?: { [key: string]: string };

  status?: string;
}

export declare namespace LinkPayments {
  export { type LinkPayment as LinkPayment };
}
