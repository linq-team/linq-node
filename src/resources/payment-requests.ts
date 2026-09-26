// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * Request a payment from a recipient over iMessage. You create a payment
 * request, send its `checkout_url` to the recipient, and they pay with Apple
 * Pay or card. Funds settle **directly to your own Stripe account** — Linq
 * never holds the money.
 *
 * ## How it works
 *
 * 1. **Create** a payment request with an amount and currency. You get back a
 *    `checkout_url` and a `status` of `requested`.
 * 2. **Send** the `checkout_url` to the recipient as a `link` message part so
 *    it arrives as a tappable card (see *Sending the link* below).
 * 3. The recipient **pays** on the hosted checkout (Apple Pay App Clip on a
 *    supported iPhone, web checkout everywhere else).
 * 4. You receive a **`payment.succeeded`** webhook and the request's `status`
 *    becomes `succeeded`. Requests you don't collect eventually `expire`.
 *
 * ## Connected accounts (Stripe Standard, direct charges)
 *
 * Payments run on **Stripe Connect Standard accounts** using **direct
 * charges**: the charge is created on *your* connected account and **you are
 * the merchant of record**. That means the money, the payout schedule, the
 * customer relationship, and the compliance surface are all yours — Linq
 * orchestrates the request and the checkout but is never in the funds flow.
 *
 * **Refunds, disputes, and chargebacks are handled by you, in your own Stripe
 * Dashboard.** Because charges settle directly to your account, Linq has no
 * custody of the funds and cannot issue refunds or contest disputes on your
 * behalf — and there is no refund/dispute endpoint in this API by design. Use
 * the Stripe Dashboard (or the Stripe API on your own account) for the money
 * lifecycle after a payment succeeds.
 *
 * ## Getting set up
 *
 * Open **Agent Pay** in your Linq dashboard
 * (`https://zero.linqapp.com/organization/payments`), click **Connect Stripe**,
 * and complete Stripe's onboarding (business details + a bank account). When
 * your account reaches `charges_enabled`, request creation unlocks; until you
 * connect Stripe, `POST /v3/payment_requests` returns `403`. You can keep
 * collecting even while Stripe finishes background verification.
 *
 * ## Subscriptions
 *
 * Set `mode: subscription` on `POST /v3/payment_requests` to start an
 * **auto-renewing subscription** instead of a one-time charge. Instead of an
 * amount, you pass a `price_id` — an active **recurring Price** on your
 * connected Stripe account (create one in your Stripe Dashboard under
 * Product catalog; if you sell through Stripe Payment Links today, reuse the
 * price your link is built from). The recipient pays the first invoice at
 * the same checkout, and their payment method is saved to the subscription
 * for automatic renewals.
 *
 * The division of labor is deliberate: **Linq handles the first payment,
 * your Stripe account handles the rest.** The request reaches `succeeded`
 * when the first invoice is paid; from then on the subscription lives
 * entirely on your connected account. The response's `stripe` object gives
 * you the join keys — `customer_id` and `subscription_id` — so renewals,
 * plan changes, dunning, and cancellation are managed with your own Stripe
 * Dashboard/API and your own Stripe webhooks. Your `metadata` is stamped on
 * the Customer and Subscription, so correlating in either direction is
 * trivial. There are no renewal webhooks from Linq by design.
 *
 * ### Discounts
 *
 * Pass a `discount` with a **coupon** or **promotion code** from your
 * connected Stripe account to apply it to the subscription. Create either in
 * your Stripe Dashboard under Product catalog → Coupons; Linq only forwards
 * the id.
 *
 * ```json
 * {
 *   "mode": "subscription",
 *   "price_id": "price_1QAbCdEfGhIjKlMn",
 *   "discount": {
 *     "coupon": "7fKCMvBh",
 *     "label": "50% OFF FIRST MONTH"
 *   }
 * }
 * ```
 *
 * Stripe applies the coupon and prices the first invoice; the `amount` we
 * return is that invoice's amount due, so a `$50.00/month` price with a
 * 50%-off-first-month coupon comes back as `2500` and the recipient is
 * charged **$25.00** at checkout. A coupon that covers the whole first
 * invoice returns `amount: 0`; checkout shows $0.00 and collects the card for
 * the renewal rather than charging now. Renewals bill at the full price
 * automatically — how long a discount lasts is the coupon's `duration`,
 * enforced by Stripe on your account, and Linq never re-prices anything.
 *
 * Use `promotion_code` instead of `coupon` to apply a promotion code by id
 * (`promo_...`, not the customer-facing code string); pass one or the other,
 * never both.
 *
 * `label` is the customer-facing promotion name displayed at checkout instead
 * of the coupon or promotion code ID. The label is displayed exactly as
 * provided, so include important terms such as "FIRST MONTH" or
 * "FIRST 3 MONTHS" when applicable. These terms are not displayed elsewhere
 * on the checkout screen.
 *
 * If omitted, Stripe uses the coupon's name as the promotion label.
 *
 * ### Free trials
 *
 * Add `trial_period_days` (or a fixed `trial_end` timestamp) to start the
 * subscription with a free trial. The checkout still collects the
 * recipient's payment method — the pay sheet shows "$0 due today" with the
 * first charge date — and saves it to the subscription; Stripe bills it
 * automatically when the trial ends. The request reaches `succeeded` when
 * the card is collected, and the response carries `trial_end`. If the trial
 * would end without a payment method on file, the subscription cancels
 * rather than generating unpayable invoices. Trial lifecycle after checkout
 * (extending, ending early) is managed in your own Stripe account via
 * `stripe.subscription_id`.
 *
 * A subscription request you cancel (or that expires unpaid) cancels the
 * incomplete Stripe subscription — nothing lingers on your account.
 *
 * ## Pre-created customers
 *
 * By default each request stands alone: payment mode attaches no Customer,
 * and subscription mode creates a fresh one. If you already manage
 * Customers on your connected account, pass their id as `customer_id`
 * (`cus_...`) on create — in payment mode the charge lands on that
 * customer's payment history, and in subscription mode the subscription is
 * created on them instead of on a new Customer. The id must reference an
 * existing, non-deleted customer on your connected account or the request
 * fails with `400`. We never modify a customer you pass — no metadata is
 * stamped on it.
 *
 * ## Sending the link
 *
 * Deliver the `checkout_url` as a **`link` message part** via
 * `POST /v3/chats/{chatId}/messages` — it renders as a rich card with your
 * branding (title, amount, image) instead of a bare URL, which converts far
 * better. A `link` part must be the only part in the message. See
 * [Rich Link Previews](/channel/imessage/guides/messaging/sending-messages).
 *
 * On a supported iPhone the link opens an **Apple Pay App Clip** — a native,
 * no-install checkout sheet. Everywhere else (Android, desktop, iPhones
 * without the App Clip yet) the same URL opens the web checkout, so the link
 * always works. The App Clip experience for your payment links is registered
 * automatically by Linq and refreshed whenever you update your payments
 * branding; a newly registered experience can take up to ~24 hours to
 * activate on Apple's side, during which links open the web checkout.
 *
 * ## Sending it as a card instead
 *
 * A `link` part is one way to deliver a request. The other is the
 * **`agentpay` experience**, which sends the same request as a native card
 * in Linq's iMessage app — the amount and reason are drawn in the bubble,
 * and it turns itself into "Paid" in place once the payment succeeds,
 * without a second message.
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
 * `checkout_url` is the only required field — pass back exactly what
 * `POST /v3/payment_requests` returned. **The amount and reason are read
 * from that request, never from you**, so the card can never claim a
 * different figure than the checkout will charge. Optional `title` and
 * `note` override the copy only. The link must be one of your own payment
 * requests; another partner's is rejected.
 *
 * The trade-off against a `link` part: a card is an app card, so it is
 * iMessage-only, and recipients without the app see a static version of it.
 * A link works everywhere and is what opens the Apple Pay App Clip. Send
 * whichever suits the conversation — both settle the same payment request
 * and fire the same webhooks.
 *
 * ## Webhooks
 *
 * Subscribe to payment lifecycle events to reconcile server-side rather than
 * polling: `payment.succeeded`, `payment.canceled`, and `payment.expired`.
 * Each event carries the payment request id, amount, currency, and your
 * `metadata`. See [Webhooks](/channel/imessage/guides/webhooks).
 */
