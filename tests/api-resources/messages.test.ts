// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import LinqAPIV3 from '@linqapp/sdk';

const client = new LinqAPIV3({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource messages', () => {
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
  test.skip('delete: only required params', async () => {
    const responsePromise = client.messages.delete('69a37c7d-af4f-4b5e-af42-e28e98ce873a', {
      chat_id: '94c6bf33-31d9-40e3-a0e9-f94250ecedb9',
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
  test.skip('delete: required and optional params', async () => {
    const response = await client.messages.delete('69a37c7d-af4f-4b5e-af42-e28e98ce873a', {
      chat_id: '94c6bf33-31d9-40e3-a0e9-f94250ecedb9',
    });
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
      custom_emoji: '😍',
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
});
