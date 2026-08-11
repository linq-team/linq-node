// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import type { RequestInit, RequestInfo, BodyInit } from './internal/builtin-types';
import type { HTTPMethod, PromiseOrValue, MergedRequestInit, FinalizedRequestInit } from './internal/types';
import { uuid4 } from './internal/utils/uuid';
import { validatePositiveInteger, isAbsoluteURL, safeJSON } from './internal/utils/values';
import { sleep } from './internal/utils/sleep';
export type { Logger, LogLevel } from './internal/utils/log';
import { castToError, isAbortError } from './internal/errors';
import type { APIResponseProps } from './internal/parse';
import { getPlatformHeaders } from './internal/detect-platform';
import * as Shims from './internal/shims';
import * as Opts from './internal/request-options';
import { stringifyQuery } from './internal/utils/query';
import { VERSION } from './version';
import * as Errors from './core/error';
import * as Pagination from './core/pagination';
import {
  AbstractPage,
  type ListChatsPaginationParams,
  ListChatsPaginationResponse,
  type ListMessagesPaginationParams,
  ListMessagesPaginationResponse,
} from './core/pagination';
import * as Uploads from './core/uploads';
import * as API from './resources/index';
import { APIPromise } from './core/api-promise';
import {
  AttachmentCreateParams,
  AttachmentCreateResponse,
  AttachmentRetrieveResponse,
  Attachments,
  SupportedContentType,
} from './resources/attachments';
import {
  AvailableNumber,
  AvailableNumberRetrieveParams,
  AvailableNumberRetrieveResponse,
} from './resources/available-number';
import {
  BlockedHandleBlockParams,
  BlockedHandleBlockResponse,
  BlockedHandleEntry,
  BlockedHandleListResponse,
  BlockedHandleUnblockParams,
  BlockedHandles,
} from './resources/blocked-handles';
import {
  Capability,
  CapabilityCheckIMessageParams,
  CapabilityCheckRCSParams,
  HandleCheck,
  HandleCheckResponse,
} from './resources/capability';
import {
  ContactCard,
  ContactCardCreateParams,
  ContactCardRetrieveParams,
  ContactCardRetrieveResponse,
  ContactCardUpdateParams,
  SetContactCard,
} from './resources/contact-card';
import { ExperienceListResponse, ExperienceRetrieveResponse, Experiences } from './resources/experiences';
import {
  PaymentHandleConnection,
  PaymentHandleVerifyParams,
  PaymentHandles,
} from './resources/payment-handles';
import {
  PaymentProvider,
  PaymentProviderConnectParams,
  PaymentProviderConnectResponse,
  PaymentProviders,
} from './resources/payment-providers';
import {
  PaymentRequest,
  PaymentRequestCreateParams,
  PaymentRequestListParams,
  PaymentRequestListResponse,
  PaymentRequests,
} from './resources/payment-requests';
import { Payment, PaymentCreateParams, PaymentCredentialsResponse, Payments } from './resources/payments';
import {
  PhoneNumberListResponse,
  PhoneNumberUpdateParams,
  PhoneNumberUpdateResponse,
  PhoneNumbers,
} from './resources/phone-numbers';
import { PhonenumberListResponse, Phonenumbers } from './resources/phonenumbers';
import { WebhookEventListResponse, WebhookEventType, WebhookEvents } from './resources/webhook-events';
import {
  WebhookSubscription,
  WebhookSubscriptionCreateParams,
  WebhookSubscriptionCreateResponse,
  WebhookSubscriptionListResponse,
  WebhookSubscriptionUpdateParams,
  WebhookSubscriptions,
} from './resources/webhook-subscriptions';
import {
  ChatCreatedWebhookEvent,
  ChatGroupIconUpdateFailedWebhookEvent,
  ChatGroupIconUpdatedWebhookEvent,
  ChatGroupNameUpdateFailedWebhookEvent,
  ChatGroupNameUpdatedWebhookEvent,
  ChatTypingIndicatorStartedWebhookEvent,
  ChatTypingIndicatorStoppedWebhookEvent,
  MessageDeliveredWebhookEvent,
  MessageEditedWebhookEvent,
  MessageEventV2,
  MessageFailedWebhookEvent,
  MessagePayload,
  MessageReadWebhookEvent,
  MessageReceivedWebhookEvent,
  MessageSentWebhookEvent,
  ParticipantAddedWebhookEvent,
  ParticipantRemovedWebhookEvent,
  PhoneNumberStatusUpdatedWebhookEvent,
  ReactionAddedWebhookEvent,
  ReactionEventBase,
  ReactionRemovedWebhookEvent,
  SchemasMediaPartResponse,
  SchemasMessageEffect,
  SchemasTextPartResponse,
  UnwrapWebhookEvent,
  Webhooks,
} from './resources/webhooks';
import {
  Chat,
  ChatCreateParams,
  ChatCreateResponse,
  ChatLeaveChatResponse,
  ChatListChatsParams,
  ChatSendVoicememoParams,
  ChatSendVoicememoResponse,
  ChatUpdateParams,
  ChatUpdateResponse,
  Chats,
  ChatsListChatsPagination,
  LinkPart,
  MediaPart,
  MessageContent,
  TextPart,
} from './resources/chats/chats';
import {
  Message,
  MessageAddReactionParams,
  MessageAddReactionResponse,
  MessageCreateParams,
  MessageCreateResponse,
  MessageEffect,
  MessageListMessagesThreadParams,
  MessageUpdateAppCardParams,
  MessageUpdateAppCardResponse,
  MessageUpdateParams,
  Messages,
  MessagesListMessagesPagination,
  ReplyTo,
} from './resources/messages/messages';
import { type Fetch } from './internal/builtin-types';
import { HeadersLike, NullableHeaders, buildHeaders } from './internal/headers';
import { FinalRequestOptions, RequestOptions } from './internal/request-options';
import { readEnv } from './internal/utils/env';
import {
  type LogLevel,
  type Logger,
  formatRequestDetails,
  loggerFor,
  parseLogLevel,
} from './internal/utils/log';
import { isEmptyObj } from './internal/utils/values';

export interface ClientOptions {
  /**
   * Bearer token authentication. Include your API token in the Authorization header.
   *
   * Format: `Authorization: Bearer <your-token>`
   *
   */
  apiKey?: string | undefined;

  /**
   * Webhook signing secret used by `client.webhooks.unwrap()` to verify the
   * Standard Webhooks signature on incoming webhook requests.
   *
   * Format: a base64-encoded key, optionally with a `whsec_` prefix
   * (e.g. `whsec_<your-webhook-signing-secret>`).
   *
   */
  webhookSecret?: string | null | undefined;

  /**
   * Override the default base URL for the API, e.g., "https://api.example.com/v2/"
   *
   * Defaults to process.env['LINQ_API_V3_BASE_URL'].
   */
  baseURL?: string | null | undefined;

  /**
   * The maximum amount of time (in milliseconds) that the client should wait for a response
   * from the server before timing out a single request.
   *
   * Note that request timeouts are retried by default, so in a worst-case scenario you may wait
   * much longer than this timeout before the promise succeeds or fails.
   *
   * @unit milliseconds
   */
  timeout?: number | undefined;
  /**
   * Additional `RequestInit` options to be passed to `fetch` calls.
   * Properties will be overridden by per-request `fetchOptions`.
   */
  fetchOptions?: MergedRequestInit | undefined;

  /**
   * Specify a custom `fetch` function implementation.
   *
   * If not provided, we expect that `fetch` is defined globally.
   */
  fetch?: Fetch | undefined;

  /**
   * The maximum number of times that the client will retry a request in case of a
   * temporary failure, like a network error or a 5XX error from the server.
   *
   * @default 2
   */
  maxRetries?: number | undefined;

  /**
   * Default headers to include with every request to the API.
   *
   * These can be removed in individual requests by explicitly setting the
   * header to `null` in request options.
   */
  defaultHeaders?: HeadersLike | undefined;

  /**
   * Default query parameters to include with every request to the API.
   *
   * These can be removed in individual requests by explicitly setting the
   * param to `undefined` in request options.
   */
  defaultQuery?: Record<string, string | undefined> | undefined;

  /**
   * Set the log level.
   *
   * Defaults to process.env['LINQ_API_V3_LOG'] or 'warn' if it isn't set.
   */
  logLevel?: LogLevel | undefined;

  /**
   * Set the logger.
   *
   * Defaults to globalThis.console.
   */
  logger?: Logger | undefined;
}

/**
 * API Client for interfacing with the Linq API V3 API.
 */
export class LinqAPIV3 {
  apiKey: string;
  webhookSecret: string | null;

  baseURL: string;
  maxRetries: number;
  timeout: number;
  logger: Logger;
  logLevel: LogLevel | undefined;
  fetchOptions: MergedRequestInit | undefined;

  private fetch: Fetch;
  #encoder: Opts.RequestEncoder;
  protected idempotencyHeader?: string;
  private _options: ClientOptions;

