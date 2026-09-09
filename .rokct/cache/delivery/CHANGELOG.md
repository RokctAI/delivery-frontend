# Changelog

## 1.0.1

* The header shows the wordmark only. Ray, 2026-09-09: "i saw supacharge
  got a s logo in header, let home sdk declare if it needs logo there or
  not. supacharge text is the logo right now until i design an icon". The
  image beside the wordmark was the host shell's own
  `components/custom/brand-logo.tsx`, an asset-free placeholder that draws
  the platform's first letter on a dark square, which base_sdk's header
  rendered because nothing told it not to; juvo has no icon yet.
  * `components/custom/landing/delivery-header-menu.ts` declares
    `brand: { logo: "none" }` (base_sdk >= 1.21.0's `HeaderMenu.brand`, the
    declaration lms_sdk 1.13.0 makes): no image in the brand slot, the
    wordmark (`branding.tsx`) alone. Nothing else about the menu changes.
    When an icon is designed, the declaration becomes its path.
  * `manifest.json` names the floor: base_sdk >= 1.21.0, and
    `components/custom/landing/header-menu.ts` in `requires` at the same
    floor. Against 1.14.0-1.20.0 the field is a type error in the
    registry's `HeaderMenu`.
  * This changelog's 1.0.0 entry wraps its bare `juvo.app` URL in angle
    brackets (markdownlint MD034); the words are unchanged.

## 1.0.0

