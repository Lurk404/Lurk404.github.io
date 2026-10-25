---
title: "Course Outline Generator"
excerpt: "A form-based HTML and JavaScript tool that produces policy-aligned course outlines ready for Brightspace and the college website."
role: "Project lead and developer"
order: 1
last_modified_at: 2026-10-24
---

## The brief

Course outlines at Langara have to meet college policy F1003, and the same outline needs to appear in more than one place: in the course in Brightspace, on the Drupal-based college website, and in departmental records. My department Chair commissioned a tool to produce them.

## What I built

I scoped the tool against policy F1003 and against how peer institutions handle course outlines, then built it as an HTML and JavaScript application.

- **A form front end.** Instructors fill in a form built around what the policy asks an outline to contain.
- **Clean HTML export.** The output uses inline styles only, so it pastes into Brightspace or Drupal without picking up stray formatting or breaking either platform's layout.
- **Record keeping.** A Word and Excel pipeline keeps a copy of each outline for the department's records.

## Where it stands

As project lead, I presented the tool to the Academic Planning and Priorities Committee with a proposal to adopt it across the college.