  /**
   * API Client for interfacing with the Linq API V3 API.
   *
   * @param {string | undefined} [opts.apiKey=process.env['LINQ_API_V3_API_KEY'] ?? undefined]
   * @param {string | null | undefined} [opts.webhookSecret=process.env['LINQ_WEBHOOK_SECRET'] ?? null]
   * @param {string} [opts.baseURL=process.env['LINQ_API_V3_BASE_URL'] ?? https://api.linqapp.com/api/partner] - Override the default base URL for the API.
   * @param {number} [opts.timeout=1 minute] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
   * @param {MergedRequestInit} [opts.fetchOptions] - Additional `RequestInit` options to be passed to `fetch` calls.
   * @param {Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
   * @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
   * @param {HeadersLike} opts.defaultHeaders - Default headers to include with every request to the API.
   * @param {Record<string, string | undefined>} opts.defaultQuery - Default query parameters to include with every request to the API.
   */
  constructor({
    baseURL = readEnv('LINQ_API_V3_BASE_URL'),
    apiKey = readEnv('LINQ_API_V3_API_KEY'),
    webhookSecret = readEnv('LINQ_WEBHOOK_SECRET') ?? null,
    ...opts
  }: ClientOptions = {}) {
    if (apiKey === undefined) {
      throw new Errors.LinqAPIV3Error(
        "The LINQ_API_V3_API_KEY environment variable is missing or empty; either provide it, or instantiate the LinqAPIV3 client with an apiKey option, like new LinqAPIV3({ apiKey: 'My API Key' }).",
      );
    }

    const options: ClientOptions = {
      apiKey,
      webhookSecret,
      ...opts,
      baseURL: baseURL || `https://api.linqapp.com/api/partner`,
    };

    this.baseURL = options.baseURL!;
    this.timeout = options.timeout ?? LinqAPIV3.DEFAULT_TIMEOUT /* 1 minute */;
    this.logger = options.logger ?? console;
    const defaultLogLevel = 'warn';
    // Set default logLevel early so that we can log a warning in parseLogLevel.
    this.logLevel = defaultLogLevel;
    this.logLevel =
      parseLogLevel(options.logLevel, 'ClientOptions.logLevel', this) ??
      parseLogLevel(readEnv('LINQ_API_V3_LOG'), "process.env['LINQ_API_V3_LOG']", this) ??
      defaultLogLevel;
    this.fetchOptions = options.fetchOptions;
    this.maxRetries = options.maxRetries ?? 2;
    this.fetch = options.fetch ?? Shims.getDefaultFetch();
    this.#encoder = Opts.FallbackEncoder;

    const customHeadersEnv = readEnv('LINQ_API_V3_CUSTOM_HEADERS');
    if (customHeadersEnv) {
      const parsed: Record<string, string> = {};
      for (const line of customHeadersEnv.split('\n')) {
        const colon = line.indexOf(':');
        if (colon >= 0) {
          parsed[line.substring(0, colon).trim()] = line.substring(colon + 1).trim();
        }
      }
      options.defaultHeaders = { ...parsed, ...options.defaultHeaders };
    }

    this._options = options;

    this.apiKey = apiKey;
    this.webhookSecret = webhookSecret;
  }

  /**
   * Create a new client instance re-using the same options given to the current client with optional overriding.
   */
  withOptions(options: Partial<ClientOptions>): this {
    const client = new (this.constructor as any as new (props: ClientOptions) => typeof this)({
      ...this._options,
      baseURL: this.baseURL,
      maxRetries: this.maxRetries,
      timeout: this.timeout,
      logger: this.logger,
      logLevel: this.logLevel,
      fetch: this.fetch,
      fetchOptions: this.fetchOptions,
      apiKey: this.apiKey,
      webhookSecret: this.webhookSecret,
      ...options,
    });
    return client;
  }

