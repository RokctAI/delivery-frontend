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

// Neutral bare-shell seam for the base kernel's platform gateway (ADR-005).
// The real implementation is base_sdk's src/services/platform-gateway.ts,
// which the composer lands at exactly this path (installs: src/services ->
// app/services/base) — per Ray's ruling on PR #4 the shell no longer commits
// base_sdk-generated copies, only this contract stub so its own gateway lib
// (app/lib/gateway-rpc.ts, app/lib/paas-gateway.ts) compiles bare. Only the
// symbols shell code actually imports are declared; calls resolve to null,
// which is the kernel's own "call failed" contract, so callers take their
// error branches. Composing base_sdk overwrites this file wholesale.

/** The universal platform entry-point method name (mirrors base_sdk). */
export const PLATFORM_GATEWAY_METHOD = "rokct.platform.api";

/** The full request path derived from PLATFORM_GATEWAY_METHOD. */
export const PLATFORM_GATEWAY_PATH = `/api/v1/method/${PLATFORM_GATEWAY_METHOD}`;

/** Options accepted by platformCall — same shape as base_sdk's kernel. */
export interface PlatformCallOptions {
  baseUrl?: string;
  method?: "GET" | "POST";
  headers?: Record<string, string>;
  timeout?: number;
  fetchOptions?: RequestInit & {
    next?: { revalidate?: number | false; tags?: string[] };
  };
}

/**
 * Bare-shell stub of the kernel's universal gateway call. Always resolves to
 * null — the kernel's documented any-failure return — because without
 * base_sdk composed there is no gateway to talk to. Callers that need a
 * result (e.g. paasCall) already treat null as failure and throw.
 */
export async function platformCall<T = unknown>(
  _cmd: string,
  _payload?: Record<string, unknown> | string,
  _options: PlatformCallOptions = {},
): Promise<T | null> {
  return null;
}