export class PaymentRequests extends APIResource {
  /**
   * Creates a payment request and returns a `checkout_url` the recipient opens to
   * pay with Apple Pay or card. Funds settle directly to your connected Stripe
   * account. A payment request is independent of any chat; to associate one with a
   * chat for your records, store the chat id in `metadata`. Requires your connected
   * account to be `charges_enabled` (returns `403` otherwise).
   *
   * Set `mode: subscription` with a recurring `price_id` from your connected Stripe
   * account to start an **auto-renewing subscription** instead of a one-time charge
   * — the recipient pays the first invoice at checkout and the response's `stripe`
   * object carries the customer and subscription ids for the ongoing lifecycle in
   * your own Stripe account. See the _Subscriptions_ section of the tag overview.
   *
   * In either mode, pass `customer_id` to attach the request to an **existing
   * Customer** on your connected account instead of creating a new one — see
   * _Pre-created customers_ in the tag overview.
   *
   * @example
   * ```ts
   * const paymentRequest = await client.paymentRequests.create({
   *   amount: 497,
   *   currency: 'usd',
   *   description: 'Coffee with Ava',
   *   metadata: { order_id: 'order_8675309' },
   * });
   * ```
   */
  create(params: PaymentRequestCreateParams, options?: RequestOptions): APIPromise<PaymentRequest> {
    const { 'Idempotency-Key': idempotencyKey, ...body } = params;
    return this._client.post('/v3/payment_requests', {
      body,
      ...options,
      headers: buildHeaders([
        { ...(idempotencyKey != null ? { 'Idempotency-Key': idempotencyKey } : undefined) },
        options?.headers,
      ]),
    });
  }

