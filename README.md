# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

## Offers carousel

Discounted tours can be scrolled horizontally by touch or with the Previous/Next
buttons. The buttons appear only when the cards overflow the carousel, including
after loading tours or resizing the viewport, and are disabled at either end.

## Website background

The fixed, viewport-covering background in `src/App.vue` uses
`assetUrl('/uploads/system/main.jpg')`. Page sections are transparent, with
semi-transparent panels for readable text. Tour cards and modal backgrounds
retain their own styling.

## Reviews

`src/components/Reviews.vue` loads `GET /api/public/reviews` and displays the
linked tour title, tour date, review text and reviewer's first name
in a carousel, newest tour date first.
The review date remains stored and editable in admin but is not displayed publicly.
Each scored review shows five stars and its whole-number score (0 through 5).
Existing unscored reviews do not display stars until a score is entered in admin.
Tour cards, offers, category tours and tour details show a review-count link
when reviews exist. Review-count links and the Reviews heading also show the
average score to one decimal place. Unscored reviews are excluded from the
average; zero stars counts. Links such as `#reviews-tour-1` filter the Reviews
section to that tour; **All reviews** clears the filter. Review text is initially limited
to three rendered lines, with **Read More / Read Less** for overflowing content.
Reviews are maintained in the admin's Reviews page; visitors cannot submit reviews
yet. Dates are returned as `YYYY-MM-DD` and displayed without timezone shifts.
The API database requires the reviews migration (`npm run db:reviews` in the API
directory). Load failures are shown separately from an empty reviews list.
