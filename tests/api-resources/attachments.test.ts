// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import LinqNodeSDK from 'linq-node-sdk';

const client = new LinqNodeSDK({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource attachments', () => {
  // Prism tests are disabled
  test.skip('create: only required params', async () => {
    const responsePromise = client.attachments.create({
      content_type: 'image/jpeg',
      filename: 'photo.jpg',
      size_bytes: 1024000,
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
  test.skip('create: required and optional params', async () => {
    const response = await client.attachments.create({
      content_type: 'image/jpeg',
      filename: 'photo.jpg',
      size_bytes: 1024000,
    });
  });

  // Prism tests are disabled
  test.skip('retrieve', async () => {
    const responsePromise = client.attachments.retrieve('abc12345-1234-5678-9abc-def012345678');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
