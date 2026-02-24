// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import LinqAPIV3 from '@linqapp/sdk';

const client = new LinqAPIV3({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource capability', () => {
  // Mock server tests are disabled
  test.skip('checkImessage: only required params', async () => {
    const responsePromise = client.capability.checkImessage({ address: '+15551234567' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('checkImessage: required and optional params', async () => {
    const response = await client.capability.checkImessage({ address: '+15551234567', from: '+15559876543' });
  });

  // Mock server tests are disabled
  test.skip('checkRcs: only required params', async () => {
    const responsePromise = client.capability.checkRcs({ address: '+15551234567' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('checkRcs: required and optional params', async () => {
    const response = await client.capability.checkRcs({ address: '+15551234567', from: '+15559876543' });
  });
});
