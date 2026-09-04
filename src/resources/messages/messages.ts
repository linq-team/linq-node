// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import * as ChatsAPI from '../chats/chats';
import * as MessagesAPI from '../chats/messages';
import * as PollAPI from './poll';
import { Poll, PollAddOptionsParams, PollVoteParams } from './poll';
import { APIPromise } from '../../core/api-promise';
import {
  ListMessagesPagination,
  type ListMessagesPaginationParams,
  PagePromise,
} from '../../core/pagination';
import { buildHeaders } from '../../internal/headers';
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
 * ## App Clips
 *
 * An `app_clip` part sends a **registered App Clip** — not only Linq's Apple Pay
 * checkout, but any partner's own App Clip. Like a `link` part it must be the
 * **only** part in the message, and it is **iMessage only** — it never downgrades
 * to SMS or RCS. The payment-checkout use of this part is covered in the
 * **Payments** section.
 *
 * ## Ephemeral Messages (Privacy Tier)
 *
 * For regulated or sensitive conversations, opt in to the **ephemeral messages** tier by contacting your Linq support contact. When enabled, every message on the covered phone numbers is given a **retention window configured for your account**. After that window, the message's text, formatting, and attachment references are no longer retrievable through the API — see the Attachments row below for how the attachment media itself is handled. Metadata about the message is retained: message identifiers, timestamps, phone numbers, and delivery state. Metadata retention is not bounded by this window. Bounded operational copies, such as backups and delivery queues, expire on their own separate schedules. There is no per-message flag; ephemerality is applied automatically based on your configuration.
 *
 * The window can be set anywhere from **60 minutes to 24 hours**, and defaults to **24 hours**. Ask your Linq support contact to configure a shorter window; it cannot be changed through the API.
 *
 * You can request it at two scopes:
 *
 * | Scope | Effect |
 * |---|---|
 * | **Partner-wide** | Every outbound and inbound message on every phone number under your account has its content removed from the API surface after your configured window. Metadata is retained. |
 * | **Per phone number** | Only the specified phone numbers have message content removed from the API surface this way. The rest follow the standard message-retention policy. |
 *
 * **Behavioral differences vs the standard default:**
 *
 * | Aspect | Standard | Ephemeral |
 * |---|---|---|
 * | Retention | Retained per the standard message-retention policy | **Hard backstop: your configured window** (60 minutes – 24 hours, default 24 hours) from when the message is created |
 * | After expiry | Message stays retrievable | Message content is no longer retrievable — `GET /v3/messages/{messageId}` returns `404` and it no longer appears in `GET /v3/chats/{chatId}/messages` |
 * | Content on expiry | N/A | Text, formatting, and attachment references are removed from the API surface, not blanked out in place. Metadata (identifiers, timestamps, phone numbers, delivery state) is retained; its retention is not bounded by this window |
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
 * - **The attachment backstop is separate from the message window.** API retrievability (the `404` behavior above) ends at your configured window. Ephemeral-tier media objects are removed on their own storage backstop — within roughly 24–48 hours of upload — which is independent of the message window and can outlast a window shorter than a day. Removal of the corresponding entries from the sending device happens asynchronously and can complete after the backstop.
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
export class Messages extends APIResource {
  poll: PollAPI.Poll = new PollAPI.Poll(this._client);

