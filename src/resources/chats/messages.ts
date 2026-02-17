// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Messages extends APIResource {
  /**
   * Retrieve messages from a specific chat with pagination support.
   *
   * @example
   * ```ts
   * const messages = await client.chats.messages.list(
   *   '550e8400-e29b-41d4-a716-446655440000',
   * );
   * ```
   */
  list(
    chatID: string,
    query: MessageListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<MessageListResponse> {
    return this._client.get(path`/v3/chats/${chatID}/messages`, { query, ...options });
  }

  /**
   * Send a message to an existing chat. Use this endpoint when you already have a
   * chat ID and want to send additional messages to it.
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
   * const response = await client.chats.messages.send(
   *   '550e8400-e29b-41d4-a716-446655440000',
   *   {
   *     message: {
   *       parts: [{ type: 'text', value: 'Hello, world!' }],
   *     },
   *   },
   * );
   * ```
   */
  send(chatID: string, body: MessageSendParams, options?: RequestOptions): APIPromise<MessageSendResponse> {
    return this._client.post(path`/v3/chats/${chatID}/messages`, { body, ...options });
  }
}

export interface MessageListResponse {
  /**
   * List of messages
   */
  messages: Array<MessageListResponse.Message>;

  /**
   * Cursor for fetching the next page of results. Null if there are no more results
   * to fetch. Pass this value as the `cursor` parameter in the next request.
   */
  next_cursor?: string | null;
}

export namespace MessageListResponse {
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
     * Whether the message has been delivered
     */
    is_delivered: boolean;

    /**
     * Whether this message was sent by the authenticated user
     */
    is_from_me: boolean;

    /**
     * Whether the message has been read
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
    effect?: Message.Effect | null;

    /**
     * @deprecated DEPRECATED: Use from_handle instead. Phone number of the message
     * sender.
     */
    from?: string | null;

    /**
     * The sender of this message as a full handle object
     */
    from_handle?: Message.FromHandle | null;

    /**
     * Message parts in order (text and media)
     */
    parts?: Array<Message.TextPartResponse | Message.MediaPartResponse> | null;

    /**
     * Preferred service for sending this message
     */
    preferred_service?: 'iMessage' | 'SMS' | 'RCS' | null;

    /**
     * When the message was read
     */
    read_at?: string | null;

    /**
     * Indicates this message is a threaded reply to another message
     */
    reply_to?: Message.ReplyTo | null;

    /**
     * When the message was sent
     */
    sent_at?: string | null;

