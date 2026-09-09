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

// The juvo storefront's header menu, for base_sdk's header-menu registry
// (components/custom/landing/header-menu.ts, base_sdk >= 1.14.0), which
// the shared header renders inside itself: inline beside the logo from
// the `lg` breakpoint up, behind a burger below it.
//
// The three entries are ANCHORS, not links: delivery-features-section.tsx,
// delivery-apps-section.tsx and delivery-pricing-section.tsx register
// their own `{ id, label }` in meta.nav, base resolves each id against the
// page's live nav, lifts the label from there, and drops the entry on a
// render where the section is not on the page (the pricing section turns
// itself down when the platform returns no plan rows), which a hand-written
// "#pricing" href could not do.
//
// ONE group, `apps`, the way lms 1.12.0 added its "Get the app" cards
// (Ray, 2026-09-09: the storefront "will show off three apps
// paas_customer, paas_manager, paas_driver as customer, manager, delivery
// apps with downloads"). A group rather than flat `links` because
// base_sdk >= 1.18.0 draws an item that carries a `description` or an
// `icon` as a card - icon box, label, one-line blurb - only inside the
// groups panel; a flat link is a bare word. So the desktop bar leads with
// one "Get the apps" trigger that opens three cards, one per app, and the
// burger lists them under the same heading. The cards are
// DELIVERY_SHOWN_APPS from ./delivery-apps.ts, the one list the apps
// section also reads: each card is the app's label and its own line, and
// its destination is the first build the app's release lane publishes
// (the releases page; every build of an app shares it). Against a base
// between 1.14.0 and 1.17.0 the description and icon are simply not drawn.
//
// No `actions`: the header already draws Log in and Sign up beside the row
// (components/custom/header.tsx, the auth link and the auth pill), and a
// second pair would only repeat them.
//
// Since 1.0.1 the menu also says what the header's brand slot draws
// (base_sdk >= 1.21.0, HeaderMenu.brand). Ray, 2026-09-09: "i saw
// supacharge got a s logo in header, let home sdk declare if it needs logo
// there or not. supacharge text is the logo right now until i design an
// icon". The image beside the wordmark was the host shell's own
// brand-logo.tsx, an asset-free placeholder drawing the platform's first
// letter, which base's header rendered because nothing told it not to.
// juvo has no icon yet (delivery-site-metadata.ts registers none, so the
// tab gets base's generated letter tile, which the header never draws), so
// `brand: { logo: "none" }` tells it: no image, the wordmark alone. When an
// icon is designed, the declaration becomes its path. Against a base_sdk
// older than 1.21.0 the field is unknown to the registry's HeaderMenu type
// and the compose fails to type-check, which is the floor the manifest
// names.

import type { HeaderMenu } from "@/components/custom/landing/header-menu";
import { DELIVERY_SHOWN_APPS } from "@/components/custom/landing/delivery-apps";

const DELIVERY_HEADER_MENU: HeaderMenu = {
  // juvo has no icon yet; the wordmark is the logo (Ray, 2026-09-09).
  brand: { logo: "none" },
  anchors: ["features", "apps", "pricing"],
  groups: [
    {
      id: "apps",
      label: "Get the apps",
      items: DELIVERY_SHOWN_APPS.map((app) => ({
        id: app.id,
        label: app.label,
        href: app.builds[0].href,
        external: true,
        description: app.description,
        icon: app.builds[0].icon,
      })),
    },
  ],
};

export default DELIVERY_HEADER_MENU;
