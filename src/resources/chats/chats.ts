// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as MessagesAPI from '../messages';
import * as Shared from '../shared';
import * as ChatsMessagesAPI from './messages';
import { MessageListParams, MessageSendParams, MessageSendResponse, Messages, SentMessage } from './messages';
import * as ParticipantsAPI from './participants';
import {
  ParticipantAddParams,
  ParticipantAddResponse,
  ParticipantRemoveParams,
  ParticipantRemoveResponse,
  Participants,
} from './participants';
import * as TypingAPI from './typing';
import { Typing } from './typing';
import { APIPromise } from '../../core/api-promise';
import { ListChatsPagination, type ListChatsPaginationParams, PagePromise } from '../../core/pagination';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Chats extends APIResource {
  participants: ParticipantsAPI.Participants = new ParticipantsAPI.Participants(this._client);
  typing: TypingAPI.Typing = new TypingAPI.Typing(this._client);
  messages: ChatsMessagesAPI.Messages = new ChatsMessagesAPI.Messages(this._client);

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
   * @example
   * ```ts
   * const chat = await client.chats.update(
   *   '550e8400-e29b-41d4-a716-446655440000',
   *   { display_name: 'Team Discussion' },
   * );
   * ```
   */
  update(chatID: string, body: ChatUpdateParams, options?: RequestOptions): APIPromise<Chat> {
    return this._client.put(path`/v3/chats/${chatID}`, { body, ...options });
  }

  /**
   * Retrieves a paginated list of chats for the authenticated partner filtered by
   * phone number. Returns all chats involving the specified phone number with their
   * participants and recent activity.
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
   * for await (const chat of client.chats.listChats({
   *   from: '+13343284472',
   * })) {
   *   // ...
   * }
   * ```
   */
  listChats(
    query: ChatListChatsParams,
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
   *   {
   *     from: '+12052535597',
   *     voice_memo_url: 'https://example.com/voice-memo.m4a',
   *   },
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
   * **Deprecated:** Use `POST /v3/my_cards/{chatId}/share` instead.
   *
   * Share your contact information (Name and Photo Sharing) with a chat.
   *
   * **Note:** A contact card must be configured before sharing. You can set up your
   * contact card on the
   * [Linq dashboard](https://dashboard.linqapp.com/contact-cards).
   *
   * @deprecated
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
   * Whether the chat is archived
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
   * Messaging service type
   */
  service?: Shared.ServiceType | null;
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
 */
export interface MessageContent {
  /**
   * Array of message parts. Each part can be either text or media. Parts are
   * displayed in order. Text and media can be mixed.
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
   * - Consecutive text parts are not allowed. Text parts must be separated by media
   *   parts. For example, [text, text] is invalid, but [text, media, text] is valid.
   * - Maximum of **100 parts** total.
   * - Media parts using a public `url` (downloaded by the server on send) are capped
   *   at **40**. Parts using `attachment_id` or presigned URLs are exempt from this
   *   sub-limit. For bulk media sends exceeding 40 files, pre-upload via
   *   `POST /v3/attachments` and reference by `attachment_id` or `download_url`.
   */
  parts: Array<TextPart | MediaPart>;

  /**
   * iMessage effect to apply to this message (screen or bubble effect)
   */
  effect?: MessagesAPI.MessageEffect;

  /**
   * Optional idempotency key for this message. Use this to prevent duplicate sends
   * of the same message.
   */
  idempotency_key?: string;

  /**
   * Messaging service type
   */
  preferred_service?: Shared.ServiceType;

  /**
   * Reply to another message to create a threaded conversation
   */
  reply_to?: MessagesAPI.ReplyTo;
}

export interface TextPart {
  /**
   * Indicates this is a text message part
   */
  type: 'text';

  /**
   * The text content
   */
  value: string;
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
     * Whether this is a group chat
     */
    is_group: boolean;

    /**
     * A message that was sent (used in CreateChat and SendMessage responses)
     */
    message: ChatsMessagesAPI.SentMessage;

    /**
     * Messaging service type
     */
    service: Shared.ServiceType;
  }
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
   */
  message: MessageContent;

  /**
   * Array of recipient handles (phone numbers in E.164 format or email addresses).
   * For individual chats, provide one recipient. For group chats, provide multiple.
   */
  to: Array<string>;
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
   * Phone number to filter chats by. Returns all chats made from this phone number.
   * Must be in E.164 format (e.g., `+13343284472`). The `+` is automatically
   * URL-encoded by HTTP clients.
   */
  from: string;
}

export interface ChatSendVoicememoParams {
  /**
   * Sender phone number in E.164 format
   */
  from: string;

  /**
   * URL of the voice memo audio file. Must be a publicly accessible HTTPS URL.
   */
  voice_memo_url: string;
}

Chats.Participants = Participants;
Chats.Typing = Typing;
Chats.Messages = Messages;

export declare namespace Chats {
  export {
    type Chat as Chat,
    type MediaPart as MediaPart,
    type MessageContent as MessageContent,
    type TextPart as TextPart,
    type ChatCreateResponse as ChatCreateResponse,
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
}
