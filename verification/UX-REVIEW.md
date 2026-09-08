# Course UI and UX revision - 2026-09-08

## Interface

- Quiet warm background, readable line length, more paragraph spacing and restrained colors.
- Course blocks expand on demand; progress diagrams have their own view.
- Reading and scored quizzes are separate screens. Optional exercises and further reading stay accessible in disclosures.
- Previous lesson, next lesson, course map and back-to-lesson links are explicit. The brand returns to the main immuno.games catalog.
- One question at a time, selected-answer styling, explicit confirmation, saved feedback and a clear next action.
- Tables scroll inside their own container on narrow screens. Buttons have touch-friendly spacing; keyboard focus and reduced motion remain supported.

## Assessment behavior

Confirmed lesson/case answers cannot be changed or retried. Correct answers earn 10 XP once. Incorrect answers show a gently sad guide and a teaching explanation; acknowledging the feedback permits continued exploration, without XP for the error. Block trophies record exploration. Mastery and final results record accuracy.

Optional mastery checks have five different questions and one submission. The final investigation has one submission; if the learner scores below 4/5, a separate recovery contains five new questions, also with one submission and no extra XP. A score of at least 4/5 on either final set earns completion. Existing progress and achievements remain compatible with v1 files. Stored answers take priority during merges and before submission in another tab.

This is a device-local educational record, not a secure examination system. No account, server or analytics was added.

## Verification performed

Automated checks cover content/references/assets; rendered routes; original exercise arithmetic; partial and out-of-order progress; one-submission locks after reload/import; review without XP; legacy migration; assessment gating and the separate recovery path.

Chrome browser checks cover the single-cell home, lesson, correct and wrong answers, persisted locks after reload, step completion and next-lesson navigation; all five decisions and final submission of a block review, with no retry controls after reload. Spatial checks include a lesson with figures, the collapsible QC exercise, slider keyboard input and figure enlargement/close. Screenshots inspected desktop layout and 390px/768px iframe viewports; a 320px viewport was also checked for quizzes and spatial tables. Checked views had no document-level horizontal overflow (vertical scrollbars reduce available content width). Mobile/tablet checks use real iframe viewports, not physical devices. Native sharing and every optional exercise were not manually exercised; exercise arithmetic and routes have automated coverage.

## Cell-guide asset

Built-in image generation; neutral, happy and gently sad frames on one transparent sprite sheet. The same illustration is used in both courses. It is interface artwork, not a biological diagram.

Prompt: Create one horizontal three-frame raster sprite sheet for a single-cell / spatial transcriptomics educational web game, exact 3:1 aspect ratio. The SAME cute cell mascot in each equal-width square frame: pale mint cytoplasm, a visible soft lavender nucleus, minimal dark expressive face, rounded organic cell shape and a few small membrane extensions, no hands or limbs. Sophisticated editorial cartoon for scientifically curious adults, crisp flat shapes and restrained outlines, not babyish or shiny 3D. Center all three full-body poses at the same scale and baseline with generous identical margins. Left: neutral welcoming expression. Middle: happy correct expression with delighted smile. Right: gently sad incorrect expression, supportive and never distressed. Preserve identical design, nucleus position and palette; only expression and slight posture differ. No text, labels, dividing lines, watermark, speech bubbles, gradients or extra objects. Clean background. The delivered image has a transparent background.

## Follow-up bug and color audit

Both published pages still served the pre-UX version when checked. This consolidated patch targets main at 7152364 and includes the complete UX revision plus these fixes; it replaces the earlier UX patch.

- Single-cell uses green (#27685f); spatial uses blue (#355d9b). Buttons, links, headings, panels and learning cards follow the course theme. Correct and incorrect feedback retain common green/peach meanings. Data-plot colors are unchanged.
- A final correct lesson answer now shows its explanation and a Finish button before the completion summary, including after reload.
- Conflicting imported final attempts can no longer add XP to a retained earlier result. Final XP is reconstructed from the retained submitted answers.
- Passing recovery now shows course completion when returning to the original final-results page.
- The keyboard skip link focuses the current content without changing the course route to an unknown #main page.
- Selected interactive buttons have explicit theme-colored backgrounds and white text; the UMAP toggle previously inherited white text on a transparent background.
- Learn remains marked as active throughout the lesson and assessment routes.

All five automated verification scripts and JavaScript syntax checks passed. A local-reference audit found all 39 script, stylesheet, favicon, mascot and figure paths nonempty. Content tests also validate lesson references and rendered routes. This does not claim that every external reference website was checked live.

Additional browser checks confirmed final-answer feedback before and after reload, unchanged XP after finishing the check, keyboard skip focus, UMAP layout/color switching, donor-condition-cell-type aggregation and spatial incorrect-answer locks after reload. Screenshots confirmed distinct course colors at 320px and the corrected UMAP selected-button contrast. Both tested 320px home viewports had 305px content and scroll widths (the remaining 15px is the scrollbar), with no document-level horizontal overflow. Previous 390px and 768px layout checks also remain applicable. Native OS sharing and physical mobile devices were not tested.

Run: node verification/regressions.cjs, node verification/assessment.cjs, node verification/journey.cjs, node verification/single-cell.cjs and node verification/spatial.cjs.
