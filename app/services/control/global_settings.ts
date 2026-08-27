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

// Neutral bare-shell GlobalSettings seam. The drizzle/Postgres store these
// settings live in belongs to the auth surface (its rows — admin API keys,
// beta/debug flags — are written by the admin login flow), which Ray's
// ruling on PR #4 moved to the users repo's auth_sdk Next.js half. The bare
// shell therefore has no persistence: reads return safe defaults and
// toggles report failure. Composing auth_sdk overwrites this file with the
// drizzle-backed implementation (same class name, same method contracts).

/** Shape of the settings record both the seam and the drizzle-backed
 *  auth_sdk implementation resolve to. Admin key fields are only ever
 *  populated by the auth_sdk copy (they live in its Postgres store). */
export type GlobalSettingsRecord = {
  id?: string;
  isBetaMode: boolean;
  isDebugMode: boolean;
  adminApiKey?: string | null;
  adminApiSecret?: string | null;
  platformSyncSecret?: string | null;
};

export class GlobalSettingsService {
  static async getGlobalSettings(): Promise<GlobalSettingsRecord> {
    // No store in the bare shell — mirror the drizzle copy's catch-branch
    // defaults so callers (branding, handson system settings) behave the
    // same as when the composed copy cannot reach Postgres.
    return { isBetaMode: true, isDebugMode: false };
  }

  static async toggleBetaMode(): Promise<{
    success: boolean;
    isBetaMode?: boolean;
  }> {
    return { success: false };
  }

  static async toggleDebugMode(): Promise<{
    success: boolean;
    isDebugMode?: boolean;
  }> {
    return { success: false };
  }
}
