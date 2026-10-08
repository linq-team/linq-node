// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import LinqAPIV3 from '@linqapp/sdk';

const client = new LinqAPIV3({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource poll', () => {
  // Mock server tests are disabled
  test.skip('retrieve', async () => {
    const responsePromise = client.messages.poll.retrieve('69a37c7d-af4f-4b5e-af42-e28e98ce873a');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('addOptions: only required params', async () => {
    const responsePromise = client.messages.poll.addOptions('69a37c7d-af4f-4b5e-af42-e28e98ce873a', {
      options: [{ text: 'Pizza' }],
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
  test.skip('addOptions: required and optional params', async () => {
    const response = await client.messages.poll.addOptions('69a37c7d-af4f-4b5e-af42-e28e98ce873a', {
      options: [{ text: 'Pizza' }],
    });
  });

  // Mock server tests are disabled
  test.skip('vote: only required params', async () => {
    const responsePromise = client.messages.poll.vote('69a37c7d-af4f-4b5e-af42-e28e98ce873a', {
      operation: 'add',
      option_id: '97ce8c17-7ef6-4bbc-a89a-6b93d189712f',
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
  test.skip('vote: required and optional params', async () => {
    const response = await client.messages.poll.vote('69a37c7d-af4f-4b5e-af42-e28e98ce873a', {
      operation: 'add',
      option_id: '97ce8c17-7ef6-4bbc-a89a-6b93d189712f',
    });
  });
});