  /**
   * Check whether the base URL is set to its default.
   */
  #baseURLOverridden(): boolean {
    return this.baseURL !== 'https://api.linqapp.com/api/partner';
  }

  protected defaultQuery(): Record<string, string | undefined> | undefined {
    return this._options.defaultQuery;
  }

  protected validateHeaders({ values, nulls }: NullableHeaders) {
    return;
  }

  protected async authHeaders(opts: FinalRequestOptions): Promise<NullableHeaders | undefined> {
    return buildHeaders([{ Authorization: `Bearer ${this.apiKey}` }]);
  }

  protected stringifyQuery(query: object | Record<string, unknown>): string {
    return stringifyQuery(query);
  }

  private getUserAgent(): string {
    return `${this.constructor.name}/JS ${VERSION}`;
  }

  protected defaultIdempotencyKey(): string {
    return `stainless-node-retry-${uuid4()}`;
  }

  protected makeStatusError(
    status: number,
    error: Object,
    message: string | undefined,
    headers: Headers,
  ): Errors.APIError {
    return Errors.APIError.generate(status, error, message, headers);
  }

  buildURL(
    path: string,
    query: Record<string, unknown> | null | undefined,
    defaultBaseURL?: string | undefined,
  ): string {
    const baseURL = (!this.#baseURLOverridden() && defaultBaseURL) || this.baseURL;
    const url =
      isAbsoluteURL(path) ?
        new URL(path)
      : new URL(baseURL + (baseURL.endsWith('/') && path.startsWith('/') ? path.slice(1) : path));

    const defaultQuery = this.defaultQuery();
    const pathQuery = Object.fromEntries(url.searchParams);
    if (!isEmptyObj(defaultQuery) || !isEmptyObj(pathQuery)) {
      query = { ...pathQuery, ...defaultQuery, ...query };
    }

    if (typeof query === 'object' && query && !Array.isArray(query)) {
      url.search = this.stringifyQuery(query);
    }

    return url.toString();
  }

  /**
   * Used as a callback for mutating the given `FinalRequestOptions` object.
   */
  protected async prepareOptions(options: FinalRequestOptions): Promise<void> {}

  /**
   * Used as a callback for mutating the given `RequestInit` object.
   *
   * This is useful for cases where you want to add certain headers based off of
   * the request properties, e.g. `method` or `url`.
   */
  protected async prepareRequest(
    request: RequestInit,
    { url, options }: { url: string; options: FinalRequestOptions },
  ): Promise<void> {}

  get<Rsp>(path: string, opts?: PromiseOrValue<RequestOptions>): APIPromise<Rsp> {
    return this.methodRequest('get', path, opts);
  }

  post<Rsp>(path: string, opts?: PromiseOrValue<RequestOptions>): APIPromise<Rsp> {
    return this.methodRequest('post', path, opts);
  }

  patch<Rsp>(path: string, opts?: PromiseOrValue<RequestOptions>): APIPromise<Rsp> {
    return this.methodRequest('patch', path, opts);
  }

  put<Rsp>(path: string, opts?: PromiseOrValue<RequestOptions>): APIPromise<Rsp> {
    return this.methodRequest('put', path, opts);
  }

  delete<Rsp>(path: string, opts?: PromiseOrValue<RequestOptions>): APIPromise<Rsp> {
    return this.methodRequest('delete', path, opts);
  }

  private methodRequest<Rsp>(
    method: HTTPMethod,
    path: string,
    opts?: PromiseOrValue<RequestOptions>,
  ): APIPromise<Rsp> {
    return this.request(
      Promise.resolve(opts).then((opts) => {
        return { method, path, ...opts };
      }),
    );
  }

  request<Rsp>(
    options: PromiseOrValue<FinalRequestOptions>,
    remainingRetries: number | null = null,
  ): APIPromise<Rsp> {
    return new APIPromise(this, this.makeRequest(options, remainingRetries, undefined));
  }

  private async makeRequest(
    optionsInput: PromiseOrValue<FinalRequestOptions>,
    retriesRemaining: number | null,
    retryOfRequestLogID: string | undefined,
  ): Promise<APIResponseProps> {
    const options = await optionsInput;
    const maxRetries = options.maxRetries ?? this.maxRetries;
    if (retriesRemaining == null) {
      retriesRemaining = maxRetries;
    }

    await this.prepareOptions(options);

    const { req, url, timeout } = await this.buildRequest(options, {
      retryCount: maxRetries - retriesRemaining,
    });

    await this.prepareRequest(req, { url, options });

    /** Not an API request ID, just for correlating local log entries. */
    const requestLogID = 'log_' + ((Math.random() * (1 << 24)) | 0).toString(16).padStart(6, '0');
    const retryLogStr = retryOfRequestLogID === undefined ? '' : `, retryOf: ${retryOfRequestLogID}`;
    const startTime = Date.now();

    loggerFor(this).debug(
      `[${requestLogID}] sending request`,
      formatRequestDetails({
        retryOfRequestLogID,
        method: options.method,
        url,
        options,
        headers: req.headers,
      }),
    );

    if (options.signal?.aborted) {
      throw new Errors.APIUserAbortError();
    }

    const controller = new AbortController();
    const response = await this.fetchWithTimeout(url, req, timeout, controller).catch(castToError);
    const headersTime = Date.now();

    if (response instanceof globalThis.Error) {
      const retryMessage = `retrying, ${retriesRemaining} attempts remaining`;
      if (options.signal?.aborted) {
        throw new Errors.APIUserAbortError();
      }
      // detect native connection timeout errors
      // deno throws "TypeError: error sending request for url (https://example/): client error (Connect): tcp connect error: Operation timed out (os error 60): Operation timed out (os error 60)"
      // undici throws "TypeError: fetch failed" with cause "ConnectTimeoutError: Connect Timeout Error (attempted address: example:443, timeout: 1ms)"
      // others do not provide enough information to distinguish timeouts from other connection errors
      const isTimeout =
        isAbortError(response) ||
        /timed? ?out/i.test(String(response) + ('cause' in response ? String(response.cause) : ''));
      if (retriesRemaining) {
        loggerFor(this).info(
          `[${requestLogID}] connection ${isTimeout ? 'timed out' : 'failed'} - ${retryMessage}`,
        );
        loggerFor(this).debug(
          `[${requestLogID}] connection ${isTimeout ? 'timed out' : 'failed'} (${retryMessage})`,
          formatRequestDetails({
            retryOfRequestLogID,
            url,
            durationMs: headersTime - startTime,
            message: response.message,
          }),
        );
        return this.retryRequest(options, retriesRemaining, retryOfRequestLogID ?? requestLogID);
      }
      loggerFor(this).info(
        `[${requestLogID}] connection ${isTimeout ? 'timed out' : 'failed'} - error; no more retries left`,
      );
      loggerFor(this).debug(
        `[${requestLogID}] connection ${isTimeout ? 'timed out' : 'failed'} (error; no more retries left)`,
        formatRequestDetails({
          retryOfRequestLogID,
          url,
          durationMs: headersTime - startTime,
          message: response.message,
        }),
      );
      if (isTimeout) {
        throw new Errors.APIConnectionTimeoutError();
      }
      throw new Errors.APIConnectionError({ cause: response });
    }

    const responseInfo = `[${requestLogID}${retryLogStr}] ${req.method} ${url} ${
      response.ok ? 'succeeded' : 'failed'
    } with status ${response.status} in ${headersTime - startTime}ms`;

    if (!response.ok) {
      const shouldRetry = await this.shouldRetry(response);
      if (retriesRemaining && shouldRetry) {
        const retryMessage = `retrying, ${retriesRemaining} attempts remaining`;

        // We don't need the body of this response.
        await Shims.CancelReadableStream(response.body);
        loggerFor(this).info(`${responseInfo} - ${retryMessage}`);
        loggerFor(this).debug(
          `[${requestLogID}] response error (${retryMessage})`,
          formatRequestDetails({
            retryOfRequestLogID,
            url: response.url,
            status: response.status,
            headers: response.headers,
            durationMs: headersTime - startTime,
          }),
        );
        return this.retryRequest(
          options,
          retriesRemaining,
          retryOfRequestLogID ?? requestLogID,
          response.headers,
        );
      }

      const retryMessage = shouldRetry ? `error; no more retries left` : `error; not retryable`;

      loggerFor(this).info(`${responseInfo} - ${retryMessage}`);

      const errText = await response.text().catch((err: any) => castToError(err).message);
      const errJSON = safeJSON(errText) as any;
      const errMessage = errJSON ? undefined : errText;

      loggerFor(this).debug(
        `[${requestLogID}] response error (${retryMessage})`,
        formatRequestDetails({
          retryOfRequestLogID,
          url: response.url,
          status: response.status,
          headers: response.headers,
          message: errMessage,
          durationMs: Date.now() - startTime,
        }),
      );

      const err = this.makeStatusError(response.status, errJSON, errMessage, response.headers);
      throw err;
    }

    loggerFor(this).info(responseInfo);
    loggerFor(this).debug(
      `[${requestLogID}] response start`,
      formatRequestDetails({
        retryOfRequestLogID,
        url: response.url,
        status: response.status,
        headers: response.headers,
        durationMs: headersTime - startTime,
      }),
    );

    return { response, options, controller, requestLogID, retryOfRequestLogID, startTime };
  }

  getAPIList<Item, PageClass extends Pagination.AbstractPage<Item> = Pagination.AbstractPage<Item>>(
    path: string,
    Page: new (...args: any[]) => PageClass,
    opts?: PromiseOrValue<RequestOptions>,
  ): Pagination.PagePromise<PageClass, Item> {
    return this.requestAPIList(
      Page,
      opts && 'then' in opts ?
        opts.then((opts) => ({ method: 'get', path, ...opts }))
      : { method: 'get', path, ...opts },
    );
  }

  requestAPIList<
    Item = unknown,
    PageClass extends Pagination.AbstractPage<Item> = Pagination.AbstractPage<Item>,
  >(
    Page: new (...args: ConstructorParameters<typeof Pagination.AbstractPage>) => PageClass,
    options: PromiseOrValue<FinalRequestOptions>,
  ): Pagination.PagePromise<PageClass, Item> {
    const request = this.makeRequest(options, null, undefined);
    return new Pagination.PagePromise<PageClass, Item>(this as any as LinqAPIV3, request, Page);
  }

  async fetchWithTimeout(
    url: RequestInfo,
    init: RequestInit | undefined,
    ms: number,
    controller: AbortController,
  ): Promise<Response> {
    const { signal, method, ...options } = init || {};
    const abort = this._makeAbort(controller);
    if (signal) signal.addEventListener('abort', abort, { once: true });

    const timeout = setTimeout(abort, ms);

    const isReadableBody =
      ((globalThis as any).ReadableStream && options.body instanceof (globalThis as any).ReadableStream) ||
      (typeof options.body === 'object' && options.body !== null && Symbol.asyncIterator in options.body);

    const fetchOptions: RequestInit = {
      signal: controller.signal as any,
      ...(isReadableBody ? { duplex: 'half' } : {}),
      method: 'GET',
      ...options,
    };
    if (method) {
      // Custom methods like 'patch' need to be uppercased
      // See https://github.com/nodejs/undici/issues/2294
      fetchOptions.method = method.toUpperCase();
    }

    try {
      // use undefined this binding; fetch errors if bound to something else in browser/cloudflare
      return await this.fetch.call(undefined, url, fetchOptions);
    } finally {
      clearTimeout(timeout);
    }
  }

  private async shouldRetry(response: Response): Promise<boolean> {
    // Note this is not a standard header.
    const shouldRetryHeader = response.headers.get('x-should-retry');

    // If the server explicitly says whether or not to retry, obey.
    if (shouldRetryHeader === 'true') return true;
    if (shouldRetryHeader === 'false') return false;

    // Retry on request timeouts.
    if (response.status === 408) return true;

    // Retry on lock timeouts.
    if (response.status === 409) return true;

    // Retry on rate limits.
    if (response.status === 429) return true;

    // Retry internal errors.
    if (response.status >= 500) return true;

    return false;
  }

  private async retryRequest(
    options: FinalRequestOptions,
    retriesRemaining: number,
    requestLogID: string,
    responseHeaders?: Headers | undefined,
  ): Promise<APIResponseProps> {
    let timeoutMillis: number | undefined;

    // Note the `retry-after-ms` header may not be standard, but is a good idea and we'd like proactive support for it.
    const retryAfterMillisHeader = responseHeaders?.get('retry-after-ms');
    if (retryAfterMillisHeader) {
      const timeoutMs = parseFloat(retryAfterMillisHeader);
      if (!Number.isNaN(timeoutMs)) {
        timeoutMillis = timeoutMs;
      }
    }

    // About the Retry-After header: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After
    const retryAfterHeader = responseHeaders?.get('retry-after');
    if (retryAfterHeader && !timeoutMillis) {
      const timeoutSeconds = parseFloat(retryAfterHeader);
      if (!Number.isNaN(timeoutSeconds)) {
        timeoutMillis = timeoutSeconds * 1000;
      } else {
        timeoutMillis = Date.parse(retryAfterHeader) - Date.now();
      }
    }

    // If the API asks us to wait a certain amount of time, just do what it
    // says, but otherwise calculate a default
    if (timeoutMillis === undefined) {
      const maxRetries = options.maxRetries ?? this.maxRetries;
      timeoutMillis = this.calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries);
    }
    await sleep(timeoutMillis);

    return this.makeRequest(options, retriesRemaining - 1, requestLogID);
  }

  private calculateDefaultRetryTimeoutMillis(retriesRemaining: number, maxRetries: number): number {
    const initialRetryDelay = 0.5;
    const maxRetryDelay = 8.0;

    const numRetries = maxRetries - retriesRemaining;

    // Apply exponential backoff, but not more than the max.
    const sleepSeconds = Math.min(initialRetryDelay * Math.pow(2, numRetries), maxRetryDelay);

    // Apply some jitter, take up to at most 25 percent of the retry time.
    const jitter = 1 - Math.random() * 0.25;

    return sleepSeconds * jitter * 1000;
  }

  async buildRequest(
    inputOptions: FinalRequestOptions,
    { retryCount = 0 }: { retryCount?: number } = {},
  ): Promise<{ req: FinalizedRequestInit; url: string; timeout: number }> {
    const options = { ...inputOptions };
    const { method, path, query, defaultBaseURL } = options;

    const url = this.buildURL(path!, query as Record<string, unknown>, defaultBaseURL);
    if ('timeout' in options) validatePositiveInteger('timeout', options.timeout);
    options.timeout = options.timeout ?? this.timeout;
    const { bodyHeaders, body } = this.buildBody({ options });
    const reqHeaders = await this.buildHeaders({ options: inputOptions, method, bodyHeaders, retryCount });

    const req: FinalizedRequestInit = {
      method,
      headers: reqHeaders,
      ...(options.signal && { signal: options.signal }),
      ...((globalThis as any).ReadableStream &&
        body instanceof (globalThis as any).ReadableStream && { duplex: 'half' }),
      ...(body && { body }),
      ...((this.fetchOptions as any) ?? {}),
      ...((options.fetchOptions as any) ?? {}),
    };

    return { req, url, timeout: options.timeout };
  }

  private async buildHeaders({
    options,
    method,
    bodyHeaders,
    retryCount,
  }: {
    options: FinalRequestOptions;
    method: HTTPMethod;
    bodyHeaders: HeadersLike;
    retryCount: number;
  }): Promise<Headers> {
    let idempotencyHeaders: HeadersLike = {};
    if (this.idempotencyHeader && method !== 'get') {
      if (!options.idempotencyKey) options.idempotencyKey = this.defaultIdempotencyKey();
      idempotencyHeaders[this.idempotencyHeader] = options.idempotencyKey;
    }

    const headers = buildHeaders([
      idempotencyHeaders,
      {
        Accept: 'application/json',
        'User-Agent': this.getUserAgent(),
        'X-Stainless-Retry-Count': String(retryCount),
        ...(options.timeout ? { 'X-Stainless-Timeout': String(Math.trunc(options.timeout / 1000)) } : {}),
        ...getPlatformHeaders(),
      },
      await this.authHeaders(options),
      this._options.defaultHeaders,
      bodyHeaders,
      options.headers,
    ]);

    this.validateHeaders(headers);

    return headers.values;
  }

  private _makeAbort(controller: AbortController) {
    // note: we can't just inline this method inside `fetchWithTimeout()` because then the closure
    //       would capture all request options, and cause a memory leak.
    return () => controller.abort();
  }

  private buildBody({ options }: { options: FinalRequestOptions }): {
    bodyHeaders: HeadersLike;
    body: BodyInit | undefined;
  } {
    const { body, headers: rawHeaders } = options;
    if (!body) {
      // A resource method always passes a `body` key when its operation defines a
      // request body, even if the caller omitted an optional body param. Keep the
      // content-type for those, and only elide it for operations with no body at
      // all (e.g. GET/DELETE).
      if (body == null && 'body' in options) {
        return this.#encoder({ body, headers: buildHeaders([rawHeaders]) });
      }
      return { bodyHeaders: undefined, body: undefined };
    }
    const headers = buildHeaders([rawHeaders]);
    if (
      // Pass raw type verbatim
      ArrayBuffer.isView(body) ||
      body instanceof ArrayBuffer ||
      body instanceof DataView ||
      (typeof body === 'string' &&
        // Preserve legacy string encoding behavior for now
        headers.values.has('content-type')) ||
      // `Blob` is superset of `File`
      ((globalThis as any).Blob && body instanceof (globalThis as any).Blob) ||
      // `FormData` -> `multipart/form-data`
      body instanceof FormData ||
      // `URLSearchParams` -> `application/x-www-form-urlencoded`
      body instanceof URLSearchParams ||
      // Send chunked stream (each chunk has own `length`)
      ((globalThis as any).ReadableStream && body instanceof (globalThis as any).ReadableStream)
    ) {
      return { bodyHeaders: undefined, body: body as BodyInit };
    } else if (
      typeof body === 'object' &&
      (Symbol.asyncIterator in body ||
        (Symbol.iterator in body && 'next' in body && typeof body.next === 'function'))
    ) {
      return { bodyHeaders: undefined, body: Shims.ReadableStreamFrom(body as AsyncIterable<Uint8Array>) };
    } else if (
      typeof body === 'object' &&
      headers.values.get('content-type') === 'application/x-www-form-urlencoded'
    ) {
      return {
        bodyHeaders: { 'content-type': 'application/x-www-form-urlencoded' },
        body: this.stringifyQuery(body),
      };
    } else {
      return this.#encoder({ body, headers });
    }
  }

  static LinqAPIV3 = this;
  static DEFAULT_TIMEOUT = 60000; // 1 minute

  static LinqAPIV3Error = Errors.LinqAPIV3Error;
  static APIError = Errors.APIError;
  static APIConnectionError = Errors.APIConnectionError;
  static APIConnectionTimeoutError = Errors.APIConnectionTimeoutError;
  static APIUserAbortError = Errors.APIUserAbortError;
  static NotFoundError = Errors.NotFoundError;
  static ConflictError = Errors.ConflictError;
  static RateLimitError = Errors.RateLimitError;
  static BadRequestError = Errors.BadRequestError;
  static AuthenticationError = Errors.AuthenticationError;
  static InternalServerError = Errors.InternalServerError;
  static PermissionDeniedError = Errors.PermissionDeniedError;
  static UnprocessableEntityError = Errors.UnprocessableEntityError;

  static toFile = Uploads.toFile;

  chats: API.Chats = new API.Chats(this);
  /**
   * Messages are individual communications within a chat thread.
   *
   * Messages can include text, media attachments, rich link previews, special effects
   * (like confetti or fireworks), and reactions. All messages are associated with a
   * specific chat and sent from a phone number you own.
   *
   * Messages support delivery status tracking, read receipts, and editing capabilities.
   *
   * ## Rich Link Previews
   *
   * Send a URL as a `link` part to deliver it with a rich preview card showing the
   * page's title, description, and image (when available). A `link` part must be the
   * **only** part in the message — it cannot be combined with text or media parts.
   * To send a URL without a preview card, include it in a `text` part instead.
   *
   * **Limitations:**
   * - A `link` part cannot be combined with other parts in the same message.
   * - Maximum URL length: 2,048 characters.
   *
   * ## Ephemeral Messages (Privacy Tier)
   *
   * For regulated or sensitive conversations, opt in to the **ephemeral messages** tier by contacting your Linq support contact. When enabled, every message on the covered phone numbers is automatically given a fixed **24-hour retention window** — after that window the platform permanently deletes the message from Linq storage. There is no per-message flag; ephemerality is applied automatically based on your configuration.
   *
   * You can request it at two scopes:
   *
   * | Scope | Effect |
   * |---|---|
   * | **Partner-wide** | Every outbound and inbound message on every phone number under your account is retained for 24 hours, then deleted. |
   * | **Per phone number** | Only the specified phone numbers have their messages auto-deleted. The rest follow the standard message-retention policy. |
   *
   * **Behavioral differences vs the standard default:**
   *
   * | Aspect | Standard | Ephemeral |
   * |---|---|---|
   * | Retention | Retained per the standard message-retention policy | **Hard backstop: 24 hours** from when the message is created |
   * | After expiry | Message stays retrievable | Message is permanently deleted — `GET /v3/messages/{messageId}` returns `404` and it no longer appears in `GET /v3/chats/{chatId}/messages` |
   * | Content on expiry | N/A | Text, formatting, and attachment references are scrubbed; the message is gone, not blanked out |
   * | Cross-partner isolation | Enforced | Enforced |
   *
   * **How the 24-hour window works:**
   *
   * - The window is fixed at **24 hours from message creation** (`created_at`) and cannot be configured per message.
   * - It mirrors the ephemeral *attachments* 1-day backstop, so a message and any media it carries expire together.
   * - Expiry is delivery-independent — the clock starts when the message is created, not when it is delivered or read.
   *
   * **What you observe:**
   *
   * - **No expiry timestamp is exposed.** API responses and webhook payloads do not include the deletion time. If you need it, compute `created_at + 24h` yourself.
   * - **No deletion webhook is sent.** There is no `message.deleted` event — a message simply stops being retrievable once its window passes.
   * - **Delivery is unaffected.** Ephemeral messages send, deliver, and fire the usual `message.sent` / `message.received` and status webhooks exactly like standard messages. Only retention changes.
   *
   * **When to choose ephemeral:**
   *
   * - You have a compliance requirement that the platform must not retain message content beyond a short window.
   * - The conversation is high-sensitivity (PHI, financial, identity verification) and you do not want it sitting in storage long-term.
   * - Your application is the system of record — you capture what you need from the delivery webhook in real time and do not rely on reading message history back from Linq later.
   *
   * **Important:** ephemeral applies in *both directions* — messages you send **and** messages received by the phone numbers in that scope. Because Linq can no longer return the message after 24 hours, persist anything you need to keep from the webhook payload at the time it is delivered.
   *
   */
  messages: API.Messages = new API.Messages(this);
  /**
   * Send files (images, videos, documents, audio) with messages by providing a URL in a media part.
   * Pre-uploading via `POST /v3/attachments` is **optional** and only needed for specific optimization scenarios.
   *
   * ## Sending Media via URL (up to 10MB)
   *
   * Provide a publicly accessible HTTPS URL with a [supported media type](#supported-file-types) in the `url` field of a media part.
   *
   * ```json
   * {
   *   "parts": [
   *     { "type": "media", "url": "https://your-cdn.com/images/photo.jpg" }
   *   ]
   * }
   * ```
   *
   * This works with any URL you already host — no pre-upload step required. **Maximum file size: 10MB.**
   *
   * ## Pre-Upload (required for files over 10MB)
   *
   * Use `POST /v3/attachments` when you want to:
   * - **Send files larger than 10MB** (up to 100MB) — URL-based downloads are limited to 10MB
   * - **Send the same file to many recipients** — upload once, reuse the `attachment_id` without re-downloading each time
   * - **Reduce message send latency** — the file is already stored, so sending is faster
   *
   * **How it works:**
   * 1. `POST /v3/attachments` with file metadata → returns a presigned `upload_url` (valid for **15 minutes**) and a permanent `attachment_id`
   * 2. PUT the raw file bytes to the `upload_url` with the `required_headers` (no JSON or multipart — just the binary content)
   * 3. Reference the `attachment_id` in your media part when sending messages (no expiration)
   *
   * **Key difference:** When you provide an external `url`, we download and process the file on every send.
   * When you use a pre-uploaded `attachment_id`, the file is already stored — so repeated sends skip the download step entirely.
   *
   * ## Domain Allowlisting
   *
   * Attachment URLs in API responses are served from `cdn.linqapp.com`. This includes:
   * - `url` fields in media and voice memo message parts
   * - `download_url` fields in attachment and upload response objects
   *
   * If your application enforces domain allowlists (e.g., for SSRF protection), add:
   *
   * ```
   * cdn.linqapp.com
   * ```
   *
   * ## Supported File Types
   *
   * - **Images:** JPEG, PNG, GIF, HEIC, HEIF, TIFF, BMP
   * - **Videos:** MP4, MOV, M4V
   * - **Audio:** M4A, AAC, MP3, WAV, AIFF, CAF, AMR
   * - **Documents:** PDF, TXT, RTF, CSV, Office formats, ZIP
   * - **Contact & Calendar:** VCF, ICS
   *
   * ## Audio: Attachment vs Voice Memo
   *
   * Audio files sent as media parts appear as **downloadable file attachments** in iMessage.
   * To send audio as an **iMessage voice memo bubble** (with native inline playback UI),
   * use the dedicated `POST /v3/chats/{chatId}/voicememo` endpoint instead.
   *
   * ## File Size Limits
   *
   * - **URL-based (`url` field):** 10MB maximum
   * - **Pre-upload (`attachment_id`):** 100MB maximum
   *
   * ## Security & Ownership
   *
   * Every attachment is bound to the partner account that created or received it. The API enforces ownership on every operation that touches an attachment — sending, retrieving, deleting.
   *
   * **What this means for you:**
   *
   * - An attachment created under your API key can only be referenced by your API key.
   * - Submitting another partner's `attachment_id` returns `404 Not Found`. We do not disclose whether the id exists or belongs to someone else.
   * - Submitting a CDN URL that resolves to another partner's attachment is rejected before the send is attempted.
   * - Ownership enforcement applies uniformly across send, create-chat, voice memo, retrieve, and delete operations.
   *
   * Every attachment-affecting endpoint requires a valid partner API key. Unauthenticated calls return `401 Unauthorized`.
   *
   * ## Attachment URL Patterns
   *
   * Attachment URLs in API responses and webhook payloads use one of two layouts, depending on the attachment's tier:
   *
   * | Tier | URL pattern | TTL |
   * |---|---|---|
   * | Persistent (default) | `https://cdn.linqapp.com/attachments/partners/{partner_id}/{attachment_id}/{filename}` | Long-lived |
   * | Ephemeral | Pre-signed URL pointing at the ephemeral prefix on `cdn.linqapp.com` | 15 minutes per signed URL — re-fetch via the API for a fresh URL |
   *
   * Inbound media you receive over webhooks uses the same layout your outbound sends produce, so the URL you store and the URL you build look identical — no special casing in your client.
   *
   * ## Ephemeral Attachments (Privacy Tier)
   *
   * For regulated or sensitive content, opt in to the **ephemeral attachments** tier by contacting your Linq support contact. You can request it at two scopes:
   *
   * | Scope | Effect |
   * |---|---|
   * | **Partner-wide** | Every outbound and inbound attachment on every phone number under your account is routed through the ephemeral tier. |
   * | **Per phone number** | Only the specified phone numbers route their attachments through the ephemeral tier. The rest stay on the persistent tier. |
   *
   * **Behavioral differences vs the persistent default:**
   *
   * | Aspect | Persistent | Ephemeral |
   * |---|---|---|
   * | Download URL form | Long-lived CDN URL | Pre-signed URL with short TTL |
   * | Retention floor | Indefinite (until you call `DELETE`) | **Hard backstop: 1 day** — even without an explicit `DELETE`, the platform removes the underlying bytes after 24 hours |
   * | URL re-fetch | Not required | Fetch via `GET /v3/attachments/{attachmentId}` for a fresh signed URL after TTL expiry |
   * | Cross-partner isolation | Enforced | Enforced |
   *
   * **When to choose ephemeral:**
   *
   * - Your downstream system processes the file immediately on receipt and does not need to re-read it later.
   * - You have a compliance requirement that the platform must not retain attachments beyond a short window.
   * - The content is high-sensitivity (PHI, financial documents, identity verification) and you do not want it sitting behind a long-lived URL.
   *
   * **Important:** ephemeral applies in *both directions* — outbound files you upload **and** inbound media received by the phone numbers in that scope. Download bytes you need to keep promptly, or fetch a fresh signed URL via the API when needed.
   *
   * ## Deleting an Attachment
   *
   * To permanently remove an attachment you own, use:
   *
   * ```http
   * DELETE /v3/attachments/{attachmentId}
   * Authorization: Bearer <your_api_key>
   * ```
   *
   * **What this does:**
   *
   * 1. Verifies the attachment is owned by your account. Returns `404` otherwise.
   * 2. Removes the underlying file from Linq storage.
   * 3. Records an audit entry (timestamp, partner, attachment id).
   *
   * **Response codes:**
   *
   * | Status | Meaning |
   * |---|---|
   * | `204 No Content` | Deletion succeeded. The attachment is removed from Linq storage. |
   * | `400 Bad Request` | `attachmentId` is not a valid UUID. |
   * | `401 Unauthorized` | Missing or invalid API key. |
   * | `404 Not Found` | Attachment does not exist or is not owned by your account. |
   * | `500 Internal Server Error` | Transient infrastructure issue — safe to retry. |
   *
   * **Effect on message history:**
   *
   * - Messages that referenced the deleted attachment remain visible.
   * - The message part that pointed at the attachment is preserved with no attachment reference.
   * - Webhook payloads previously delivered to you retain the original URL string, but downloads from that URL return `404` going forward.
   *
   * Deletion is **irreversible**. Once `204` is returned, the bytes are gone — there is no undelete.
   *
   * ## Inbound Media Flow
   *
   * When one of your phone numbers receives a message with media (image, video, audio, document), the platform:
   *
   * 1. Stores the file under your partner account.
   * 2. Records metadata linked to the inbound message.
   * 3. Delivers a webhook whose `parts[]` array includes a `media` part with a `url` pointing at `cdn.linqapp.com`.
   * 4. If the receiving phone is opted in to ephemeral, the `url` is a short-TTL signed URL.
   *
   * You can acknowledge the webhook without fetching the file inline, and lazy-load via `GET /v3/attachments/{attachmentId}` later. For ephemeral attachments, retrieving via the API always returns a freshly-signed URL.
   *
   * ## Data Lifecycle Summary
   *
   * | Data | Persistent tier | Ephemeral tier |
   * |---|---|---|
   * | Attachment bytes | Retained until you `DELETE` | **Auto-removed after 1 day**, also removable via `DELETE` |
   * | Attachment metadata (id, filename, mime type, size) | Retained until you `DELETE` | Removed alongside the bytes |
   * | Message body & parts | Retained per message-retention policy | Retained per message-retention policy — unless the line also has **ephemeral messages** enabled (see the Messages page), in which case the message and its parts are deleted 24 hours after creation |
   * | Audit log of deletions | Retained per platform retention policy | Retained per platform retention policy |
   *
   * **In transit:** TLS 1.2+ everywhere. **At rest:** AES-256 (server-side encryption).
   *
   * ## Compliance Checklist
   *
   * If you're integrating Linq under a security or privacy review, here is the short list:
   *
   * - Allowlist exactly one outbound domain: `cdn.linqapp.com`.
   * - Decide whether you need ephemeral attachments (high-sensitivity content) — request enablement through your Linq support contact.
   * - Implement `DELETE /v3/attachments/{attachmentId}` calls in your deletion workflow.
   * - Persist any attachments your application needs long-term — Linq is the authoritative source until you delete, but the ephemeral tier auto-purges after 1 day.
   * - For audit: every deletion is logged on Linq's side. Surface a confirmation in your application UI based on the `204` response.
   * - For end-user "right to delete" requests: enumerate attachment ids and `DELETE` each. The platform does not provide a partner-wide wipe endpoint — deletion is per-attachment by design.
   *
   */
  attachments: API.Attachments = new API.Attachments(this);
  /**
   * Phone Numbers represent the phone numbers assigned to your partner account.
   *
   * Use the list phone numbers endpoint to discover which phone numbers are available
   * for sending messages.
   *
   * When creating chats, listing chats, or sending a voice memo, use one of your assigned phone numbers
   * in the `from` field.
   *
   */
  phonenumbers: API.Phonenumbers = new API.Phonenumbers(this);
  /**
   * Phone Numbers represent the phone numbers assigned to your partner account.
   *
   * Use the list phone numbers endpoint to discover which phone numbers are available
   * for sending messages.
   *
   * When creating chats, listing chats, or sending a voice memo, use one of your assigned phone numbers
   * in the `from` field.
   *
   */
  phoneNumbers: API.PhoneNumbers = new API.PhoneNumbers(this);
  /**
   * Phone Numbers represent the phone numbers assigned to your partner account.
   *
   * Use the list phone numbers endpoint to discover which phone numbers are available
   * for sending messages.
   *
   * When creating chats, listing chats, or sending a voice memo, use one of your assigned phone numbers
   * in the `from` field.
   *
   */
  availableNumber: API.AvailableNumber = new API.AvailableNumber(this);
  /**
   * Request a payment from a recipient over iMessage. You create a payment
   * request, send its `checkout_url` to the recipient, and they pay with Apple
   * Pay or card. Funds settle **directly to your own Stripe account** — Linq
   * never holds the money.
   *
   * ## How it works
   *
   * 1. **Create** a payment request with an amount and currency. You get back a
   *    `checkout_url` and a `status` of `requested`.
   * 2. **Send** the `checkout_url` to the recipient as a `link` message part so
   *    it arrives as a tappable card (see *Sending the link* below).
   * 3. The recipient **pays** on the hosted checkout (Apple Pay App Clip on a
   *    supported iPhone, web checkout everywhere else).
   * 4. You receive a **`payment.succeeded`** webhook and the request's `status`
   *    becomes `succeeded`. Requests you don't collect eventually `expire`.
   *
   * ## Connected accounts (Stripe Standard, direct charges)
   *
   * Payments run on **Stripe Connect Standard accounts** using **direct
   * charges**: the charge is created on *your* connected account and **you are
   * the merchant of record**. That means the money, the payout schedule, the
   * customer relationship, and the compliance surface are all yours — Linq
   * orchestrates the request and the checkout but is never in the funds flow.
   *
   * **Refunds, disputes, and chargebacks are handled by you, in your own Stripe
   * Dashboard.** Because charges settle directly to your account, Linq has no
   * custody of the funds and cannot issue refunds or contest disputes on your
   * behalf — and there is no refund/dispute endpoint in this API by design. Use
   * the Stripe Dashboard (or the Stripe API on your own account) for the money
   * lifecycle after a payment succeeds.
   *
   * ## Getting set up
   *
   * Open **Agent Pay** in your Linq dashboard
   * (`https://zero.linqapp.com/organization/payments`), click **Connect Stripe**,
   * and complete Stripe's onboarding (business details + a bank account). When
   * your account reaches `charges_enabled`, request creation unlocks; until you
   * connect Stripe, `POST /v3/payment_requests` returns `403`. You can keep
   * collecting even while Stripe finishes background verification.
   *
   * ## Subscriptions
   *
   * Set `mode: subscription` on `POST /v3/payment_requests` to start an
   * **auto-renewing subscription** instead of a one-time charge. Instead of an
   * amount, you pass a `price_id` — an active **recurring Price** on your
   * connected Stripe account (create one in your Stripe Dashboard under
   * Product catalog; if you sell through Stripe Payment Links today, reuse the
   * price your link is built from). The recipient pays the first invoice at
   * the same checkout, and their payment method is saved to the subscription
   * for automatic renewals.
   *
   * The division of labor is deliberate: **Linq handles the first payment,
   * your Stripe account handles the rest.** The request reaches `succeeded`
   * when the first invoice is paid; from then on the subscription lives
   * entirely on your connected account. The response's `stripe` object gives
   * you the join keys — `customer_id` and `subscription_id` — so renewals,
   * plan changes, dunning, and cancellation are managed with your own Stripe
   * Dashboard/API and your own Stripe webhooks. Your `metadata` is stamped on
   * the Customer and Subscription, so correlating in either direction is
   * trivial. There are no renewal webhooks from Linq by design.
   *
   * ### Free trials
   *
   * Add `trial_period_days` (or a fixed `trial_end` timestamp) to start the
   * subscription with a free trial. The checkout still collects the
   * recipient's payment method — the pay sheet shows "$0 due today" with the
   * first charge date — and saves it to the subscription; Stripe bills it
   * automatically when the trial ends. The request reaches `succeeded` when
   * the card is collected, and the response carries `trial_end`. If the trial
   * would end without a payment method on file, the subscription cancels
   * rather than generating unpayable invoices. Trial lifecycle after checkout
   * (extending, ending early) is managed in your own Stripe account via
   * `stripe.subscription_id`.
   *
   * A subscription request you cancel (or that expires unpaid) cancels the
   * incomplete Stripe subscription — nothing lingers on your account.
   *
   * ## Pre-created customers
   *
   * By default each request stands alone: payment mode attaches no Customer,
   * and subscription mode creates a fresh one. If you already manage
   * Customers on your connected account, pass their id as `customer_id`
   * (`cus_...`) on create — in payment mode the charge lands on that
   * customer's payment history, and in subscription mode the subscription is
   * created on them instead of on a new Customer. The id must reference an
   * existing, non-deleted customer on your connected account or the request
   * fails with `400`. We never modify a customer you pass — no metadata is
   * stamped on it.
   *
   * ## Sending the link
   *
   * Deliver the `checkout_url` as a **`link` message part** via
   * `POST /v3/chats/{chatId}/messages` — it renders as a rich card with your
   * branding (title, amount, image) instead of a bare URL, which converts far
   * better. A `link` part must be the only part in the message. See
   * [Rich Link Previews](/guides/messaging/sending-messages).
   *
   * On a supported iPhone the link opens an **Apple Pay App Clip** — a native,
   * no-install checkout sheet. Everywhere else (Android, desktop, iPhones
   * without the App Clip yet) the same URL opens the web checkout, so the link
   * always works. The App Clip experience for your payment links is registered
   * automatically by Linq and refreshed whenever you update your payments
   * branding; a newly registered experience can take up to ~24 hours to
   * activate on Apple's side, during which links open the web checkout.
   *
   * ## Sending it as a card instead
   *
   * A `link` part is one way to deliver a request. The other is the
   * **`agentpay` experience**, which sends the same request as a native card
   * in Linq's iMessage app — the amount and reason are drawn in the bubble,
   * and it turns itself into "Paid" in place once the payment succeeds,
   * without a second message.
   *
   * ```json
   * POST /v3/chats/{chatId}/messages
   * {
   *   "message": {
   *     "agentkit": {
   *       "experience": "agentpay",
   *       "action": "request_payment",
   *       "params": { "checkout_url": "https://zero.linqapp.com/pay/acme?session=tok_..." }
   *     }
   *   }
   * }
   * ```
   *
   * `checkout_url` is the only required field — pass back exactly what
   * `POST /v3/payment_requests` returned. **The amount and reason are read
   * from that request, never from you**, so the card can never claim a
   * different figure than the checkout will charge. Optional `title` and
   * `note` override the copy only. The link must be one of your own payment
   * requests; another partner's is rejected.
   *
   * The trade-off against a `link` part: a card is an app card, so it is
   * iMessage-only, and recipients without the app see a static version of it.
   * A link works everywhere and is what opens the Apple Pay App Clip. Send
   * whichever suits the conversation — both settle the same payment request
   * and fire the same webhooks.
   *
   * ## Webhooks
   *
   * Subscribe to payment lifecycle events to reconcile server-side rather than
   * polling: `payment.succeeded`, `payment.canceled`, and `payment.expired`.
   * Each event carries the payment request id, amount, currency, and your
   * `metadata`. See [Webhooks](/guides/webhooks).
   *
   */
  paymentRequests: API.PaymentRequests = new API.PaymentRequests(this);
  /**
   * Let an agent pay on a customer's behalf with a single-use virtual card.
   * Connect a customer once, then create a payment — a virtual card is minted
   * scoped to that purchase and the card details are handed back for checkout.
   *
   */
  paymentProviders: API.PaymentProviders = new API.PaymentProviders(this);
  /**
   * Let an agent pay on a customer's behalf with a single-use virtual card.
   * Connect a customer once, then create a payment — a virtual card is minted
   * scoped to that purchase and the card details are handed back for checkout.
   *
   */
  paymentHandles: API.PaymentHandles = new API.PaymentHandles(this);
  /**
   * Let an agent pay on a customer's behalf with a single-use virtual card.
   * Connect a customer once, then create a payment — a virtual card is minted
   * scoped to that purchase and the card details are handed back for checkout.
   *
   */
  payments: API.Payments = new API.Payments(this);
  /**
   * Block handles — phone numbers, email addresses, SMS short codes, or
   * sender IDs. Inbound messages from a blocked handle are dropped before
   * they reach your webhooks, and direct sends to a blocked handle are
   * rejected with `403` (error code `2026`). Group sends that include
   * unblocked members are not restricted.
   *
   */
  blockedHandles: API.BlockedHandles = new API.BlockedHandles(this);
  /**
   * An **experience** renders inside Linq's iMessage app as a native card,
   * instead of as text or a link. You invoke one by name; Linq resolves the
   * recipient, mints any session it needs, composes the card and sends it.
   *
   * ```json
   * POST /v3/chats/{chatId}/messages
   * {
   *   "message": {
   *     "agentkit": {
   *       "experience": "agentpay",
   *       "action": "request_payment",
   *       "params": { "checkout_url": "https://zero.linqapp.com/pay/acme?session=tok_..." }
   *     }
   *   }
   * }
   * ```
   *
   * The key is `agentkit` — the app the card renders in. Nested under it is
   * the experience hosted by that app, the action you're invoking on it, and
   * that action's params. A card **is** the whole message on Apple's side, so
   * a message carries either `agentkit` or `parts`, never both, and an action
   * goes to exactly one recipient.
   *
   * ## What you can invoke
   *
   * | Experience | Action | What the customer sees |
   * |---|---|---|
   * | `agentpay` | `request_payment` | A payment request they can pay in the app. Turns itself into "Paid" in place once it settles. |
   * | `agentcard` | `attach_card` | A prompt to add a card to their wallet. |
   * | `agentcard` | `approve_card` | A passkey approval for a virtual card. |
   * | `link` | `open` | A card that opens a URL you supply. |
   *
   * `GET /v3/experiences` is the authoritative list for your account, with
   * every action and the fields each accepts — an action missing there cannot
   * be sent. Fields are display copy unless documented otherwise.
   *
   * ## Params are checked before the card is sent
   *
   * Unknown fields are **rejected rather than ignored**, so copy that would
   * never have rendered fails for you now instead of arriving wrong on
   * somebody's phone. Some fields are read rather than sent: `agentpay`'s
   * `request_payment` takes only a `checkout_url` and resolves the amount and
   * reason from that payment request, so a card can never claim a figure the
   * checkout will not charge.
   *
   * Cards are **iMessage-only**. Recipients without the app see a static
   * version built from the same copy; SMS and RCS recipients cannot receive
   * one at all (error codes 2018 and 4005).
   *
   */
  experiences: API.Experiences = new API.Experiences(this);
  /**
   * Webhook Subscriptions allow you to receive real-time notifications when events
   * occur on your account.
   *
   * Configure webhook endpoints to receive events such as messages sent/received,
   * delivery status changes, reactions, typing indicators, and more.
   *
   * Failed deliveries (5xx, 429, network errors) are retried up to 10 times over
   * ~25 minutes with exponential backoff. Each event includes a unique ID for
   * deduplication.
   *
   * ## Webhook Headers
   *
   * All webhook requests include two sets of headers. **If you have an existing integration
   * using the `X-Webhook-*` headers, nothing changes** — those headers are still sent on
   * every delivery and work exactly as before. The new `webhook-*` headers follow the
   * [Standard Webhooks](https://github.com/standard-webhooks/standard-webhooks) specification.
   * You can safely ignore them if your current verification code works and you don't want to use this convention.
   *
   * ### Standard Webhooks Headers (Recommended)
   *
   * Used by [our SDK](https://github.com/linq-team/linq-node) and any [Standard Webhooks library](https://github.com/standard-webhooks/standard-webhooks).
   *
   * | Header | Description |
   * |--------|-------------|
   * | `webhook-id` | Unique event identifier (use as idempotency key) |
   * | `webhook-timestamp` | Unix timestamp (seconds) when the webhook was sent |
   * | `webhook-signature` | Standard Webhooks signature (`v1,{base64}` format) |
   *
   * ### Legacy Headers (Deprecated)
   *
   * Still sent on every delivery for backwards compatibility. Existing verification code
   * using these headers continues to work — no changes required.
   *
   * | Header | Description |
   * |--------|-------------|
   * | `X-Webhook-Event` | *(deprecated)* Event type (e.g., `message.sent`) |
   * | `X-Webhook-Subscription-ID` | *(deprecated)* Webhook subscription ID |
   * | `X-Webhook-Timestamp` | *(deprecated)* Unix timestamp (seconds) |
   * | `X-Webhook-Signature` | *(deprecated)* HMAC-SHA256 signature (hex-encoded) |
   *
   * ## Signing Secrets
   *
   * Signing secrets use the Standard Webhooks format: a `whsec_` prefix followed
   * by base64-encoded random bytes (e.g., `whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw7Jxx2Oll+OE=`).
   *
   * Strip the `whsec_` prefix and base64-decode the remainder to get the raw key bytes.
   *
   * ## Verifying Webhook Signatures
   *
   * Webhooks are signed following the [Standard Webhooks specification](https://github.com/standard-webhooks/standard-webhooks).
   * You can use any [Standard Webhooks library](https://github.com/standard-webhooks/standard-webhooks) to verify
   * signatures, or implement verification manually:
   *
   * **Signed content:** `{webhook-id}.{webhook-timestamp}.{body}`
   *
   * **Verification Steps:**
   *
   * 1. Extract the `webhook-id`, `webhook-timestamp`, and `webhook-signature` headers
   * 2. Reject if the timestamp is more than 5 minutes old (replay protection)
   * 3. Get the raw request body bytes (do not parse and re-serialize)
   * 4. Construct signed content: `"{webhook-id}.{webhook-timestamp}.{body}"`
   * 5. Strip the `whsec_` prefix from your secret and base64-decode to get key bytes
   * 6. Compute HMAC-SHA256 using the key bytes over the signed content
   * 7. Base64-encode the result and compare with the value after `v1,` in `webhook-signature`
   * 8. Use constant-time comparison to prevent timing attacks
   *
   * **Example (Python):**
   *
   * ```python
   * import base64, hmac, hashlib
   *
   * def verify_webhook(secret, body, headers):
   *     msg_id = headers['webhook-id']
   *     timestamp = headers['webhook-timestamp']
   *     signature = headers['webhook-signature']
   *
   *     secret_str = secret.removeprefix('whsec_')
   *     key = base64.b64decode(secret_str)
   *
   *     signed_content = f"{msg_id}.{timestamp}.{body}"
   *     expected = base64.b64encode(
   *         hmac.new(key, signed_content.encode(), hashlib.sha256).digest()
   *     ).decode()
   *
   *     for sig in signature.split(' '):
   *         if sig.startswith('v1,') and hmac.compare_digest(expected, sig[3:]):
   *             return True
   *     return False
   * ```
   *
   * **Example (Node.js):**
   *
   * ```javascript
   * const crypto = require('crypto');
   *
   * function verifyWebhook(secret, rawBody, headers) {
   *   const msgId = headers['webhook-id'];
   *   const timestamp = headers['webhook-timestamp'];
   *   const signature = headers['webhook-signature'];
   *
   *   const secretStr = secret.startsWith('whsec_') ? secret.slice(6) : secret;
   *   const keyBytes = Buffer.from(secretStr, 'base64');
   *   const signedContent = `${msgId}.${timestamp}.${rawBody}`;
   *   const expected = crypto
   *     .createHmac('sha256', keyBytes)
   *     .update(signedContent)
   *     .digest('base64');
   *
   *   return signature.split(' ').some(sig => {
   *     if (!sig.startsWith('v1,')) return false;
   *     try {
   *       return crypto.timingSafeEqual(
   *         Buffer.from(expected, 'base64'),
   *         Buffer.from(sig.slice(3), 'base64')
   *       );
   *     } catch { return false; }
   *   });
   * }
   * ```
   *
   * **Security Best Practices:**
   *
   * - Reject webhooks with timestamps older than 5 minutes to prevent replay attacks
   * - Always use constant-time comparison for signature verification
   * - Store your signing secret securely (e.g., environment variable, secrets manager)
   * - Return a 2xx status code quickly, then process the webhook asynchronously
   *
   */
  webhookEvents: API.WebhookEvents = new API.WebhookEvents(this);
  /**
   * Webhook Subscriptions allow you to receive real-time notifications when events
   * occur on your account.
   *
   * Configure webhook endpoints to receive events such as messages sent/received,
   * delivery status changes, reactions, typing indicators, and more.
   *
   * Failed deliveries (5xx, 429, network errors) are retried up to 10 times over
   * ~25 minutes with exponential backoff. Each event includes a unique ID for
   * deduplication.
   *
   * ## Webhook Headers
   *
   * All webhook requests include two sets of headers. **If you have an existing integration
   * using the `X-Webhook-*` headers, nothing changes** — those headers are still sent on
   * every delivery and work exactly as before. The new `webhook-*` headers follow the
   * [Standard Webhooks](https://github.com/standard-webhooks/standard-webhooks) specification.
   * You can safely ignore them if your current verification code works and you don't want to use this convention.
   *
   * ### Standard Webhooks Headers (Recommended)
   *
   * Used by [our SDK](https://github.com/linq-team/linq-node) and any [Standard Webhooks library](https://github.com/standard-webhooks/standard-webhooks).
   *
   * | Header | Description |
   * |--------|-------------|
   * | `webhook-id` | Unique event identifier (use as idempotency key) |
   * | `webhook-timestamp` | Unix timestamp (seconds) when the webhook was sent |
   * | `webhook-signature` | Standard Webhooks signature (`v1,{base64}` format) |
   *
   * ### Legacy Headers (Deprecated)
   *
   * Still sent on every delivery for backwards compatibility. Existing verification code
   * using these headers continues to work — no changes required.
   *
   * | Header | Description |
   * |--------|-------------|
   * | `X-Webhook-Event` | *(deprecated)* Event type (e.g., `message.sent`) |
   * | `X-Webhook-Subscription-ID` | *(deprecated)* Webhook subscription ID |
   * | `X-Webhook-Timestamp` | *(deprecated)* Unix timestamp (seconds) |
   * | `X-Webhook-Signature` | *(deprecated)* HMAC-SHA256 signature (hex-encoded) |
   *
   * ## Signing Secrets
   *
   * Signing secrets use the Standard Webhooks format: a `whsec_` prefix followed
   * by base64-encoded random bytes (e.g., `whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw7Jxx2Oll+OE=`).
   *
   * Strip the `whsec_` prefix and base64-decode the remainder to get the raw key bytes.
   *
   * ## Verifying Webhook Signatures
   *
   * Webhooks are signed following the [Standard Webhooks specification](https://github.com/standard-webhooks/standard-webhooks).
   * You can use any [Standard Webhooks library](https://github.com/standard-webhooks/standard-webhooks) to verify
   * signatures, or implement verification manually:
   *
   * **Signed content:** `{webhook-id}.{webhook-timestamp}.{body}`
   *
   * **Verification Steps:**
   *
   * 1. Extract the `webhook-id`, `webhook-timestamp`, and `webhook-signature` headers
   * 2. Reject if the timestamp is more than 5 minutes old (replay protection)
   * 3. Get the raw request body bytes (do not parse and re-serialize)
   * 4. Construct signed content: `"{webhook-id}.{webhook-timestamp}.{body}"`
   * 5. Strip the `whsec_` prefix from your secret and base64-decode to get key bytes
   * 6. Compute HMAC-SHA256 using the key bytes over the signed content
   * 7. Base64-encode the result and compare with the value after `v1,` in `webhook-signature`
   * 8. Use constant-time comparison to prevent timing attacks
   *
   * **Example (Python):**
   *
   * ```python
   * import base64, hmac, hashlib
   *
   * def verify_webhook(secret, body, headers):
   *     msg_id = headers['webhook-id']
   *     timestamp = headers['webhook-timestamp']
   *     signature = headers['webhook-signature']
   *
   *     secret_str = secret.removeprefix('whsec_')
   *     key = base64.b64decode(secret_str)
   *
   *     signed_content = f"{msg_id}.{timestamp}.{body}"
   *     expected = base64.b64encode(
   *         hmac.new(key, signed_content.encode(), hashlib.sha256).digest()
   *     ).decode()
   *
   *     for sig in signature.split(' '):
   *         if sig.startswith('v1,') and hmac.compare_digest(expected, sig[3:]):
   *             return True
   *     return False
   * ```
   *
   * **Example (Node.js):**
   *
   * ```javascript
   * const crypto = require('crypto');
   *
   * function verifyWebhook(secret, rawBody, headers) {
   *   const msgId = headers['webhook-id'];
   *   const timestamp = headers['webhook-timestamp'];
   *   const signature = headers['webhook-signature'];
   *
   *   const secretStr = secret.startsWith('whsec_') ? secret.slice(6) : secret;
   *   const keyBytes = Buffer.from(secretStr, 'base64');
   *   const signedContent = `${msgId}.${timestamp}.${rawBody}`;
   *   const expected = crypto
   *     .createHmac('sha256', keyBytes)
   *     .update(signedContent)
   *     .digest('base64');
   *
   *   return signature.split(' ').some(sig => {
   *     if (!sig.startsWith('v1,')) return false;
   *     try {
   *       return crypto.timingSafeEqual(
   *         Buffer.from(expected, 'base64'),
   *         Buffer.from(sig.slice(3), 'base64')
   *       );
   *     } catch { return false; }
   *   });
   * }
   * ```
   *
   * **Security Best Practices:**
   *
   * - Reject webhooks with timestamps older than 5 minutes to prevent replay attacks
   * - Always use constant-time comparison for signature verification
   * - Store your signing secret securely (e.g., environment variable, secrets manager)
   * - Return a 2xx status code quickly, then process the webhook asynchronously
   *
   */
  webhookSubscriptions: API.WebhookSubscriptions = new API.WebhookSubscriptions(this);
  /**
   * Check whether a recipient address supports iMessage or RCS before sending a message.
   *
   */
  capability: API.Capability = new API.Capability(this);
  webhooks: API.Webhooks = new API.Webhooks(this);
  /**
   * Contact Card lets you set and share your contact information (name and profile photo) with chat participants via iMessage Name and Photo Sharing.
   *
   * Use `POST /v3/contact_card` to create or update a card for a phone number.
   * Use `PATCH /v3/contact_card` to update an existing active card.
   * Use `GET /v3/contact_card` to retrieve the active card(s) for your partner account.
   *
   * **Sharing behavior:** Sharing may not take effect in every chat due to limitations outside our control. We recommend calling the share endpoint once per day, after the first outbound activity.
   *
   */
  contactCard: API.ContactCard = new API.ContactCard(this);
}

