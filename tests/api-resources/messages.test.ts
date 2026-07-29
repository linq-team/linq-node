// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import LinqAPIV3 from '@linqapp/sdk';

const client = new LinqAPIV3({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource messages', () => {
  // Mock server tests are disabled
  test.skip('create: only required params', async () => {
    const responsePromise = client.messages.create({
      message: {},
      to: ['+14155559876'],
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
  test.skip('create: required and optional params', async () => {
    const response = await client.messages.create({
      message: {
        action: {
          action: 'attach_card',
          experience: 'agentcard',
          params: { foo: 'bar' },
        },
        effect: { name: 'confetti', type: 'screen' },
        idempotency_key: 'msg-abc123xyz',
        parts: [
          {
            type: 'text',
            value: 'Hi! Thanks for reaching out — how can we help?',
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
        preferred_service: 'iMessage',
        reply_to: { message_id: '550e8400-e29b-41d4-a716-446655440000', part_index: 0 },
      },
      to: ['+14155559876'],
      continuation_message: { text: "Hi, it's Acme Support reaching you from a new number." },
      exclude_from: ['+12052535597'],
      'Idempotency-Key': 'send-abc123xyz',
    });
  });

  // Mock server tests are disabled
  test.skip('retrieve', async () => {
    const responsePromise = client.messages.retrieve('69a37c7d-af4f-4b5e-af42-e28e98ce873a');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('update: only required params', async () => {
    const responsePromise = client.messages.update('69a37c7d-af4f-4b5e-af42-e28e98ce873a', {
      text: 'This is the edited message content',
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
  test.skip('update: required and optional params', async () => {
    const response = await client.messages.update('69a37c7d-af4f-4b5e-af42-e28e98ce873a', {
      text: 'This is the edited message content',
      part_index: 0,
    });
  });

  // Mock server tests are disabled
  test.skip('delete', async () => {
    const responsePromise = client.messages.delete('69a37c7d-af4f-4b5e-af42-e28e98ce873a');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('addReaction: only required params', async () => {
    const responsePromise = client.messages.addReaction('69a37c7d-af4f-4b5e-af42-e28e98ce873a', {
      operation: 'add',
      type: 'love',
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
  test.skip('addReaction: required and optional params', async () => {
    const response = await client.messages.addReaction('69a37c7d-af4f-4b5e-af42-e28e98ce873a', {
      operation: 'add',
      type: 'love',
      custom_emoji: 'custom_emoji',
      part_index: 1,
    });
  });

  // Mock server tests are disabled
  test.skip('listMessagesThread', async () => {
    const responsePromise = client.messages.listMessagesThread('69a37c7d-af4f-4b5e-af42-e28e98ce873a');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('listMessagesThread: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.messages.listMessagesThread(
        '69a37c7d-af4f-4b5e-af42-e28e98ce873a',
        {
          cursor: 'cursor',
          limit: 1,
          order: 'asc',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(LinqAPIV3.NotFoundError);
  });

  // Mock server tests are disabled
  test.skip('updateAppCard: only required params', async () => {
    const responsePromise = client.messages.updateAppCard('69a37c7d-af4f-4b5e-af42-e28e98ce873a', {
      layout: {},
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
  test.skip('updateAppCard: required and optional params', async () => {
    const response = await client.messages.updateAppCard('69a37c7d-af4f-4b5e-af42-e28e98ce873a', {
      layout: {
        caption: 'Score: 2 – 1',
        image_subtitle: 'Tonight, 7:30 PM',
        image_title: 'Table for 2',
        image_url: 'https://cdn.linqapp.com/example/card-preview.jpg',
        subcaption: 'You said: hello',
        trailing_caption: '2 min',
        trailing_subcaption: 'expires',
      },
      fallback_text: 'Score update',
      interactive: true,
      url: 'https://app.example.com/card?game=7f3a&move=2',
    });
  });
});
