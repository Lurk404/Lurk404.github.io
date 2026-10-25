# Adding a project to Work

How the Work page (/work/) is put together, and how to add to it. Folders starting with `_` that Jekyll doesn't know aren't published, so this note stays out of the website.

## Where things live

- Each project is one file in `_portfolio/`, published at `/work/<file name>/`. So `_portfolio/course-outline-generator.md` is at `/work/course-outline-generator/`. Use lowercase words joined by hyphens.
- The Work page itself is `_pages/work.html`. It shows one card per project, then the accessibility demonstrations, which are ordinary pages listed there by hand.
- The collection is set up in `_config.yml` (search for `collections:`).
- The cards are drawn by `_includes/card-grid.html`, the same template the Published Work page uses. Their styles are in `_sass/portfolio/_custom.scss` (search for "Cards").

## Adding a project

Copy an existing file in `_portfolio/` and change the front matter at the top:

```yaml
---
title: "Course Outline Generator"
excerpt: "One or two sentences. This is what the card shows."
role: "Project lead and developer"   # optional, shown small on the card
years: "2021 to present"             # optional, shown after the role
order: 1                             # position on /work/ (1 comes first)
header:
  teaser: /assets/images/work/course-outline-generator.png   # optional image
last_modified_at: 2026-10-25
---
```

Then write the case study underneath in Markdown. A pattern that works: what it was for, what you did, and what came of it, each under a `##` heading.

- **Always set `excerpt`.** Without it the card has no description.
- **Give every project an `order`.** Projects are sorted by it.
- **Don't add `tags:`.** The theme would link them to the Tags page, which only lists reflections, so the links would lead nowhere.
- **Images (optional):** about 1000 × 600 pixels, the same shape for every project, with no text in the image. The card gives the image empty alt text because the title right below it names the project, so the image mustn't carry anything the title doesn't.

## Moving a page without breaking links

If a page's address changes, add the old address to the new page's front matter, and anyone following an old link is sent on:

```yaml
redirect_from: /the/old/address/
```

The old Accessibility Projects page (/accessibility/) and the WYSIWYG editor page (/accessibility/wysiwyg/) forward to Work this way.
