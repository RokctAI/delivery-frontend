/*
 * Copyright (c) 2026 RokctAI
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

// Neutral bare-shell session seam. The shell commits no auth surface (Ray's
// ruling on PR #4: auth belongs to the users repo's auth_sdk Next.js half),
// so with no way to establish a session both functions resolve to null —
// every session-gated shell code path (app/lib/client.ts, app/lib/roles.ts,
// app/lib/paas-gateway.ts, app/(chat)/page.tsx) takes its unauthenticated
// branch. Composing auth_sdk overwrites this file with the NextAuth-backed
// implementation; shell code imports ONLY this seam, never
// "@/app/(auth)/..." directly, so the shell builds identically either way.

/** The current session, or null. Bare shell: always null (no auth surface). */
export async function auth(): Promise<any> {
  return null;
}

/** Alias kept for call sites that read as "session" rather than "auth". */
export async function getCurrentSession(): Promise<any> {
  return null;
}
