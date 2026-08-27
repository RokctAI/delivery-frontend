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

import { redirect } from "next/navigation";

import { getCurrentSession } from "@/app/lib/session";

// Neutral bare-shell root route. The shell commits no auth surface (Ray's
// ruling on PR #4: auth belongs to the users repo's auth_sdk Next.js half),
// so the seam session is always null here and every visitor lands on
// /landing. Composing auth_sdk overwrites this file with the session-aware
// copy (PaaSLogin for ?site_name visitors, dashboard redirect for
// authenticated sessions); a future agent SDK that owns the chat home
// overwrites it again and must absorb that auth behavior. Keep this file at
// app/(chat)/page.tsx — moving it to app/page.tsx would collide with the
// SDK-installed copy at compose time (two "/" routes).
export default async function Page() {
  const session = await getCurrentSession();

  if (!session || !session.user) {
    redirect("/landing");
  }

  // Unreachable bare (the seam never authenticates); kept so the composed
  // fallback semantics stay documented next to the code they belong to.
  redirect("/paas/dashboard");
}
