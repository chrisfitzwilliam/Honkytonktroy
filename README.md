# Honky Tonk Troy

Static website for Honky Tonk Troy at 180 North Main Street, Troy, Missouri.

- Website: <https://honkytonktroy.com/>
- Main menu: <https://honkytonktroy.com/honky-tonk-troy/#menu>
- Breakfast: <https://honkytonktroy.com/honky-tonk-troy/#breakfast>
- Repository: <https://github.com/chrisfitzwilliam/Honkytonktroy>
- Active local checkout: `C:\Users\DESKTOP\Documents\honkytonkyTROY\v4`

This directory is the Git repository and deployment root. The neighboring `website/` workspace and nested `v4/` directory contain older copies.

## Structure

There is no framework or build step. The site uses HTML, CSS and vanilla JavaScript.

```text
index.html                         Video landing page and Enter button
honky-tonk-troy/index.html          Main site, including food and breakfast menus
assets/css/site.css                Shared styles and approved Open Dark menu rules
assets/js/landing-video.js          Landing-page behavior
assets/js/nav.js                    Header, scroll tracking and menu category tabs
assets/js/parallax.js               Parallax behavior
assets/js/slideshow.js              Slideshow script
assets/menus/                      Original menu PDFs extracted from supplied messages
assets/video/                      Landing and logo videos
images/                            Site images and logos
CNAME                              honkytonktroy.com
.nojekyll                          Static GitHub Pages publishing
```

## Approved menus — October 16, 2026

The main menu contains 34 items across Appetizers, Salads, Sandwiches, Wraps and Burgers. The user selected **Open Dark**, option 2 from the local design comparison:

- Burgundy background with open rows and thin separators.
- Bold uppercase Barlow Condensed dish names, gold prices and readable descriptions.
- Item rows have no rounded frames, gradients or hover backgrounds.
- Categories use underlined text tabs; PDF actions use compact text links.

The main-menu styling is scoped to `#menu` under `MAIN MENU: OPEN DARK` in `assets/css/site.css`.

Breakfast is an independent `#breakfast` section immediately after `#menu`. It remains visible while main-menu categories change and contains 26 entries grouped into Plates; Sandwiches, Bowls & Burritos; Kids Breakfast; À La Carte; and Beverages. It uses a cream background and simple ruled rows. Its `data-nav-section="menu"` attribute keeps Menu highlighted in the site navigation while viewing breakfast.

### Source PDFs

| Supplied message, stored above this checkout | Original attachment | Published file |
| --- | --- | --- |
| `Fwd_ Troy Honky Tonk Menus.msg` | `Troy Menu 9.23.26.pdf` | [assets/menus/honky-tonk-troy-menu.pdf](assets/menus/honky-tonk-troy-menu.pdf) |
| `Fwd_ breakfast menu for Troy.msg` | `TROY BREAKFAST.pdf` | [assets/menus/honky-tonk-troy-breakfast-menu.pdf](assets/menus/honky-tonk-troy-breakfast-menu.pdf) |

Each PDF has two pages. Published files were checked against the extracted attachments and match byte for byte.

Content decisions:

- Signature Fried Fish has no price in the supplied PDF. The user confirmed **Ask for price** for the website.
- Sandwiches, wraps and burgers include tots or fries; onion rings or a side salad cost an additional **$2.99**.
- Pub Tacos are **4 tacos**; the current PDF does not include the older chips-and-salsa description.
- The supplied breakfast menu gives no serving hours. No breakfast hours were added.
- All 60 menu entries and their prices were preserved when applying the approved design.

## Local development

From this checkout:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Open <http://localhost:8000/> for the landing page or <http://localhost:8000/honky-tonk-troy/#menu> for the menu. Use HTTP for browser verification.

The separate local comparison server in `../menu-previews/` also serves this checkout's assets and current pages. When running, use <http://localhost:8765/honky-tonk-troy/#menu>. The comparison hub is <http://localhost:8765/options/>; option 2 is the approved design. That folder is outside this Git repository.

## Editing and verification

Edit menu content in `honky-tonk-troy/index.html` and styles in `assets/css/site.css`. Main-menu tabs use `.menu-tab[data-target]` and matching `.menu-panel` IDs. Keep their `aria-controls`, `aria-labelledby`, selected state and keyboard navigation consistent.

Bump the stylesheet query in the main page after CSS changes. The current value is `site.css?v=20261016-open-dark`. Bump the script query when changing navigation JavaScript; it currently uses `nav.js?v=20261016-menu-layout`.

Useful checks:

```powershell
git diff --check
node --check assets/js/nav.js
```

For menu changes, inspect desktop and phone layouts, switch all five categories, check keyboard navigation and the breakfast jump link, and open both PDFs. There is no configured automated test or build command.

The approved rollout was checked in Chromium at 1440, 390 and 320 pixels. All five categories matched the Open Dark preview's computed styles, with no horizontal overflow. Breakfast remained visible and retained its styling. The three-option preview was also checked at 768 pixels. Live-page checks confirmed the published stylesheet, category switching and the fish price label.

## Deployment

GitHub Pages publishes the repository root from `main`; `CNAME` configures `honkytonktroy.com`. Pushing `main` triggers the `pages-build-deployment` workflow.

Stage the intended files explicitly: this local checkout also contains unrelated untracked archives, images, settings and an older nested site copy.

After publishing, confirm the Pages workflow succeeded and inspect the live menu. Deployment can be checked with:

```powershell
gh run list --repo chrisfitzwilliam/Honkytonktroy --limit 3
gh api repos/chrisfitzwilliam/Honkytonktroy/pages/builds/latest
```

Menu rollout commits:

| Commit | Change |
| --- | --- |
| `7e8f804` | Extracted the PDFs, updated the main menu and added breakfast content. |
| `d18dfa2` | Moved breakfast into its own section and simplified category/PDF controls. |
| `fd7f04a` | Applied the user-approved Open Dark item layout. |

The Open Dark deployment was confirmed successful on October 16, 2026.