LinqAPIV3.Chats = Chats;
LinqAPIV3.Messages = Messages;
LinqAPIV3.Attachments = Attachments;
LinqAPIV3.Phonenumbers = Phonenumbers;
LinqAPIV3.PhoneNumbers = PhoneNumbers;
LinqAPIV3.AvailableNumber = AvailableNumber;
LinqAPIV3.PaymentRequests = PaymentRequests;
LinqAPIV3.PaymentProviders = PaymentProviders;
LinqAPIV3.PaymentHandles = PaymentHandles;
LinqAPIV3.Payments = Payments;
LinqAPIV3.BlockedHandles = BlockedHandles;
LinqAPIV3.Experiences = Experiences;
LinqAPIV3.WebhookEvents = WebhookEvents;
LinqAPIV3.WebhookSubscriptions = WebhookSubscriptions;
LinqAPIV3.Capability = Capability;
LinqAPIV3.Webhooks = Webhooks;
LinqAPIV3.ContactCard = ContactCard;

export declare namespace LinqAPIV3 {
  export type RequestOptions = Opts.RequestOptions;

  export import ListChatsPagination = Pagination.ListChatsPagination;
  export {
    type ListChatsPaginationParams as ListChatsPaginationParams,
    type ListChatsPaginationResponse as ListChatsPaginationResponse,
  };

