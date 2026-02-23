// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Linq from '@linqapp/sdk';

const client = new Linq({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource messages', () => {
  test('list', async () => {
    const responsePromise = client.chats.messages.list('550e8400-e29b-41d4-a716-446655440000');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('list: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.chats.messages.list(
        '550e8400-e29b-41d4-a716-446655440000',
        { cursor: 'cursor', limit: 1 },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Linq.NotFoundError);
  });

  test('send: only required params', async () => {
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

  test('send: required and optional params', async () => {
    const response = await client.chats.messages.send('550e8400-e29b-41d4-a716-446655440000', {
      message: {
        parts: [
          {
            type: 'text',
            value: 'Hello, world!',
            idempotency_key: 'text-part-abc123',
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
