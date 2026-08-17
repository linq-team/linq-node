// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
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
 * For regulated or sensitive conversations, opt in to the **ephemeral messages** tier by contacting your Linq support contact. When enabled, every message on the covered phone numbers is automatically given a fixed **24-hour retention window** — after that window the platform permanently deletes the message from Linq storage. There is no per-message flag; ephemerality is applied automatically based on your configuration.
 *
 * You can request it at two scopes:
 *
 * | Scope | Effect |
 * |---|---|
 * | **Partner-wide** | Every outbound and inbound message on every phone number under your account is retained for 24 hours, then deleted. |
 * | **Per phone number** | Only the specified phone numbers have their messages auto-deleted. The rest follow the standard message-retention policy. |
 *
 * **Behavioral differences vs the standard default:**
 *
 * | Aspect | Standard | Ephemeral |
 * |---|---|---|
 * | Retention | Retained per the standard message-retention policy | **Hard backstop: 24 hours** from when the message is created |
 * | After expiry | Message stays retrievable | Message is permanently deleted — `GET /v3/messages/{messageId}` returns `404` and it no longer appears in `GET /v3/chats/{chatId}/messages` |
 * | Content on expiry | N/A | Text, formatting, and attachment references are scrubbed; the message is gone, not blanked out |
 * | Cross-partner isolation | Enforced | Enforced |
 *
 * **How the 24-hour window works:**
 *
 * - The window is fixed at **24 hours from message creation** (`created_at`) and cannot be configured per message.
 * - It mirrors the ephemeral *attachments* 1-day backstop, so a message and any media it carries expire together.
 * - Expiry is delivery-independent — the clock starts when the message is created, not when it is delivered or read.
 *
 * **What you observe:**
 *
 * - **No expiry timestamp is exposed.** API responses and webhook payloads do not include the deletion time. If you need it, compute `created_at + 24h` yourself.
 * - **No deletion webhook is sent.** There is no `message.deleted` event — a message simply stops being retrievable once its window passes.
 * - **Delivery is unaffected.** Ephemeral messages send, deliver, and fire the usual `message.sent` / `message.received` and status webhooks exactly like standard messages. Only retention changes.
 *
 * **When to choose ephemeral:**
 *
 * - You have a compliance requirement that the platform must not retain message content beyond a short window.
 * - The conversation is high-sensitivity (PHI, financial, identity verification) and you do not want it sitting in storage long-term.
 * - Your application is the system of record — you capture what you need from the delivery webhook in real time and do not rely on reading message history back from Linq later.
 *
 * **Important:** ephemeral applies in *both directions* — messages you send **and** messages received by the phone numbers in that scope. Because Linq can no longer return the message after 24 hours, persist anything you need to keep from the webhook payload at the time it is delivered.
 */
export class Polls extends APIResource {
  /**
   * Create an iMessage poll in an existing chat and send it. Polls are
   * iMessage-only.
   *
   * The chat must already exist — **a poll cannot be the first message of a new
   * chat** (use `POST /v3/chats` for that). Options are **add-only and immutable**:
   * you can add options later via `POST /v3/messages/{messageId}/poll/options`, but
   * never edit or remove them.
   *
   * @example
   * ```ts
   * const pollEnvelope = await client.chats.polls.create(
   *   '550e8400-e29b-41d4-a716-446655440000',
   *   {
   *     poll: {
   *       options: [{ text: 'Tacos' }, { text: 'Sushi' }],
   *       idempotency_key: 'poll-abc123',
   *     },
   *   },
   * );
   * ```
   */
  create(chatID: string, body: PollCreateParams, options?: RequestOptions): APIPromise<PollEnvelope> {
    return this._client.post(path`/v3/chats/${chatID}/polls`, { body, ...options });
  }
}

/**
 * Poll content — options and the aggregate voter count.
 */
export interface Poll {
  options: Array<Poll.Option>;

  /**
   * Distinct participants across the whole poll (a voter picking two options counts
   * once).
   */
  total_voters: number;
}

export namespace Poll {
  export interface Option {
    can_be_edited: boolean;

    /**
     * The participant who added this option (poll creator for the initial options;
     * whoever added later ones).
     */
    creator_handle: Shared.ChatHandle;

    option_id: string;

    text: string;

    /**
     * Participants who voted for this option (vote_count = voters.length).
     */
    voters: Array<Option.Voter>;
  }

  export namespace Option {
    export interface Voter {
      handle: string;

      voted_at: string;
    }
  }
}

/**
 * Message-level envelope returned by every poll endpoint.
 */
export interface PollEnvelope {
  chat_id: string;

  created_at: string;

  /**
   * The poll-definition message's ID — reference this poll by it.
   */
  message_id: string;

  /**
   * Poll content — options and the aggregate voter count.
   */
  poll: Poll;

  /**
   * Tapbacks/stickers on the whole poll (message part 0).
   */
  reactions: Array<Shared.Reaction>;

  updated_at: string;
}

export interface PollCreateParams {
  /**
   * Poll content to create. A poll needs at least two options. Options are add-only
   * and immutable — there is no title/question (send that as a normal text message).
   */
  poll: PollCreateParams.Poll;
}

export namespace PollCreateParams {
  /**
   * Poll content to create. A poll needs at least two options. Options are add-only
   * and immutable — there is no title/question (send that as a normal text message).
   */
  export interface Poll {
    options: Array<Poll.Option>;

    /**
     * Optional key to deduplicate the poll creation.
     */
    idempotency_key?: string;
  }

  export namespace Poll {
    export interface Option {
      text: string;
    }
  }
}

export declare namespace Polls {
  export { type Poll as Poll, type PollEnvelope as PollEnvelope, type PollCreateParams as PollCreateParams };
}
