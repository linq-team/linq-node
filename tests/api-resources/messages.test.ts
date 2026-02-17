// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import LinqNodeSDK from 'linq-node-sdk';

const client = new LinqNodeSDK({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource messages', () => {
  // Prism tests are disabled
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

  // Prism tests are disabled
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

  // Prism tests are disabled
  test.skip('delete: required and optional params', async () => {
    const response = await client.messages.delete('69a37c7d-af4f-4b5e-af42-e28e98ce873a', {
      chat_id: '94c6bf33-31d9-40e3-a0e9-f94250ecedb9',
    });
  });

  // Prism tests are disabled
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

  // Prism tests are disabled
  test.skip('addReaction: required and optional params', async () => {
    const response = await client.messages.addReaction('69a37c7d-af4f-4b5e-af42-e28e98ce873a', {
      operation: 'add',
      type: 'love',
      custom_emoji: '😍',
      part_index: 1,
    });
  });

  // Prism tests are disabled
  test.skip('retrieveThread', async () => {
    const responsePromise = client.messages.retrieveThread('69a37c7d-af4f-4b5e-af42-e28e98ce873a');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('retrieveThread: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.messages.retrieveThread(
        '69a37c7d-af4f-4b5e-af42-e28e98ce873a',
        {
          cursor: 'cursor',
          limit: 1,
          order: 'asc',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(LinqNodeSDK.NotFoundError);
  });
});