    /**
     * Service used to send/receive this message
     */
    service?: 'iMessage' | 'SMS' | 'RCS' | null;
  }

  export namespace Message {
    /**
     * iMessage effect applied to a message (screen or bubble effect)
     */
    export interface Effect {
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
     * The sender of this message as a full handle object
     */
    export interface FromHandle {
      /**
       * Unique identifier for this handle
       */
      id: string;

      /**
       * Phone number (E.164) or email address of the participant
       */
      handle: string;

      /**
       * When this participant joined the chat
       */
      joined_at: string;

      /**
       * Service type (iMessage, SMS, RCS, etc.)
       */
      service: 'iMessage' | 'SMS' | 'RCS';

      /**
       * Whether this handle belongs to the sender (your phone number)
       */
      is_me?: boolean | null;

      /**
       * When they left (if applicable)
       */
      left_at?: string | null;

      /**
       * Participant status
       */
      status?: 'active' | 'left' | 'removed' | null;
    }

    /**
     * A text message part
     */
    export interface TextPartResponse {
      /**
       * Reactions on this message part
       */
      reactions: Array<TextPartResponse.Reaction> | null;

      /**
       * Indicates this is a text message part
       */
      type: 'text';

      /**
       * The text content
       */
      value: string;
    }

    export namespace TextPartResponse {
      export interface Reaction {
        handle: Reaction.Handle;

        /**
         * Whether this reaction is from the current user
         */
        is_me: boolean;

        /**
         * Type of reaction. Standard iMessage tapbacks are love, like, dislike, laugh,
         * emphasize, question. Custom emoji reactions have type "custom" with the actual
         * emoji in the custom_emoji field.
         */
        type: 'love' | 'like' | 'dislike' | 'laugh' | 'emphasize' | 'question' | 'custom';

        /**
         * Custom emoji if type is "custom", null otherwise
         */
        custom_emoji?: string | null;
      }

      export namespace Reaction {
        export interface Handle {
          /**
           * Unique identifier for this handle
           */
          id: string;

          /**
           * Phone number (E.164) or email address of the participant
           */
          handle: string;

          /**
           * When this participant joined the chat
           */
          joined_at: string;

          /**
           * Service type (iMessage, SMS, RCS, etc.)
           */
          service: 'iMessage' | 'SMS' | 'RCS';

          /**
           * Whether this handle belongs to the sender (your phone number)
           */
          is_me?: boolean | null;

          /**
           * When they left (if applicable)
           */
          left_at?: string | null;

          /**
           * Participant status
           */
          status?: 'active' | 'left' | 'removed' | null;
        }
      }
    }

    /**
     * A media attachment part
     */
    export interface MediaPartResponse {
      /**
       * Unique attachment identifier
       */
      id: string;

      /**
       * Original filename
       */
      filename: string;

      /**
       * MIME type of the file
       */
      mime_type: string;

      /**
       * Reactions on this message part
       */
      reactions: Array<MediaPartResponse.Reaction> | null;

      /**
       * File size in bytes
       */
      size_bytes: number;

      /**
       * Indicates this is a media attachment part
       */
      type: 'media';

      /**
       * Presigned URL for downloading the attachment (expires in 1 hour).
       */
      url: string;
    }

    export namespace MediaPartResponse {
      export interface Reaction {
        handle: Reaction.Handle;

        /**
         * Whether this reaction is from the current user
         */
        is_me: boolean;

        /**
         * Type of reaction. Standard iMessage tapbacks are love, like, dislike, laugh,
         * emphasize, question. Custom emoji reactions have type "custom" with the actual
         * emoji in the custom_emoji field.
         */
        type: 'love' | 'like' | 'dislike' | 'laugh' | 'emphasize' | 'question' | 'custom';

        /**
         * Custom emoji if type is "custom", null otherwise
         */
        custom_emoji?: string | null;
      }

      export namespace Reaction {
        export interface Handle {
          /**
           * Unique identifier for this handle
           */
          id: string;

          /**
           * Phone number (E.164) or email address of the participant
           */
          handle: string;

          /**
           * When this participant joined the chat
           */
          joined_at: string;

          /**
           * Service type (iMessage, SMS, RCS, etc.)
           */
          service: 'iMessage' | 'SMS' | 'RCS';

          /**
           * Whether this handle belongs to the sender (your phone number)
           */
          is_me?: boolean | null;

          /**
           * When they left (if applicable)
           */
          left_at?: string | null;

          /**
           * Participant status
           */
          status?: 'active' | 'left' | 'removed' | null;
        }
      }
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
  }
}

/**
 * Response for sending a message to a chat
 */
export interface MessageSendResponse {
  /**
   * Unique identifier of the chat this message was sent to
   */
  chat_id: string;

  /**
   * A message that was sent (used in CreateChat and SendMessage responses)
   */
  message: MessageSendResponse.Message;
}

export namespace MessageSendResponse {
  /**
   * A message that was sent (used in CreateChat and SendMessage responses)
   */
  export interface Message {
    /**
     * Message identifier (UUID)
     */
    id: string;

    /**
     * Current delivery status of a message
     */
    delivery_status: 'pending' | 'queued' | 'sent' | 'delivered' | 'failed';

    /**
     * Whether the message has been read
     */
    is_read: boolean;

    /**
     * Message parts in order (text and media)
     */
    parts: Array<Message.TextPartResponse | Message.MediaPartResponse>;

    /**
     * When the message was sent
     */
    sent_at: string;

    /**
     * When the message was delivered
     */
    delivered_at?: string | null;

    /**
     * iMessage effect applied to a message (screen or bubble effect)
     */
    effect?: Message.Effect | null;

    /**
     * The sender of this message as a full handle object
     */
    from_handle?: Message.FromHandle | null;

    /**
     * Preferred service for sending this message
     */
    preferred_service?: 'iMessage' | 'SMS' | 'RCS' | null;

    /**
     * Indicates this message is a threaded reply to another message
     */
    reply_to?: Message.ReplyTo | null;

    /**
     * Service used to send this message
     */
    service?: 'iMessage' | 'SMS' | 'RCS' | null;
  }

  export namespace Message {
    /**
     * A text message part
     */
    export interface TextPartResponse {
      /**
       * Reactions on this message part
       */
      reactions: Array<TextPartResponse.Reaction> | null;

      /**
       * Indicates this is a text message part
       */
      type: 'text';

      /**
       * The text content
       */
      value: string;
    }

    export namespace TextPartResponse {
      export interface Reaction {
        handle: Reaction.Handle;

        /**
         * Whether this reaction is from the current user
         */
        is_me: boolean;

        /**
         * Type of reaction. Standard iMessage tapbacks are love, like, dislike, laugh,
         * emphasize, question. Custom emoji reactions have type "custom" with the actual
         * emoji in the custom_emoji field.
         */
        type: 'love' | 'like' | 'dislike' | 'laugh' | 'emphasize' | 'question' | 'custom';

        /**
         * Custom emoji if type is "custom", null otherwise
         */
        custom_emoji?: string | null;
      }

      export namespace Reaction {
        export interface Handle {
          /**
           * Unique identifier for this handle
           */
          id: string;

          /**
           * Phone number (E.164) or email address of the participant
           */
          handle: string;

          /**
           * When this participant joined the chat
           */
          joined_at: string;

          /**
           * Service type (iMessage, SMS, RCS, etc.)
           */
          service: 'iMessage' | 'SMS' | 'RCS';

          /**
           * Whether this handle belongs to the sender (your phone number)
           */
          is_me?: boolean | null;

          /**
           * When they left (if applicable)
           */
          left_at?: string | null;

          /**
           * Participant status
           */
          status?: 'active' | 'left' | 'removed' | null;
        }
      }
    }

    /**
     * A media attachment part
     */
    export interface MediaPartResponse {
      /**
       * Unique attachment identifier
       */
      id: string;

      /**
       * Original filename
       */
      filename: string;

      /**
       * MIME type of the file
       */
      mime_type: string;

      /**
       * Reactions on this message part
       */
      reactions: Array<MediaPartResponse.Reaction> | null;

      /**
       * File size in bytes
       */
      size_bytes: number;

      /**
       * Indicates this is a media attachment part
       */
      type: 'media';

      /**
       * Presigned URL for downloading the attachment (expires in 1 hour).
       */
      url: string;
    }

    export namespace MediaPartResponse {
      export interface Reaction {
        handle: Reaction.Handle;

        /**
         * Whether this reaction is from the current user
         */
        is_me: boolean;

        /**
         * Type of reaction. Standard iMessage tapbacks are love, like, dislike, laugh,
         * emphasize, question. Custom emoji reactions have type "custom" with the actual
         * emoji in the custom_emoji field.
         */
        type: 'love' | 'like' | 'dislike' | 'laugh' | 'emphasize' | 'question' | 'custom';

        /**
         * Custom emoji if type is "custom", null otherwise
         */
        custom_emoji?: string | null;
      }

      export namespace Reaction {
        export interface Handle {
          /**
           * Unique identifier for this handle
           */
          id: string;

          /**
           * Phone number (E.164) or email address of the participant
           */
          handle: string;

          /**
           * When this participant joined the chat
           */
          joined_at: string;

          /**
           * Service type (iMessage, SMS, RCS, etc.)
           */
          service: 'iMessage' | 'SMS' | 'RCS';

          /**
           * Whether this handle belongs to the sender (your phone number)
           */
          is_me?: boolean | null;

          /**
           * When they left (if applicable)
           */
          left_at?: string | null;

          /**
           * Participant status
           */
          status?: 'active' | 'left' | 'removed' | null;
        }
      }
    }

    /**
     * iMessage effect applied to a message (screen or bubble effect)
     */
    export interface Effect {
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
     * The sender of this message as a full handle object
     */
    export interface FromHandle {
      /**
       * Unique identifier for this handle
       */
      id: string;

      /**
       * Phone number (E.164) or email address of the participant
       */
      handle: string;

      /**
       * When this participant joined the chat
       */
      joined_at: string;

      /**
       * Service type (iMessage, SMS, RCS, etc.)
       */
      service: 'iMessage' | 'SMS' | 'RCS';

      /**
       * Whether this handle belongs to the sender (your phone number)
       */
      is_me?: boolean | null;

      /**
       * When they left (if applicable)
       */
      left_at?: string | null;

      /**
       * Participant status
       */
      status?: 'active' | 'left' | 'removed' | null;
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
  }
}

export interface MessageListParams {
  /**
   * Pagination cursor from previous next_cursor response
   */
  cursor?: string;

  /**
   * Maximum number of messages to return
   */
  limit?: number;
}

export interface MessageSendParams {
  /**
   * Message content container. Groups all message-related fields together,
   * separating the "what" (message content) from the "where" (routing fields like
   * from/to).
   */
  message: MessageSendParams.Message;
}

export namespace MessageSendParams {
  /**
   * Message content container. Groups all message-related fields together,
   * separating the "what" (message content) from the "where" (routing fields like
   * from/to).
   */
  export interface Message {
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
     * **Validation Rule:** Consecutive text parts are not allowed. Text parts must be
     * separated by media parts. For example, [text, text] is invalid, but [text,
     * media, text] is valid.
     */
    parts: Array<Message.TextPart | Message.MediaPart>;

    /**
     * iMessage effect to apply to this message (screen or bubble effect)
     */
    effect?: Message.Effect;

    /**
     * Optional idempotency key for this message. Use this to prevent duplicate sends
     * of the same message.
     */
    idempotency_key?: string;

    /**
     * Preferred messaging service to use for this message. If not specified, uses
     * default fallback chain: iMessage → RCS → SMS.
     *
     * - iMessage: Enforces iMessage without fallback to RCS or SMS. Message fails if
     *   recipient doesn't support iMessage.
     * - RCS: Enforces RCS or SMS (no iMessage). Uses RCS if recipient supports it,
     *   otherwise falls back to SMS.
     * - SMS: Enforces SMS (no iMessage). Uses RCS if recipient supports it, otherwise
     *   falls back to SMS.
     */
    preferred_service?: 'iMessage' | 'RCS' | 'SMS';

    /**
     * Reply to another message to create a threaded conversation
     */
    reply_to?: Message.ReplyTo;
  }

  export namespace Message {
    export interface TextPart {
      /**
       * Indicates this is a text message part
       */
      type: 'text';

      /**
       * The text content
       */
      value: string;

      /**
       * Optional idempotency key for this specific message part. Use this to prevent
       * duplicate sends of the same part.
       */
      idempotency_key?: string;
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
       * Optional idempotency key for this specific message part. Use this to prevent
       * duplicate sends of the same part.
       */
      idempotency_key?: string;

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
     * iMessage effect to apply to this message (screen or bubble effect)
     */
    export interface Effect {
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
     * Reply to another message to create a threaded conversation
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
  }
}

export declare namespace Messages {
  export {
    type MessageListResponse as MessageListResponse,
    type MessageSendResponse as MessageSendResponse,
    type MessageListParams as MessageListParams,
    type MessageSendParams as MessageSendParams,
  };
}