* First release: the Next.js half of the delivery product, the home SDK of
  the delivery-platform shell (RokctAI/delivery-frontend). Ray, 2026-09-09:
  the landing "will be selling a delivery platform not selling to merchants,
  his portal is the one that sell to merchants" - so this SDK is the
  storefront that sells the platform and the door to the tenant portal a
  tenant's own domain opens, and nothing else.
  * `templates/app/(chat)/page.tsx` owns `/`, on the path where the
    delivery-frontend shell keeps its holding copy (its comment: an
    `app/page.tsx` would leave two "/" routes at compose time). A signed-in
    session goes to base_sdk's manager shell at `/manager`; a visitor naming
    a tenant (`?site_name=`) or arriving on a tenant's own domain (base's
    tenant-host lookup) gets auth_sdk's `PaaSLogin`; everyone else goes to
    the composed landing at `/landing`.
  * `app/paas/dashboard/page.tsx` and `app/paas/admin/page.tsx` keep the
    paas-era portal paths answering - auth_sdk 1.6.0's `auth.config.ts`
    still falls back to them for a PaaS login whose backend names no
    `homePage` - by forwarding to base_sdk's `/manager` and `/admin`.
  * `components/custom/landing/delivery-plans-query.ts` registers at
    `// @rokct-sdk-plans-query-start`: `LANDING_CONFIG.plansQuery` with one
    filter laid over its payload, `["plan_category", "=", "paas"]`, the
    inclusive mirror of agent_sdk 1.10.0's `agent-plans-query.ts`. No plan
    id or name is in the filter; the category is the one the PaaS plan
    fixtures spell.
  * `delivery-hero-copy.ts` (`// @rokct-sdk-hero-copy-start`) and
    `delivery-hero-form.tsx` (`// @rokct-sdk-hero-form-start`): the headline
    cycles the two delivery services the delivery docs name - last-mile
    deliveries, intercity parcels - and driver dispatch, over the plan
    fixtures' white-label line; the body is two calls to action with no
    input, the pricing section and the login, since the base hero draws no
    call to action without a registered body.
  * `delivery-features-section.tsx` and `delivery-pricing-section.tsx`
    (`// @rokct-sdk-page-sections-start`, copy in
    `landing/delivery-page-sections.ts`): what the platform does, one card
    per capability with its source named beside it, and the live plan rows
    the control site returns (name, price, term, trial, feature lines with
    the fixtures' inline markup stripped, a sign-up button per plan). The
    pricing section declares `meta.renders` over the prefetched rows so it
    and its Pricing nav stop drop together when there are none.
  * `delivery-header-menu.ts` (`// @rokct-sdk-header-menu-start`): two
    anchors, `features` and `pricing`, resolved against the page's live nav.
    No groups; no actions, because base's header already draws Log in and
    Sign up.
  * `delivery-site-metadata.ts` (`// @rokct-sdk-site-metadata-start`): the
    title, tagline, description and keywords, every claim a source fact. It
    declares its own shape rather than importing base's, as hosting, lms and
    agent do, and registers no `icon`, so base_sdk >= 1.17.0's generated
    letter favicon applies.
  * `components/custom/nav/delivery-nav.tsx`: the deliveryman's sidebar
    group, taken from the delivery-frontend shell - the file base_sdk's
    `app-sidebar.tsx` imports and role-gates and names in its `requires` as
    the delivery frontend's to take. Its entries sit under `/manager`, the
    move merchants_sdk 1.1.0 made for `merchant-nav.tsx`.
  * `app/lib/paas-gateway.ts`: the paas-era tenant gateway seam at its
    import path, a one-line hand-off to base_sdk >= 1.3.0's kernel
    `paasCall` (session site first, then the request host's tenant, then
    the configured default).
  * Not shipped, because base_sdk 1.19 or auth_sdk 1.6 own the file: the
    shell's `app-sidebar.tsx` (base's has the same gating and imports this
    nav), `nav/admin-nav.tsx` (base's, pointing at its `/admin` pages),
    `nav/merchant-nav.tsx` (merchants_sdk's), `app/paas/dashboard/layout.tsx`
    (base's `app/manager/layout.tsx`), `app/lib/session.ts`,
    `session-provider.tsx`, `middleware.ts` and
    `app/services/control/global_settings.ts` (auth_sdk's), and the shell's
    seeded rokct.ai header and landing copies (base's).
  * Every word rendered comes from `zones/delivery/docs`,
    `zones/delivery/frappe`, the PaaS plan fixtures in
    `commerce/merchants/frappe/src/tenant/fixtures/Subscription_Plan`, or the
    paas_driver and paas_manager feature guides; colours route through the
    shell's theme tokens, never a literal brand colour.
  * The storefront is juvo. Ray, 2026-09-09: "deliveryplatform will be
    juvo so i will point juvo.app to it" - `delivery-site-metadata.ts`
    names the site "juvo", exactly as he wrote it (no wordmark, no
    capitalisation invented; paas_customer's own README already titles the
    customer app "Juvo"), and sets `url` to <https://juvo.app> so base's
    canonical and social-card URLs resolve there. The title leads with it.
    Nothing else on the page spelled a brand.
  * The apps section, `delivery-apps-section.tsx` (`meta.order` 50, nav
    stop "Apps", registered at `// @rokct-sdk-page-sections-start`). Ray,
    2026-09-09: "deliveryplatform will show off three apps paas_customer,
    paas_manager, paas_driver as customer, manager, delivery apps with
    downloads and demo account details for potentials to try them". Its
    data is `landing/delivery-apps.ts`, lms 1.12.0's `LMS_APPS` /
    `LMS_SHOWN_APPS` shape: `DELIVERY_APPS`, one entry per app in Ray's
    order (Customer app - paas_customer, "Juvo"; Manager app -
    paas_manager, "Manager"; Delivery app - paas_driver, "Driver"), each
    with its own feature-guide line and a `shown` flag per build, and
    `DELIVERY_SHOWN_APPS`, the filtered view every surface reads.
    * Downloads, from what each repo's RELEASE lane publishes
      (`.github/workflows/release.yml`), every href the repo's
      `releases/latest` page since assets are named per version: Android
      APK shown for all three (`build_android: true` in each; paas_manager
      and paas_driver v1.2.9 carry `app-v1.2.9.apk`); Windows shown for
      paas_manager only (`build_windows: true`, `app-windows-v1.2.9.zip`).
      Gaps, kept as `shown: false` with a `// gap:` note: paas_customer's
      release lane declares no Windows build (its CI `build.yml` does, but
      publishes no release asset); paas_driver's release lane declares
      `build_android` and `build_hms` only, although its v1.2.9 release
      still carries a Windows zip; iOS is `shown: false` everywhere ("ios
      is demoted for now") and no repo has an iOS lane or a store listing
      (`marketing/store/listing/en-US/*.txt` hold only template comments;
      `play-deploy.yml` pushes to the Play internal track, which has no
      public URL). No store URL is invented.
    * The try-it block, the one place on the page that says "demo
      account". The mechanism exists in the apps - users_sdk 1.3.8 marks a
      real production account `is_demo_account`
      (`users/frappe/fixtures/custom_field_user_is_demo_account.json`),
      auth_sdk 1.11.0 and base_sdk 1.61.0's `DemoSession` switch the app
      to its in-app demo data when that account signs in, delivery 1.22.0's
      driver facades follow it - but nothing seeds an account (an operator
      ticks the box on a User form), the login screens show no credentials
      hint, and the tour's `*@demo.rokct.ai` addresses exist only in
      auth_sdk's `MockAuthRepository`, compiled out of release builds. So
      no source spells a login and none is written here: the block reads
      `NEXT_PUBLIC_JUVO_DEMO_SITE` (the site the accounts are marked on,
      shared by the three) and, per app,
      `NEXT_PUBLIC_JUVO_DEMO_CUSTOMER_LOGIN` /
      `NEXT_PUBLIC_JUVO_DEMO_CUSTOMER_PASSWORD`,
      `NEXT_PUBLIC_JUVO_DEMO_MANAGER_LOGIN` /
      `NEXT_PUBLIC_JUVO_DEMO_MANAGER_PASSWORD`,
      `NEXT_PUBLIC_JUVO_DEMO_DRIVER_LOGIN` /
      `NEXT_PUBLIC_JUVO_DEMO_DRIVER_PASSWORD` (names in
      `DELIVERY_DEMO_ENV`; NEXT_PUBLIC_ values are inlined at build time,
      so set them where the shell is built), draws the site, login and
      password rows that are set, and draws nothing for an app whose login
      is unset - a shell built without them shows the downloads alone.
  * `delivery-header-menu.ts` gains the `apps` anchor and ONE group, "Get
    the apps", the way lms 1.12.0 added its "Get the app" cards: three
    cards from `DELIVERY_SHOWN_APPS` (label, the app's line, the releases
    page, a phone or box glyph), drawn as cards by base_sdk >= 1.18.0's
    groups panel and as plain links by 1.14.0-1.17.0. The
    `HeaderMenuIcon` names are typed locally (`DeliveryAppIcon`) rather
    than imported, as the metadata module declares its own shape.
  * Floors: base_sdk >= 1.19.0 (the home_sdk composer, protocol #390, and
    the base that shipped with it), auth_sdk >= 1.6.0, telemetry_sdk.
    auth_sdk composes before this SDK because the root route renders its
    `PaaSLogin` and the landing's login and sign-up links are its routes.
    The register page stays auth_sdk's; the delivery registration is the
    follow-up once auth_sdk 1.7.0's register registry lands.
