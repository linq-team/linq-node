// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Attachments extends APIResource {
  /**
   * **This endpoint is optional.** You can send media by simply providing a URL in
   * your message's media part — no pre-upload required. Use this endpoint only when
   * you want to upload a file ahead of time for reuse or latency optimization.
   *
   * Returns a presigned upload URL and a permanent `attachment_id` you can reference
   * in future messages.
   *
   * ## Step 1: Request an upload URL
   *
   * Call this endpoint with file metadata:
   *
   * ```json
   * POST /v3/attachments
   * {
   *   "filename": "photo.jpg",
   *   "content_type": "image/jpeg",
   *   "size_bytes": 1024000
   * }
   * ```
   *
   * The response includes an `upload_url` (valid for 15 minutes) and a permanent
   * `attachment_id`.
   *
   * ## Step 2: Upload the file
   *
   * Make a PUT request to the `upload_url` with the raw file bytes as the request
   * body.. Include the headers from `required_headers`. The request body is the
   * binary file content — **not** JSON, **not** multipart form data.
   *
   * ```bash
   * curl -X PUT "<upload_url from step 1>" \
   *   -H "Content-Type: image/jpeg" \
   *   --data-binary @filebytes
   * ```
   *
   * ## Step 3: Send a message with the attachment
   *
   * Reference the `attachment_id` in a media part. The ID never expires — use it in
   * as many messages as you want.
   *
   * ```json
   * POST /v3/messages
   * {
   *   "to": ["+15551234567"],
   *   "from": "+15559876543",
   *   "parts": [
   *     { "type": "media", "attachment_id": "<attachment_id from step 1>" }
   *   ]
   * }
   * ```
   *
   * ## When to use this instead of a URL in the media part
   *
   * - Sending the same file to multiple recipients (avoids re-downloading each time)
   * - Large files where you want to separate upload from message send
   * - Latency-sensitive sends where the file should already be stored
   *
   * If you just need to send a file once, skip all of this and pass a `url` directly
   * in the media part instead.
   *
   * **File Size Limit:** 100MB
   *
   * **Unsupported Types:** WebP, SVG, FLAC, OGG, and executable files are explicitly
   * rejected.
   *
   * @example
   * ```ts
   * const attachment = await client.attachments.create({
   *   content_type: 'image/jpeg',
   *   filename: 'photo.jpg',
   *   size_bytes: 1024000,
   * });
   * ```
   */
  create(body: AttachmentCreateParams, options?: RequestOptions): APIPromise<AttachmentCreateResponse> {
    return this._client.post('/v3/attachments', { body, ...options });
  }

  /**
   * Retrieve metadata for a specific attachment including its status, file
   * information, and URLs for downloading.
   *
   * @example
   * ```ts
   * const attachment = await client.attachments.retrieve(
   *   'abc12345-1234-5678-9abc-def012345678',
   * );
   * ```
   */
  retrieve(attachmentID: string, options?: RequestOptions): APIPromise<AttachmentRetrieveResponse> {
    return this._client.get(path`/v3/attachments/${attachmentID}`, options);
  }
}

/**
 * Supported MIME types for file attachments and media URLs.
 *
 * **Images:** image/jpeg, image/png, image/gif, image/heic, image/heif,
 * image/tiff, image/bmp
 *
 * **Videos:** video/mp4, video/quicktime, video/mpeg, video/3gpp
 *
 * **Audio:** audio/mpeg, audio/mp4, audio/x-m4a, audio/x-caf, audio/wav,
 * audio/aiff, audio/aac, audio/amr
 *
 * **Documents:** application/pdf, text/plain, text/vcard, text/rtf, text/csv,
 * text/html, text/calendar, application/msword,
 * application/vnd.openxmlformats-officedocument.wordprocessingml.document,
 * application/vnd.ms-excel,
 * application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
 * application/vnd.ms-powerpoint,
 * application/vnd.openxmlformats-officedocument.presentationml.presentation,
 * application/vnd.apple.pages, application/vnd.apple.numbers,
 * application/vnd.apple.keynote, application/epub+zip, application/zip
 *
 * **Unsupported:** WebP, SVG, FLAC, OGG, and executable files are explicitly
 * rejected.
 */
