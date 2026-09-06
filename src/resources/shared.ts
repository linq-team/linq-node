// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

export interface ChatHandle {
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
   * Messaging service type
   */
  service: ServiceType;

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
 * A rich link preview part
 */
export interface LinkPartResponse {
  /**
   * Reactions on this message part
   */
  reactions: Array<Reaction> | null;

  /**
   * Indicates this is a rich link preview part
   */
  type: 'link';

  /**
   * The URL
   */
  value: string;
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
  reactions: Array<Reaction> | null;

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

export interface Reaction {
  handle: ChatHandle;

  /**
   * Whether this reaction is from the current user
   */
  is_me: boolean;

  /**
   * Type of reaction. Standard iMessage tapbacks are love, like, dislike, laugh,
   * emphasize, question. Custom emoji reactions have type "custom" with the actual
   * emoji in the custom_emoji field. Sticker reactions have type "sticker" with
   * sticker attachment details in the sticker field.
   */
  type: ReactionType;

  /**
   * Identifier for this reaction. Pass it to
   * `PATCH /v3/messages/{messageId}/reactions/{reactionId}` to move a sticker.
   *
   * Stickers placed before this API shipped can be read but not moved: the
   * device-side reference needed to reposition them was never recorded, so `PATCH`
   * returns 404 for those.
   */
  id?: string;

  /**
   * Custom emoji if type is "custom", null otherwise
   */
  custom_emoji?: string | null;

  /**
   * Sticker attachment details when reaction_type is "sticker". Null for non-sticker
   * reactions.
   */
  sticker?: Reaction.Sticker | null;
}

export namespace Reaction {
  /**
   * Sticker attachment details when reaction_type is "sticker". Null for non-sticker
   * reactions.
   */
  export interface Sticker {
    /**
     * Filename of the sticker
     */
    file_name?: string;

    /**
     * Sticker image height in pixels
     */
    height?: number;

    /**
     * MIME type of the sticker image
     */
    mime_type?: string;

    /**
     * Presigned URL for downloading the sticker image (expires in 1 hour).
     */
    url?: string;

    /**
     * Sticker image width in pixels
     */
    width?: number;
  }
}

/**
 * Type of reaction. Standard iMessage tapbacks are love, like, dislike, laugh,
 * emphasize, question. Custom emoji reactions have type "custom" with the actual
 * emoji in the custom_emoji field. Sticker reactions have type "sticker" with
 * sticker attachment details in the sticker field.
 */
export type ReactionType =
  | 'love'
  | 'like'
  | 'dislike'
  | 'laugh'
  | 'emphasize'
  | 'question'
  | 'custom'
  | 'sticker';

/**
 * Messaging service type
 */
export type ServiceType = 'iMessage' | 'SMS' | 'RCS';

export interface TextDecoration {
  /**
   * Character range `[start, end)` in the `value` string where the decoration
   * applies. `start` is inclusive, `end` is exclusive. _Characters are measured as
   * UTF-16 code units. Most characters count as 1; some emoji count as 2._
   */
  range: Array<number>;

  /**
   * Animated text effect to apply. Mutually exclusive with `style`.
   */
  animation?: 'big' | 'small' | 'shake' | 'nod' | 'explode' | 'ripple' | 'bloom' | 'jitter';

  /**
   * Text style to apply. Mutually exclusive with `animation`.
   */
  style?: 'bold' | 'italic' | 'strikethrough' | 'underline';
}

/**
 * A text message part
 */
export interface TextPartResponse {
  /**
   * Reactions on this message part
   */
  reactions: Array<Reaction> | null;

  /**
   * Indicates this is a text message part
   */
  type: 'text';

  /**
   * The text content
   */
  value: string;

  /**
   * @deprecated DEPRECATED: Use `mentions` instead. Handle (E.164 phone number or
   * Apple ID email) of the **first** mention on this part. A part may carry several
   * mentions; this field shows only the first in `value` order, so it cannot be used
   * to determine whether a given participant was mentioned. `null` when the part
   * carries no mention.
   */
  mention?: string | null;

  /**
   * @deprecated DEPRECATED: Use `mentions[].range` instead. Character range
   * `[start, end)` in `value` highlighted as the **first** mention only. `null` when
   * the range was omitted (the whole `value` is highlighted) or the part carries no
   * mention. _Characters are measured as UTF-16 code units. Most characters count as
   * 1; some emoji count as 2._
   */
  mention_range?: Array<number> | null;

  /**
   * Every mention on this part, in the order they appear in `value`. `null` when the
   * part carries no mention. A part can carry several mentions of different people —
   * check `is_me` to tell whether this line was one of them.
   *
   * Only iMessage carries mentions. On a received message this is populated when the
   * sender was on iMessage; SMS and RCS have no way to mark a mention, so a message
   * from an SMS or RCS participant arrives as plain text with `mentions` null, even
   * in a group where other participants are on iMessage.
   */
  mentions?: Array<TextPartResponse.Mention> | null;

  /**
   * Text decorations applied to character ranges in the value
   */
  text_decorations?: Array<TextDecoration> | null;
}

export namespace TextPartResponse {
  /**
   * One mention on a text part — who was mentioned, and which characters of `value`
   * are the mention. A part carries one of these per mention, in the order they
   * appear in the text, so a message naming two people has two entries.
   */
  export interface Mention {
    /**
     * Address of the mentioned participant, exactly as the device recorded it — an
     * E.164 phone number or an email address.
     */
    handle: string;

    /**
     * Whether the mentioned participant is this line.
     */
    is_me: boolean;

    /**
     * Character range `[start, end)` in `value` highlighted as this mention.
     * _Characters are measured as UTF-16 code units. Most characters count as 1; some
     * emoji count as 2._
     */
    range: Array<number>;
  }
}
