// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Linq from '@linqapp/sdk';

const client = new Linq({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource chats', () => {
  test('create: only required params', async () => {
    const responsePromise = client.chats.create({
      from: '+12052535597',
      message: { parts: [{ type: 'text', value: 'Hello! How can I help you today?' }] },
      to: ['+12052532136'],
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('create: required and optional params', async () => {
    const response = await client.chats.create({
      from: '+12052535597',
      message: {
        parts: [
          {
            type: 'text',
            value: 'Hello! How can I help you today?',
            idempotency_key: 'text-part-abc123',
          },
        ],
        effect: { name: 'confetti', type: 'screen' },
        idempotency_key: 'msg-abc123xyz',
        preferred_service: 'iMessage',
        reply_to: { message_id: '550e8400-e29b-41d4-a716-446655440000', part_index: 0 },
      },
      to: ['+12052532136'],
    });
  });

  test('retrieve', async () => {
    const responsePromise = client.chats.retrieve('550e8400-e29b-41d4-a716-446655440000');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('update', async () => {
    const responsePromise = client.chats.update('550e8400-e29b-41d4-a716-446655440000', {});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('list: only required params', async () => {
    const responsePromise = client.chats.list({ from: '%2B13343284472' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('list: required and optional params', async () => {
    const response = await client.chats.list({
      from: '%2B13343284472',
      cursor: '20',
      limit: 20,
    });
  });

  test('markAsRead', async () => {
    const responsePromise = client.chats.markAsRead('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('sendVoicememo: only required params', async () => {
    const responsePromise = client.chats.sendVoicememo('f19ee7b8-8533-4c5c-83ec-4ef8d6d1ddbd', {
      from: '+12052535597',
      voice_memo_url: 'https://example.com/voice-memo.m4a',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('sendVoicememo: required and optional params', async () => {
    const response = await client.chats.sendVoicememo('f19ee7b8-8533-4c5c-83ec-4ef8d6d1ddbd', {
      from: '+12052535597',
      voice_memo_url: 'https://example.com/voice-memo.m4a',
    });
  });

  test('shareContactCard', async () => {
    const responsePromise = client.chats.shareContactCard('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