  /**
   * Send a message to one or more recipients **without supplying a `from` number**.
   * Linq resolves both the sending line and the target chat for you, then returns
   * exactly which line was used, which chat the message landed in, whether a new
   * chat was created, and every resulting message id.
   *
   * This fuses "create chat" and "send message" behind a single message-centric
   * resource. Provide only the recipients (`to`) and the `message`; the platform
   * decides the rest.
   *
   * ## How the from-number and chat are chosen
   *
   * - **Reuse** — if a chat with exactly these recipients already exists on a line
   *   that can still send, the message is sent into that chat on its existing line
   *   (`from_selection.reason = reused_active_chat`). The most-recently-active such
   *   chat wins; chats stranded on flagged lines (e.g. by an earlier failover) are
   *   skipped.
   * - **New** — if no such chat exists, a new chat is created on the best available
   *   line (`from_selection.reason = new_best_number`).
   * - **Failover** — if matching chats exist but none is on a line that can send, a
   *   **new** chat is created on a fresh best line and the flagged chat is abandoned
   *   (`from_selection.reason = failover_flagged`, `previous_chat_id` set). If you
   *   supply `continuation_message`, that text is sent as the single message INSTEAD
   *   of `message` (useful as a fresh-number-appropriate opener). Exactly one
   *   message is sent either way.
   *
   * Recipients (`to`) are an order-independent set: a single handle is a direct
   * chat, multiple handles a group chat.
   *
   * ## Excluding lines
   *
   * `exclude_from` keeps specific lines out of **this** send's line pick. It only
   * affects picking a line for a new chat — an existing chat is always reused on its
   * own line, preferring a chat on a non-excluded line when the recipients have more
   * than one. An exclusion never abandons a live chat or moves it to a new number,
   * so if the only chat these recipients have is on an excluded line, that chat is
   * still used. `from` tells you the line that was actually used.
   *
   * ## Differences from POST /v3/chats
   *
   * - The first message **may contain a link** (including for a newly created chat).
   *   Note: sending a link as the very first message on a freshly selected line can
   *   elevate that line's flagging risk — it is allowed, not recommended.
   * - Voice memos are **not** supported here. To send an iMessage voice-memo bubble,
   *   use `POST /v3/chats/{chatId}/voicememo` with a known chat id.
   *
   * ## Service preference, effects, decorations
   *
   * Set `message.preferred_service` (`iMessage` | `RCS` | `SMS`), `message.effect`,
   * and per-part `text_decorations` exactly as on the other send endpoints.
   *
   * Always responds `202 Accepted` — chat creation is incidental to the send.
   *
   * @example
   * ```ts
   * const message = await client.messages.create({
   *   message: {
   *     parts: [
   *       {
   *         type: 'text',
   *         value:
   *           'Hi! Thanks for reaching out — how can we help?',
   *       },
   *     ],
   *   },
   *   to: ['+14155559876'],
   * });
   * ```
   */
  create(params: MessageCreateParams, options?: RequestOptions): APIPromise<MessageCreateResponse> {
    const { 'Idempotency-Key': idempotencyKey, ...body } = params;
    return this._client.post('/v3/messages', {
      body,
      ...options,
      headers: buildHeaders([
        { ...(idempotencyKey != null ? { 'Idempotency-Key': idempotencyKey } : undefined) },
        options?.headers,
      ]),
    });
  }

  /**
   * Retrieve a specific message by its ID. This endpoint returns the full message
   * details including text, attachments, reactions, and metadata.
   *
   * @example
   * ```ts
   * const message = await client.messages.retrieve(
   *   '69a37c7d-af4f-4b5e-af42-e28e98ce873a',
   * );
   * ```
   */
  retrieve(messageID: string, options?: RequestOptions): APIPromise<Message> {
    return this._client.get(path`/v3/messages/${messageID}`, options);
  }

  /**
   * Edit the text content of a specific part of a previously sent message.
   *
   * **Note:** A message can be edited up to 5 times, and only within 15 minutes of
   * when it was originally sent.
   *
   * @example
   * ```ts
   * const message = await client.messages.update(
   *   '69a37c7d-af4f-4b5e-af42-e28e98ce873a',
   *   { text: 'This is the edited message content' },
   * );
   * ```
   */
  update(messageID: string, body: MessageUpdateParams, options?: RequestOptions): APIPromise<Message> {
    return this._client.patch(path`/v3/messages/${messageID}`, { body, ...options });
  }