  /**
   * Returns a payment request's status and details.
   *
   * @example
   * ```ts
   * const paymentRequest =
   *   await client.paymentRequests.retrieve(
   *     '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
   *   );
   * ```
   */
  retrieve(paymentRequestID: string, options?: RequestOptions): APIPromise<PaymentRequest> {
    return this._client.get(path`/v3/payment_requests/${paymentRequestID}`, options);
  }

  /**
   * Lists your payment requests, newest first, for reconciliation. Paginate with
   * `limit` + `offset`; `has_more` indicates whether another page exists.
   *
   * @example
   * ```ts
   * const paymentRequests = await client.paymentRequests.list();
   * ```
   */
  list(
    query: PaymentRequestListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<PaymentRequestListResponse> {
    return this._client.get('/v3/payment_requests', { query, ...options });
  }

  /**
   * Cancels an unpaid payment request: the underlying payment intent is canceled and
   * the request moves to `canceled`. A request that is already paid, canceled, or
   * expired returns 409.
   *
   * @example
   * ```ts
   * const paymentRequest = await client.paymentRequests.cancel(
   *   '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
   * );
   * ```
   */
  cancel(paymentRequestID: string, options?: RequestOptions): APIPromise<PaymentRequest> {
    return this._client.post(path`/v3/payment_requests/${paymentRequestID}/cancel`, options);
  }
}

export interface PaymentRequest {
  /**
   * Unique identifier of the payment request.
   */
  id: string;

  /**
   * What the recipient is charged at checkout, in the currency's minor units. In
   * `subscription` mode this is the first invoice's amount due — all items after any
   * discounts are applied — so a discount that covers the whole invoice returns `0`
   * and checkout shows $0.00.
   */
  amount: number;

  /**
   * URL the recipient opens to pay:
   * `https://zero.linqapp.com/pay/{slug}?session=...`, where `{slug}` is your
   * partner checkout slug.
   */
  checkout_url: string;

  created_at: string;

  currency: string;

  /**
   * Whether this request collects a one-time charge or starts a subscription.
   */
  mode: 'payment' | 'subscription';

  object: string;

  /**
   * Lifecycle status of the payment request.
   */
  status: 'requested' | 'succeeded' | 'canceled' | 'expired';

