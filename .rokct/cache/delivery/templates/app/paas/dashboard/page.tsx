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

// The paas-era path of the tenant dashboard. base_sdk >= 1.2.0 carries that
// dashboard as app/manager/layout.tsx and app/manager/page.tsx, and the
// commerce SDKs' manager pages and merchants_sdk's merchant-nav.tsx live
// under /manager with it - but auth_sdk 1.6.0's auth.config.ts still sends a
// PaaS seller whose backend names no homePage from `/` to /paas/dashboard,
// and the delivery-frontend shell's own nav copies still point here. This
// route keeps that path answering by forwarding to where the dashboard now
// is; the delivery-frontend layout that once sat here (the same sidebar
// chrome as base's manager layout, breadcrumb aside) is not shipped twice.

import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function Page() {
  redirect("/manager");
}
