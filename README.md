# delivery-frontend

Frontend shell for the delivery platform product, which PaaS folds into. The
product is **juvo** (Ray, 2026-09-09: "deliveryplatform will be juvo so i will
point juvo.app to it"): the storefront that sells the platform and shows off
the three apps (customer, manager, driver), and the door to the tenant portal
a tenant's own domain opens.

Spawned by [RokctAI Factory](https://github.com/rokctai/factory) from
<https://github.com/RokctAI/factory/issues/129>.

## Status

**Composed at deploy — the SDK cache is committed, the composed output is not.**

Vercel builds this repo from a commit, so everything the build composes from
has to be in that commit. The vendored SDK cache under `.rokct/cache/` is
therefore committed and pinned by `.rokct/lock.json`, and `vercel.json`'s
`buildCommand` is `bash scripts/compose.sh && npm run build`: compose offline
from the committed cache, then build. No token, no clone and no network reach
the deploy — the model [`RokctAI/supacharge-web`](https://github.com/RokctAI/supacharge-web),
[`RokctAI/hosting`](https://github.com/RokctAI/hosting) and the Dart app
shells (`paas_manager`, `paas_driver`) already use.

The shell carries **no product copy**. Everything a visitor reads on the
storefront — the hero, the features, apps and pricing sections, the header
menu, the `<title>`, description and link-preview cards, the plans filter —
is `delivery_sdk`'s, the home SDK, registered into `base_sdk`'s landing
registries at compose time. The host layer commits only what the SDK
manifests name under `requires`: the shadcn primitives (`components/ui/*`),
`lib/utils.ts` and `lib/frappe.ts`, `app/config/*`, `app/lib/*` (the client,
gateway and i18n libs, `nav.delivery.*` keys included), the `branding` /
`brand-logo` seams (the wordmark is `PLATFORM_NAME`, "juvo", in
`app/config/constants.ts`), `merchant-nav.tsx` and the theme tokens in
`app/globals.css`. No plan id or plan name is written anywhere in this repo:
`delivery_sdk` filters the control site's shared catalog by category on the
server.

Composing adds `/landing` (the storefront), the `/admin` and `/manager`
trees `base_sdk` owns (with `products_sdk`'s product pages under both), the
`/login`, `/register`, `/forgot-password` and `/api/auth/[...nextauth]`
routes `auth_sdk` owns, and `/` from `delivery_sdk`: a signed-in session goes
to `/manager`, a `?site_name=` visitor or a tenant's own domain gets the
portal login, everyone else is sent to `/landing`. The paas-era
`/paas/dashboard` and `/paas/admin` paths answer with redirects to `/manager`
and `/admin`.

Nothing composed is committed. Every path an installer writes is listed in
the generated block at the end of [`.gitignore`](.gitignore). Because those
install targets are not in the tree, a bare `npm run build` without composing
first is not a supported build of this shell: run `bash scripts/compose.sh`
first (it needs nothing but the checkout). CI's
`Compose Offline + Build (Vercel parity)` job runs exactly the two commands
Vercel runs and fails if a compose changes anything committed.

The full brief lives in [docs/spec.md](docs/spec.md); the build instructions
for the agent live in [AGENTS.md](AGENTS.md).

## Stack

Next.js 16 (App Router) + React 19 + TypeScript, matching
[`RokctAI/rokctai_frontend`](https://github.com/RokctAI/rokctai_frontend)'s
versions and config style so the Next.js shells stay on one set of
conventions. The `@/*` → `./*` tsconfig path alias is the one the Next.js SDK
installer convention assumes, so composed SDK templates resolve their imports
unchanged.

`.npmrc` sets `legacy-peer-deps=true`: `react-day-picker@8` (the version
`components/ui/calendar.tsx` and `base_sdk`'s date-range picker are written
against) declares a `date-fns` peer of `^2 || ^3`, while `base_sdk`'s manifest
declares `date-fns@^4`. The pair works — `rokctai_frontend` ships it — but
npm's strict peer resolver refuses the tree.

## Getting started

```bash
bash .rokct/bootstrap.sh   # installs the Rokct agent protocol into this repo

npm ci
bash scripts/compose.sh    # offline: composes from the committed .rokct/cache/
npm run dev                # http://localhost:3000
```

Composing is part of any build of this shell:

```bash
bash scripts/compose.sh    # offline: composes from the committed .rokct/cache/
npm run build              # what Vercel runs after it, per vercel.json
```

Other commands: `npm start` (serve the build), `npm run typecheck`.

## Configuration

Copy [`.env.example`](.env.example) to `.env.local`. Every variable this shell
reads is documented there, names only; none is required to build.

- `ROKCT_BASE_URL` (server) / `NEXT_PUBLIC_ROKCT_BASE_URL` (public fallback)
  — the **control site**: the Frappe backend this shell points at.
  `base_sdk`'s platform gateway reads it, and the landing's plan rows come
  through it. Unset, the landing renders without a pricing section.
- `NEXT_PUBLIC_SITE_URL` — the public origin, `https://juvo.app` in
  production. `base_sdk` derives the canonical URL, the link-preview host
  line and the generated favicon letter from it.
- `ROKCT_TENANT_HOSTS` and the `ROKCT_TENANT_HOST_*` resolver settings — how
  a tenant's own domain maps to its site (`base_sdk`'s kernel; `auth_sdk`'s
  tenant-host middleware sends a resolved host to the portal login, unknown
  and preview hosts to the storefront).
- `AUTH_SECRET`, `POSTGRES_URL` / `POSTGRES_URL_NON_POOLING` — runtime only,
  for `auth_sdk`'s composed routes and its database tenant link (this shell
  serves many tenant backends, so the default link stays).
- `NEXT_PUBLIC_JUVO_DEMO_SITE` and the six `NEXT_PUBLIC_JUVO_DEMO_*_LOGIN` /
  `_PASSWORD` names — the storefront's try-it block, inlined at build time
  and hidden while unset.

## Composition

`.rokct/config/app_type` (`deliveryplatform`) names the registry template
(`The-Rokct-Protocol core/utils/frappe/composer/deliveryplatform.json`) that
is canonical for this shell's Next.js composition; the composer
(`The-Rokct-Protocol core/utils/nextjs/sdk_composer.py`) materializes
`composer.json` from it on every compose, copies SDK templates into the host
and merges their npm dependencies into `package.json`. The committed
`composer.json` is the offline mirror of that template's `sdks` block — change
the registry template first, then mirror it here so the two do not drift.

The composed SDKs are `base_sdk`, `auth_sdk`, `telemetry_sdk`, `products_sdk`
(the tenant portal's product pages) and `delivery_sdk` (the home SDK:
`.rokct/lock.json` flags it `home_sdk`, and the offline compose prints
`[i] home SDK: delivery_sdk`). There is deliberately no `agent_sdk`: its
integrations are unconditional and would flip the shell AI-first. The
composer does not generate the application shell itself: the host layer
listed under **Status** above is host-owned. Each host seam file says in its
own header which `requires` entry it answers — read those before widening
one.

`scripts/compose.sh` has two modes:

- `bash scripts/compose.sh` — Vercel, CI and developers. Verifies the
  vendored composer and every cache entry against `.rokct/lock.json`, then
  runs each cached SDK's `install.py`. Offline: no git, no network, no token.
- `bash scripts/compose.sh refresh` — a maintainer, or Actions with
  `MONOREPO_PAT`. Re-fetches the protocol composer and every SDK the registry
  template names, replaces `.rokct/cache/` wholesale, rewrites
  `.rokct/lock.json` (every SDK's pins and its `home_sdk` flag), the
  composed-output block in `.gitignore` and `package-lock.json`, and stages
  the cache. Commit the result to `main`; that commit is what ships the new
  SDK version.

The cache is listed in `.gitignore` and committed with `git add -f`. The
ignore rule is there for one reason: the fleet linter's auto-fix runs
`prettier --write . --ignore-path .gitignore` and commits the result, and
reformatting a vendored template would change the content `.rokct/lock.json`
pins — the next deploy would then refuse to compose. `refresh` stages the
cache with `-f` for the same reason, and leaves `.rokct/cache/install_state.json`
— the installers' per-checkout record — untracked.
