// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import * as BackgroundAPI from './background';
import { Background, BackgroundSetParams } from './background';
import * as LocationAPI from './location';
import { GetChatLocationResponse, Location, LocationRequestResponse } from './location';
import * as MessagesAPI from './messages';
import { MessageListParams, MessageSendParams, MessageSendResponse, Messages, SentMessage } from './messages';
import * as ParticipantsAPI from './participants';
import {
  ParticipantAddParams,
  ParticipantAddResponse,
  ParticipantRemoveParams,
  ParticipantRemoveResponse,
  Participants,
} from './participants';
import * as PollsAPI from './polls';
import { Poll, PollCreateParams, PollEnvelope, Polls } from './polls';
import * as TypingAPI from './typing';
import { Typing } from './typing';
import * as ResourcesMessagesAPI from '../messages/messages';
import { APIPromise } from '../../core/api-promise';
import { ListChatsPagination, type ListChatsPaginationParams, PagePromise } from '../../core/pagination';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Chats extends APIResource {
  participants: ParticipantsAPI.Participants = new ParticipantsAPI.Participants(this._client);
  typing: TypingAPI.Typing = new TypingAPI.Typing(this._client);
  messages: MessagesAPI.Messages = new MessagesAPI.Messages(this._client);
  location: LocationAPI.Location = new LocationAPI.Location(this._client);
  polls: PollsAPI.Polls = new PollsAPI.Polls(this._client);
  background: BackgroundAPI.Background = new BackgroundAPI.Background(this._client);

  /**
   * Create a new chat with specified participants and send an initial message. The
   * initial message is required when creating a chat.
   *
   * ## Message Effects
   *
   * You can add iMessage effects to make your messages more expressive. Effects are
   * optional and can be either screen effects (full-screen animations) or bubble
   * effects (message bubble animations).
   *
   * **Screen Effects:** `confetti`, `fireworks`, `lasers`, `sparkles`,
   * `celebration`, `hearts`, `love`, `balloons`, `happy_birthday`, `echo`,
   * `spotlight`
   *
   * **Bubble Effects:** `slam`, `loud`, `gentle`, `invisible`
   *
   * Only one effect type can be applied per message.
   *
   * ## Inline Text Decorations (iMessage only)
   *
   * Use the `text_decorations` array on a text part to apply styling and animations
   * to character ranges.
   *
   * Each decoration specifies a `range: [start, end)` and exactly one of `style` or
   * `animation`.
   *
   * **Styles:** `bold`, `italic`, `strikethrough`, `underline` **Animations:**
   * `big`, `small`, `shake`, `nod`, `explode`, `ripple`, `bloom`, `jitter`
   *
   * ```json
   * {
   *   "type": "text",
   *   "value": "Hello world",
   *   "text_decorations": [
   *     { "range": [0, 5], "style": "bold" },
   *     { "range": [6, 11], "animation": "shake" }
   *   ]
   * }
   * ```
   *
   * **Note:** Style ranges (bold, italic, etc.) may overlap, but animation ranges
   * must not overlap with other animations or styles. Text decorations only render
   * for iMessage recipients. For SMS/RCS, text decorations are not applied.
   *
   * ## First-Message Link Restriction
   *
   * To protect sender deliverability, the **first outbound message** of a new chat
   * cannot be a link. The request is rejected with `400` (error code `1005`) when:
   *
   * - The message contains a `link` part (explicit rich-preview link), or
   * - Any `text` part contains a URL.
   *
   * This rule applies only to `POST /v3/chats`. Follow-up messages on an existing
   * chat (`POST /v3/chats/{chatId}/messages`) are not subject to this restriction.
   *
   * ## Reusing an Existing Chat
   *
   * Chats are keyed on the `from` line plus the exact set of `to` handles. Repeating
   * this request with the same `from` and `to` returns the **existing** chat and
   * sends the message into it instead of starting a second conversation.
   *
   * A group chat that has a `display_name` is excluded from that matching. To run
   * several parallel groups over the same participants, name each one with
   * `PUT /v3/chats/{chatId}` before creating the next: the following
   * `POST /v3/chats` with the same `to` then returns a new, separate `chat_id`. Two
   * other cases also produce a new chat instead of reusing one — the participant set
   * changed (a participant was added or removed), or the `from` line left the group.
   *
   * Whenever the response is a new chat, the first-message rules above apply to that
   * request: no link in the first message, and no `reply_to` or message effect. To
   * send into a chat you already know, use `POST /v3/chats/{chatId}/messages` with
   * its `chat_id`.
   *
   * @example
   * ```ts
   * const chat = await client.chats.create({
   *   from: '+12052535597',
   *   message: {
   *     parts: [
   *       {
   *         type: 'text',
   *         value: 'Hello! How can I help you today?',
   *       },
   *     ],
   *   },
   *   to: ['+12052532136'],
   * });
   * ```
   */
  create(body: ChatCreateParams, options?: RequestOptions): APIPromise<ChatCreateResponse> {
    return this._client.post('/v3/chats', { body, ...options });
  }

  /**
   * Retrieve a chat by its unique identifier.
   *
   * @example
   * ```ts
   * const chat = await client.chats.retrieve(
   *   '550e8400-e29b-41d4-a716-446655440000',
   * );
   * ```
   */
  retrieve(chatID: string, options?: RequestOptions): APIPromise<Chat> {
    return this._client.get(path`/v3/chats/${chatID}`, options);
  }

  /**
   * Update chat properties such as display name and group chat icon.
   *
   * Listen for `chat.group_name_updated`, `chat.group_icon_updated`,
   * `chat.group_name_update_failed`, or `chat.group_icon_update_failed` webhook
   * events to confirm the outcome.
   *
   * @example
   * ```ts
   * const chat = await client.chats.update(
   *   '550e8400-e29b-41d4-a716-446655440000',
   *   { display_name: 'Team Discussion' },
   * );
   * ```
   */
  update(chatID: string, body: ChatUpdateParams, options?: RequestOptions): APIPromise<ChatUpdateResponse> {
    return this._client.put(path`/v3/chats/${chatID}`, { body, ...options });
  }

  /**
   * Removes your phone number from a group chat. Once you leave, you will no longer
   * receive messages from the group and all interaction endpoints (send message,
   * typing, mark read, etc.) will return 409.
   *
   * A `participant.removed` webhook will fire once the leave has been processed.
   *
   * **Supported**
   *
   * - iMessage group chats with 4 or more active participants (including yourself)
   *
   * **Not supported**
   *
   * - DM (1-on-1) chats — use the chat directly to continue the conversation
   *
   * @example
   * ```ts
   * const response = await client.chats.leaveChat(
   *   '550e8400-e29b-41d4-a716-446655440000',
   * );
   * ```
   */
  leaveChat(chatID: string, options?: RequestOptions): APIPromise<ChatLeaveChatResponse> {
    return this._client.post(path`/v3/chats/${chatID}/leave`, options);
  }

  /**
   * Retrieves a paginated list of chats for the authenticated partner.
   *
   * **Filtering:**
   *
   * - If `from` is provided, returns chats for that specific phone number
   * - If `from` is omitted, returns chats across all phone numbers owned by the
   *   partner
   * - If `to` is provided, only returns chats where the specified handle is a
   *   participant
   *
   * **Pagination:**
   *
   * - Use `limit` to control page size (default: 20, max: 100)
   * - The response includes `next_cursor` for fetching the next page
   * - When `next_cursor` is `null`, there are no more results to fetch
   * - Pass the `next_cursor` value as the `cursor` parameter for the next request
   *
   * **Example pagination flow:**
   *
   * 1. First request: `GET /v3/chats?from=%2B12223334444&limit=20`
   * 2. Response includes `next_cursor: "20"` (more results exist)
   * 3. Next request: `GET /v3/chats?from=%2B12223334444&limit=20&cursor=20`
   * 4. Response includes `next_cursor: null` (no more results)
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const chat of client.chats.listChats()) {
   *   // ...
   * }
   * ```
   */
  listChats(
    query: ChatListChatsParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<ChatsListChatsPagination, Chat> {
    return this._client.getAPIList('/v3/chats', ListChatsPagination<Chat>, { query, ...options });
  }

  /**
   * Mark all messages in a chat as read.
   *
   * @example
   * ```ts
   * await client.chats.markAsRead(
   *   '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
   * );
   * ```
   */
  markAsRead(chatID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.post(path`/v3/chats/${chatID}/read`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Send an audio file as an **iMessage voice memo bubble** to all participants in a
   * chat. Voice memos appear with iMessage's native inline playback UI, unlike
   * regular audio attachments sent via media parts which appear as downloadable
   * files.
   *
   * **Supported audio formats:**
   *
   * - MP3 (audio/mpeg)
   * - M4A (audio/x-m4a, audio/mp4)
   * - AAC (audio/aac)
   * - CAF (audio/x-caf) - Core Audio Format
   * - WAV (audio/wav)
   * - AIFF (audio/aiff, audio/x-aiff)
   * - AMR (audio/amr)
   *
   * @example
   * ```ts
   * const response = await client.chats.sendVoicememo(
   *   'f19ee7b8-8533-4c5c-83ec-4ef8d6d1ddbd',
   *   { voice_memo_url: 'https://example.com/voice-memo.m4a' },
   * );
   * ```
   */
  sendVoicememo(
    chatID: string,
    body: ChatSendVoicememoParams,
    options?: RequestOptions,
  ): APIPromise<ChatSendVoicememoResponse> {
    return this._client.post(path`/v3/chats/${chatID}/voicememo`, { body, ...options });
  }

  /**
   * Share your contact information (Name and Photo Sharing) with a chat.
   *
   * **Note:** A contact card must be configured before sharing. You can set up your
   * contact card via the [Contact Card API](#tag/Contact-Card) or on the
   * [Linq dashboard](https://dashboard.linqapp.com/contact-cards).
   *
   * @example
   * ```ts
   * await client.chats.shareContactCard(
   *   '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
   * );
   * ```
   */
  shareContactCard(chatID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.post(path`/v3/chats/${chatID}/share_contact_card`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export type ChatsListChatsPagination = ListChatsPagination<Chat>;

export interface Chat {
  /**
   * Unique identifier for the chat
   */
  id: string;

  /**
   * When the chat was created
   */
  created_at: string;

  /**
   * Display name for the chat. Defaults to a comma-separated list of recipient
   * handles. Can be updated for group chats.
   */
  display_name: string | null;

  /**
   * List of chat participants with full handle details. Always contains at least two
   * handles (your phone number and the other participant).
   */
  handles: Array<Shared.ChatHandle>;

  /**
   * **[BETA]** Current health for a chat. Always present — chats start at `HEALTHY`
   * and may shift based on engagement and delivery signals on the conversation. Many
   * `AT_RISK` or `CRITICAL` chats on a single line increase the risk of line
   * flagging.
   *
   * Switch on `status` to surface chat and line health in your UI — the enum is the
   * long-term contract. Each status carries a `doc_url` that deep-links to the
   * relevant section of the Chat Health guide. To gate a send, act on the response
   * rather than the status: a `403` is the authoritative answer.
   *
   * See the [Chat Health guide](/guides/chats/chat-health) for what each status
   * means and how to react.
   */
  health_status: Chat.HealthStatus;

  /**
   * @deprecated is_archived is no longer a useful signal
   */
  is_archived: boolean;

  /**
   * Whether this is a group chat
   */
  is_group: boolean;

  /**
   * When the chat was last updated
   */
  updated_at: string;

  /**
   * URL of the group chat icon. Only set for group chats that have an icon; `null`
   * otherwise.
   */
  group_chat_icon?: string | null;

  /**
   * Messaging service type
   */
  service?: Shared.ServiceType | null;
}

export namespace Chat {
  /**
   * **[BETA]** Current health for a chat. Always present — chats start at `HEALTHY`
   * and may shift based on engagement and delivery signals on the conversation. Many
   * `AT_RISK` or `CRITICAL` chats on a single line increase the risk of line
   * flagging.
   *
   * Switch on `status` to surface chat and line health in your UI — the enum is the
   * long-term contract. Each status carries a `doc_url` that deep-links to the
   * relevant section of the Chat Health guide. To gate a send, act on the response
   * rather than the status: a `403` is the authoritative answer.
   *
   * See the [Chat Health guide](/guides/chats/chat-health) for what each status
   * means and how to react.
   */
  export interface HealthStatus {
    /**
     * Deep-link to the relevant section of the Chat Health guide for this status.
     */
    doc_url: string;

    /**
     * Current health bucket for the chat. See the
     * [Chat Health guide](/guides/chats/chat-health) for what each value means and how
     * to react. `doc_url` deep-links to the relevant section.
     *
     * `OPTED_OUT` — the recipient sent `STOP`, `UNSUBSCRIBE`, `OPTOUT`, `CANCEL`,
     * `END`, or `QUIT`. The keyword must be the whole trimmed message, never part of a
     * longer one: `STOP` counts, `please stop` does not. Most keywords must match
     * exactly, including case. `OPT OUT` is the exception — it matches in any casing,
     * with or without the space or a hyphen, so `opt out`, `Opt-Out` and `optout` all
     * count. It clears as soon as they reply again: any later message from them that
     * is not itself an opt-out keyword opts them back in immediately — a reply in any
     * conversation with you counts, the same way the block does.
     *
     * `OPTED_OUT` marks only the conversation the keyword arrived in. The block below
     * is wider than the mark, so a conversation still reading `HEALTHY` can be blocked
     * as well — gate on the `403`, not on the status. Group threads are never marked
     * and are never blocked.
     *
     * Linq enforces this: while a recipient is opted out, every send to them is
     * rejected with `403` (error code `2024`) before the message is queued, across
     * every chat and every line on your account. Nothing is delivered, including a
     * final courtesy message — to send one, set `override_optout: true` on that single
     * request.
     */
    status: 'HEALTHY' | 'AT_RISK' | 'CRITICAL' | 'OPTED_OUT';

    /**
     * When this status last changed.
     */
    updated_at: string;
  }
}

export interface LinkPart {
  /**
   * Indicates this is a rich link preview part
   */
  type: 'link';

  /**
   * URL to send with a rich link preview. The recipient will see an inline card with
   * the page's title, description, and preview image (when available).
   *
   * A `link` part must be the **only** part in the message. To send a URL as plain
   * text (no preview card), use a `text` part instead.
   */
  value: string;
}

export interface MediaPart {
  /**
   * Indicates this is a media attachment part
   */
  type: 'media';

  /**
   * Reference to a file pre-uploaded via `POST /v3/attachments` (optional). The file
   * is already stored, so sends using this ID skip the download step — useful when
   * sending the same file to many recipients.
   *
   * Either `url` or `attachment_id` must be provided, but not both.
   */
  attachment_id?: string;

  /**
   * Any publicly accessible HTTPS URL to the media file. The server downloads and
   * sends the file automatically — no pre-upload step required.
   *
   * **Size limit:** 10MB maximum for URL-based downloads. For larger files (up to
   * 100MB), use the pre-upload flow: `POST /v3/attachments` to get a presigned URL,
   * upload directly, then reference by `attachment_id`.
   *
   * **Requirements:**
   *
   * - URL must use HTTPS
   * - File content must be a supported format (the server validates the actual file
   *   content)
   *
   * **Supported formats:**
   *
   * - Images: .jpg, .jpeg, .png, .gif, .heic, .heif, .tif, .tiff, .bmp
   * - Videos: .mp4, .mov, .m4v, .mpeg, .mpg, .3gp
   * - Audio: .m4a, .mp3, .aac, .caf, .wav, .aiff, .amr
   * - Documents: .pdf, .txt, .rtf, .csv, .doc, .docx, .xls, .xlsx, .ppt, .pptx,
   *   .pages, .numbers, .key, .epub, .zip, .html, .htm
   * - Contact & Calendar: .vcf, .ics
   *
   * **Tip:** Audio sent here appears as a regular file attachment. To send audio as
   * an iMessage voice memo bubble (with inline playback), use
   * `/v3/chats/{chatId}/voicememo`. For repeated sends of the same file, use
   * `attachment_id` to avoid redundant downloads.
   *
   * Either `url` or `attachment_id` must be provided, but not both.
   */
  url?: string;
}

/**
 * Message content container. Groups all message-related fields together,
 * separating the "what" (message content) from the "where" (routing fields like
 * from/to).
 *
 * A message carries EITHER `parts` — text and attachments, which compose into one
 * bubble — or a single `experience` invocation, which renders an experience inside
 * Linq's iMessage app. Never both: an app card is the whole message (Apple's
 * `MSMessage` cannot coexist with text), so copy and a card are two sends, not
 * one.
 */
export interface MessageContent {
  /**
   * iMessage effect to apply to this message (screen or bubble effect)
   */
  effect?: ResourcesMessagesAPI.MessageEffect;

  /**
   * Invokes an action on an experience — a third party that renders inside Linq's
   * iMessage app. Linq resolves the recipient's connection, mints any session the
   * action needs, composes the card and sends it; none of that is visible to you.
   *
   * Call `GET /v3/experiences/{experience}` for the actions you may invoke and the
   * fields each accepts.
   */
  experience?: MessageContent.Experience;

  /**
   * Optional idempotency key for this message. Use this to prevent duplicate sends
   * of the same message. Reusing a key whose message was deleted — or was an
   * ephemeral message that has since expired — returns 404; the message is never
   * resent.
   */
  idempotency_key?: string;

  /**
   * Array of message parts. Each part can be text, media, or link. Parts are
   * displayed in order. Text and media can be mixed freely, but a `link` part must
   * be the only part in the message.
   *
   * **Rich Link Previews:**
   *
   * - Use a `link` part to send a URL with a rich preview card
   * - A `link` part must be the **only** part in the message
   * - To send a URL as plain text (no preview), use a `text` part instead
   *
   * **Supported Media:**
   *
   * - Images: .jpg, .jpeg, .png, .gif, .heic, .heif, .tif, .tiff, .bmp
   * - Videos: .mp4, .mov, .m4v, .mpeg, .mpg, .3gp
   * - Audio: .m4a, .mp3, .aac, .caf, .wav, .aiff, .amr
   * - Documents: .pdf, .txt, .rtf, .csv, .doc, .docx, .xls, .xlsx, .ppt, .pptx,
   *   .pages, .numbers, .key, .epub, .zip, .html, .htm
   * - Contact & Calendar: .vcf, .ics
   *
   * **Audio:**
   *
   * - Audio files (.m4a, .mp3, .aac, .caf, .wav, .aiff, .amr) are fully supported as
   *   media parts
   * - To send audio as an **iMessage voice memo bubble** (inline playback UI), use
   *   the dedicated `/v3/chats/{chatId}/voicememo` endpoint instead
   *
   * **Validation Rules:**
   *
   * - A `link` part must be the **only** part in the message. It cannot be combined
   *   with text or media parts.
   * - Consecutive text parts are not allowed. Text parts must be separated by media
   *   parts. For example, [text, text] is invalid, but [text, media, text] is valid.
   * - Maximum of **100 parts** total.
   * - Media parts using a public `url` (downloaded by the server on send) are capped
   *   at **40**. Parts using `attachment_id` or presigned URLs are exempt from this
   *   sub-limit. For bulk media sends exceeding 40 files, pre-upload via
   *   `POST /v3/attachments` and reference by `attachment_id` or `download_url`.
   */
  parts?: Array<TextPart | MediaPart | LinkPart | MessageContent.IMessageAppPart>;

  /**
   * Messaging service type
   */
  preferred_service?: Shared.ServiceType;

  /**
   * Reply to another message to create a threaded conversation
   */
  reply_to?: ResourcesMessagesAPI.ReplyTo;
}

export namespace MessageContent {
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

  /**
   * An iMessage app card, backed by a Messages app extension. iMessage only — an
   * `imessage_app` part must be the **only** part in the message and is never
   * delivered over SMS/RCS. See the IMessageAppServiceUnsupported (2018) and
   * RecipientUnsupportedMessageType (4005) error codes.
   */
  export interface IMessageAppPart {
    /**
     * Identifies the iMessage app (Messages app extension) that backs the card.
     */
    app: IMessageAppPart.App;

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
    layout: IMessageAppPart.Layout;

    /**
     * Indicates this is an iMessage app card part.
     */
    type: 'imessage_app';

    /**
     * Text shown on surfaces that cannot render the card (notifications, lock screen).
     * Defaults to the caption when omitted.
     */
    fallback_text?: string;

    /**
     * Whether the card renders as your app's interactive balloon for recipients who
     * have your iMessage app installed. `true` (default) lets your installed extension
     * draw its live, interactive view for those recipients; everyone else sees the
     * static card built from `layout`. `false` always shows the static `layout` card,
     * even to recipients who have the app installed. Recipients without your app
     * always see the static card regardless of this flag.
     */
    interactive?: boolean;

    /**
     * URL the recipient's app opens when they tap the card. Either an absolute
     * `https://` URL (capped at 2048 characters) or a `data:` URL carrying inline app
     * state, e.g. a game's encoded state (capped at 16384 characters).
     */
    url?: string;
  }

  export namespace IMessageAppPart {
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
}

export interface TextPart {
  /**
   * Indicates this is a text message part
   */
  type: 'text';

  /**
   * The text content of the message. This value is sent as-is with no parsing or
   * transformation — Markdown syntax will be delivered as plain text. Use
   * `text_decorations` to apply inline formatting and animations (iMessage only).
   */
  value: string;

  /**
   * @mention a chat participant (iMessage group chats only). Set to their handle —
   * E.164 phone number or Apple ID email. `value` is the display text; use the bare
   * name (`"Juan"`, not `"@Juan"`). The mentioned participant is notified even if
   * the chat is muted. Falls back to plain text over SMS/RCS.
   *
   * By default the entire `value` renders as the mention; use `mention_range` to
   * highlight only part of it.
   */
  mention?: string;

  /**
   * Optional character range `[start, end)` in `value` that renders as the `mention`
   * highlight (e.g. just the name in `"Hey Kevin, can you look at this?"`). Requires
   * `mention`. Without it, the entire `value` is highlighted. `start` is inclusive,
   * `end` is exclusive. _Characters are measured as UTF-16 code units. Most
   * characters count as 1; some emoji count as 2._
   */
  mention_range?: Array<number>;

  /**
   * Optional array of text decorations applied to character ranges in the `value`
   * field (iMessage only).
   *
   * Each decoration specifies a character range `[start, end)` and exactly one of
   * `style` or `animation`.
   *
   * **Styles:** `bold`, `italic`, `strikethrough`, `underline` **Animations:**
   * `big`, `small`, `shake`, `nod`, `explode`, `ripple`, `bloom`, `jitter`
   *
   * Style ranges may overlap (e.g. bold + italic on the same text), but animation
   * ranges must not overlap with other animations or styles.
   *
   * _Characters are measured as UTF-16 code units. Most characters count as 1; some
   * emoji count as 2._
   *
   * **Note:** Text decorations only render for iMessage recipients. For SMS/RCS,
   * text decorations are not applied.
   */
  text_decorations?: Array<Shared.TextDecoration>;
}

/**
 * Response for creating a new chat with an initial message
 */
export interface ChatCreateResponse {
  chat: ChatCreateResponse.Chat;
}

export namespace ChatCreateResponse {
  export interface Chat {
    /**
     * Unique identifier for the created chat (UUID)
     */
    id: string;

    /**
     * Display name for the chat. Defaults to a comma-separated list of recipient
     * handles. Can be updated for group chats.
     */
    display_name: string | null;

    /**
     * List of participants in the chat. Always contains at least two handles (your
     * phone number and the other participant).
     */
    handles: Array<Shared.ChatHandle>;

    /**
     * **[BETA]** Current health for a chat. Always present — chats start at `HEALTHY`
     * and may shift based on engagement and delivery signals on the conversation. Many
     * `AT_RISK` or `CRITICAL` chats on a single line increase the risk of line
     * flagging.
     *
     * Switch on `status` to surface chat and line health in your UI — the enum is the
     * long-term contract. Each status carries a `doc_url` that deep-links to the
     * relevant section of the Chat Health guide. To gate a send, act on the response
     * rather than the status: a `403` is the authoritative answer.
     *
     * See the [Chat Health guide](/guides/chats/chat-health) for what each status
     * means and how to react.
     */
    health_status: Chat.HealthStatus;

    /**
     * Whether this is a group chat
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
  }

  export namespace Chat {
    /**
     * **[BETA]** Current health for a chat. Always present — chats start at `HEALTHY`
     * and may shift based on engagement and delivery signals on the conversation. Many
     * `AT_RISK` or `CRITICAL` chats on a single line increase the risk of line
     * flagging.
     *
     * Switch on `status` to surface chat and line health in your UI — the enum is the
     * long-term contract. Each status carries a `doc_url` that deep-links to the
     * relevant section of the Chat Health guide. To gate a send, act on the response
     * rather than the status: a `403` is the authoritative answer.
     *
     * See the [Chat Health guide](/guides/chats/chat-health) for what each status
     * means and how to react.
     */
    export interface HealthStatus {
      /**
       * Deep-link to the relevant section of the Chat Health guide for this status.
       */
      doc_url: string;

      /**
       * Current health bucket for the chat. See the
       * [Chat Health guide](/guides/chats/chat-health) for what each value means and how
       * to react. `doc_url` deep-links to the relevant section.
       *
       * `OPTED_OUT` — the recipient sent `STOP`, `UNSUBSCRIBE`, `OPTOUT`, `CANCEL`,
       * `END`, or `QUIT`. The keyword must be the whole trimmed message, never part of a
       * longer one: `STOP` counts, `please stop` does not. Most keywords must match
       * exactly, including case. `OPT OUT` is the exception — it matches in any casing,
       * with or without the space or a hyphen, so `opt out`, `Opt-Out` and `optout` all
       * count. It clears as soon as they reply again: any later message from them that
       * is not itself an opt-out keyword opts them back in immediately — a reply in any
       * conversation with you counts, the same way the block does.
       *
       * `OPTED_OUT` marks only the conversation the keyword arrived in. The block below
       * is wider than the mark, so a conversation still reading `HEALTHY` can be blocked
       * as well — gate on the `403`, not on the status. Group threads are never marked
       * and are never blocked.
       *
       * Linq enforces this: while a recipient is opted out, every send to them is
       * rejected with `403` (error code `2024`) before the message is queued, across
       * every chat and every line on your account. Nothing is delivered, including a
       * final courtesy message — to send one, set `override_optout: true` on that single
       * request.
       */
      status: 'HEALTHY' | 'AT_RISK' | 'CRITICAL' | 'OPTED_OUT';

      /**
       * When this status last changed.
       */
      updated_at: string;
    }
  }
}

export interface ChatUpdateResponse {
  chat_id?: string;

  status?: string;
}

export interface ChatLeaveChatResponse {
  message?: string;

  status?: string;

  trace_id?: string;
}

/**
 * Response for sending a voice memo to a chat
 */
export interface ChatSendVoicememoResponse {
  voice_memo: ChatSendVoicememoResponse.VoiceMemo;
}

export namespace ChatSendVoicememoResponse {
  export interface VoiceMemo {
    /**
     * Message identifier
     */
    id: string;

    chat: VoiceMemo.Chat;

    /**
     * When the voice memo was created
     */
    created_at: string;

    /**
     * Sender phone number
     */
    from: string;

    /**
     * Current delivery status
     */
    status: string;

    /**
     * Recipient handles (phone numbers or email addresses)
     */
    to: Array<string>;

    voice_memo: VoiceMemo.VoiceMemo;

    /**
     * Messaging service type
     */
    service?: Shared.ServiceType | null;
  }

  export namespace VoiceMemo {
    export interface Chat {
      /**
       * Chat identifier
       */
      id: string;

      /**
       * Chat participants
       */
      handles: Array<Shared.ChatHandle>;

      /**
       * Whether the chat is active
       */
      is_active: boolean;

      /**
       * Whether this is a group chat
       */
      is_group: boolean;

      /**
       * Messaging service type
       */
      service: Shared.ServiceType;
    }

    export interface VoiceMemo {
      /**
       * Attachment identifier
       */
      id: string;

      /**
       * Original filename
       */
      filename: string;

      /**
       * Audio MIME type
       */
      mime_type: string;

      /**
       * File size in bytes
       */
      size_bytes: number;

      /**
       * CDN URL for downloading the voice memo
       */
      url: string;

      /**
       * Duration in milliseconds
       */
      duration_ms?: number | null;
    }
  }
}

export interface ChatCreateParams {
  /**
   * Sender phone number in E.164 format. Must be a phone number that the
   * authenticated partner has permission to send from.
   */
  from: string;

  /**
   * Message content container. Groups all message-related fields together,
   * separating the "what" (message content) from the "where" (routing fields like
   * from/to).
   *
   * A message carries EITHER `parts` — text and attachments, which compose into one
   * bubble — or a single `experience` invocation, which renders an experience inside
   * Linq's iMessage app. Never both: an app card is the whole message (Apple's
   * `MSMessage` cannot coexist with text), so copy and a card are two sends, not
   * one.
   */
  message: MessageContent;

  /**
   * Array of recipient handles (phone numbers in E.164 format or email addresses).
   * For individual chats, provide one recipient. For group chats, provide multiple.
   */
  to: Array<string>;

  /**
   * Send even though the recipient asked you to stop (`403`, error code `2024`).
   * Applies to this request only: the opt-out stays in place, so the next send
   * without this flag is rejected again. Every override is recorded against your API
   * key.
   */
  override_optout?: boolean;
}

export interface ChatUpdateParams {
  /**
   * New display name for the chat (group chats only)
   */
  display_name?: string;

  /**
   * URL of an image to set as the group chat icon (group chats only)
   */
  group_chat_icon?: string;
}

export interface ChatListChatsParams extends ListChatsPaginationParams {
  /**
   * Phone number to filter chats by. Returns chats made from this phone number. Must
   * be in E.164 format (e.g., `+13343284472`). The `+` is automatically URL-encoded
   * by HTTP clients. If omitted, returns chats across all phone numbers owned by the
   * partner.
   */
  from?: string;

  /**
   * Filter chats by a participant handle. Only returns chats where this handle is a
   * participant. Can be an E.164 phone number (e.g., `+13343284472`) or an email
   * address (e.g., `user@example.com`). For phone numbers, the `+` is automatically
   * URL-encoded by HTTP clients.
   */
  to?: string;
}

export interface ChatSendVoicememoParams {
  /**
   * Reference to a voice memo file pre-uploaded via `POST /v3/attachments`. The file
   * is already stored, so sends using this ID skip the download step.
   *
   * Either `voice_memo_url` or `attachment_id` must be provided, but not both.
   */
  attachment_id?: string;

  /**
   * Send even though the recipient asked you to stop (`403`, error code `2024`).
   * Applies to this request only: the opt-out stays in place, so the next send
   * without this flag is rejected again. Every override is recorded against your API
   * key.
   */
  override_optout?: boolean;

  /**
   * URL of the voice memo audio file. Must be a publicly accessible HTTPS URL.
   *
   * Either `voice_memo_url` or `attachment_id` must be provided, but not both.
   */
  voice_memo_url?: string;
}

Chats.Participants = Participants;
Chats.Typing = Typing;
Chats.Messages = Messages;
Chats.Location = Location;
Chats.Polls = Polls;
Chats.Background = Background;

export declare namespace Chats {
  export {
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
    Participants as Participants,
    type ParticipantAddResponse as ParticipantAddResponse,
    type ParticipantRemoveResponse as ParticipantRemoveResponse,
    type ParticipantAddParams as ParticipantAddParams,
    type ParticipantRemoveParams as ParticipantRemoveParams,
  };

  export { Typing as Typing };

  export {
    Messages as Messages,
    type SentMessage as SentMessage,
    type MessageSendResponse as MessageSendResponse,
    type MessageListParams as MessageListParams,
    type MessageSendParams as MessageSendParams,
  };

  export {
    Location as Location,
    type GetChatLocationResponse as GetChatLocationResponse,
    type LocationRequestResponse as LocationRequestResponse,
  };

  export {
    Polls as Polls,
    type Poll as Poll,
    type PollEnvelope as PollEnvelope,
    type PollCreateParams as PollCreateParams,
  };

  export { Background as Background, type BackgroundSetParams as BackgroundSetParams };
}
