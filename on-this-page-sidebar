# "On this page": only show it on longer pages

How to control when the "On this page" box (Minimal Mistakes' table of contents) appears on the portfolio site (`Lurk404.github.io`).

It's turned on for every page and post in `_config.yml` (`toc: true` under `defaults`). The options below decide when it actually shows. Use either one, or both.

## Option 1: Automatic, when a page has fewer than 3 sections

Two edits keep the box and the floating "On this page" button in step with each other.

### 1. Hide the box: `_sass/portfolio/_custom.scss`

Find the rule that hides the box when it's empty:

```scss
.sidebar__right:not(:has(.toc__menu a)) {
  display: none;
}
```

Replace it with:

```scss
// "On this page" box: only shown when the page has at least 3 sections
// (counts top-level entries, usually the H2s; change the 3 to adjust)
.sidebar__right:not(:has(.toc__menu > li:nth-child(3))) {
  display: none;
}
```

This counts **top-level entries only**. A page with two H2s and lots of H3s under them counts as 2.

To change the threshold, change the `3` in `nth-child(3)`.

### 2. Hide the floating button: `_includes/page_nav_buttons.html`

On narrower screens, a floating "On this page" button copies the same list. Without this change it would still appear on pages where the box is hidden.

Find:

```js
    if (source && !source.querySelector('a')) source = null;
```

Replace it with:

```js
    /* Same rule as the box (see _custom.scss): at least 3 top-level entries */
    if (source && source.querySelectorAll(':scope > li').length < 3) source = null;
```

If you change the threshold, change the `3` here too, so the two match.

"Back to top" still shows on every page.

## Option 2: By hand, turn it off on one page

Add this to the page's front matter, between the `---` lines at the top:

```yaml
toc: false
```

This works alongside Option 1. Use it for a long page where you still don't want the box.
