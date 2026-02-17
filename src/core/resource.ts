// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import type { LinqNodeSDK } from '../client';

export abstract class APIResource {
  protected _client: LinqNodeSDK;

  constructor(client: LinqNodeSDK) {
    this._client = client;
  }
}
