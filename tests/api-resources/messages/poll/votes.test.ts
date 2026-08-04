// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import LinqAPIV3 from '@linqapp/sdk';

const client = new LinqAPIV3({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource votes', () => {
  // Mock server tests are disabled
  test.skip('create: only required params', async () => {
    const responsePromise = client.messages.poll.votes.create('69a37c7d-af4f-4b5e-af42-e28e98ce873a', {
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
  test.skip('create: required and optional params', async () => {
    const response = await client.messages.poll.votes.create('69a37c7d-af4f-4b5e-af42-e28e98ce873a', {
      operation: 'add',
      option_id: '97ce8c17-7ef6-4bbc-a89a-6b93d189712f',
    });
  });
});
