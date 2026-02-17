// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import LinqNodeSDK from 'linq-node-sdk';

const client = new LinqNodeSDK({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource participants', () => {
  // Prism tests are disabled
  test.skip('add: only required params', async () => {
    const responsePromise = client.chats.participants.add('550e8400-e29b-41d4-a716-446655440000', {
      handle: '+12052499136',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('add: required and optional params', async () => {
    const response = await client.chats.participants.add('550e8400-e29b-41d4-a716-446655440000', {
      handle: '+12052499136',
    });
  });

  // Prism tests are disabled
  test.skip('remove: only required params', async () => {
    const responsePromise = client.chats.participants.remove('550e8400-e29b-41d4-a716-446655440000', {
      handle: '+12052499136',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('remove: required and optional params', async () => {
    const response = await client.chats.participants.remove('550e8400-e29b-41d4-a716-446655440000', {
      handle: '+12052499136',
    });
  });
});
