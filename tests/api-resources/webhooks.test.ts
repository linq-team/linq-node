// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Webhook } from 'standardwebhooks';

import LinqAPIV3 from '@linqapp/sdk';

const client = new LinqAPIV3({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource webhooks', () => {
  test.skip('unwrap', () => {
    const key = 'whsec_c2VjcmV0Cg==';
    const payload =
      '{"api_version":"v3","created_at":"2025-11-23T17:30:00Z","data":{"id":"550e8400-e29b-41d4-a716-446655440001","chat":{"id":"550e8400-e29b-41d4-a716-446655440000","health_status":{"doc_url":"https://docs.linqapp.com/guides/chats/chat-health#at-risk","status":"AT_RISK","updated_at":"2026-05-01T18:28:25Z"},"is_group":true,"owner_handle":{"id":"550e8400-e29b-41d4-a716-446655440000","handle":"+15551234567","joined_at":"2025-05-21T15:30:00.000-05:00","service":"iMessage","is_me":false,"left_at":"2019-12-27T18:11:19.117Z","status":"active"}},"direction":"outbound","parts":[{"type":"text","value":"Hello!","text_decorations":[{"range":[0,5],"animation":"shake","style":"bold"}]}],"sender_handle":{"id":"550e8400-e29b-41d4-a716-446655440000","handle":"+15551234567","joined_at":"2025-05-21T15:30:00.000-05:00","service":"iMessage","is_me":false,"left_at":"2019-12-27T18:11:19.117Z","status":"active"},"service":"iMessage","delivered_at":"2026-01-30T20:49:20.352Z","effect":{"name":"gentle","type":"bubble"},"idempotency_key":"unique-key","preferred_service":"iMessage","read_at":null,"reply_to":{"message_id":"182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e","part_index":0},"sent_at":"2026-01-30T20:49:19.704Z"},"event_id":"550e8400-e29b-41d4-a716-446655440000","event_type":"message.sent","partner_id":"partner_abc123","trace_id":"abc123def456","webhook_version":"2025-01-01"}';
    const msgID = '1';
    const timestamp = new Date();
    const wh = new Webhook('whsec_c2VjcmV0Cg==');
    const signature = wh.sign(msgID, timestamp, payload);
    const headers: Record<string, string> = {
      'webhook-signature': signature,
      'webhook-id': msgID,
      'webhook-timestamp': String(Math.floor(timestamp.getTime() / 1000)),
    };
    client.webhooks.unwrap(payload, { headers, key });
    client.withOptions({ webhookSecret: key }).webhooks.unwrap(payload, { headers });
    client.withOptions({ webhookSecret: 'whsec_aaaaaaaaaa==' }).webhooks.unwrap(payload, { headers, key });
    expect(() => {
      const wrongKey = 'whsec_aaaaaaaaaa==';
      client.webhooks.unwrap(payload, { headers, key: wrongKey });
    }).toThrow('No matching signature found');
    expect(() => {
      const wrongKey = 'whsec_aaaaaaaaaa==';
      client.withOptions({ webhookSecret: wrongKey }).webhooks.unwrap(payload, { headers });
    }).toThrow('No matching signature found');
    expect(() => {
      const badSig = wh.sign(msgID, timestamp, 'some other payload');
      client.webhooks.unwrap(payload, { headers: { ...headers, 'webhook-signature': badSig }, key });
    }).toThrow('No matching signature found');
    expect(() => {
      const badSig = wh.sign(msgID, timestamp, 'some other payload');
      client
        .withOptions({ webhookSecret: key })
        .webhooks.unwrap(payload, { headers: { ...headers, 'webhook-signature': badSig } });
    }).toThrow('No matching signature found');
    expect(() => {
      client.webhooks.unwrap(payload, { headers: { ...headers, 'webhook-timestamp': '5' }, key });
    }).toThrow('Message timestamp too old');
    expect(() => {
      client
        .withOptions({ webhookSecret: key })
        .webhooks.unwrap(payload, { headers: { ...headers, 'webhook-timestamp': '5' } });
    }).toThrow('Message timestamp too old');
    expect(() => {
      client.webhooks.unwrap(payload, { headers: { ...headers, 'webhook-id': 'wrong' }, key });
    }).toThrow('No matching signature found');
    expect(() => {
      client
        .withOptions({ webhookSecret: key })
        .webhooks.unwrap(payload, { headers: { ...headers, 'webhook-id': 'wrong' } });
    }).toThrow('No matching signature found');
  });
});
