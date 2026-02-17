// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import LinqNodeSDK from 'linq-node-sdk';

const client = new LinqNodeSDK({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource webhookEvents', () => {
  // Prism tests are disabled
  test.skip('list', async () => {
    const responsePromise = client.webhookEvents.list();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
