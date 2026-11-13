# Saikat Bairagi: personal site

A fast, hand-built portfolio site for a freelance designer, developer and digital marketer.
No frameworks and no build step: plain HTML, CSS and JavaScript modules.

**Live site:** https://saikat-bairagi.github.io

## Highlights

- Apple-inspired black and white design with light and deep green accents
- Eight pages in one site (Home, Services, Work, Products, Tools, Play, About, Contact) with soft page transitions
- Six appearance modes: Auto (time of day), System, Morning, Afternoon, Evening and Night, with a circular reveal when you switch
- Four small games (2048, Snake, Memory, Stack) that work on phone and desktop and pause when off screen
- Command palette on Ctrl or Cmd + K
- A contact form that sends straight to the inbox, with no server (see Contact form below)
- Smooth, inertial scrolling ([Lenis](https://github.com/darkroomengineering/lenis), MIT)
- Every illustration is drawn in code: animated SVG and CSS, no stock images
- Thirteen free tools that run entirely in the browser, including a QR code generator
  ([qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator), MIT)
- Responsive from small phones to large desktops, and respects `prefers-reduced-motion`
- Live local time for Khulna, a project brief builder and one-tap contact buttons

## Structure

```
index.html          Markup only
css/
  themes.css        Colour tokens for the six appearance modes
  base.css          Reset, typography, navigation, buttons, loader
  ui.css            Theme switcher, command palette, form states
  art.css           Animated SVG illustrations
  home.css          Home page sections
  pages.css         Services, Products, About, Contact
  work.css          Concept project mockups
  tools.css         Free tools UI
  games.css         Play page
  responsive.css    Tablet and mobile rules
js/
  data.js           Editable content: reviews, booking link, concepts, tool data
  main.js           Entry point: scrolling, router, reveal animations, intro
  utils.js          Shared helpers
  art.js            Illustration markup
  reviews.js        Review carousel with flags
  work.js           Concept project cards
  tools.js          The free tools
  contact.js        Project brief form, booking buttons, mail fallback
  theme.js          Appearance modes and the circular reveal
  games.js          The four games (UI and loops)
  game-logic.js     Pure game logic, no DOM
  palette.js        Command palette
  nav.js            Mobile menu (links fold into one arrow button)
assets/
  saikat.jpg        Portrait
```

## Editing content

Most changes live in `js/data.js`:

- **Add a review:** add an object to `REVIEWS` (`name`, `country`, `flag`, `text`).
- **Booking link:** set `CAL`. Leave it empty to hide every "Book a call" button.
- **Concept projects:** edit the `CON` list.

## Contact form

GitHub Pages cannot run PHP or any server code, so the form posts to
[FormSubmit](https://formsubmit.co), a free service that forwards each message to the inbox
set in `FORM_ENDPOINT` (`js/data.js`). The first time anyone submits the form, FormSubmit sends
one activation email to that inbox. Click the link in it once and every later message is delivered.

## Run locally

ES modules need a web server, so opening `index.html` directly will not work:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy

Pushed to the `main` branch of `saikat-bairagi.github.io` and served by GitHub Pages
(Settings, Pages, Deploy from a branch, `main`, root).

## Credits

Design and code by Saikat Bairagi. Fonts: Inter and Syncopate via Google Fonts.
