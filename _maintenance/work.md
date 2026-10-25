# Adding a project to Work

How the Work page (/work/) is put together, and how to add to it. Folders starting with `_` that Jekyll doesn't know aren't published, so this note stays out of the website.

## Where things live

- Each project is one file in `_portfolio/`, published at `/work/<file name>/`. So `_portfolio/course-outline-generator.md` is at `/work/course-outline-generator/`. Use lowercase words joined by hyphens.
- The Work page itself is `_pages/work.html`. It shows one card per project, then a second set of cards for the accessibility demonstrations: the projects with `status: "Demonstration"`.
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
featured: true                       # optional: also shows it on the home page
order: 1                             # position on /work/ and the home page (1 comes first)
header:
  teaser: /assets/images/work/course-outline-generator.png   # optional image
last_modified_at: 2026-10-25
---
```

Then write the case study underneath in Markdown. A pattern that works: what it was for, what you did, and what came of it, each under a `##` heading.

- **Always set `excerpt`.** Without it the card has no description.
- **Give every project its own `order`.** Projects are sorted by it. A project without one goes first, and two with the same number can swap places between builds.
- **Featured projects:** the home page's Selected work shows every project with `featured: true`, in `order` order. Nothing limits how many, so keep it to three for one tidy row.
- **Add it to the sidebar menu.** The menu on /work/ and the project pages doesn't update itself. In `_data/navigation.yml`, under `work:`, add a `title:` and `url:` pair for the new project, in the same position as its `order`. Keep the title short, because the sidebar is narrow. The url is `/work/<file name>/`.
- **Status (optional):** `status: "Complete"` shows a small pill on the card and under the project's title. The words with their own colour are In progress, Ongoing, Complete, On hold, Prototype and Demonstration. Demonstration also moves the card from Projects to Accessibility demonstrations on /work/ (spell it exactly that way, with the capital D), and its sidebar line goes in the second group. Any other word still shows, in grey. To add a colour, add a line to both `$statuses` lists in `_sass/portfolio/_custom.scss` ("Project status pills").
- **Opening a link in a new tab:** in Markdown, put `{:target="_blank"}` straight after the link, as in `[Try it](https://example.com){:target="_blank"}`. There's no need to switch to an HTML `<a>` tag. If you do write a heading in HTML, give it an `id` (`<h2 id="what-it-does">`), or it won't appear in "On this page".
- **Don't add `tags:`.** The theme would link them to the Tags page, which only lists reflections, so the links would lead nowhere.
- **Images (optional):** about 1000 × 600 pixels, the same shape for every project, with no text in the image. The card gives the image empty alt text because the title right below it names the project, so the image mustn't carry anything the title doesn't.

## Moving a page without breaking links

If a page's address changes, add the old address to the new page's front matter, and anyone following an old link is sent on:

```yaml
redirect_from: /the/old/address/
```

The old Accessibility Projects page (/accessibility/), the WYSIWYG editor page (/accessibility/wysiwyg/), and the four demonstrations (once under /accessibility/ and /workshops-presentations/) forward to Work this way.
