# Adding a project or a book

How the Work and Writing pages are put together, and how to add to them. Folders starting with `_` that Jekyll doesn't know aren't published, so this note stays out of the website.

## Where things live

| What | Folder | Its address | Listed on |
| --- | --- | --- | --- |
| A project | `_portfolio/` | `/work/<file name>/` | `/work/` and, if featured, the home page |
| A book, newsletter or article | `_writing/` | `/writing/<file name>/` | `/writing/` |

The file name becomes the address, so `_portfolio/course-outline-generator.md` is at `/work/course-outline-generator/`. Use lowercase words joined by hyphens.

The collections themselves are set up in `_config.yml` (search for `collections:`). The cards are drawn by `_includes/card-grid.html`; their styles are in `_sass/portfolio/_custom.scss` (search for "Cards").

## Adding a project

Copy an existing file in `_portfolio/` and change the front matter at the top:

```yaml
---
title: "Course Outline Generator"
excerpt: "One or two sentences. This is what the card shows."
role: "Project lead and developer"   # optional, shown small on the card
years: "2021 to present"             # optional, shown after the role
featured: true                       # optional: puts it on the home page
order: 1                             # position on /work/ (1 comes first)
header:
  teaser: /assets/images/work/course-outline-generator.png   # optional image
last_modified_at: 2026-10-24
---
```

Then write the case study underneath in Markdown. A pattern that works: what it was for, what you did, and what came of it, each under a `##` heading.

- **Always set `excerpt`.** Without it the card has no description.
- **Don't add `tags:`.** The theme would link them to the Tags page, which only lists reflections, so the links would lead nowhere.
- **Featured projects:** the home page shows every project with `featured: true`. Keep it to three, and give them `order` 1, 2 and 3.
- **Images (optional):** about 1000 × 600 pixels, the same shape for every project, with no text in the image. The card gives the image empty alt text because the title right below it names the project, so the image mustn't carry anything the title doesn't.

## Adding a book

The same, in `_writing/`. A book with a cover goes under **Books** on `/writing/`; anything without one goes under **More books, newsletters, and articles**. Covers are 3:4 (portrait), like the existing ones in `assets/images/wp/`.

```yaml
header:
  teaser: /assets/images/wp/2024/06/Pressbooks-Cover-2.png
```

To show the cover at the top of the book's own page as well:

```html
<img src="{{ '/assets/images/wp/2024/06/Pressbooks-Cover-2.png' | relative_url }}" alt="" width="240" height="320" class="book-cover">
```

## Moving a page without breaking links

If a page's address changes, add the old address to the new page's front matter, and anyone following an old link is sent on:

```yaml
redirect_from: /the/old/address/
```

The old Published Work, Workshops and Presentations, and Accessibility Projects pages forward to Writing, Talks, and Work this way.