  /**
   * Deletes a message from the Linq API only. This does NOT unsend or remove the
   * message from the actual chat — recipients will still see the message. Re-sending
   * with a deleted message's idempotency key returns 404 — a deleted message is
   * never resent.
   *
   * @example
   * ```ts
   * await client.messages.delete(
   *   '69a37c7d-af4f-4b5e-af42-e28e98ce873a',
   * );
   * ```
   */
  delete(messageID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/v3/messages/${messageID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Add or remove emoji reactions to messages. Reactions let users express their
   * response to a message without sending a new message.
   *
   * **Supported Reactions:**
   *
   * - love ❤️
   * - like 👍
   * - dislike 👎
   * - laugh 😂
   * - emphasize ‼️
   * - question ❓
   * - custom - any emoji (use `custom_emoji` field to specify)
   *
   * @example
   * ```ts
   * const response = await client.messages.addReaction(
   *   '69a37c7d-af4f-4b5e-af42-e28e98ce873a',
   *   { operation: 'add', type: 'love' },
   * );
   * ```
   */
  addReaction(
    messageID: string,
    body: MessageAddReactionParams,
    options?: RequestOptions,
  ): APIPromise<MessageAddReactionResponse> {
    return this._client.post(path`/v3/messages/${messageID}/reactions`, { body, ...options });
  }

  /**
   * Retrieve all messages in a conversation thread. Given any message ID in the
   * thread, returns the originator message and all replies in chronological order.
   *
   * If the message is not part of a thread, returns just that single message.
   *
   * Supports pagination and configurable ordering.
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const message of client.messages.listMessagesThread(
   *   '69a37c7d-af4f-4b5e-af42-e28e98ce873a',
   * )) {
   *   // ...
   * }
   * ```
   */
  listMessagesThread(
    messageID: string,
    query: MessageListMessagesThreadParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<MessagesListMessagesPagination, Message> {
    return this._client.getAPIList(path`/v3/messages/${messageID}/thread`, ListMessagesPagination<Message>, {
      query,
      ...options,
    });
  }

  /**
   * Replaces a previously delivered `imessage_app` card on the recipient's screen
   * with new content, instead of posting a new bubble (like a game move redrawing
   * the board).
   *
   * The update is delivered as a **new message** with its own id and delivery
   * lifecycle (`message.sent` / `message.delivered` / `message.failed` webhooks fire
   * for the new id). To update the card again, reference the message id returned by
   * this call.
   *
   * Constraints:
   *
   * - The referenced message must be an `imessage_app` card sent by you (`400`
   *   otherwise — inbound cards cannot be updated).
   * - The referenced card must already be delivered (`409` otherwise — retry after
   *   the `message.delivered` webhook for it).
   * - The app identity (`team_id`, `bundle_id`, name) is inherited from the original
   *   card and cannot change; only `url`, `fallback_text`, and `layout` are
   *   replaced.
   * - iMessage-only, like all app cards.
   * - Concurrent updates against the same card are not serialized server-side; the
   *   last one delivered wins on the recipient's screen. Serialize updates by always
   *   referencing the message id returned by the previous call.
   *
   * @example
   * ```ts
   * const response = await client.messages.updateAppCard(
   *   '69a37c7d-af4f-4b5e-af42-e28e98ce873a',
   *   {
   *     layout: { caption: 'Score: 2 – 1' },
   *     fallback_text: 'Score update',
   *     url: 'https://app.example.com/card?game=7f3a&move=2',
   *   },
   * );
   * ```
   */
  updateAppCard(
    messageID: string,
    body: MessageUpdateAppCardParams,
    options?: RequestOptions,
  ): APIPromise<MessageUpdateAppCardResponse> {
    return this._client.post(path`/v3/messages/${messageID}/update`, { body, ...options });
  }
}

export type MessagesListMessagesPagination = ListMessagesPagination<Message>;

export interface Message {
  /**
   * Unique identifier for the message
   */
  id: string;

  /**
   * ID of the chat this message belongs to
   */
  chat_id: string;

  /**
   * When the message was created
   */
  created_at: string;

  /**
   * Current delivery status of a message
   */
  delivery_status: 'pending' | 'queued' | 'sent' | 'delivered' | 'received' | 'read' | 'failed';

  /**
   * @deprecated DEPRECATED: Use `delivery_status` instead (true when
   * `delivery_status` is `delivered` or `read`). Whether the message has been
   * delivered.
   */
  is_delivered: boolean;

  /**
   * Whether this message was sent by the authenticated user
   */
  is_from_me: boolean;

  /**
   * @deprecated DEPRECATED: Use `delivery_status == "read"` instead. Whether the
   * message has been read.
   */
  is_read: boolean;

  /**
   * When the message was last updated
   */
  updated_at: string;

  /**
   * When the message was delivered
   */
  delivered_at?: string | null;

  /**
   * iMessage effect applied to a message (screen or bubble effect)
   */
  effect?: MessageEffect | null;

  /**
   * @deprecated DEPRECATED: Use from_handle instead. Phone number of the message
   * sender.
   */
  from?: string | null;

  /**
   * The sender of this message as a full handle object
   */
  from_handle?: Shared.ChatHandle | null;

  /**
   * Message parts in order (text, media, and link)
   */
  parts?: Array<
    | Shared.TextPartResponse
    | Shared.MediaPartResponse
    | Shared.LinkPartResponse
    | Message.IMessageAppPartResponse
    | Message.AppClipPartResponse
  > | null;

  /**
   * Messaging service type
   */
  preferred_service?: Shared.ServiceType | null;

  /**
   * When the message was read
   */
  read_at?: string | null;

  /**
   * Present only when this message was recovered by reconciliation rather than
   * delivered live, and set to the time of that recovery. The field is omitted
   * entirely for normally-delivered messages, which is the overwhelming majority.
   * When present, expect `sent_at` to be substantially earlier — the message is
   * genuine but was ingested late, so it may not have appeared in earlier reads of
   * this conversation.
   */
  reconciled_at?: string;

  /**
   * Indicates this message is a threaded reply to another message
   */
  reply_to?: ReplyTo | null;

  /**
   * When the message was sent
   */
  sent_at?: string | null;

  /**
   * Messaging service type
   */
  service?: Shared.ServiceType | null;
}

export namespace Message {
  /**
   * An iMessage app card part.
   */
  export interface IMessageAppPartResponse {
    /**
     * Identifies the iMessage app (Messages app extension) that backs the card.
     */
    app: IMessageAppPartResponse.App;

    /**
     * Visible layout of the card. At least one of `caption`, `subcaption`,
     * `trailing_caption`, `trailing_subcaption`, or `image_url` must be set, otherwise
     * the card renders as an empty bubble.
     *
     * `image_url` displays a preview image at the top of the card. The image renders
     * on the recipient's card whether or not they have your app installed. The small
     * icon beside the caption is the app's own icon and is not settable here.
     *
     * `* Note - requires a trusted chat w/ inbound activity`
     *
     * `image_title` and `image_subtitle` render as text overlaid on the image (title
     * bold, subtitle beneath it). They only appear when `image_url` is set — without
     * an image there is nothing to overlay — so setting either without `image_url` is
     * rejected.
     */
    layout: IMessageAppPartResponse.Layout;

    /**
     * Reactions on this message part
     */
    reactions: Array<Shared.Reaction> | null;

    /**
     * Indicates this is an iMessage app card part.
     */
    type: 'imessage_app';

    /**
     * The URL delivered to the iMessage app on tap.
     */
    url: string;

    /**
     * Fallback text for surfaces that cannot render the card.
     */
    fallback_text?: string | null;
  }

  export namespace IMessageAppPartResponse {
    /**
     * Identifies the iMessage app (Messages app extension) that backs the card.
     */
    export interface App {
      /**
       * Bundle identifier of the Messages app extension. Must not contain `:`.
       */
      bundle_id: string;

      /**
       * Display name of the app, shown by Messages' fallback UI.
       */
      name: string;

      /**
       * The app's 10-character uppercase alphanumeric team identifier.
       */
      team_id: string;

      /**
       * The owning app's App Store id (optional). When set, recipients without the
       * iMessage app installed see a "Get the app" affordance.
       */
      app_store_id?: number;
    }

    /**
     * Visible layout of the card. At least one of `caption`, `subcaption`,
     * `trailing_caption`, `trailing_subcaption`, or `image_url` must be set, otherwise
     * the card renders as an empty bubble.
     *
     * `image_url` displays a preview image at the top of the card. The image renders
     * on the recipient's card whether or not they have your app installed. The small
     * icon beside the caption is the app's own icon and is not settable here.
     *
     * `* Note - requires a trusted chat w/ inbound activity`
     *
     * `image_title` and `image_subtitle` render as text overlaid on the image (title
     * bold, subtitle beneath it). They only appear when `image_url` is set — without
     * an image there is nothing to overlay — so setting either without `image_url` is
     * rejected.
     */
    export interface Layout {
      /**
       * Primary label, top-left and bold.
       */
      caption?: string;

      /**
       * Text shown below `image_title`, overlaid on the card image. Requires
       * `image_url`.
       */
      image_subtitle?: string;

      /**
       * Bold text overlaid on the card image. Requires `image_url` (rejected without
       * it).
       */
      image_title?: string;

      /**
       * URL of an image (JPEG, PNG, HEIF, or WebP) to display as the card's preview
       * image; an unreachable or non-image URL returns a validation error. Renders for
       * all recipients regardless of whether they have the app. Note - requires a
       * trusted chat w/ inbound activity. In responses, this is the re-hosted
       * `cdn.linqapp.com` copy of the image you supplied, not your original URL.
       */
      image_url?: string;

      /**
       * Secondary label, below `caption` on the left.
       */
      subcaption?: string;

      /**
       * Label shown top-right.
       */
      trailing_caption?: string;

      /**
       * Label shown below `trailing_caption`, on the right.
       */
      trailing_subcaption?: string;
    }
  }

  /**
   * An App Clip card part
   */
  export interface AppClipPartResponse {
    /**
     * Reactions on this message part
     */
    reactions: Array<Shared.Reaction> | null;

    /**
     * Indicates this is an App Clip card part
     */
    type: 'app_clip';

    /**
     * The App Clip link the card opens
     */
    value: string;

    /**
     * The card's summary line, composed by Linq from the App Clip page
     */
    description?: string;

    /**
     * The card's preview image
     */
    image_url?: string;

    /**
     * The card's headline, composed by Linq from the App Clip page
     */
    title?: string;
  }
}

/**
 * iMessage effect applied to a message (screen or bubble effect)
 */
export interface MessageEffect {
  /**
   * Name of the effect. Common values:
   *
   * - Screen effects: confetti, fireworks, lasers, sparkles, celebration, hearts,
   *   love, balloons, happy_birthday, echo, spotlight
   * - Bubble effects: slam, loud, gentle, invisible
   */
  name?: string;

  /**
   * Type of effect
   */
  type?: 'screen' | 'bubble';
}

/**
 * Indicates this message is a threaded reply to another message
 */
export interface ReplyTo {
  /**
   * The ID of the message to reply to
   */
  message_id: string;

  /**
   * The specific message part to reply to (0-based index). Defaults to 0 (first
   * part) if not provided. Use this when replying to a specific part of a multipart
   * message.
   */
  part_index?: number;
}

/**
 * Result of an auto-from send. Self-describing: which line was used, which chat
 * the message landed in, whether a new chat was created, and the resulting message
 * id(s).
 */
export interface MessageCreateResponse {
  /**
   * The resolved chat (reused or newly created) the message landed in.
   */
  chat_id: string;

  /**
   * True when a new chat was created (new or failover), false on reuse.
   */
  created_new_chat: boolean;

  /**
   * The line (E.164) the message was actually sent from.
   */
  from: string;

  /**
   * Why this line/chat was chosen.
   */
  from_selection: MessageCreateResponse.FromSelection;

  /**
   * Participants of the resolved chat.
   */
  handles: Array<Shared.ChatHandle>;

  /**
   * Whether the resolved chat is a group chat.
   */
  is_group: boolean;

  /**
   * A message that was sent (used in CreateChat and SendMessage responses)
   */
  message: MessagesAPI.SentMessage;

  /**
   * Messaging service type
   */
  service: Shared.ServiceType;

  /**
   * Set ONLY on `failover_flagged`: the abandoned flagged chat that was NOT sent
   * into. Null otherwise.
   */
  previous_chat_id?: string | null;
}

export namespace MessageCreateResponse {
  /**
   * Why this line/chat was chosen.
   */
  export interface FromSelection {
    /**
     * - `reused_active_chat` — reused an existing chat on its healthy line
     * - `new_best_number` — created a new chat on the best available line
     * - `failover_flagged` — no existing chat for these recipients was on a line that
     *   could send; created a new chat on a fresh line
     */
    reason: 'reused_active_chat' | 'new_best_number' | 'failover_flagged';

    /**
     * True only when an existing chat was reused.
     */
    reused_existing_chat: boolean;
  }
}

export interface MessageAddReactionResponse {
  message?: string;

  status?: string;

  trace_id?: string;
}

/**
 * Response for sending a message to a chat
 */
export interface MessageUpdateAppCardResponse {
  /**
   * Unique identifier of the chat this message was sent to
   */
  chat_id: string;

  /**
   * A message that was sent (used in CreateChat and SendMessage responses)
   */
  message: MessagesAPI.SentMessage;
}

export interface MessageCreateParams {
  /**
   * Body param: Message content container. Groups all message-related fields
   * together, separating the "what" (message content) from the "where" (routing
   * fields like from/to).
   *
   * A message carries EITHER `parts` — text and attachments, which compose into one
   * bubble — or a single `experience` invocation, which renders an experience inside
   * Linq's iMessage app. Never both: an app card is the whole message (Apple's
   * `MSMessage` cannot coexist with text), so copy and a card are two sends, not
   * one.
   */
  message: ChatsAPI.MessageContent;

  /**
   * Body param: Recipient handles (E.164 phone numbers or email addresses). One
   * handle is a direct chat; multiple handles a group chat. Order-independent — the
   * set identifies the chat.
   */
  to: Array<string>;

  /**
   * Body param: Text-only fallback that **replaces** `message` ONLY on the failover
   * branch — when a chat with these recipients already existed but its line was
   * flagged, so a new chat is created on a fresh line. On that branch this text is
   * sent as the single message instead of `message` (the recipient is on a new
   * number, so you typically want a fresh-number-appropriate opener rather than the
   * original content). Ignored otherwise (a healthy reuse, or genuine first
   * contact). Carries no parts, media, or effects — exactly one message is ever
   * sent.
   */
  continuation_message?: MessageCreateParams.ContinuationMessage;

  /**
   * Body param: Lines (E.164) not to pick for this send. Applies for this request
   * only — nothing is remembered between calls.
   *
   * **Exclusion only affects picking a line for a new chat.** If `to` already has a
   * chat, that chat is reused on its own line, and a chat on a non-excluded line is
   * preferred when there is more than one. If the only chat these recipients have is
   * on an excluded line, it is still reused — an exclusion never abandons a live
   * chat or moves it to a new number. Check `from` in the response to see the line
   * that was actually used.
   *
   * Numbers that are not your lines are ignored. Every entry must be E.164 — a value
   * like `4155551234` is rejected rather than silently skipped. Excluding every one
   * of your available lines returns 400 when a line has to be picked.
   */
  exclude_from?: Array<string>;

  /**
   * Body param: Send even though the recipient asked you to stop (`403`, error code
   * `2024`). Applies to this request only: the opt-out stays in place, so the next
   * send without this flag is rejected again. Every override is recorded against
   * your API key.
   */
  override_optout?: boolean;

  /**
   * Header param: Optional idempotency key for the send. Reuse the same key to
   * safely retry without sending twice. May also be supplied as
   * `message.idempotency_key`.
   */
  'Idempotency-Key'?: string;
}

export namespace MessageCreateParams {
  /**
   * Text-only fallback that **replaces** `message` ONLY on the failover branch —
   * when a chat with these recipients already existed but its line was flagged, so a
   * new chat is created on a fresh line. On that branch this text is sent as the
   * single message instead of `message` (the recipient is on a new number, so you
   * typically want a fresh-number-appropriate opener rather than the original
   * content). Ignored otherwise (a healthy reuse, or genuine first contact). Carries
   * no parts, media, or effects — exactly one message is ever sent.
   */
  export interface ContinuationMessage {
    /**
     * The replacement message text, sent as the single message on failover.
     */
    text: string;
  }
}

export interface MessageUpdateParams {
  /**
   * New text content for the message part
   */
  text: string;

  /**
   * Index of the message part to edit. Defaults to 0.
   */
  part_index?: number;
}

export interface MessageAddReactionParams {
  /**
   * Whether to add or remove the reaction
   */
  operation: 'add' | 'remove';

  /**
   * Type of reaction. Standard iMessage tapbacks are love, like, dislike, laugh,
   * emphasize, question. Custom emoji reactions have type "custom" with the actual
   * emoji in the custom_emoji field. Sticker reactions have type "sticker" with
   * sticker attachment details in the sticker field.
   */
  type: Shared.ReactionType;

  /**
   * Custom emoji string. Required when type is "custom".
   */
  custom_emoji?: string;

  /**
   * Optional index of the message part to react to. If not provided, reacts to the
   * entire message (part 0).
   */
  part_index?: number;
}

export interface MessageListMessagesThreadParams extends ListMessagesPaginationParams {
  /**
   * Sort order for messages (asc = oldest first, desc = newest first)
   */
  order?: 'asc' | 'desc';
}

export interface MessageUpdateAppCardParams {
  /**
   * Visible layout of the card. At least one of `caption`, `subcaption`,
   * `trailing_caption`, `trailing_subcaption`, or `image_url` must be set, otherwise
   * the card renders as an empty bubble.
   *
   * `image_url` displays a preview image at the top of the card. The image renders
   * on the recipient's card whether or not they have your app installed. The small
   * icon beside the caption is the app's own icon and is not settable here.
   *
   * `* Note - requires a trusted chat w/ inbound activity`
   *
   * `image_title` and `image_subtitle` render as text overlaid on the image (title
   * bold, subtitle beneath it). They only appear when `image_url` is set — without
   * an image there is nothing to overlay — so setting either without `image_url` is
   * rejected.
   */
  layout: MessageUpdateAppCardParams.Layout;

  /**
   * Invokes an action on an experience — a third party that renders inside Linq's
   * iMessage app. Linq resolves the recipient's connection, mints any session the
   * action needs, composes the card and sends it; none of that is visible to you.
   *
   * Call `GET /v3/experiences/{experience}` for the actions you may invoke and the
   * fields each accepts.
   */
  experience?: MessageUpdateAppCardParams.Experience;

  /**
   * Text shown on surfaces that cannot render the card (notifications, lock screen).
   * Defaults to the caption when omitted.
   */
  fallback_text?: string;

  /**
   * Whether the updated card renders as your app's interactive balloon for
   * recipients who have your iMessage app installed. `true` (default) lets your
   * installed extension draw its live view; `false` always shows the static `layout`
   * card. Recipients without your app always see the static card regardless of this
   * flag.
   *
   * Defaults to `true` when omitted — it is **not** inherited from the original
   * card. To keep a card static across updates, re-send `interactive: false` on each
   * update.
   */
  interactive?: boolean;

  /**
   * URL the recipient's app opens when they tap the updated card.
   *
   * Mutually exclusive with `experience` and `raw_payload_data`.
   */
  url?: string;
}

export namespace MessageUpdateAppCardParams {
  /**
   * Visible layout of the card. At least one of `caption`, `subcaption`,
   * `trailing_caption`, `trailing_subcaption`, or `image_url` must be set, otherwise
   * the card renders as an empty bubble.
   *
   * `image_url` displays a preview image at the top of the card. The image renders
   * on the recipient's card whether or not they have your app installed. The small
   * icon beside the caption is the app's own icon and is not settable here.
   *
   * `* Note - requires a trusted chat w/ inbound activity`
   *
   * `image_title` and `image_subtitle` render as text overlaid on the image (title
   * bold, subtitle beneath it). They only appear when `image_url` is set — without
   * an image there is nothing to overlay — so setting either without `image_url` is
   * rejected.
   */
  export interface Layout {
    /**
     * Primary label, top-left and bold.
     */
    caption?: string;

    /**
     * Text shown below `image_title`, overlaid on the card image. Requires
     * `image_url`.
     */
    image_subtitle?: string;

    /**
     * Bold text overlaid on the card image. Requires `image_url` (rejected without
     * it).
     */
    image_title?: string;

    /**
     * URL of an image (JPEG, PNG, HEIF, or WebP) to display as the card's preview
     * image; an unreachable or non-image URL returns a validation error. Renders for
     * all recipients regardless of whether they have the app. Note - requires a
     * trusted chat w/ inbound activity. In responses, this is the re-hosted
     * `cdn.linqapp.com` copy of the image you supplied, not your original URL.
     */
    image_url?: string;

    /**
     * Secondary label, below `caption` on the left.
     */
    subcaption?: string;

    /**
     * Label shown top-right.
     */
    trailing_caption?: string;

    /**
     * Label shown below `trailing_caption`, on the right.
     */
    trailing_subcaption?: string;
  }

  /**
   * Invokes an action on an experience — a third party that renders inside Linq's
   * iMessage app. Linq resolves the recipient's connection, mints any session the
   * action needs, composes the card and sends it; none of that is visible to you.
   *
   * Call `GET /v3/experiences/{experience}` for the actions you may invoke and the
   * fields each accepts.
   */
  export interface Experience {
    /**
     * Which of its actions, e.g. `attach_card`.
     */
    action: string;

    /**
     * The experience to invoke, e.g. `agentcard` or `agentpay`.
     */
    name: string;

    /**
     * Values for the fields this action exposes. Keys are exactly the field names
     * listed for the action — no mapping, no nesting.
     *
     * Display copy only, except a `url`-type field — that value sets the destination,
     * and must be an absolute `https` URL.
     *
     * Some fields are read rather than sent: `agentpay`'s `request_payment` takes only
     * a `checkout_url` and resolves the amount and reason from that payment request
     * itself, so the card cannot state a figure the checkout will not charge.
     */
    params?: { [key: string]: unknown };
  }
}

Messages.Poll = Poll;

export declare namespace Messages {
  export {
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
    Poll as Poll,
    type PollAddOptionsParams as PollAddOptionsParams,
    type PollVoteParams as PollVoteParams,
  };
}
