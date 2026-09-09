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

import "server-only";

// The paas-era shell's tenant gateway seam, kept at its import path. The
// delivery-frontend shell carried `paasCall` here: resolve the signed-in
// user's tenant site (`session.user.siteName`, the site they logged into)
// and API credentials from the session, then run `cmd` through the single
// platform gateway entry point, throwing on an unauthorized session or a
// failed call. base_sdk >= 1.3.0 carries exactly that wrapper in the kernel
// (app/services/base/platform-gateway.ts: `paasCall`, whose
// `resolveTenantBaseUrl` reads the session site first, then the request
// host's tenant mapping, then the configured default), so this module is
// the one-line hand-off that keeps `@/app/lib/paas-gateway` importable for
// the delivery portal's server actions while the kernel owns the
// behaviour. New code should import `paasCall` or `platformCall` from the
// kernel directly.

export { paasCall } from "@/app/services/base/platform-gateway";