  export import ListMessagesPagination = Pagination.ListMessagesPagination;
  export {
    type ListMessagesPaginationParams as ListMessagesPaginationParams,
    type ListMessagesPaginationResponse as ListMessagesPaginationResponse,
  };

  export {
    Chats as Chats,
    type Chat as Chat,
    type LinkPart as LinkPart,
    type MediaPart as MediaPart,
    type MessageContent as MessageContent,
    type TextPart as TextPart,
    type ChatCreateResponse as ChatCreateResponse,
    type ChatUpdateResponse as ChatUpdateResponse,
    type ChatLeaveChatResponse as ChatLeaveChatResponse,
    type ChatSendVoicememoResponse as ChatSendVoicememoResponse,
    type ChatsListChatsPagination as ChatsListChatsPagination,
    type ChatCreateParams as ChatCreateParams,
    type ChatUpdateParams as ChatUpdateParams,
    type ChatListChatsParams as ChatListChatsParams,
    type ChatSendVoicememoParams as ChatSendVoicememoParams,
  };

  export {
    Messages as Messages,
    type Message as Message,
    type MessageEffect as MessageEffect,
    type ReplyTo as ReplyTo,
    type MessageCreateResponse as MessageCreateResponse,
    type MessageAddReactionResponse as MessageAddReactionResponse,
    type MessageUpdateAppCardResponse as MessageUpdateAppCardResponse,
    type MessagesListMessagesPagination as MessagesListMessagesPagination,
    type MessageCreateParams as MessageCreateParams,
    type MessageUpdateParams as MessageUpdateParams,
    type MessageAddReactionParams as MessageAddReactionParams,
    type MessageListMessagesThreadParams as MessageListMessagesThreadParams,
    type MessageUpdateAppCardParams as MessageUpdateAppCardParams,
  };

