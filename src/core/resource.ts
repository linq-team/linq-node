// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import type { LinqAPIV3 } from '../client';

export abstract class APIResource {
  protected _client: LinqAPIV3;

  constructor(client: LinqAPIV3) {
    this._client = client;
  }
}
