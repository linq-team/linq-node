// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import type { Linq } from '../client';

export abstract class APIResource {
  protected _client: Linq;

  constructor(client: Linq) {
    this._client = client;
  }
}