  export {
    Attachments as Attachments,
    type SupportedContentType as SupportedContentType,
    type AttachmentCreateResponse as AttachmentCreateResponse,
    type AttachmentRetrieveResponse as AttachmentRetrieveResponse,
    type AttachmentCreateParams as AttachmentCreateParams,
  };

  export { Phonenumbers as Phonenumbers, type PhonenumberListResponse as PhonenumberListResponse };

  export {
    PhoneNumbers as PhoneNumbers,
    type PhoneNumberUpdateResponse as PhoneNumberUpdateResponse,
    type PhoneNumberListResponse as PhoneNumberListResponse,
    type PhoneNumberUpdateParams as PhoneNumberUpdateParams,
  };

  export {
    AvailableNumber as AvailableNumber,
    type AvailableNumberRetrieveResponse as AvailableNumberRetrieveResponse,
    type AvailableNumberRetrieveParams as AvailableNumberRetrieveParams,
  };

  export {
    PaymentRequests as PaymentRequests,
    type PaymentRequest as PaymentRequest,
    type PaymentRequestListResponse as PaymentRequestListResponse,
    type PaymentRequestCreateParams as PaymentRequestCreateParams,
    type PaymentRequestListParams as PaymentRequestListParams,
  };

  export {
    PaymentProviders as PaymentProviders,
    type PaymentProvider as PaymentProvider,
    type PaymentProviderConnectResponse as PaymentProviderConnectResponse,
    type PaymentProviderConnectParams as PaymentProviderConnectParams,
  };

