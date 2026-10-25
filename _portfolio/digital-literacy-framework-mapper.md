---
title: "Digital Literacy Framework Mapper and stamp generator"
excerpt: "An AI agent and a small web tool that map learning material to the BC Digital Literacy Framework and label it consistently."
role: "Co-developer"
order: 7
last_modified_at: 2026-10-24
---

<h2>What it does</h2>

Mapping course material to the BC Digital Literacy Framework by hand takes time. Two colleagues and I built a pair of tools to speed it up:

- The <a href="https://chatgpt.com/g/g-684c67ce67188191a790a3405583f58c-digital-literacy-framework-mapper" target="_blank">Digital Literacy Framework Mapper</a>, a custom AI agent that suggests which framework competencies a piece of learning material addresses.
- The <a href="https://lurk404.github.io/digitalliteracystamp/index.html" target="_blank">Competency Stamp Generator</a>, a web tool that turns those competencies into a consistent visual stamp to place on the material.

We presented both at the Digital Learning Strategy Forum ([see Talks and teaching](/about-me/workshop-presentations/#conference-talks)).

<h2>>Designing the stamp accessibly</h2>

The stamp uses coloured segments, one per competency. Colour alone can't carry meaning, so every segment has a text label and the stamp comes with a written list of its competencies. That way no one has to tell the segments apart by colour, and the stamp doesn't need alt text of its own: the list beside it already says everything it shows.
