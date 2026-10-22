# "On this page": only show it on longer pages

How to control when the "On this page" box (Minimal Mistakes' table of contents) appears. Folders starting with `_` aren't published, so this note stays out of the website.

It's turned on for every page and reflection in `_config.yml` (`toc: true` under `defaults`). The options below decide when it actually shows. Use either one, or both.

## Option 1: Automatic, when a page has fewer than 3 sections

In `_sass/portfolio/_custom.scss`, find the rule that hides the box when it's empty:

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

This counts **top-level entries only**. A page with two H2s and lots of H3s under them counts as 2. To change the threshold, change the `3` in `nth-child(3)`.

Nothing else needs changing: the "Back to top" button checks whether the box is showing and moves to the bottom of the screen when it isn't.

## Option 2: By hand, turn it off on one page

Add this to the page's front matter, between the `---` lines at the top:

```yaml
toc: false
```

This works alongside Option 1. Use it for a long page where you still don't want the box.
