// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import LinqAPIV3 from '@linqapp/sdk';

const client = new LinqAPIV3({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource messages', () => {
  // Mock server tests are disabled
  test.skip('list', async () => {
    const responsePromise = client.chats.messages.list('550e8400-e29b-41d4-a716-446655440000');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('list: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.chats.messages.list(
        '550e8400-e29b-41d4-a716-446655440000',
        { cursor: 'cursor', limit: 1 },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(LinqAPIV3.NotFoundError);
  });

  // Mock server tests are disabled
  test.skip('send: only required params', async () => {
    const responsePromise = client.chats.messages.send('550e8400-e29b-41d4-a716-446655440000', {
      message: { parts: [{ type: 'text', value: 'Hello, world!' }] },
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
  test.skip('send: required and optional params', async () => {
    const response = await client.chats.messages.send('550e8400-e29b-41d4-a716-446655440000', {
      message: {
        parts: [
          {
            type: 'text',
            value: 'Hello, world!',
            text_decorations: [
              {
                range: [0, 5],
                animation: 'shake',
                style: 'bold',
              },
              {
                range: [6, 11],
                animation: 'shake',
                style: 'bold',
              },
            ],
          },
        ],
        effect: { name: 'confetti', type: 'screen' },
        idempotency_key: 'msg-abc123xyz',
        preferred_service: 'iMessage',
        reply_to: { message_id: '550e8400-e29b-41d4-a716-446655440000', part_index: 0 },
      },
    });
  });
});
