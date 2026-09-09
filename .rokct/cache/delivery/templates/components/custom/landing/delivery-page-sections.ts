/*
 * Copyright (c) 2026 ROKCT INTELLIGENCE (PTY) LTD
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

// The copy of the juvo storefront's three landing sections
// (components/custom/delivery-features-section.tsx,
// delivery-apps-section.tsx and delivery-pricing-section.tsx), in one
// place the way
// hosting-page-sections.ts holds the hosting storefront's. Every claim
// here is lifted from a source of the platform and named beside it:
//
//  - zones/delivery/docs/INTERCITY_DELIVERY_TERMS.md (terms 1.1, 1.2, 6, 7)
//    and INTERCITY_PROVIDER_DESIGN.md: the two delivery services, the
//    wallet, cash on delivery, the provider boundary.
//  - zones/delivery/frappe/manifest.json (the whitelisted API) and its
//    doctypes: parcel orders, parcel types and price calculation, delivery
//    zones, dispatch routes, COD confirmation, driver statistics.
//  - RokctAI/paas_driver and RokctAI/paas_manager, marketing/tour/
//    feature-guide.md: what the Driver and Manager apps do, in their words.
//  - The apps section's cards are landing/delivery-apps.ts (each app's own
//    feature guide and README, cited there); only its frame words are here.
//  - commerce/merchants/frappe/src/tenant/fixtures/Subscription_Plan/
//    PaaS-Monthly.json and PaaS-Yearly.json: the plan feature lines, USD,
//    Monthly and Yearly, the trial.
//
// No figure, feature or support promise appears that a source does not
// state, and the live prices are never written here - the pricing section
// renders the rows the control site returns. Nothing here filters or looks
// plans up by name or id - the plans query (landing/delivery-plans-query.ts)
// selects by `plan_category`.

export interface DeliveryFeature {
  /** Stable key. */
  id: string;
  name: string;
  text: string;
}

export interface DeliveryPricingLabels {
  select: (plan: string) => string;
  trial: (days: number) => string;
  monthly: string;
  yearly: string;
  perMonth: string;
  perYear: string;
}

export interface DeliveryAppsLabels {
  /** The try-it block's heading: the one place on the page that may say "demo account" (Ray asked for those details here). */
  tryIt: string;
  site: string;
  login: string;
  password: string;
}

export interface DeliveryPageSectionsConfig {
  features: {
    heading: string;
    blurb: string;
    items: DeliveryFeature[];
  };
  apps: {
    heading: string;
    blurb: string;
    labels: DeliveryAppsLabels;
  };
  pricing: {
    heading: string;
    blurb: string;
    labels: DeliveryPricingLabels;
  };
}

export const DELIVERY_PAGE_SECTIONS: DeliveryPageSectionsConfig = {
  features: {
    heading: "What the platform does",
    blurb:
      "A white-label delivery platform with WhatsApp order integration, parcel tracking sync and a digital wallet, on a PaaS plan billed monthly or yearly in USD.",
    items: [
      {
        // Terms 1.1.
        id: "last-mile",
        name: "Last-mile delivery",
        text: "Deliveries within a delivery zone, performed by drivers connected to the platform's own delivery network.",
      },
      {
        // Terms 1.2; INTERCITY_PROVIDER_DESIGN.md (the client apps never talk to the provider).
        id: "intercity",
        name: "Intercity delivery",
        text: "City-to-city deliveries performed by third-party logistics providers integrated into the platform. Client apps talk only to the platform's API, never to the provider.",
      },
      {
        // Driver guide 10 and 11; api.parcel.get_types, calculate_price, add_parcel_review; plan feature "Parcel Tracking Sync".
        id: "parcels",
        name: "Parcel orders",
        text: "Documents and packages with sender, receiver and fee on every parcel: parcel types, price calculation, tracking sync and reviews through the platform API.",
      },
      {
        // Driver guide 8; Dispatch Route and Dispatch Route Stop doctypes.
        id: "dispatch",
        name: "Driver dispatch",
        text: "Dispatch lines up a driver's stops, pickups first, then drop-offs, with distance and cash per stop.",
      },
      {
        // Driver guide 13; api.delivery.check_delivery_zone, get_delivery_zone_by_shop; Deliveryman Delivery Zone doctype.
        id: "zones",
        name: "Delivery zones",
        text: "Each driver's delivery zone is drawn on the map and dispatch follows it; orders are checked against the zone that serves the shop.",
      },
      {
        // Driver guide 6; api.driver_parcel.confirm_parcel_cod_collection; terms 7.
        id: "cod",
        name: "Cash on delivery",
        text: "Drivers see the cash to collect up front and confirm collection on the parcel; COD is remitted through the platform after fees.",
      },
      {
        // Plan feature "Digital Wallet System"; terms 6; driver guide 14 and manager guide 17.
        id: "wallet",
        name: "Digital wallet",
        text: "A digital wallet on every plan, and earnings for today, this week or this month charted day by day, for the store and for the driver.",
      },
      {
        // Manager guide (tagline, 5, 11, 13, 15) and driver guide (tagline).
        id: "apps",
        name: "Manager and Driver apps",
        text: "Manager runs the whole store from one screen: till, menu, order queue and kitchen queue. Driver puts the delivery day in one app: deliveries, parcels and payouts.",
      },
    ],
  },
  apps: {
    // Ray, 2026-09-09: "deliveryplatform will show off three apps paas_customer, paas_manager,
    // paas_driver as customer, manager, delivery apps with downloads and demo account details for
    // potentials to try them". The frame says which three and offers the downloads; the cards
    // (landing/delivery-apps.ts) say what each app does in its own words.
    heading: "Three apps, one platform",
    blurb:
      "A customer app, a manager app and a delivery app, each with its downloads.",
    labels: {
      tryIt: "Try it with the demo account",
      site: "Site",
      login: "Login",
      password: "Password",
    },
  },
  pricing: {
    heading: "Pricing",
    blurb:
      "One PaaS plan, billed monthly or yearly. Prices in USD; the yearly plan starts with a 14-day trial.",
    labels: {
      select: (plan) => `Select ${plan}`,
      trial: (days) => `Start ${days}-day trial`,
      monthly: "Monthly",
      yearly: "Yearly",
      perMonth: "/ month",
      perYear: "/ year",
    },
  },
};
