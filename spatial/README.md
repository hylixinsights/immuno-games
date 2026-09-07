# Spatial Transcriptomics for immuno.games

Course content: Marcos Toquetão and the Computational Systems Biology Laboratory (CSBL).

This is a focused English adaptation of the supplied introductory course. It includes 15 lessons, 17 short learning steps, 51 lesson questions, 15 case decisions, 25 optional mastery questions and 5 final-investigation decisions. There are 17 source figures: 10 published panels and 7 translated original diagrams. The source bibliography is retained, with practical resources added for this adaptation.

## Publish on your existing GitHub Pages site

Copy the `spatial` folder from this archive into the directory already published by your immuno.games repository. Keep its files and `assets` directory together. Commit the addition using your normal publishing workflow. When that directory is published at the domain root, the course address will be `https://immuno.games/spatial/`.

Do not replace your existing homepage, CNAME or Pages configuration. The course uses relative asset paths and hash navigation, so it can also be placed in a different subdirectory. No compilation, npm installation, server functions, API keys or database are required.

For an initial local check, open `spatial/index.html` in a modern browser. The separately supplied single-file HTML contains the same course with embedded assets and can also be opened directly. Browser persistence and native sharing may differ for local files; HTTPS hosting provides the normal experience.

## Deliberate scientific scope

The main technology choices are Visium and Xenium. Normalization introduces log-normalization and SCTransform as alternatives, with explicit assay-specific limitations. Cell annotation covers markers and reference label transfer. cell2location is the single deconvolution example. Expression-based Leiden and BANKSY illustrate clustering and spatial domains. Moran's I, donor-level pseudobulk with edgeR, and CellChat provide one example per respective analysis task. Seurat is the single practical workflow.

These are representative, widely used teaching choices, not a measured market-share ranking or a claim of universal superiority. No additional platform is required to complete the course. Extra platforms visible in original benchmark figures remain contextual. The lesson text and Read more sections are concise adaptations, not an exhaustive translation of every source paragraph.

The browser teaches analysis decisions. It does not execute Seurat or process experimental datasets. The practical lesson links to the official runnable tutorial. All numerical slider examples and research scenarios are explicitly fictional or synthetic.

## Files and future courses

`course.js` contains lesson text, questions, figure metadata, glossary and references. `engine.js` defines progress rules independently of the interface. `app.js` implements navigation, exercises, import/export and sharing. `styles.css` controls responsive appearance. `assets` contains all local images and the icon.

A future bulk or single-cell course should have its own content, unique course ID and appropriate workflows. The existing progress engine can be reused. Update the remaining course-specific interface labels and toolkit table when adapting the app. Keep question IDs stable when editing existing material so saved progress is not reassigned to unrelated questions. For incompatible changes, increment the course version and provide an explicit migration if needed.

## Progress and scoring

Each correctly resolved lesson, case or final question gives 10 XP once, up to 710 XP. Lesson completion requires resolving all of its questions. A block trophy requires every lesson step in that block and its three-question case. Optional mastery uses five separate questions and a 4/5 threshold. The final investigation unlocks after five trophies; 4/5 earns course completion. Retakes preserve the best score. Mastery adds no XP.

Answers are shuffled for display. There is no countdown or points penalty. Progress is stored using a course-specific browser key. Exported JSON can be imported on another device; import validates and merges compatible progress. This local learning record is editable by its owner and is not a verified assessment or professional certificate.

## Privacy and sharing

There are no analytics, cookies for tracking, external fonts, remote AI calls or account services. External references open their original websites. A name is optional and stored locally. Sharing generates a PNG and post text; publication always depends on the learner's own action. Native sharing and clipboard access depend on browser and HTTPS support. Download is provided as a fallback.

## Figures and credits

Original course content and diagrams: Marcos Toquetão and CSBL. Diagram labels were translated and some captions clarified. Published panels retain the crops supplied in the PDF. Their original authors and licenses are identified in each caption and in `FIGURE-CREDITS.md`. The resolution of the supplied raster images limits enlargement. No artificial detail was generated.

Some source bibliography entries were explicitly marked for bibliographic verification. Those flags remain in the reference list. The supplementary bibliography is preserved for continuity; it is not a requirement to read every paper.

## Verification

Run `node verification/check.cjs` from this extracted archive. It checks content links, figure files, scoring, repeat attempts, achievement thresholds, progress validation, restored progress and route rendering. The rendering checks use a lightweight JavaScript test harness, not a browser. JavaScript syntax and local asset paths were checked. The translated figures were inspected visually. Desktop/mobile browser layout and native sharing were not tested in a real browser in this environment.

Version: 1.0.0. Adaptation date: 7 September 2026.
