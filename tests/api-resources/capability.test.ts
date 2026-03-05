// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import LinqAPIV3 from '@linqapp/sdk';

const client = new LinqAPIV3({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource capability', () => {
  // Mock server tests are disabled
  test.skip('checkiMessage: only required params', async () => {
    const responsePromise = client.capability.checkiMessage({ address: '+15551234567' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('checkiMessage: required and optional params', async () => {
    const response = await client.capability.checkiMessage({ address: '+15551234567', from: '+15559876543' });
  });

  // Mock server tests are disabled
  test.skip('checkRCS: only required params', async () => {
    const responsePromise = client.capability.checkRCS({ address: '+15551234567' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('checkRCS: required and optional params', async () => {
    const response = await client.capability.checkRCS({ address: '+15551234567', from: '+15559876543' });
  });
});
