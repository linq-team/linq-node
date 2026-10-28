// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * An **experience** renders inside Linq's iMessage app as a native card,
 * instead of as text or a link. You invoke one by name; Linq resolves the
 * recipient, mints any session it needs, composes the card and sends it.
 *
 * Send it to `POST /v3/chats/{chatId}/messages`:
 *
 * ```json
 * {
 *   "message": {
 *     "experience": {
 *       "name": "agentpay",
 *       "action": "request_payment",
 *       "params": { "checkout_url": "https://zero.linqapp.com/pay/acme?session=tok_..." }
 *     }
 *   }
 * }
 * ```
 *
 * The key is `experience` — what you're invoking. Nested under it is its
 * `name`, the action you're invoking on it, and that action's params. A card
 * **is** the whole message on Apple's side, so a message carries either
 * `experience` or `parts`, never both, and an action goes to exactly one
 * recipient.
 *
 * ## What you can invoke
 *
 * | Experience | Action | What the customer sees |
 * |---|---|---|
 * | `agentpay` | `request_payment` | A payment request they can pay in the app. Turns itself into "Paid" in place once it settles. |
 * | `agentcard` | `attach_card` | A prompt to add a card to their wallet. |
 * | `agentcard` | `approve_card` | A passkey approval for a virtual card. |
 * | `link` | `open` | A card that opens a URL you supply. |
 *
 * `GET /v3/experiences` is the list to build against, with every action and
 * the fields each accepts — anything not described there is unsupported.
 * Fields are display copy unless documented otherwise.
 *
 * ## Params are checked before the card is sent
 *
 * Unknown fields are **rejected rather than ignored**, so copy that would
 * never have rendered fails for you now instead of arriving wrong on
 * somebody's phone. Some fields are read rather than sent: `agentpay`'s
 * `request_payment` takes only a `checkout_url` and resolves the amount and
 * reason from that payment request, so a card can never claim a figure the
 * checkout will not charge.
 *
 * Cards are **iMessage-only**. Recipients without the app see a static
 * version built from the same copy; SMS and RCS recipients cannot receive
 * one at all (error codes 2018 and 4005).
 */
export class Experiences extends APIResource {
  /**
   * Get one experience
   *
   * @example
   * ```ts
   * const experience = await client.experiences.retrieve(
   *   'agentpay',
   * );
   * ```
   */
  retrieve(experience: string, options?: RequestOptions): APIPromise<ExperienceRetrieveResponse> {
    return this._client.get(path`/v3/experiences/${experience}`, options);
  }

  /**
   * The experiences enabled for your account, with the actions you may invoke on
   * each and the fields each action accepts. Treat it as the list to build against:
   * anything not described here is unsupported and may change or stop working
   * without notice.
   *
   * @example
   * ```ts
   * const experiences = await client.experiences.list();
   * ```
   */
  list(options?: RequestOptions): APIPromise<ExperienceListResponse> {
    return this._client.get('/v3/experiences', options);
  }
}

/**
 * What an experience offers you. Deliberately a projection: where its templates
 * live and how they are built is not yours to depend on, so it is not here.
 */
export interface ExperienceRetrieveResponse {
  actions?: Array<ExperienceRetrieveResponse.Action>;

  display_name?: string;

  experience?: string;
}

export namespace ExperienceRetrieveResponse {
  export interface Action {
    /**
     * Fields you may send in `params`, keyed by the exact name to use.
     */
    fields?: { [key: string]: Action.Fields };

    name?: string;

    summary?: string;
  }

  export namespace Action {
    export interface Fields {
      /**
       * Maximum length, for strings.
       */
      max?: number;

      required?: boolean;

      type?: 'string' | 'cents' | 'int' | 'url';
    }
  }
}

export interface ExperienceListResponse {
  experiences?: Array<ExperienceListResponse.Experience>;
}

export namespace ExperienceListResponse {
  /**
   * What an experience offers you. Deliberately a projection: where its templates
   * live and how they are built is not yours to depend on, so it is not here.
   */
  export interface Experience {
    actions?: Array<Experience.Action>;

    display_name?: string;

    experience?: string;
  }

  export namespace Experience {
    export interface Action {
      /**
       * Fields you may send in `params`, keyed by the exact name to use.
       */
      fields?: { [key: string]: Action.Fields };

      name?: string;

      summary?: string;
    }

    export namespace Action {
      export interface Fields {
        /**
         * Maximum length, for strings.
         */
        max?: number;

        required?: boolean;

        type?: 'string' | 'cents' | 'int' | 'url';
      }
    }
  }
}

export declare namespace Experiences {
  export {
    type ExperienceRetrieveResponse as ExperienceRetrieveResponse,
    type ExperienceListResponse as ExperienceListResponse,
  };
}
