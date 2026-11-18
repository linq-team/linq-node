// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';

export class LinkConnections extends APIResource {}

export interface LinkConnectionStatus {
  handle?: string;

  status?: 'pending' | 'connected' | 'revoked' | 'not_connected';
}

export declare namespace LinkConnections {
  export { type LinkConnectionStatus as LinkConnectionStatus };
}