export type SupportedContentType =
  | 'image/jpeg'
  | 'image/jpg'
  | 'image/png'
  | 'image/gif'
  | 'image/heic'
  | 'image/heif'
  | 'image/tiff'
  | 'image/bmp'
  | 'image/x-ms-bmp'
  | 'video/mp4'
  | 'video/quicktime'
  | 'video/mpeg'
  | 'video/x-m4v'
  | 'video/3gpp'
  | 'audio/mpeg'
  | 'audio/mp3'
  | 'audio/mp4'
  | 'audio/x-m4a'
  | 'audio/m4a'
  | 'audio/x-caf'
  | 'audio/wav'
  | 'audio/x-wav'
  | 'audio/aiff'
  | 'audio/x-aiff'
  | 'audio/aac'
  | 'audio/x-aac'
  | 'audio/amr'
  | 'application/pdf'
  | 'text/plain'
  | 'text/vcard'
  | 'text/x-vcard'
  | 'text/rtf'
  | 'application/rtf'
  | 'text/csv'
  | 'text/html'
  | 'text/calendar'
  | 'application/msword'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  | 'application/vnd.ms-excel'
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  | 'application/vnd.ms-powerpoint'
  | 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  | 'application/vnd.apple.pages'
  | 'application/x-iwork-pages-sffpages'
  | 'application/vnd.apple.numbers'
  | 'application/x-iwork-numbers-sffnumbers'
  | 'application/vnd.apple.keynote'
  | 'application/x-iwork-keynote-sffkey'
  | 'application/epub+zip'
  | 'application/zip'
  | 'application/x-zip-compressed';

export interface AttachmentCreateResponse {
  /**
   * Unique identifier for the attachment (for status checks via GET
   * /v3/attachments/{id})
   */
  attachment_id: string;

  /**
   * Permanent CDN URL for the file. Does not expire. Use the `attachment_id` to
   * reference this file in media parts when sending messages.
   */
  download_url: string;

  /**
   * When the upload URL expires (15 minutes from now)
   */
  expires_at: string;

  /**
   * HTTP method to use for upload (always PUT)
   */
  http_method: 'PUT';

  /**
   * HTTP headers required for the upload request
   */
  required_headers: { [key: string]: string };

  /**
   * Presigned URL for uploading the file. PUT the raw binary file content to this
   * URL with the `required_headers`. Do not JSON-encode or multipart-wrap the body.
   * Expires after 15 minutes.
   */
  upload_url: string;
}

export interface AttachmentRetrieveResponse {
  /**
   * Unique identifier for the attachment (UUID)
   */
  id: string;

  /**
   * Supported MIME types for file attachments and media URLs.
   *
   * **Images:** image/jpeg, image/png, image/gif, image/heic, image/heif,
   * image/tiff, image/bmp
   *
   * **Videos:** video/mp4, video/quicktime, video/mpeg, video/3gpp
   *
   * **Audio:** audio/mpeg, audio/mp4, audio/x-m4a, audio/x-caf, audio/wav,
   * audio/aiff, audio/aac, audio/amr
   *
   * **Documents:** application/pdf, text/plain, text/vcard, text/rtf, text/csv,
   * text/html, text/calendar, application/msword,
   * application/vnd.openxmlformats-officedocument.wordprocessingml.document,
   * application/vnd.ms-excel,
   * application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
   * application/vnd.ms-powerpoint,
   * application/vnd.openxmlformats-officedocument.presentationml.presentation,
   * application/vnd.apple.pages, application/vnd.apple.numbers,
   * application/vnd.apple.keynote, application/epub+zip, application/zip
   *
   * **Unsupported:** WebP, SVG, FLAC, OGG, and executable files are explicitly
   * rejected.
   */
  content_type: SupportedContentType;

  /**
   * When the attachment was created
   */
  created_at: string;

  /**
   * Original filename of the attachment
   */
  filename: string;

  /**
   * Size of the attachment in bytes
   */
  size_bytes: number;

  /**
   * Current upload/processing status
   */
  status: 'pending' | 'complete' | 'failed';

  /**
   * URL to download the attachment
   */
  download_url?: string;
}

export interface AttachmentCreateParams {
  /**
   * Supported MIME types for file attachments and media URLs.
   *
   * **Images:** image/jpeg, image/png, image/gif, image/heic, image/heif,
   * image/tiff, image/bmp
   *
   * **Videos:** video/mp4, video/quicktime, video/mpeg, video/3gpp
   *
   * **Audio:** audio/mpeg, audio/mp4, audio/x-m4a, audio/x-caf, audio/wav,
   * audio/aiff, audio/aac, audio/amr
   *
   * **Documents:** application/pdf, text/plain, text/vcard, text/rtf, text/csv,
   * text/html, text/calendar, application/msword,
   * application/vnd.openxmlformats-officedocument.wordprocessingml.document,
   * application/vnd.ms-excel,
   * application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
   * application/vnd.ms-powerpoint,
   * application/vnd.openxmlformats-officedocument.presentationml.presentation,
   * application/vnd.apple.pages, application/vnd.apple.numbers,
   * application/vnd.apple.keynote, application/epub+zip, application/zip
   *
   * **Unsupported:** WebP, SVG, FLAC, OGG, and executable files are explicitly
   * rejected.
   */
  content_type: SupportedContentType;

  /**
   * Name of the file to upload
   */
  filename: string;

  /**
   * Size of the file in bytes (max 100MB)
   */
  size_bytes: number;
}

export declare namespace Attachments {
  export {
    type SupportedContentType as SupportedContentType,
    type AttachmentCreateResponse as AttachmentCreateResponse,
    type AttachmentRetrieveResponse as AttachmentRetrieveResponse,
    type AttachmentCreateParams as AttachmentCreateParams,
  };
}