  description?: string;

  /**
   * Subscription mode — the discount applied, as Stripe applied it.
   */
  discount?: PaymentRequest.Discount;

  /**
   * When an unpaid request auto-expires.
   */
  expires_at?: string;

  /**
   * Subscription mode — how often the subscription renews.
   */
  interval?: 'day' | 'week' | 'month' | 'year';

  /**
   * Subscription mode — intervals per renewal (e.g. `3` + `month` = quarterly).
   */
  interval_count?: number;

  metadata?: { [key: string]: string };

  /**
   * Natural-rail join keys, present when `rail: natural`.
   */
  natural?: PaymentRequest.Natural;

  /**
   * When the request was paid. Absent until it succeeds.
   */
  paid_at?: string;

  /**
   * Subscription mode — the recurring price this request subscribes to.
   */
  price_id?: string;

  /**
   * Subscription mode — units of the price subscribed to.
   */
  quantity?: number;

  /**
   * The rail this request settled on.
   */
  rail?: 'stripe' | 'natural';

  /**
   * Ids of the Stripe objects created **on your connected account** — your join keys
   * into your own Stripe Dashboard, webhooks, and API. After a subscription's first
   * payment succeeds, its ongoing lifecycle (renewals, plan changes, cancellation)
   * is managed in your Stripe account using `subscription_id`.
   */
  stripe?: PaymentRequest.Stripe;

  /**
   * Subscription mode — when the free trial ends and the first charge happens.
   * Present only on trial requests; `paid_at`/`succeeded` mean the payment method
   * was collected (no funds move until this time).
   */
  trial_end?: string;

  updated_at?: string;
}

export namespace PaymentRequest {
  /**
   * Subscription mode — the discount applied, as Stripe applied it.
   */
  export interface Discount {
    /**
     * The ID of the coupon applied.
     */
    coupon?: string;

    /**
     * The customer-facing discount description shown at checkout.
     */
    label?: string;

    /**
     * The ID of the promotion code applied, if you passed one.
     */
    promotion_code?: string;
  }

  /**
   * Natural-rail join keys, present when `rail: natural`.
   */
  export interface Natural {
    /**
     * The Natural payment request (`prq_...`).
     */
    payment_request_id?: string;

    /**
     * The settled transaction (`txn_...`).
     */
    transaction_id?: string;
  }

  /**
   * Ids of the Stripe objects created **on your connected account** — your join keys
   * into your own Stripe Dashboard, webhooks, and API. After a subscription's first
   * payment succeeds, its ongoing lifecycle (renewals, plan changes, cancellation)
   * is managed in your Stripe account using `subscription_id`.
   */
  export interface Stripe {
    /**
     * The Customer this request is attached to (`cus_...`). Always set in subscription
     * mode (created for you unless you passed `customer_id`); set in payment mode only
     * when you passed one.
     */
    customer_id?: string;

    /**
     * The PaymentIntent collected at checkout (`pi_...`).
     */
    payment_intent_id?: string;

    /**
     * Subscription mode — the Subscription (`sub_...`).
     */
    subscription_id?: string;
  }
}

export interface PaymentRequestListResponse {
  data: Array<PaymentRequest>;

  /**
   * Whether more results exist beyond this page.
   */
  has_more: boolean;

  object: 'list';
}

export interface PaymentRequestCreateParams {
  /**
   * Body param: Amount to charge, in the currency's minor units (e.g. cents). Must
   * be at least the payment provider's minimum (50 for `usd`). Required in `payment`
   * mode; must be omitted in `subscription` mode (the amount comes from the price).
   */
  amount?: number;

  /**
   * Body param: Three-letter ISO 4217 currency code. Only `usd` is currently
   * supported. Required in `payment` mode; must be omitted in `subscription` mode
   * (the currency comes from the price).
   */
  currency?: string;

  /**
   * Body param: Optional id of an **existing Customer** on your connected Stripe
   * account (`cus_...`) to attach this request to, instead of a new Customer being
   * created. In `payment` mode the charge lands on that customer's payment history;
   * in `subscription` mode the subscription is created on them. The customer must
   * exist (and not be deleted) on your connected account.
   */
  customer_id?: string;

