// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import LinqAPIV3 from '@linqapp/sdk';

const client = new LinqAPIV3({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource background', () => {
  // Mock server tests are disabled
  test.skip('remove', async () => {
    const responsePromise = client.chats.background.remove('550e8400-e29b-41d4-a716-446655440000');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('set: only required params', async () => {
    const responsePromise = client.chats.background.set('550e8400-e29b-41d4-a716-446655440000', {
      type: 'color',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('set: required and optional params', async () => {
    const response = await client.chats.background.set('550e8400-e29b-41d4-a716-446655440000', {
      type: 'color',
      image_url: 'https://cdn.linqapp.com/u/bg.jpg',
      shades: ['#F2C4E1', '#F5A623'],
      style: 'sky',
      variant: 'mango',
    });
  });
});
