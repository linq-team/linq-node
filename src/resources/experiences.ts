// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * Let an agent pay on a customer's behalf with a single-use virtual card.
 * Connect a customer once, then create a payment — a virtual card is minted
 * scoped to that purchase and the card details are handed back for checkout.
 */
export class Experiences extends APIResource {
  /**
   * Get one experience
   */
  retrieve(experience: string, options?: RequestOptions): APIPromise<ExperienceRetrieveResponse> {
    return this._client.get(path`/v3/experiences/${experience}`, options);
  }

  /**
   * The experiences enabled for your account, with the actions you may invoke on
   * each and the fields each action accepts. This is the authoritative list — an
   * action missing here cannot be sent.
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
