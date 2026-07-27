<div align="center">
  <h1>Linq</h1>
  <p><strong>iMessage, RCS, and SMS from your backend.</strong></p>

The official TypeScript SDK for the Linq Partner API — typed access to chats, messages, attachments, phone numbers, payment requests, and webhooks.

  <p>
    <a href="https://www.npmjs.com/package/@linqapp/sdk"><img src="https://img.shields.io/npm/v/@linqapp/sdk.svg?style=flat&colorA=1a1a1a&colorB=3178c6" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/@linqapp/sdk"><img src="https://img.shields.io/npm/dm/@linqapp/sdk.svg?style=flat&colorA=1a1a1a&colorB=3178c6" alt="npm downloads" /></a>
    <a href="https://github.com/linq-team/linq-node/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@linqapp/sdk.svg?style=flat&colorA=1a1a1a&colorB=3178c6" alt="license" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-4.9+-3178c6?style=flat&colorA=1a1a1a&colorB=3178c6" alt="TypeScript" /></a>
  </p>
</div>

## About Linq

**[Linq](https://linqapp.com)** is messaging infrastructure for businesses that want to talk to customers on the channels they already use. You get real phone numbers that send and receive native **iMessage** — with typing indicators, reactions, effects, and read receipts — and fall back to **RCS** and **SMS** when iMessage isn't available.

Learn more at **https://linqapp.com**.

## Getting Started

1. Generate an API token at **[dashboard.linqapp.com/api-tooling](https://dashboard.linqapp.com/api-tooling)** (API → Overview → Generate new token).

2. Install the SDK:

   ```sh
   npm install @linqapp/sdk
   ```

3. Send your first message:

   ```ts
   import LinqAPIV3 from '@linqapp/sdk';

   const client = new LinqAPIV3({
     apiKey: process.env['LINQ_API_V3_API_KEY'], // This is the default and can be omitted
   });

   const { message } = await client.messages.create({
     to: ['+14155559876'],
     message: {
       parts: [{ type: 'text', value: 'Hi! Thanks for reaching out — how can we help?' }],
     },
   });

   console.log(message);
   ```

   Sending to a handle you haven't messaged before creates the chat for you; `client.chats.create` gives you explicit control over group chats and the sending number.

## Documentation

Visit **[docs.linqapp.com](https://docs.linqapp.com)** for guides and the REST API reference. Every method, request param, and response field in this library is listed in **[api.md](api.md)** and documented in docstrings that appear on hover in most editors.

## Resources

| Resource                      | What it does                                                    |
| ----------------------------- | --------------------------------------------------------------- |
| `client.messages`             | Send, edit, retrieve, delete messages; add reactions            |
| `client.chats`                | Create and update chats, participants, typing indicators, reads |
| `client.attachments`          | Upload media to send as message parts                           |
| `client.phoneNumbers`         | List and configure your sending numbers                         |
| `client.availableNumber`      | Search numbers available to provision                           |
| `client.capability`           | Check whether a handle can receive iMessage or RCS              |
| `client.contactCard`          | Read the contact card recipients see                            |
| `client.paymentRequests`      | Request and collect payments in a chat                          |
| `client.webhookSubscriptions` | Manage webhook endpoints and subscribed events                  |
| `client.webhooks`             | Verify and parse incoming webhook payloads                      |

## Webhooks

Inbound messages, reactions, and delivery updates arrive as webhooks. `client.webhooks.unwrap` verifies the signature and returns a typed, discriminated event:

```ts
const client = new LinqAPIV3({
  webhookSecret: process.env['LINQ_WEBHOOK_SECRET'], // This is the default and can be omitted
});

const event = client.webhooks.unwrap(rawRequestBody, { headers: requestHeaders });

if (event.event_type === 'message.received') {
  console.log(event.data);
}
```

Pass the **raw** request body — parsing it first breaks signature verification.

## Request & Response types

This library includes TypeScript definitions for all request params and response fields. You may import and use them like so:

<!-- prettier-ignore -->
```ts
import LinqAPIV3 from '@linqapp/sdk';

const client = new LinqAPIV3();

const params: LinqAPIV3.MessageCreateParams = {
  to: ['+14155559876'],
  message: { parts: [{ type: 'text', value: 'Hello!' }] },
};
const response: LinqAPIV3.MessageCreateResponse = await client.messages.create(params);
```

## Handling errors

When the library is unable to connect to the API,
or if the API returns a non-success status code (i.e., 4xx or 5xx response),
a subclass of `APIError` will be thrown:

<!-- prettier-ignore -->
```ts
const message = await client.messages
  .create({ to: ['+14155559876'], message: {} })
  .catch(async (err) => {
    if (err instanceof LinqAPIV3.APIError) {
      console.log(err.status); // 400
      console.log(err.name); // BadRequestError
      console.log(err.headers); // {server: 'nginx', ...}
    } else {
      throw err;
    }
  });
```

Error codes are as follows:

| Status Code | Error Type                 |
| ----------- | -------------------------- |
| 400         | `BadRequestError`          |
| 401         | `AuthenticationError`      |
| 403         | `PermissionDeniedError`    |
| 404         | `NotFoundError`            |
| 422         | `UnprocessableEntityError` |
| 429         | `RateLimitError`           |
| >=500       | `InternalServerError`      |
| N/A         | `APIConnectionError`       |

### Retries

Certain errors will be automatically retried 2 times by default, with a short exponential backoff.
Connection errors (for example, due to a network connectivity problem), 408 Request Timeout, 409 Conflict,
429 Rate Limit, and >=500 Internal errors will all be retried by default.

You can use the `maxRetries` option to configure or disable this:

<!-- prettier-ignore -->
```js
// Configure the default for all requests:
const client = new LinqAPIV3({
  maxRetries: 0, // default is 2
});

// Or, configure per-request:
await client.messages.create({ to: ['+14155559876'], message: {} }, {
  maxRetries: 5,
});
```

### Timeouts

Requests time out after 1 minute by default. You can configure this with a `timeout` option:

<!-- prettier-ignore -->
```ts
// Configure the default for all requests:
const client = new LinqAPIV3({
  timeout: 20 * 1000, // 20 seconds (default is 1 minute)
});

// Override per-request:
await client.messages.create({ to: ['+14155559876'], message: {} }, {
  timeout: 5 * 1000,
});
```

On timeout, an `APIConnectionTimeoutError` is thrown.

Note that requests which time out will be [retried twice by default](#retries).

## Auto-pagination

List methods in the LinqAPIV3 API are paginated.
You can use the `for await … of` syntax to iterate through items across all pages:

```ts
async function fetchAllChats(params) {
  const allChats = [];
  // Automatically fetches more pages as needed.
  for await (const chat of client.chats.listChats()) {
    allChats.push(chat);
  }
  return allChats;
}
```

Alternatively, you can request a single page at a time:

```ts
let page = await client.chats.listChats();
for (const chat of page.chats) {
  console.log(chat);
}

// Convenience methods are provided for manually paginating:
while (page.hasNextPage()) {
  page = await page.getNextPage();
  // ...
}
```

## MCP Server

Use the Linq MCP Server to let AI assistants explore endpoints, make test requests, and use the documentation while integrating this SDK.

[![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en-US/install-mcp?name=%40linqapp%2Fsdk-mcp&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIkBsaW5xYXBwL3Nkay1tY3AiXSwiZW52Ijp7IkxJTlFfQVBJX1YzX0FQSV9LRVkiOiJNeSBBUEkgS2V5IiwiTElOUV9XRUJIT09LX1NFQ1JFVCI6Ik15IFdlYmhvb2sgU2VjcmV0In19)
[![Install in VS Code](https://img.shields.io/badge/_-Add_to_VS_Code-blue?style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA0MCA0MCI+PHBhdGggZmlsbD0iI0VFRSIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMzAuMjM1IDM5Ljg4NGEyLjQ5MSAyLjQ5MSAwIDAgMS0xLjc4MS0uNzNMMTIuNyAyNC43OGwtMy40NiAyLjYyNC0zLjQwNiAyLjU4MmExLjY2NSAxLjY2NSAwIDAgMS0xLjA4Mi4zMzggMS42NjQgMS42NjQgMCAwIDEtMS4wNDYtLjQzMWwtMi4yLTJhMS42NjYgMS42NjYgMCAwIDEgMC0yLjQ2M0w3LjQ1OCAyMCA0LjY3IDE3LjQ1MyAxLjUwNyAxNC41N2ExLjY2NSAxLjY2NSAwIDAgMSAwLTIuNDYzbDIuMi0yYTEuNjY1IDEuNjY1IDAgMCAxIDIuMTMtLjA5N2w2Ljg2MyA1LjIwOUwyOC40NTIuODQ0YTIuNDg4IDIuNDg4IDAgMCAxIDEuODQxLS43MjljLjM1MS4wMDkuNjk5LjA5MSAxLjAxOS4yNDVsOC4yMzYgMy45NjFhMi41IDIuNSAwIDAgMSAxLjQxNSAyLjI1M3YuMDk5LS4wNDVWMzMuMzd2LS4wNDUuMDk1YTIuNTAxIDIuNTAxIDAgMCAxLTEuNDE2IDIuMjU3bC04LjIzNSAzLjk2MWEyLjQ5MiAyLjQ5MiAwIDAgMS0xLjA3Ny4yNDZabS43MTYtMjguOTQ3LTExLjk0OCA5LjA2MiAxMS45NTIgOS4wNjUtLjAwNC0xOC4xMjdaIi8+PC9zdmc+)](https://vscode.stainless.com/mcp/%7B%22name%22%3A%22%40linqapp%2Fsdk-mcp%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40linqapp%2Fsdk-mcp%22%5D%2C%22env%22%3A%7B%22LINQ_API_V3_API_KEY%22%3A%22My%20API%20Key%22%2C%22LINQ_WEBHOOK_SECRET%22%3A%22My%20Webhook%20Secret%22%7D%7D)

> Note: You may need to set environment variables in your MCP client.

## Advanced Usage

### Accessing raw Response data (e.g., headers)

The "raw" `Response` returned by `fetch()` can be accessed through the `.asResponse()` method on the `APIPromise` type that all methods return.
This method returns as soon as the headers for a successful response are received and does not consume the response body, so you are free to write custom parsing or streaming logic.

You can also use the `.withResponse()` method to get the raw `Response` along with the parsed data.
Unlike `.asResponse()` this method consumes the body, returning once it is parsed.

<!-- prettier-ignore -->
```ts
const client = new LinqAPIV3();

const response = await client.messages
  .create({ to: ['+14155559876'], message: {} })
  .asResponse();
console.log(response.headers.get('X-My-Header'));
console.log(response.statusText); // access the underlying Response object

const { data: message, response: raw } = await client.messages
  .create({ to: ['+14155559876'], message: {} })
  .withResponse();
console.log(raw.headers.get('X-My-Header'));
console.log(message);
```

### Logging

> [!IMPORTANT]
> All log messages are intended for debugging only. The format and content of log messages
> may change between releases.

#### Log levels

The log level can be configured in two ways:

1. Via the `LINQ_API_V3_LOG` environment variable
2. Using the `logLevel` client option (overrides the environment variable if set)

```ts
import LinqAPIV3 from '@linqapp/sdk';

const client = new LinqAPIV3({
  logLevel: 'debug', // Show all log messages
});
```

Available log levels, from most to least verbose:

- `'debug'` - Show debug messages, info, warnings, and errors
- `'info'` - Show info messages, warnings, and errors
- `'warn'` - Show warnings and errors (default)
- `'error'` - Show only errors
- `'off'` - Disable all logging

At the `'debug'` level, all HTTP requests and responses are logged, including headers and bodies.
Some authentication-related headers are redacted, but sensitive data in request and response bodies
may still be visible.

#### Custom logger

By default, this library logs to `globalThis.console`. You can also provide a custom logger.
Most logging libraries are supported, including [pino](https://www.npmjs.com/package/pino), [winston](https://www.npmjs.com/package/winston), [bunyan](https://www.npmjs.com/package/bunyan), [consola](https://www.npmjs.com/package/consola), [signale](https://www.npmjs.com/package/signale), and [@std/log](https://jsr.io/@std/log). If your logger doesn't work, please open an issue.

When providing a custom logger, the `logLevel` option still controls which messages are emitted, messages
below the configured level will not be sent to your logger.

```ts
import LinqAPIV3 from '@linqapp/sdk';
import pino from 'pino';

const logger = pino();

const client = new LinqAPIV3({
  logger: logger.child({ name: 'LinqAPIV3' }),
  logLevel: 'debug', // Send all messages to pino, allowing it to filter
});
```

### Making custom/undocumented requests

This library is typed for convenient access to the documented API. If you need to access undocumented
endpoints, params, or response properties, the library can still be used.

#### Undocumented endpoints

To make requests to undocumented endpoints, you can use `client.get`, `client.post`, and other HTTP verbs.
Options on the client, such as retries, will be respected when making these requests.

```ts
await client.post('/some/path', {
  body: { some_prop: 'foo' },
  query: { some_query_arg: 'bar' },
});
```

#### Undocumented request params

To make requests using undocumented parameters, you may use `// @ts-expect-error` on the undocumented
parameter. This library doesn't validate at runtime that the request matches the type, so any extra values you
send will be sent as-is.

```ts
client.messages.create({
  // ...
  // @ts-expect-error baz is not yet public
  baz: 'undocumented option',
});
```

For requests with the `GET` verb, any extra params will be in the query, all other requests will send the
extra param in the body.

If you want to explicitly send an extra argument, you can do so with the `query`, `body`, and `headers` request
options.

#### Undocumented response properties

To access undocumented response properties, you may access the response object with `// @ts-expect-error` on
the response object, or cast the response object to the requisite type. Like the request params, we do not
validate or strip extra properties from the response from the API.

### Customizing the fetch client

By default, this library expects a global `fetch` function is defined.

If you want to use a different `fetch` function, you can either polyfill the global:

```ts
import fetch from 'my-fetch';

globalThis.fetch = fetch;
```

Or pass it to the client:

```ts
import LinqAPIV3 from '@linqapp/sdk';
import fetch from 'my-fetch';

const client = new LinqAPIV3({ fetch });
```

### Fetch options

If you want to set custom `fetch` options without overriding the `fetch` function, you can provide a `fetchOptions` object when instantiating the client or making a request. (Request-specific options override client options.)

```ts
import LinqAPIV3 from '@linqapp/sdk';

const client = new LinqAPIV3({
  fetchOptions: {
    // `RequestInit` options
  },
});
```

#### Configuring proxies

To modify proxy behavior, you can provide custom `fetchOptions` that add runtime-specific proxy
options to requests:

<img src="https://raw.githubusercontent.com/stainless-api/sdk-assets/refs/heads/main/node.svg" align="top" width="18" height="21"> **Node** <sup>[[docs](https://github.com/nodejs/undici/blob/main/docs/docs/api/ProxyAgent.md#example---proxyagent-with-fetch)]</sup>

```ts
import LinqAPIV3 from '@linqapp/sdk';
import * as undici from 'undici';

const proxyAgent = new undici.ProxyAgent('http://localhost:8888');
const client = new LinqAPIV3({
  fetchOptions: {
    dispatcher: proxyAgent,
  },
});
```

<img src="https://raw.githubusercontent.com/stainless-api/sdk-assets/refs/heads/main/bun.svg" align="top" width="18" height="21"> **Bun** <sup>[[docs](https://bun.sh/guides/http/proxy)]</sup>

```ts
import LinqAPIV3 from '@linqapp/sdk';

const client = new LinqAPIV3({
  fetchOptions: {
    proxy: 'http://localhost:8888',
  },
});
```

<img src="https://raw.githubusercontent.com/stainless-api/sdk-assets/refs/heads/main/deno.svg" align="top" width="18" height="21"> **Deno** <sup>[[docs](https://docs.deno.com/api/deno/~/Deno.createHttpClient)]</sup>

```ts
import LinqAPIV3 from 'npm:@linqapp/sdk';

const httpClient = Deno.createHttpClient({ proxy: { url: 'http://localhost:8888' } });
const client = new LinqAPIV3({
  fetchOptions: {
    client: httpClient,
  },
});
```

## Requirements

TypeScript >= 4.9 is supported.

The following runtimes are supported:

- Web browsers (Up-to-date Chrome, Firefox, Safari, Edge, and more)
- Node.js 20 LTS or later ([non-EOL](https://endoflife.date/nodejs)) versions.
- Deno v1.28.0 or higher.
- Bun 1.0 or later.
- Cloudflare Workers.
- Vercel Edge Runtime.
- Jest 28 or greater with the `"node"` environment (`"jsdom"` is not supported at this time).
- Nitro v2.6 or greater.

Note that React Native is not supported at this time.

If you are interested in other runtime environments, please open or upvote an issue on GitHub.

## Semantic versioning

This package generally follows [SemVer](https://semver.org/spec/v2.0.0.html) conventions, though certain backwards-incompatible changes may be released as minor versions:

1. Changes that only affect static types, without breaking runtime behavior.
2. Changes to library internals which are technically public but not intended or documented for external use. _(Please open a GitHub issue to let us know if you are relying on such internals.)_
3. Changes that we do not expect to impact the vast majority of users in practice.

We take backwards-compatibility seriously and work hard to ensure you can rely on a smooth upgrade experience.

## Issues

Found a bug or have a feature request? Please [open an issue](https://github.com/linq-team/linq-node/issues) on GitHub. Searching existing issues first helps avoid duplicates.

## Contributing

This library is generated with [Stainless](https://www.stainless.com/) from Linq's OpenAPI spec. See [the contributing documentation](./CONTRIBUTING.md) before opening a pull request.

## License

[Apache-2.0](./LICENSE) © [Linq](https://linqapp.com)
