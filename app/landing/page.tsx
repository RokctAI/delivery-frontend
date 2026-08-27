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

"use client";

// Minimal landing page for the deliveryplatform shell. The source repo's
// marketing landing (hero, pricing, testimonials, ...) belongs to the
// AI-first product and is not part of this shell; unauthenticated visitors
// without a tenant reach this page and are pointed at their tenant login.
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Branding } from "@/components/custom/branding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LandingPage() {
  const router = useRouter();
  const [site, setSite] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = site.trim();
    if (trimmed) {
      router.push(`/?site_name=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-8 bg-gray-900 rounded-lg border border-gray-800">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter italic">
              <Branding />
            </h1>
            <p className="text-gray-400">
              Delivery platform. Enter your tenant site to continue to login.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site_name">Tenant site</Label>
              <Input
                id="site_name"
                name="site_name"
                type="text"
                placeholder="yourshop.tenant.rokct.ai"
                value={site}
                onChange={(e) => setSite(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-white text-black hover:bg-gray-200"
            >
              Continue
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