  export {
    PaymentHandles as PaymentHandles,
    type PaymentHandleConnection as PaymentHandleConnection,
    type PaymentHandleVerifyParams as PaymentHandleVerifyParams,
  };

  export {
    Payments as Payments,
    type Payment as Payment,
    type PaymentCredentialsResponse as PaymentCredentialsResponse,
    type PaymentCreateParams as PaymentCreateParams,
  };

  export {
    BlockedHandles as BlockedHandles,
    type BlockedHandleEntry as BlockedHandleEntry,
    type BlockedHandleListResponse as BlockedHandleListResponse,
    type BlockedHandleBlockResponse as BlockedHandleBlockResponse,
    type BlockedHandleBlockParams as BlockedHandleBlockParams,
    type BlockedHandleUnblockParams as BlockedHandleUnblockParams,
  };

  export {
    Experiences as Experiences,
    type ExperienceRetrieveResponse as ExperienceRetrieveResponse,
    type ExperienceListResponse as ExperienceListResponse,
  };

  export {
    WebhookEvents as WebhookEvents,
    type WebhookEventType as WebhookEventType,
    type WebhookEventListResponse as WebhookEventListResponse,
  };

  export {
    WebhookSubscriptions as WebhookSubscriptions,
    type WebhookSubscription as WebhookSubscription,
    type WebhookSubscriptionCreateResponse as WebhookSubscriptionCreateResponse,
    type WebhookSubscriptionListResponse as WebhookSubscriptionListResponse,
    type WebhookSubscriptionCreateParams as WebhookSubscriptionCreateParams,
    type WebhookSubscriptionUpdateParams as WebhookSubscriptionUpdateParams,
  };

