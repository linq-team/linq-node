// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import * as MessagesAPI from './messages';

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
  reactions: Array<MessagesAPI.Reaction> | null;

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

/**
 * Messaging service type
 */
export type ServiceType = 'iMessage' | 'SMS' | 'RCS';

/**
 * A text message part
 */
export interface TextPartResponse {
  /**
   * Reactions on this message part
   */
  reactions: Array<MessagesAPI.Reaction> | null;

  /**
   * Indicates this is a text message part
   */
  type: 'text';

  /**
   * The text content
   */
  value: string;
}