  /**
   * Body param: Optional description shown to the recipient at checkout.
   */
  description?: string;

  /**
   * Body param: Subscription mode only. The coupon or promotion code to apply to
   * this subscription payment. Currently, only accept one coupon or one promo code.
   */
  discount?: PaymentRequestCreateParams.Discount;

  /**
   * Body param: Required for `rail: natural`. The line the request is sent from, in
   * E.164 format. Must be a phone number your organization owns.
   */
  from?: string;

  /**
   * Body param: Optional key/value metadata (up to 49 keys) echoed back on retrieval
   * and on `payment.*` webhooks, and stamped on the Stripe objects we create on your
   * connected account (the PaymentIntent, and in subscription mode the Subscription
   * and any Customer created for you — a customer you pass via `customer_id` is
   * never modified) — use it to correlate a request with your own records (e.g. a
   * chat id). Keys starting with `linq_` are reserved.
   */
  metadata?: { [key: string]: string };

  /**
   * Body param: `payment` (default) collects a one-time charge for `amount` +
   * `currency`. `subscription` starts an auto-renewing subscription from a recurring
   * `price_id` on your connected Stripe account: the recipient pays the first
   * invoice at checkout and Stripe renews it automatically from then on.
   */
  mode?: 'payment' | 'subscription';

  /**
   * Body param: Required for `rail: natural`. The payer to bill, in E.164 format.
   */
  payer_handle?: string;

  /**
   * Body param: Subscription mode only (required there): id of an **active recurring
   * Price** on your connected Stripe account (`price_...`). If you sell through
   * Stripe Payment Links today, pass the same price the link was built from to get
   * the native iMessage checkout for it.
   */
  price_id?: string;

  /**
   * Body param: Subscription mode only — units of the price to subscribe to.
   */
  quantity?: number;

  /**
   * Body param: Payment rail. `stripe` (default) is the direct-charge flow that
   * settles to your connected Stripe account. `natural` collects through the Natural
   * custodial wallet; it requires `from` + `payer_handle` and that your organization
   * has completed Natural merchant onboarding.
   */
  rail?: 'stripe' | 'natural';

  /**
   * Body param: Subscription mode only — end the free trial at a fixed timestamp
   * (must be in the future) instead of a day count. Mutually exclusive with
   * `trial_period_days`.
   */
  trial_end?: string;

  /**
   * Body param: Subscription mode only — start with a free trial of this many days.
   * The recipient's card is still collected at checkout (Apple Pay or card), saved
   * to the subscription, and first charged when the trial ends. Mutually exclusive
   * with `trial_end`.
   */
  trial_period_days?: number;

  /**
   * Header param: Optional idempotency key (max 200 characters). Reuse the same key
   * to safely retry without creating a second payment request. Reusing a key with
   * different request parameters returns 409.
   */
  'Idempotency-Key'?: string;
}

export namespace PaymentRequestCreateParams {
  /**
   * Subscription mode only. The coupon or promotion code to apply to this
   * subscription payment. Currently, only accept one coupon or one promo code.
   */
  export interface Discount {
    /**
     * The ID of the coupon to apply to this subscription.
     */
    coupon?: string;

    /**
     * Name of the coupon/promo code displayed to customers.
     */
    label?: string;

    /**
     * The ID of a promotion code to apply to this subscription.
     */
    promotion_code?: string;
  }
}

export interface PaymentRequestListParams {
  /**
   * Max results to return (default 20, max 100).
   */
  limit?: number;

  /**
   * Number of results to skip.
   */
  offset?: number;

  /**
   * Filter by lifecycle status.
   */
  status?: 'requested' | 'authorized' | 'succeeded' | 'canceled' | 'expired' | 'declined';
}

export declare namespace PaymentRequests {
  export {
    type PaymentRequest as PaymentRequest,
    type PaymentRequestListResponse as PaymentRequestListResponse,
    type PaymentRequestCreateParams as PaymentRequestCreateParams,
    type PaymentRequestListParams as PaymentRequestListParams,
  };
}
