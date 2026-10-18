# Premium Indian Catering Website --- Complete MERN Implementation Plan

**Document type:** Product, design, engineering, QA, and deployment
specification\
**Project:** Premium Indian catering and event website\
**Design reference:** [Anika Catering & Event --- ThemeForest
preview](https://preview.themeforest.net/item/anika-catering-event-wordpress-theme/full_screen_preview/63197912)\
**Technology:** React + Vite + JavaScript/JSX, Node.js, Express,
MongoDB, and Mongoose\
**Visual identity:** Royal maroon, antique gold, warm ivory, espresso\
**Scope:** Complete public website, menu and gallery, inquiry workflow,
admin dashboard, security, testing, SEO, and deployment

------------------------------------------------------------------------

## 1. Project Vision

Build a polished, responsive, production-ready website for a premium
Indian catering business. The visual direction should take inspiration
from the supplied Anika Catering & Event reference while establishing
its own distinct Indian identity.

The website should communicate: - Premium catering and event
hospitality. - Indian culinary heritage presented with contemporary
elegance. - Trust, attention to detail, and quality of service. - Clear
routes for visitors to explore services, menus, packages, and past
events. - A frictionless way to request a customized catering quotation.

The result must not look like a generic AI-generated template. Use
editorial layouts, realistic food and event photography, thoughtful
whitespace, carefully controlled decorative elements, and consistent
typography.

### 1.1 Core objectives

1.  Present the catering business and its services professionally.
2.  Showcase food, event arrangements, and the catering portfolio.
3.  Let visitors browse menu items and packages.
4.  Collect and manage quote inquiries reliably.
5.  Give administrators a secure content management dashboard.
6.  Make the website mobile-first, accessible, search-friendly, and
    performant.
7.  Support straightforward deployment and ongoing maintenance.

### 1.2 Scope boundaries

Included: - Public marketing pages. - Service and wedding catering
pages. - Menu catalog with search and filters. - Package listing. -
Gallery with filters and lightbox. - Testimonials. - Contact and quote
inquiry form. - Admin authentication and content management. - Inquiry
CRM-style workflow. - Media upload management. - Website settings and
SEO fields. - Automated tests, deployment instructions, and operational
safeguards.

Not included by default: - Online payments or deposits. - A customer
account system. - A fully automated booking calendar. - Inventory,
kitchen, or staff scheduling. - A complex quotation pricing engine. -
Customer-facing order tracking.

The initial workflow is **request a quote**, not an instant paid
booking. These excluded capabilities can be added as separate phases if
business requirements change.

------------------------------------------------------------------------

## 2. Brand and Visual Direction

### 2.1 Design concept

**Creative direction:** "Tradition, presented with understated luxury."

Use a balance of: - Deep maroon to establish brand identity. - Antique
gold for accents and calls to action. - Warm ivory for readable content
sections. - Espresso for body text and darker details. - Authentic
Indian catering and event photography. - Editorial layouts and
restrained ornamentation.

### 2.2 Color palette

  -----------------------------------------------------------------------
  Token                   Hex                     Intended use
  ----------------------- ----------------------- -----------------------
  Royal Maroon            `#641B2B`               Primary brand color,
                                                  buttons, selected
                                                  states

  Deep Maroon             `#45121E`               Dark sections, hover
                                                  states, footer

  Antique Gold            `#C6A15B`               Accents, outlines,
                                                  separators, icons

  Light Gold              `#E2C98F`               Subtle highlights and
                                                  decorative rules

  Warm Ivory              `#F7F0E5`               Main content background

  Pure White              `#FFFFFF`               Cards and high-contrast
                                                  surfaces

  Espresso                `#29201D`               Primary text and dark
                                                  details

  Muted Brown             `#6B5A50`               Secondary text

  Border Beige            `#E6DCCB`               Dividers and subtle
                                                  borders

  Success                 `#276749`               Success feedback

  Error                   `#B42318`               Validation and error
                                                  feedback
  -----------------------------------------------------------------------

Keep gold accents intentional. Do not use gold for long paragraphs or
low-contrast text. Check text and control contrast against accessibility
requirements.

### 2.3 Typography

Recommended pairing: - **Headings:** Cormorant Garamond or Playfair
Display. - **Body and interface:** Inter or Lato. - **Navigation and
buttons:** Body font with consistent weight and letter spacing.

Guidelines: - Use serif typography for large editorial headings and
selected section titles. - Use a readable sans-serif for paragraphs,
forms, admin tables, and controls. - Establish a consistent scale for
display, H1, H2, H3, body, small text, and labels. - Limit the number of
font families and weights. - Use `font-display: swap` and avoid
unnecessary font variants.

### 2.4 Layout and spacing

-   Prefer editorial grids and asymmetrical image-text layouts.
-   Give sections generous but consistent vertical spacing.
-   Use full-width photography for selected hero and gallery moments.
-   Use restrained card borders and modest corner radii.
-   Keep content widths readable on large screens.
-   Use a consistent spacing scale rather than arbitrary margins.
-   Avoid excessive gradients, glassmorphism, oversized rounded cards,
    decorative overload, and distracting animations.

### 2.5 Photography direction

Use realistic, high-quality imagery of: - Indian wedding catering and
banquet setups. - Traditional Indian dishes and plated food. - Brass
serving vessels and buffet counters. - Live food counters and chefs at
work. - Wedding reception table settings. - Indian sweets and
desserts. - Corporate and private event setups.

Prefer real business photography where available. Ensure the business
has appropriate rights to use uploaded images. Use optimized WebP/AVIF
where supported, responsive image sizes, descriptive alt text, and
consistent crops.

### 2.6 Interaction and animation

-   Subtle button and image hover effects.
-   Short, restrained entrance transitions.
-   Clear focus indicators for keyboard users.
-   Smooth scrolling only when it does not interfere with accessibility.
-   Respect `prefers-reduced-motion`.
-   Avoid autoplay video or animation that competes with the content.

------------------------------------------------------------------------

## 3. Sitemap and Route Plan

### 3.1 Public routes

  -----------------------------------------------------------------------
  Page                    Route                   Purpose
  ----------------------- ----------------------- -----------------------
  Home                    `/`                     Brand introduction and
                                                  primary conversion page

  About Us                `/about`                Story, philosophy,
                                                  team, and trust

  Services                `/services`             Overview of catering
                                                  services

  Service detail          `/services/:slug`       Individual service
                                                  details

  Wedding Catering        `/wedding-catering`     Wedding-specific
                                                  offerings

  Menu                    `/menu`                 Searchable and
                                                  filterable food catalog

  Packages                `/packages`             Configurable catering
                                                  packages

  Gallery                 `/gallery`              Food and event
                                                  portfolio

  Gallery detail          `/gallery/:slug`        Individual
  (optional)                                      event/project story

  Testimonials            `/testimonials`         Approved customer
                                                  reviews

  Contact                 `/contact`              Contact details and
                                                  location

  Get a Quote             `/get-a-quote`          Event inquiry form

  Privacy Policy          `/privacy-policy`       Privacy information

  Terms                   `/terms`                Website terms

  Not Found               `*`                     Helpful 404 page
  -----------------------------------------------------------------------

### 3.2 Admin routes

  Page               Route
  ------------------ --------------------------
  Admin login        `/admin/login`
  Dashboard          `/admin`
  Inquiries          `/admin/inquiries`
  Inquiry detail     `/admin/inquiries/:id`
  Services           `/admin/services`
  Menu categories    `/admin/menu/categories`
  Menu items         `/admin/menu/items`
  Packages           `/admin/packages`
  Gallery            `/admin/gallery`
  Testimonials       `/admin/testimonials`
  Media library      `/admin/media`
  Website settings   `/admin/settings`
  Admin account      `/admin/account`

Protect all admin routes in the frontend for navigation and in the
backend for actual authorization. Frontend route protection is not a
security boundary.

------------------------------------------------------------------------

## 4. Page-by-Page Design Specification

### 4.1 Homepage

The homepage should immediately communicate premium catering, Indian
hospitality, and trustworthiness.

Recommended section order:

1.  Hero and navigation.
2.  Brand story / introduction.
3.  Services overview.
4.  Signature culinary experience.
5.  Featured menu.
6.  Gallery / recent celebrations.
7.  Why choose us.
8.  Testimonials.
9.  Quote inquiry CTA.
10. Footer.

#### Hero and navigation

-   Full-width, high-quality wedding or catering photograph.
-   Overlay that keeps text legible without obscuring the image.
-   Transparent or deep-maroon header depending on image contrast.
-   Logo on the left.
-   Navigation links: About, Services, Wedding Catering, Menu, Gallery,
    Contact.
-   Primary CTA: "Get a Quote."
-   Mobile navigation with an accessible toggle and visible focus state.

Suggested headline: \> An Artful Feast for Life's Grandest Celebrations.

Supporting copy should explain the business's catering offering in one
or two concise sentences. Do not publish unverified claims about
experience, awards, guest counts, or clients.

#### Brand story section

-   Warm ivory background.
-   Editorial split layout.
-   One large image and a short brand introduction.
-   Gold divider or restrained Indian-inspired detail.
-   CTA to About Us.

#### Services overview

Suggested categories: - Wedding catering. - Engagement ceremonies. -
Receptions. - Corporate events. - Private parties. - Traditional
celebrations.

Each tile should include an image, title, short description, and link to
the relevant service page.

#### Signature culinary experience

Showcase actual service strengths such as: - Regional Indian cuisine. -
Live food counters. - Traditional sweets. - Custom menu planning. -
Buffet or plated service, if offered.

#### Featured menu

Show a curated selection of menu items with a link to the complete menu.
Menu content must be managed through the admin panel.

#### Gallery preview

Use a visually curated grid with a clear "View Gallery" link. Prioritize
strong photography rather than filling the section with too many images.

#### Why choose us

Only display confirmed business differentiators, for example
customization, presentation, menu flexibility, hygiene practices, or
service coordination when verified by the business owner.

#### Testimonials

Show only authentic, approved customer reviews. Include a customer name
or approved attribution and event type only with permission.

#### Inquiry CTA and footer

-   Clear invitation to plan an event.
-   Short inquiry form or link to the quote page.
-   Contact information and WhatsApp link.
-   Social links.
-   Service and policy links.
-   Copyright and business identity.

### 4.2 About Us

Include: - Brand story and founding background. - Culinary philosophy
and hospitality approach. - Chef/team profiles where applicable. -
Confirmed quality and service commitments. - Real business
photographs. - CTA: "Plan Your Celebration."

Do not invent certifications, years of experience, client names, or
scale-of-business claims.

### 4.3 Services overview and detail pages

Each service detail page should use a reusable template: - Hero image
and service title. - Short introduction. - What the service includes. -
Menu customization options. - Available service formats. - Event types
and guest-count ranges, if confirmed. - Related gallery images. -
Frequently asked questions. - "Request a Customized Quote" CTA.

The wedding catering page should have a richer visual treatment,
wedding-specific imagery, ceremony-related options, regional cuisine
choices, multi-event wedding arrangements where offered, and a prominent
quote CTA.

### 4.4 Menu

Build a browsable catalog, not a static text list.

Required features: - Search dishes by name. - Filter by category and
cuisine. - Filter by vegetarian/non-vegetarian status and dietary
attributes where verified. - Dish image, name, description, and optional
price. - Availability or visibility controls. - Pagination or "load
more" for large catalogs. - Optional shortlist of dishes for an event. -
"Send My Menu Preferences" action that carries selected dishes into the
inquiry form.

Suggested categories: - Welcome drinks. - Starters. - Main course. -
Breads. - Rice and biryani. - Desserts and sweets. - Beverages. - Live
counters.

The actual catalog must be configured by the business. Prices should be
optional because final catering cost may depend on guest count, venue,
service style, and selected dishes.

### 4.5 Packages

Each package may include: - Name and short description. - Minimum guest
count where applicable. - Included food categories. - Service and setup
inclusions. - Optional add-ons. - Starting price or "Request a quote." -
CTA to customize.

The admin controls which prices and inclusions are public. Never imply
an indicative starting price is the final quotation.

### 4.6 Gallery

Required features: - Category filters for events, buffet setups, food,
live counters, desserts, and other configured categories. - Responsive
grid or masonry-style layout. - Full-screen lightbox. - Next/previous
navigation. - Keyboard navigation and Escape-to-close. - Captions and
alternative text. - Optimized thumbnails and on-demand full-resolution
images. - Publication and ordering controls in the admin panel.

### 4.7 Testimonials

-   Show only real, authorized customer reviews.
-   Allow an approved display name or attribution.
-   Optionally include event type and date.
-   Admin CRUD operations.
-   Draft/published state.
-   Public APIs return published testimonials only.

### 4.8 Contact

Include: - Phone and email. - WhatsApp contact. - Business address and
service area. - Operating hours. - Social media links. - Map link or
embedded map, if appropriate. - Short inquiry CTA.

Business contact information should be configurable from the admin
panel.

### 4.9 Get a Quote

Recommended fields:

  Field                     Requirement
  ------------------------- -----------------------------------------
  Name                      Required
  Phone                     Required
  Email                     Optional or required by business policy
  Event type                Required
  Event date                Required if known; make configurable
  Guest count               Required or configurable
  Event location            Required or configurable
  Catering preferences      Optional
  Budget range              Optional
  Selected dishes/package   Optional
  Additional message        Optional

On submission: 1. Validate input in the browser for usability. 2.
Validate again on the server. 3. Create the inquiry in MongoDB. 4.
Return a clear success message and reference ID. 5. Notify the business
through the configured notification provider. 6. Handle notification
failure without losing the saved inquiry.

Add anti-spam protection such as rate limiting and a honeypot; use a
CAPTCHA provider only if justified by spam levels. Avoid collecting more
personal data than necessary.

------------------------------------------------------------------------

## 5. Technology Stack and Architecture

### 5.1 Stack

  Layer            Technology                      Responsibility
  ---------------- ------------------------------- ----------------------------------
  Frontend         React + Vite + JavaScript/JSX   Public pages and admin UI
  Routing          React Router                    Public, detail, and admin routes
  Styling          Tailwind CSS or organized CSS   Responsive brand styling
  Forms            React Hook Form + Zod           Form state and validation
  API client       Axios                           HTTP requests
  Backend          Node.js + Express               REST APIs and business logic
  Database         MongoDB Atlas + Mongoose        Content and inquiry records
  Authentication   JWT and bcrypt                  Admin authentication
  Media            Storage adapter                 Image upload and delivery
  Email            Configurable email provider     Inquiry notifications
  Deployment       Nginx + PM2 + HTTPS             Hosting and process management

Use JavaScript and JSX rather than TypeScript. Keep database
credentials, JWT secrets, email credentials, and storage secrets
exclusively on the backend.

### 5.2 High-level architecture

``` text
Visitor / Admin Browser
        |
        v
React + Vite Frontend
        |
        v
Nginx / HTTPS
        |
        +--------------------> React static build
        |
        v
Express REST API
        |
        +--> MongoDB Atlas
        +--> Image Storage Adapter
        +--> Email / Notification Provider
        +--> Logging / Monitoring
```

### 5.3 Project structure

``` text
catering-website/
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── common/
│       │   ├── layout/
│       │   ├── home/
│       │   ├── services/
│       │   ├── menu/
│       │   ├── gallery/
│       │   └── forms/
│       ├── pages/
│       │   ├── public/
│       │   └── admin/
│       ├── layouts/
│       ├── routes/
│       ├── hooks/
│       ├── services/
│       ├── context/
│       ├── utils/
│       ├── styles/
│       ├── App.jsx
│       └── main.jsx
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── utils/
│   │   ├── jobs/
│   │   ├── app.js
│   │   └── server.js
│   ├── scripts/
│   ├── .env.example
│   └── package.json
├── docs/
│   ├── api-specification.md
│   ├── data-models.md
│   └── deployment.md
├── .gitignore
└── README.md
```

Keep controllers thin. Put reusable business logic in services, and
centralize validation, authorization, logging, and API error handling.

------------------------------------------------------------------------

## 6. Database Design

Use Mongoose schemas with timestamps, validation, indexes, and clearly
defined ownership of data.

### 6.1 AdminUser

Suggested fields: - `name` - `email` --- normalized and unique. -
`passwordHash` - `role` --- begin with `admin`; add roles only if
required. - `isActive` - `lastLoginAt` - timestamps.

Never store plaintext passwords or expose password hashes in API
responses.

### 6.2 Service

Suggested fields: - `title` - `slug` --- unique. - `summary` -
`description` - `image` - `gallery` - `features` - `seoTitle` -
`seoDescription` - `status` --- draft/published. - `sortOrder` -
timestamps.

### 6.3 MenuCategory

Suggested fields: - `name` - `slug` - `description` - `sortOrder` -
`isActive` - timestamps.

### 6.4 MenuItem

Suggested fields: - `name` - `slug` - `categoryId` - `description` -
`image` - `cuisine` - `dietaryTags` - `price` --- optional. -
`availability` - `status` - `sortOrder` - timestamps.

### 6.5 Package

Suggested fields: - `name` - `slug` - `description` - `startingPrice`
--- optional. - `minGuests` --- optional. - `inclusions` - `addOns` -
`image` - `status` - `sortOrder` - timestamps.

### 6.6 GalleryItem

Suggested fields: - `title` - `slug` --- if detail pages are needed. -
`imageUrl` - `thumbnailUrl` - `storageProvider` - `storageKey` -
`category` - `caption` - `altText` - `eventDate` --- optional. -
`published` - `sortOrder` - timestamps.

### 6.7 Testimonial

Suggested fields: - `customerName` or approved attribution. -
`eventType` - `review` - `eventDate` --- optional. - `published` -
`sortOrder` - timestamps.

### 6.8 Inquiry

Suggested fields: - `name` - `phone` - `email` - `eventType` -
`eventDate` - `guestCount` - `location` - `budgetRange` -
`selectedItems` --- store relevant snapshots as well as references if
useful. - `message` - `status` - `internalNotes` - `source` -
`statusHistory` --- optional audit entries. - timestamps.

Suggested status values: - `new` - `contacted` - `quoted` -
`confirmed` - `completed` - `cancelled`

Validate status transitions in the service layer if workflow rules are
required.

### 6.9 SiteSettings

Suggested fields: - `businessName` - `logo` - `favicon` - `contact` -
`address` - `serviceArea` - `operatingHours` - `socialLinks` -
`whatsApp` - `hero` - `footer` - `defaultSeo` - timestamps.

### 6.10 Database rules

-   Use references for relationships such as menu category IDs.
-   Add unique indexes for admin email and relevant slugs.
-   Index common filters and sorting fields after reviewing query
    patterns.
-   Paginate large collections.
-   Keep inquiry records independent from mutable menu documents so
    historical requests are not silently changed by later menu edits.
-   Treat customer contact information and internal notes as private.
-   Define deletion and retention policies.
-   Use database-level access controls and least-privilege credentials.

### 6.11 Media storage abstraction

Use a storage service interface to make provider changes possible
without rewriting business logic.

``` js
const storage = {
  async upload(file, options) {
    // Upload using the configured provider.
  },

  async delete(fileKey) {
    // Delete the managed asset.
  }
};
```

Supported options: - Cloudinary. - Managed local/VPS storage.

For VPS storage: - Keep uploads outside the application source
directory. - Validate actual file content, MIME type, dimensions, and
size. - Generate safe filenames. - Prevent arbitrary path access and
executable uploads. - Configure backup, retention, and disk
monitoring. - Serve media through a controlled static path or media
service.

Store URLs and metadata in MongoDB, not raw image binaries.

------------------------------------------------------------------------

## 7. REST API Specification

Use a versioned prefix: `/api/v1`.

### 7.1 Public endpoints

  Method   Endpoint                    Purpose
  -------- --------------------------- -----------------------------------
  GET      `/api/v1/health`            Health check
  GET      `/api/v1/site-settings`     Public brand and contact settings
  GET      `/api/v1/services`          Published services
  GET      `/api/v1/services/:slug`    Service detail
  GET      `/api/v1/menu-categories`   Active categories
  GET      `/api/v1/menu-items`        Search/filter menu items
  GET      `/api/v1/packages`          Published packages
  GET      `/api/v1/gallery`           Published gallery items
  GET      `/api/v1/testimonials`      Approved testimonials
  POST     `/api/v1/inquiries`         Create a quote inquiry

Listing endpoints should support validated query parameters where
relevant: - `page` - `limit` - `search` - `category` - `cuisine` -
`sort`

Enforce maximum page sizes and allowlist sort fields.

### 7.2 Admin authentication endpoints

  ------------------------------------------------------------------------------
  Method                  Endpoint                       Purpose
  ----------------------- ------------------------------ -----------------------
  POST                    `/api/v1/admin/auth/login`     Authenticate admin

  POST                    `/api/v1/admin/auth/logout`    End session / revoke
                                                         token as implemented

  GET                     `/api/v1/admin/auth/me`        Current admin identity

  POST                    `/api/v1/admin/auth/refresh`   Optional refresh flow
                                                         if implemented
  ------------------------------------------------------------------------------

### 7.3 Admin content endpoints

Implement authenticated CRUD routes for: - Services. - Menu
categories. - Menu items. - Packages. - Gallery items. - Testimonials. -
Website settings. - Media.

Example route patterns: - `GET /api/v1/admin/services` -
`POST /api/v1/admin/services` - `PATCH /api/v1/admin/services/:id` -
`DELETE /api/v1/admin/services/:id`

Repeat appropriate patterns for other resources. Support publication,
sorting, pagination, and validation where needed.

### 7.4 Admin inquiry endpoints

  -------------------------------------------------------------------------------
  Method                  Endpoint                        Purpose
  ----------------------- ------------------------------- -----------------------
  GET                     `/api/v1/admin/inquiries`       List, search, filter,
                                                          paginate

  GET                     `/api/v1/admin/inquiries/:id`   View one inquiry

  PATCH                   `/api/v1/admin/inquiries/:id`   Update status, notes,
                                                          or permitted fields

  DELETE                  `/api/v1/admin/inquiries/:id`   Optional restricted
                                                          deletion under a
                                                          defined retention
                                                          policy
  -------------------------------------------------------------------------------

### 7.5 API response format

Use a consistent response shape.

Success example:

``` json
{
  "success": true,
  "message": "Inquiry submitted successfully",
  "data": {
    "inquiryId": "generated-record-id"
  }
}
```

Validation error example:

``` json
{
  "success": false,
  "message": "Please correct the highlighted fields",
  "errors": [
    {
      "field": "phone",
      "message": "Enter a valid phone number"
    }
  ]
}
```

Use appropriate HTTP status codes. Do not return internal notes,
password hashes, secrets, stack traces, or private admin fields from
public endpoints.

------------------------------------------------------------------------

## 8. Admin Dashboard Specification

The admin dashboard should be a real content management system that lets
the business owner update the website without editing source code.

### 8.1 Navigation

-   Dashboard.
-   Inquiries.
-   Services.
-   Menu & Categories.
-   Packages.
-   Gallery.
-   Testimonials.
-   Media Library.
-   Website Settings.
-   Admin Account.

### 8.2 Dashboard overview

Display useful operational information: - Total inquiries. - New
inquiries awaiting follow-up. - Inquiries contacted or quoted. -
Confirmed events, if tracked. - Recent inquiries with event dates and
guest counts. - Upcoming event dates. - Inquiry trends over a selected
period. - Quick actions to add a dish, service, package, or gallery
image.

All statistics must come from actual database records. Do not ship
fabricated business statistics or dummy production charts.

### 8.3 Inquiry management

Each inquiry detail view should show: - Customer contact details. -
Event type, date, location, and guest count. - Requested menu items and
package. - Budget and special requests, if provided. - Submission
timestamp and source. - Current status and status history. - Internal
notes. - Click-to-call, email, and WhatsApp actions. - Status update
control.

Internal notes must never appear in public pages or public API
responses.

### 8.4 Content management

For each manageable resource, support: - Create. - Edit. - Preview where
appropriate. - Publish/unpublish. - Delete with confirmation. -
Required-field validation. - Image selection and replacement. -
Draft/published state where appropriate. - Sort order for curated
homepage sections. - SEO title, description, and slug. - Helpful empty
states and actionable errors.

Use soft deletion only where retention or recovery is needed. Preserve
historical inquiry records when deleting or editing menu content.

### 8.5 Media library

-   Upload images.
-   View thumbnails and metadata.
-   Replace or remove managed assets.
-   Validate file types and sizes.
-   Show upload progress and errors.
-   Prevent deletion of assets still referenced by published content
    unless replacement or confirmation is handled.
-   Support storage-provider metadata.

------------------------------------------------------------------------

## 9. Inquiry Workflow

``` text
Visitor submits quote form
        |
        v
Validate and sanitize request
        |
        v
Is the request acceptable?
   | No          | Yes
   v             v
Return errors   Save inquiry in MongoDB
                    |
                    +--> Show confirmation and reference
                    |
                    +--> Notify business
                              |
                              v
                       Admin reviews inquiry
                              |
                              v
                       Contact customer
                              |
                              v
                       Prepare quotation
                              |
                              v
                       Customer decision
                         /         \
                    Accepted     Declined
                       |             |
                       v             v
                  Confirmed       Cancelled
```

Reliability requirements: - Save the inquiry before attempting
notifications. - Do not lose saved inquiries if email delivery fails. -
Record notification failures for retry or manual follow-up. - Rate-limit
public inquiry submissions. - Consider idempotency or duplicate
detection to handle repeated submissions safely. - Keep customer data
out of unnecessary logs. - Use a clear success state without claiming
the event is booked or confirmed.

------------------------------------------------------------------------

## 10. Reusable Components and Design System

### 10.1 Shared components

  Component           Responsibility
  ------------------- -----------------------------------------------------
  `Header`            Responsive navigation, logo, mobile menu, quote CTA
  `Footer`            Contact, links, social media, business details
  `SectionHeading`    Serif title, eyebrow label, optional gold divider
  `PrimaryButton`     Maroon fill and accessible text
  `SecondaryButton`   Gold outline or understated link
  `ServiceCard`       Image, heading, summary, link
  `MenuItemCard`      Image, category, title, dietary indicators
  `PackageCard`       Package details, optional price, CTA
  `GalleryGrid`       Responsive images and lightbox integration
  `TestimonialCard`   Approved review and attribution
  `QuoteForm`         Validated inquiry form
  `WhatsAppCTA`       Configurable business contact link
  `Breadcrumbs`       Accessible page hierarchy
  `AdminTable`        Sorting, pagination, filtering, row actions
  `ConfirmDialog`     Confirmation for destructive actions
  `Toast`             Success and error feedback
  `LoadingState`      Consistent loading UI
  `EmptyState`        Helpful message and next action
  `ErrorState`        Clear failure and retry behavior

### 10.2 Responsive behavior

Initial breakpoints: - Mobile: below 768px. - Tablet: 768px--1279px. -
Desktop: 1280px and above.

These are starting points, not rigid rules. Adjust based on real
content.

Desktop: - Full navigation. - Large editorial imagery. - Two-column
sections. - Spacious content grids.

Tablet: - Reduced grid columns. - Compact navigation. - Stack content
where necessary.

Mobile: - Collapsible navigation. - Single-column forms. -
Touch-friendly controls. - Responsive images. - Easy access to contact
and quote actions. - No horizontal overflow. - Tables that adapt to
cards or controlled horizontal scrolling where appropriate.

### 10.3 Form behavior

-   Label every field.
-   Show inline validation messages.
-   Preserve user input when server validation fails.
-   Disable duplicate submission while a request is in progress.
-   Show success and failure feedback.
-   Make error states accessible to screen readers.
-   Ensure all controls work with keyboard navigation.

------------------------------------------------------------------------

## 11. Security and Privacy

### 11.1 Authentication

-   Create the initial admin through a controlled setup or seed script.
-   Do not expose public admin registration.
-   Hash passwords using bcrypt or another appropriate password-hashing
    algorithm.
-   Protect every admin API route on the server.
-   Use generic login failure messages.
-   Add login rate limiting.
-   Support session expiration and logout.
-   Consider audit logs for important administrative actions.

Preferred browser authentication where feasible: - Secure, HTTP-only
cookies. - `Secure` in production. - Appropriate `SameSite` settings. -
CSRF protection when applicable.

If bearer tokens are used instead, avoid long-lived credentials in local
storage and carefully implement expiration, refresh, and revocation.

### 11.2 API protection

-   Validate and sanitize all input.
-   Use allowlisted update fields to prevent mass assignment.
-   Restrict CORS to approved origins.
-   Configure Helmet and suitable security headers.
-   Limit request body sizes.
-   Rate-limit sensitive and public write endpoints.
-   Return generic production errors.
-   Do not log passwords, tokens, or unnecessary customer details.
-   Keep secrets in environment variables and exclude `.env` from Git.

### 11.3 Upload protection

-   Validate file type, actual content, dimensions, and size.
-   Generate safe filenames or provider keys.
-   Reject executable or unexpected files.
-   Avoid unsafe SVG rendering unless properly sanitized.
-   Prevent path traversal.
-   Restrict upload endpoints to authorized administrators.
-   Avoid arbitrary remote URL fetching.
-   Apply safe cache headers and content types.

### 11.4 Data privacy

-   Collect only data needed to respond to inquiries.
-   Explain how submitted information is used.
-   Restrict inquiry access to authorized administrators.
-   Define retention and deletion rules.
-   Keep internal notes private.
-   Avoid unnecessary exposure of customer data in analytics and logs.
-   Use appropriate backups and access controls.

------------------------------------------------------------------------

## 12. SEO, Performance, and Accessibility

### 12.1 SEO

Implement: - Unique page titles and meta descriptions. - Clean URLs and
canonical links. - XML sitemap and `robots.txt`. - Open Graph
metadata. - Descriptive image alt text. - Breadcrumb navigation. -
Internal links between services, menus, packages, gallery, and quote
pages. - Correct indexation of public pages. - Meaningful 404 pages. -
Structured data where accurate: `LocalBusiness`, `FoodEstablishment`
when applicable, `Service`, and `BreadcrumbList`. - Consistent business
name, address, phone, and hours.

Create location-specific content only for actual service areas. Avoid
mass-producing duplicate location pages.

### 12.2 Performance targets

Initial targets measured on production pages and real devices:

  -----------------------------------------------------------------------
  Metric                                                             Goal
  ------------------------------ ----------------------------------------
  Largest Contentful Paint (LCP)                      2.5 seconds or less

  Interaction to Next Paint                                200 ms or less
  (INP)                          

  Cumulative Layout Shift (CLS)                               0.1 or less

  Lighthouse                                  Aim for 90+ in Performance,
                                   Accessibility, Best Practices, and SEO
  -----------------------------------------------------------------------

Targets are goals, not guarantees; measure and iterate.

Optimization measures: - Responsive `srcset` and correctly sized
images. - WebP/AVIF where supported. - Lazy-load below-the-fold
images. - Preload only the true hero image when useful. - Reserve image
dimensions to prevent layout shifts. - Split bundles by route. - Keep
admin code out of the public initial bundle. - Avoid unnecessary
dependencies. - Use caching where safe. - Optimize database queries and
indexes.

### 12.3 Accessibility

-   Semantic HTML landmarks.
-   Logical heading hierarchy.
-   Keyboard navigation.
-   Visible focus indicators.
-   Accessible labels and descriptions.
-   Sufficient contrast.
-   Meaningful alt text.
-   Keyboard-accessible gallery/lightbox.
-   Reduced-motion support.
-   Accessible validation and status messages.
-   Screen-reader-friendly controls and menus.

------------------------------------------------------------------------

## 13. Implementation Roadmap

### Phase 1 --- Foundation and design system

Deliverable: approved visual foundation.

Tasks: - Initialize frontend and backend. - Configure environment files,
routing, linting, and error handling. - Define colors, typography,
spacing, buttons, and shared components. - Build header, footer, and
homepage shell. - Select approved logo and photography assets.

### Phase 2 --- Public website

Deliverable: all public routes work responsively.

Tasks: - Build Home, About, Services, and Wedding Catering. - Build Menu
search and filters. - Build Packages. - Build Gallery and Lightbox. -
Build Testimonials, Contact, and Get a Quote. - Add loading, empty,
error, and 404 states. - Test responsive layouts.

### Phase 3 --- Backend and database

Deliverable: persistent, validated content and inquiry APIs.

Tasks: - Define Mongoose schemas and indexes. - Add controlled admin
setup scripts. - Implement public content endpoints. - Implement quote
submission. - Add admin authentication and authorization. - Implement
media storage abstraction. - Add notification integration. - Standardize
errors and validation.

### Phase 4 --- Admin dashboard

Deliverable: business can manage website content without code changes.

Tasks: - Build login and dashboard. - Implement inquiry list, detail,
filtering, and status workflow. - Implement CRUD for services, menu,
packages, gallery, and testimonials. - Add website settings, media
management, and SEO fields. - Connect every screen to actual API and
database records.

### Phase 5 --- QA, security, and optimization

Deliverable: release candidate passes agreed tests.

Tasks: - Test public flows, CRUD, and authorization. - Verify mobile
layouts and browser compatibility. - Test upload restrictions, rate
limits, validation, and failure scenarios. - Optimize image delivery and
frontend bundles. - Validate metadata, accessibility, and error
handling. - Test database backup and restoration.

### Phase 6 --- Production deployment

Deliverable: public website and admin are live on HTTPS.

Tasks: - Configure production environment variables and database
access. - Build the React app. - Configure Nginx. - Run Express under
PM2. - Configure HTTPS and DNS. - Verify email delivery, media uploads,
backups, and logging. - Document deployment and rollback.

------------------------------------------------------------------------

## 14. Deployment Architecture

Recommended deployment: - Frontend: Vite production build served by
Nginx. - Backend: Express under PM2 on a local port. - Database: MongoDB
Atlas with restricted network access and least-privilege database
credentials. - Domain: public website domain, with `/api`
reverse-proxied to Express or a separate API subdomain. - HTTPS:
Certbot/Let's Encrypt or equivalent. - Media: Cloudinary or managed VPS
storage. - Deployment: repeatable scripts or CI/CD with build
verification and rollback instructions.

Example topology:

``` text
Visitors / Admins
       |
       v
Nginx + HTTPS
       |
       +----> React static build
       |
       +----> /api/* ----> Express on localhost
                              |
                              +--> MongoDB Atlas
                              +--> Image Storage
                              +--> Email Provider

PM2 manages the Express process.
```

For same-origin `/api`: - Forward API requests to Express. - Serve the
React build for frontend routes. - Ensure SPA fallback rules do not
intercept API requests. - Keep the Express port inaccessible from the
public internet where possible. - Configure request timeouts and upload
limits appropriately.

Use separate development and production environments. Never put secrets
in frontend environment variables or commit them to Git.

### 14.1 Environment variable examples

Backend `.env.example`:

``` dotenv
NODE_ENV=development
PORT=5000
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=15m
CLIENT_ORIGIN=http://localhost:5173
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=
ADMIN_SETUP_SECRET=
STORAGE_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Adjust variables to the selected authentication and storage
implementations. Do not commit real values. Do not expose backend
secrets using Vite variables prefixed with `VITE_`.

Frontend example:

``` dotenv
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

In production, this may be a same-origin `/api/v1` URL.

### 14.2 Deployment checklist

-   [ ] DNS points to the correct server.
-   [ ] HTTPS works for the intended hostname(s).
-   [ ] Nginx configuration validates.
-   [ ] Frontend build succeeds.
-   [ ] Express starts and remains healthy under PM2.
-   [ ] MongoDB Atlas connectivity is restricted and verified.
-   [ ] Environment variables are set securely.
-   [ ] Admin setup is complete and public registration is disabled.
-   [ ] Quote submission persists data.
-   [ ] Notification delivery is verified.
-   [ ] Uploads work and are protected.
-   [ ] Public routes survive refresh and deep linking.
-   [ ] API routes are not swallowed by SPA fallback.
-   [ ] Backup and restore procedures are documented and tested.
-   [ ] Logs and monitoring are available.
-   [ ] Rollback steps are documented.

------------------------------------------------------------------------

## 15. Testing Strategy

### 15.1 Public website checklist

-   [ ] All routes load and refresh correctly.
-   [ ] Navigation, footer, and breadcrumbs work.
-   [ ] Images load with correct sizing and alt text.
-   [ ] Menu search and filters work together.
-   [ ] Gallery filtering and lightbox navigation work.
-   [ ] Quote form validates and submits.
-   [ ] Duplicate submissions are handled safely.
-   [ ] WhatsApp and contact links open correctly.
-   [ ] Mobile layouts have no horizontal overflow.
-   [ ] Loading, empty, error, and 404 states are clear.

### 15.2 Admin checklist

-   [ ] Invalid credentials are rejected.
-   [ ] Unauthenticated API requests are rejected.
-   [ ] Create, edit, and delete work for each content type.
-   [ ] Publish/unpublish affects public APIs correctly.
-   [ ] Menu categories and dishes remain linked.
-   [ ] Upload, replacement, and deletion work.
-   [ ] Inquiry search, filters, and pagination work.
-   [ ] Status updates and internal notes persist.
-   [ ] Internal notes are not exposed publicly.
-   [ ] Settings changes appear on the public site.
-   [ ] Destructive actions require confirmation.

### 15.3 Security and production checklist

-   [ ] Secrets are not exposed in frontend builds.
-   [ ] Invalid and oversized uploads are rejected.
-   [ ] Rate limits and input validation work.
-   [ ] Admin APIs enforce server-side authorization.
-   [ ] Errors do not leak stack traces or secrets.
-   [ ] HTTPS, DNS, and SPA routing work.
-   [ ] Database backup and restoration are tested.
-   [ ] Notification failure does not lose saved inquiries.
-   [ ] Access controls and retention policies are documented.

### 15.4 Automated tests

Use Playwright for end-to-end browser tests and a suitable Node test
framework for backend unit/integration tests.

Recommended automated flows: - Public navigation and responsive smoke
tests. - Menu search, category filters, and selected-dish inquiry. -
Quote submission and validation failures. - Admin authentication and
unauthorized access prevention. - CRUD operations for every content
resource. - Upload validation and gallery interactions. - Inquiry status
updates and internal-note privacy. - End-to-end verification using a
dedicated test database.

Do not run destructive tests against the live production database. Use
isolated test users and seeded test data.

------------------------------------------------------------------------

## 16. Final Deliverables

The finished project should include:

1.  Complete responsive public catering website.
2.  Reusable maroon-and-antique-gold design system.
3.  All agreed public pages and dynamic detail pages.
4.  Searchable menu catalog and filters.
5.  Packages listing.
6.  Gallery filters and lightbox.
7.  Quote inquiry workflow.
8.  Secure admin dashboard and CRUD operations.
9.  Inquiry management with status tracking and internal notes.
10. MongoDB schemas, indexes, and controlled setup scripts.
11. REST API validation, authentication, authorization, and error
    handling.
12. Media upload abstraction and storage configuration.
13. SEO metadata and structured data where appropriate.
14. Accessibility and performance improvements.
15. Automated smoke, API, and end-to-end tests.
16. `.env.example` files and setup instructions.
17. API, database, and deployment documentation.
18. Production deployment and rollback instructions.

------------------------------------------------------------------------

## 17. Recommended Execution Order

Start with: 1. Confirm the business name, logo, service area, and
contact details. 2. Approve the visual direction, typography, and
photography. 3. Build the homepage, header, footer, and core design
tokens. 4. Build two or three representative components, such as a
service card, menu item card, and quote form. 5. Reuse the approved
design system across all remaining pages. 6. Build backend models and
public APIs. 7. Connect the inquiry workflow. 8. Implement the admin
dashboard. 9. Complete automated tests and security checks. 10. Deploy
to staging, obtain business approval, and release to production.

Implement the design system before building every page independently.
This reduces inconsistent typography, spacing, buttons, and card styles.

### Business details to confirm

-   **Business name:** Used in logo, header, metadata, and copy.
-   **Service location:** Used in contact details, service coverage, and
    local SEO.
-   **Contact details:** Phone, email, WhatsApp, address, and social
    links.
-   **Actual services and menu:** Prevents invented offerings or claims.
-   **Pricing policy:** Public prices, starting prices, or quote-only.
-   **Storage preference:** Cloudinary or VPS-managed media.
-   **Notification preference:** Email or another configured channel.
-   **Deployment domain:** Public website and optional API subdomain.

These values should be configurable wherever possible rather than
hard-coded into the application.

------------------------------------------------------------------------

## 18. Acceptance Criteria

The project is ready for release when:

-   All agreed public routes are implemented and responsive.
-   Published content is loaded from the backend where content
    management is required.
-   Public inquiry submissions are validated, persisted, and
    acknowledged.
-   Admins can securely manage all agreed content types.
-   Admin authorization is enforced by the backend.
-   Gallery, menu filtering, and quote flows work end-to-end.
-   Uploads are validated and stored using the selected provider.
-   SEO metadata, accessibility basics, and image optimization are
    implemented.
-   Automated tests cover the agreed critical flows.
-   Production secrets are secured and environment separation is in
    place.
-   Backup, restore, logging, and deployment procedures are documented.
-   Business-specific claims, contact details, prices, and testimonials
    have been reviewed and approved.

**Final principle:** Build a premium, content-led catering brand
experience first, then support it with a secure and maintainable MERN
backend. The public website should be visually distinctive; the admin
should be straightforward; and every inquiry should be handled reliably.
