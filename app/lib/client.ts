/*
 * Copyright (c) 2026 ROKCT INTELLIGENCE (PTY) LTD
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import "server-only";

// Host-owned gateway client seam, the shape supacharge-web's app/lib/client.ts
// gives base_sdk's admin actions (app/actions/base/admin/*.ts call
// `client.call({ method, args })` on the PaaSClient returned here). The
// frappe-js-sdk app stays reachable as `client.app` for the host's own
// gateway lib (app/lib/gateway-rpc.ts takes the FrappeApp).

import "server-only";

/**
 * Host-owned PaaS client seam. Named in base_sdk's manifest `requires` and
 * imported by its admin content/settings actions, which use exactly one
 * method on what it returns: `client.call({ method, args })`.
 *
 * Mirrors RokctAI/rokctai_frontend's `app/lib/client.ts` — same
 * `frappe-js-sdk` client, same siteName -> URL derivation, same
 * "Unauthorized" on a session-less request — with two differences forced by
 * what this shell composes:
 *
 *   1. Credentials come from the host session seam `@/app/lib/session`
 *      (which base_sdk documents and auth_sdk later replaces) instead of
 *      auth_sdk's `@/app/(auth)/actions` and `@/db`, neither of which this
 *      shell composes.
 *   2. The returned value is a thin adapter exposing `call({ method, args })`,
 *      the shape base_sdk's actions call, over `FrappeCall.post`.
 *
 * Keep this file free of imports from composed SDK trees: it is committed on
 * the bare shell, where `next build` must stay green with nothing composed.
 */
import { FrappeApp } from "frappe-js-sdk";

import { getFrappeClient } from "@/lib/frappe";
import { getCurrentSession } from "@/app/lib/session";
import { GlobalSettingsService } from "@/app/services/control/global_settings";

export interface PaaSCallOptions {
  /** Dotted Frappe method path, e.g. "frappe.client.get_list". */
  method: string;
  args?: Record<string, unknown>;
}

export interface PaaSClient {
  /** The underlying frappe-js-sdk app, for callers that need more. */
  app: FrappeApp;
  call<T = any>(options: PaaSCallOptions): Promise<T>;
}

interface SessionUserCredentials {
  apiKey?: string | null;
  apiSecret?: string | null;
  siteName?: string | null;
}

function adapt(app: FrappeApp): PaaSClient {
  return {
    app,
    call<T = any>({ method, args }: PaaSCallOptions): Promise<T> {
      return app.call().post<T>(method, args);
    },
  };
}

async function requireUser(): Promise<SessionUserCredentials> {
  const session = (await getCurrentSession()) as {
    user?: SessionUserCredentials | null;
  } | null;
  if (!session || !session.user) throw new Error("Unauthorized");
  return session.user;
}

export async function getPaaSClient(): Promise<PaaSClient> {
  const { apiKey, apiSecret, siteName } = await requireUser();

  // Ensure siteName is a full URL if present.
  let url = siteName ?? undefined;
  if (siteName && !siteName.startsWith("http")) {
    url = siteName.includes("localhost")
      ? `http://${siteName}`
      : `https://${siteName}`;
  }

  // When url is undefined, getFrappeClient falls back to
  // process.env.NEXT_PUBLIC_FRAPPE_URL.
  return adapt(
    getFrappeClient({
      apiKey: apiKey ?? undefined,
      apiSecret: apiSecret ?? undefined,
      url,
    }),
  );
}

export async function getControlClient(): Promise<PaaSClient> {
  const { apiKey, apiSecret } = await requireUser();
  // siteName is deliberately ignored: the control plane is the default URL.
  return adapt(
    getFrappeClient({
      apiKey: apiKey ?? undefined,
      apiSecret: apiSecret ?? undefined,
    }),
  );
}

export default getPaaSClient;
export const getClient = getPaaSClient;

/**
 * System client for control-plane access with no user session: reads the
 * platform administrator's keys from the GlobalSettings store auth_sdk's
 * drizzle-backed service provides when composed. Same PaaSClient shape as
 * the session clients above.
 */
export async function getSystemControlClient(): Promise<PaaSClient> {
  let apiKey: string | undefined;
  let apiSecret: string | undefined;
  try {
    const settings = await GlobalSettingsService.getGlobalSettings();
    apiKey = settings?.adminApiKey || undefined;
    apiSecret = settings?.adminApiSecret || undefined;
  } catch (e) {
    console.error("Failed to fetch System Keys from settings store", e);
  }
  if (!apiKey || !apiSecret) {
    throw new Error(
      "System Identity not initialized. Please Log In as Administrator first to save keys.",
    );
  }
  return adapt(getFrappeClient({ apiKey, apiSecret }));
}

/** Unauthenticated client against the configured default backend. */
export function getGuestClient(): PaaSClient {
  return adapt(getFrappeClient());
}
