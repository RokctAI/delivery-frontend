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

// The delivery platform storefront's hero copy, for base_sdk's hero-copy
// registry (components/custom/landing/hero-copy.ts, base_sdk >= 1.6.0):
// this product's words laid over HERO_CONFIG field by field.
//
// Ray, 2026-09-09: this landing "will be selling a delivery platform not
// selling to merchants, his portal is the one that sell to merchants". So
// the headline names what the platform does, each phrase lifted from a
// source of the delivery module: "Last-mile deliveries" and "Intercity
// parcels" are the two delivery services zones/delivery/docs names (terms
// 1.1 and 1.2, INTERCITY_PROVIDER_DESIGN.md), "Driver dispatch" is the
// Dispatch Route doctype and the Driver app's route screen
// (paas_driver feature guide, "Every stop, in order"); the suffix is the
// PaaS plan fixtures' first feature line, "Delivery Platform - White Label"
// (commerce/merchants/frappe/src/tenant/fixtures/Subscription_Plan). The
// trust line states the two facts the two PaaS plan records carry:
// billing_cycle Monthly or Yearly in USD, and trial_period_days 14 on the
// yearly record (0 on the monthly one). No user counts, no adoption
// claims: the sources carry none.
//
// The hero frame renders "<text> <verb> <suffix>"; the suffix carries the
// connective, so each word's verb is empty. There is no input on this hero
// (delivery-hero-form.tsx renders two calls to action instead), so the
// placeholders are empty and the rokctapp store badges are turned off.

import type { HeroCopy } from "@/components/custom/landing/hero-copy";

const DELIVERY_HERO_COPY: HeroCopy = {
  headlineWords: [
    { text: "Last-mile deliveries", verb: "" },
    { text: "Intercity parcels", verb: "" },
    { text: "Driver dispatch", verb: "" },
  ],
  headlineSuffix: "on a white-label delivery platform",
  // No input on this hero (delivery-hero-form.tsx), so nothing to type into it.
  placeholders: [],
  backgroundImage: "",
  // Rendered by delivery-hero-form.tsx under its calls to action.
  trustLine: ["Billed monthly or yearly in USD", "14-day trial on the yearly plan"],
  // No store badges: the platform is bought on this page, not in a store.
  badges: [],
};

export default DELIVERY_HERO_COPY;
