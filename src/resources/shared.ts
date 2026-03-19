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
   * Text decorations applied to character ranges in the value
   */
  text_decorations?: Array<TextDecoration> | null;
}
