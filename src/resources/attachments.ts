// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

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
 * | Message body & parts | Retained per message-retention policy | Retained per message-retention policy |
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
 */
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
   * body. You **must** include all headers from `required_headers` exactly as
   * returned — the presigned URL is signed with these values and S3 will reject the
   * upload if they don't match.
   *
   * The request body is the binary file content — **not** JSON, **not** multipart
   * form data. The file must equal `size_bytes` bytes (the value you declared in
   * step 1).
   *
   * ```bash
   * curl -X PUT "<upload_url from step 1>" \
   *   -H "Content-Type: image/jpeg" \
   *   -H "Content-Length: 1024000" \
   *   --data-binary @photo.jpg
   * ```
   *
   * ## Step 3: Send a message with the attachment
   *
   * Reference the `attachment_id` in a media part. The ID never expires — use it in
   * as many messages as you want.
   *
   * ```json
   * POST /v3/chats
   * {
   *   "from": "+15559876543",
   *   "to": ["+15551234567"],
   *   "message": {
   *     "parts": [
   *       { "type": "media", "attachment_id": "<attachment_id from step 1>" }
   *     ]
   *   }
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
   * Retrieve metadata for a specific attachment including file information, and URLs
   * for downloading.
   *
   * `status`: (**deprecated** — will be removed in a future API version)
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
 * image/tiff, image/bmp, image/svg+xml, image/webp, image/x-icon
 *
 * **Videos:** video/mp4, video/quicktime, video/mpeg, video/mpeg2,
 * video/x-msvideo, video/3gpp
 *
 * **Audio:** audio/mpeg, audio/x-m4a, audio/x-caf, audio/x-wav, audio/x-aiff,
 * audio/aac, audio/midi, audio/amr
 *
 * **Documents:** application/pdf, text/plain, text/markdown, text/vcard, text/rtf,
 * text/csv, text/html, text/calendar, text/xml, application/json,
 * application/msword,
 * application/vnd.openxmlformats-officedocument.wordprocessingml.document,
 * application/vnd.ms-excel,
 * application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
 * application/vnd.ms-powerpoint,
 * application/vnd.openxmlformats-officedocument.presentationml.presentation,
 * application/x-iwork-pages-sffpages, application/x-iwork-numbers-sffnumbers,
 * application/x-iwork-keynote-sffkey, application/epub+zip, application/zip,
 * application/x-gzip
 *
 * **Transcoded on delivery:**
 *
 * - `audio/x-caf` — CAF files are transcoded to `audio/mp4` for delivery.
 *
 * **Deprecated (accepted but transcoded):**
 *
 * - `audio/mp3` — Deprecated. Use `audio/mpeg` instead. Files sent as audio/mp3
 *   will be delivered as audio/mpeg.
 * - `audio/mp4` — Deprecated. Use `audio/x-m4a` instead. Files sent as audio/mp4
 *   will be delivered as audio/x-m4a.
 * - `audio/aiff` — Deprecated. Use `audio/x-aiff` instead. Files sent as
 *   audio/aiff will be delivered as audio/x-aiff.
 * - `image/tiff` — Accepted, but TIFF images are transcoded to JPEG for delivery.
 *
 * **Unsupported:** FLAC, OGG, and executable files are explicitly rejected.
 */
export type SupportedContentType =
  | 'image/jpeg'
  | 'image/png'
  | 'image/gif'
  | 'image/heic'
  | 'image/heif'
  | 'image/tiff'
  | 'image/bmp'
  | 'image/svg+xml'
  | 'image/webp'
  | 'image/x-icon'
  | 'video/mp4'
  | 'video/quicktime'
  | 'video/mpeg'
  | 'video/mpeg2'
  | 'video/x-m4v'
  | 'video/x-msvideo'
  | 'video/3gpp'
  | 'audio/mpeg'
  | 'audio/mp3'
  | 'audio/x-m4a'
  | 'audio/mp4'
  | 'audio/x-caf'
  | 'audio/x-wav'
  | 'audio/x-aiff'
  | 'audio/aiff'
  | 'audio/aac'
  | 'audio/midi'
  | 'audio/amr'
  | 'application/pdf'
  | 'text/plain'
  | 'text/markdown'
  | 'text/vcard'
  | 'text/rtf'
  | 'text/csv'
  | 'text/html'
  | 'text/calendar'
  | 'application/msword'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  | 'application/vnd.ms-excel'
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  | 'application/vnd.ms-powerpoint'
  | 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  | 'application/x-iwork-pages-sffpages'
  | 'application/x-iwork-numbers-sffnumbers'
  | 'application/x-iwork-keynote-sffkey'
  | 'application/epub+zip'
  | 'text/xml'
  | 'application/json'
  | 'application/zip'
  | 'application/x-gzip';

export interface AttachmentCreateResponse {
  /**
   * Unique identifier for the attachment
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
   * HTTP headers that must be set on the upload request. The presigned URL is signed
   * with these exact values — S3 will reject the upload if they don't match.
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
   * image/tiff, image/bmp, image/svg+xml, image/webp, image/x-icon
   *
   * **Videos:** video/mp4, video/quicktime, video/mpeg, video/mpeg2,
   * video/x-msvideo, video/3gpp
   *
   * **Audio:** audio/mpeg, audio/x-m4a, audio/x-caf, audio/x-wav, audio/x-aiff,
   * audio/aac, audio/midi, audio/amr
   *
   * **Documents:** application/pdf, text/plain, text/markdown, text/vcard, text/rtf,
   * text/csv, text/html, text/calendar, text/xml, application/json,
   * application/msword,
   * application/vnd.openxmlformats-officedocument.wordprocessingml.document,
   * application/vnd.ms-excel,
   * application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
   * application/vnd.ms-powerpoint,
   * application/vnd.openxmlformats-officedocument.presentationml.presentation,
   * application/x-iwork-pages-sffpages, application/x-iwork-numbers-sffnumbers,
   * application/x-iwork-keynote-sffkey, application/epub+zip, application/zip,
   * application/x-gzip
   *
   * **Transcoded on delivery:**
   *
   * - `audio/x-caf` — CAF files are transcoded to `audio/mp4` for delivery.
   *
   * **Deprecated (accepted but transcoded):**
   *
   * - `audio/mp3` — Deprecated. Use `audio/mpeg` instead. Files sent as audio/mp3
   *   will be delivered as audio/mpeg.
   * - `audio/mp4` — Deprecated. Use `audio/x-m4a` instead. Files sent as audio/mp4
   *   will be delivered as audio/x-m4a.
   * - `audio/aiff` — Deprecated. Use `audio/x-aiff` instead. Files sent as
   *   audio/aiff will be delivered as audio/x-aiff.
   * - `image/tiff` — Accepted, but TIFF images are transcoded to JPEG for delivery.
   *
   * **Unsupported:** FLAC, OGG, and executable files are explicitly rejected.
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
   * @deprecated status is no longer a useful signal
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
   * image/tiff, image/bmp, image/svg+xml, image/webp, image/x-icon
   *
   * **Videos:** video/mp4, video/quicktime, video/mpeg, video/mpeg2,
   * video/x-msvideo, video/3gpp
   *
   * **Audio:** audio/mpeg, audio/x-m4a, audio/x-caf, audio/x-wav, audio/x-aiff,
   * audio/aac, audio/midi, audio/amr
   *
   * **Documents:** application/pdf, text/plain, text/markdown, text/vcard, text/rtf,
   * text/csv, text/html, text/calendar, text/xml, application/json,
   * application/msword,
   * application/vnd.openxmlformats-officedocument.wordprocessingml.document,
   * application/vnd.ms-excel,
   * application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
   * application/vnd.ms-powerpoint,
   * application/vnd.openxmlformats-officedocument.presentationml.presentation,
   * application/x-iwork-pages-sffpages, application/x-iwork-numbers-sffnumbers,
   * application/x-iwork-keynote-sffkey, application/epub+zip, application/zip,
   * application/x-gzip
   *
   * **Transcoded on delivery:**
   *
   * - `audio/x-caf` — CAF files are transcoded to `audio/mp4` for delivery.
   *
   * **Deprecated (accepted but transcoded):**
   *
   * - `audio/mp3` — Deprecated. Use `audio/mpeg` instead. Files sent as audio/mp3
   *   will be delivered as audio/mpeg.
   * - `audio/mp4` — Deprecated. Use `audio/x-m4a` instead. Files sent as audio/mp4
   *   will be delivered as audio/x-m4a.
   * - `audio/aiff` — Deprecated. Use `audio/x-aiff` instead. Files sent as
   *   audio/aiff will be delivered as audio/x-aiff.
   * - `image/tiff` — Accepted, but TIFF images are transcoded to JPEG for delivery.
   *
   * **Unsupported:** FLAC, OGG, and executable files are explicitly rejected.
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
