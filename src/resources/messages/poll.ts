// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as PollsAPI from '../chats/polls';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

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
 * For regulated or sensitive conversations, opt in to the **ephemeral messages** tier by contacting your Linq support contact. When enabled, every message on the covered phone numbers is given a **retention window configured for your account** — after that window the platform permanently deletes the message from Linq storage. There is no per-message flag; ephemerality is applied automatically based on your configuration.
 *
 * The window can be set anywhere from **60 minutes to 24 hours**, and defaults to **24 hours**. Ask your Linq support contact to configure a shorter window; it cannot be changed through the API.
 *
 * You can request it at two scopes:
 *
 * | Scope | Effect |
 * |---|---|
 * | **Partner-wide** | Every outbound and inbound message on every phone number under your account is retained for your configured window, then deleted. |
 * | **Per phone number** | Only the specified phone numbers have their messages auto-deleted. The rest follow the standard message-retention policy. |
 *
 * **Behavioral differences vs the standard default:**
 *
 * | Aspect | Standard | Ephemeral |
 * |---|---|---|
 * | Retention | Retained per the standard message-retention policy | **Hard backstop: your configured window** (60 minutes – 24 hours, default 24 hours) from when the message is created |
 * | After expiry | Message stays retrievable | Message is permanently deleted — `GET /v3/messages/{messageId}` returns `404` and it no longer appears in `GET /v3/chats/{chatId}/messages` |
 * | Content on expiry | N/A | Text, formatting, and attachment references are scrubbed; the message is gone, not blanked out |
 * | Attachments | Retained | Media sent on the **ephemeral attachments tier** is removed on its own storage backstop — within roughly 24–48 hours of upload — independently of the message window, so it can outlast a window shorter than a day. Attachments on the persistent tier (including pre-uploads via `POST /v3/attachments`) are kept until you `DELETE` them |
 * | Cross-partner isolation | Enforced | Enforced |
 *
 * **How the retention window works:**
 *
 * - The window runs from **message creation** (`created_at`). It is configured for your account (60 minutes – 24 hours, default 24 hours) and cannot be set per message.
 * - Attachment media follows its own storage backstop rather than the message window — see the Attachments row above.
 * - Expiry is delivery-independent — the clock starts when the message is created, not when it is delivered or read.
 * - **Deletion happens shortly *after* the window, not exactly at it.** A background sweep runs every ~5 minutes, so a message typically stops being retrievable within about 5 minutes of its expiry, and longer while a backlog is being worked through. Treat the window as the guaranteed *minimum* retention, never as an exact deletion time or an upper bound.
 *
 * **What you observe:**
 *
 * - **No expiry timestamp is exposed.** API responses and webhook payloads do not include the deletion time, and they do not report your configured window either — so if you are on a window shorter than 24 hours you cannot derive a message's expiry from the API today. Track the window you agreed with your Linq support contact and compute `created_at + window` yourself.
 * - **No deletion webhook is sent.** There is no `message.deleted` event — a message simply stops being retrievable once its window passes.
 * - **The backstop governs Linq storage.** API retrievability (the `404` behavior above) ends at your configured window. Ephemeral-tier media objects are removed on their own storage backstop — within roughly 24–48 hours of upload — which is independent of the message window and can outlast a window shorter than a day. Removal of the corresponding entries from the sending device happens asynchronously and can complete after the backstop.
 * - **Delivery is unaffected.** Ephemeral messages send, deliver, and fire the usual `message.sent` / `message.received` and status webhooks exactly like standard messages. Only retention changes.
 *
 * **When to choose ephemeral:**
 *
 * - You have a compliance requirement that the platform must not retain message content beyond a short window.
 * - The conversation is high-sensitivity (PHI, financial, identity verification) and you do not want it sitting in storage long-term.
 * - Your application is the system of record — you capture what you need from the delivery webhook in real time and do not rely on reading message history back from Linq later.
 *
 * **Important:** ephemeral applies in *both directions* — messages you send **and** messages received by the phone numbers in that scope. Because Linq can no longer return the message once its window passes, persist anything you need to keep from the webhook payload at the time it is delivered.
 */
export class Poll extends APIResource {
  /**
   * Return a poll's current results — its options, each option's voters, and the
   * distinct total number of voters — by the poll-definition message's ID.
   *
   * @example
   * ```ts
   * const pollEnvelope = await client.messages.poll.retrieve(
   *   '69a37c7d-af4f-4b5e-af42-e28e98ce873a',
   * );
   * ```
   */
  retrieve(messageID: string, options?: RequestOptions): APIPromise<PollsAPI.PollEnvelope> {
    return this._client.get(path`/v3/messages/${messageID}/poll`, options);
  }

  /**
   * Add one or more options to an existing poll. Options are **add-only and
   * immutable** — you can append options but never edit or remove them (Apple
   * constraint). Returns the full poll.
   *
   * @example
   * ```ts
   * const pollEnvelope = await client.messages.poll.addOptions(
   *   '69a37c7d-af4f-4b5e-af42-e28e98ce873a',
   *   { options: [{ text: 'Pizza' }] },
   * );
   * ```
   */
  addOptions(
    messageID: string,
    body: PollAddOptionsParams,
    options?: RequestOptions,
  ): APIPromise<PollsAPI.PollEnvelope> {
    return this._client.post(path`/v3/messages/${messageID}/poll/options`, { body, ...options });
  }

  /**
   * Add or remove your line's vote on **one** poll option (per-option toggle —
   * iMessage polls are toggled one option at a time). Returns the poll reflecting
   * the toggle.
   *
   * @example
   * ```ts
   * const pollEnvelope = await client.messages.poll.vote(
   *   '69a37c7d-af4f-4b5e-af42-e28e98ce873a',
   *   {
   *     operation: 'add',
   *     option_id: '97ce8c17-7ef6-4bbc-a89a-6b93d189712f',
   *   },
   * );
   * ```
   */
  vote(messageID: string, body: PollVoteParams, options?: RequestOptions): APIPromise<PollsAPI.PollEnvelope> {
    return this._client.post(path`/v3/messages/${messageID}/poll/votes`, { body, ...options });
  }
}

export interface PollAddOptionsParams {
  options: Array<PollAddOptionsParams.Option>;
}

export namespace PollAddOptionsParams {
  export interface Option {
    text: string;
  }
}

export interface PollVoteParams {
  /**
   * Add or remove your line's vote on the option.
   */
  operation: 'add' | 'remove';

  /**
   * The option to toggle a vote on.
   */
  option_id: string;
}

export declare namespace Poll {
  export { type PollAddOptionsParams as PollAddOptionsParams, type PollVoteParams as PollVoteParams };
}