  export {
    Capability as Capability,
    type HandleCheck as HandleCheck,
    type HandleCheckResponse as HandleCheckResponse,
    type CapabilityCheckIMessageParams as CapabilityCheckIMessageParams,
    type CapabilityCheckRCSParams as CapabilityCheckRCSParams,
  };

  export {
    Webhooks as Webhooks,
    type MessageEventV2 as MessageEventV2,
    type MessagePayload as MessagePayload,
    type ReactionEventBase as ReactionEventBase,
    type SchemasMediaPartResponse as SchemasMediaPartResponse,
    type SchemasMessageEffect as SchemasMessageEffect,
    type SchemasTextPartResponse as SchemasTextPartResponse,
    type MessageSentWebhookEvent as MessageSentWebhookEvent,
    type MessageReceivedWebhookEvent as MessageReceivedWebhookEvent,
    type MessageReadWebhookEvent as MessageReadWebhookEvent,
    type MessageDeliveredWebhookEvent as MessageDeliveredWebhookEvent,
    type MessageFailedWebhookEvent as MessageFailedWebhookEvent,
    type MessageEditedWebhookEvent as MessageEditedWebhookEvent,
    type ReactionAddedWebhookEvent as ReactionAddedWebhookEvent,
    type ReactionRemovedWebhookEvent as ReactionRemovedWebhookEvent,
    type ParticipantAddedWebhookEvent as ParticipantAddedWebhookEvent,
    type ParticipantRemovedWebhookEvent as ParticipantRemovedWebhookEvent,
    type ChatCreatedWebhookEvent as ChatCreatedWebhookEvent,
    type ChatGroupNameUpdatedWebhookEvent as ChatGroupNameUpdatedWebhookEvent,
    type ChatGroupIconUpdatedWebhookEvent as ChatGroupIconUpdatedWebhookEvent,
    type ChatGroupNameUpdateFailedWebhookEvent as ChatGroupNameUpdateFailedWebhookEvent,
    type ChatGroupIconUpdateFailedWebhookEvent as ChatGroupIconUpdateFailedWebhookEvent,
    type ChatTypingIndicatorStartedWebhookEvent as ChatTypingIndicatorStartedWebhookEvent,
    type ChatTypingIndicatorStoppedWebhookEvent as ChatTypingIndicatorStoppedWebhookEvent,
    type PhoneNumberStatusUpdatedWebhookEvent as PhoneNumberStatusUpdatedWebhookEvent,
    type UnwrapWebhookEvent as UnwrapWebhookEvent,
  };

  export {
    ContactCard as ContactCard,
    type SetContactCard as SetContactCard,
    type ContactCardRetrieveResponse as ContactCardRetrieveResponse,
    type ContactCardCreateParams as ContactCardCreateParams,
    type ContactCardRetrieveParams as ContactCardRetrieveParams,
    type ContactCardUpdateParams as ContactCardUpdateParams,
  };

  export type ChatHandle = API.ChatHandle;
  export type LinkPartResponse = API.LinkPartResponse;
  export type MediaPartResponse = API.MediaPartResponse;
  export type Reaction = API.Reaction;
  export type ReactionType = API.ReactionType;
  export type ServiceType = API.ServiceType;
  export type TextDecoration = API.TextDecoration;
  export type TextPartResponse = API.TextPartResponse;
}
