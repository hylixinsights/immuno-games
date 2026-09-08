window.COURSE.recovery = {
  "id": "final-review",
  "block": "E",
  "title": "A fresh investigation",
  "scenario": "Apply the course ideas to a new set of research decisions. Review the relevant lessons first. This separate recovery set allows one submission and does not add XP.",
  "questions": [
    {
      "prompt": "A study profiles eight donors, each before and after stimulation. T-cell counts are aggregated by donor and condition. Which comparison preserves the experiment?",
      "options": [
        "Model condition while accounting for donor pairing",
        "Treat the sixteen profiles as unrelated people",
        "Treat every T cell as an independent donor"
      ],
      "answer": 0,
      "explanation": "The paired profiles come from eight independent people. Aggregation retains the repeated observations; the downstream model must account for that pairing."
    },
    {
      "prompt": "A BD targeted assay does not report your candidate gene. What should you check first?",
      "options": [
        "Whether every missing entry can be set to biological zero",
        "Whether the gene was included in the targeted panel",
        "Whether a larger UMAP removes the missing gene"
      ],
      "answer": 1,
      "explanation": "A targeted assay can only measure its selected targets. Absence from the panel is not evidence of absent expression."
    },
    {
      "prompt": "A small low-RNA lymphocyte population disappears after applying a high minimum-gene cutoff. What is the best next step?",
      "options": [
        "Keep the cutoff because every small library is damaged",
        "Remove the population label to avoid bias",
        "Review QC distributions, markers and sample context before deciding"
      ],
      "answer": 2,
      "explanation": "A universal cutoff can remove plausible low-RNA cells. Use multiple QC signals and biological context rather than automatically retaining or discarding them."
    },
    {
      "prompt": "The same cells form more separated islands after changing UMAP settings. What is supported?",
      "options": [
        "The visualization depends on its settings; validate populations independently",
        "The tissue gained new biological cell types",
        "The cells now represent independent donors"
      ],
      "answer": 0,
      "explanation": "Changing the embedding changes its geometry. Marker programs, neighborhoods and sample structure provide additional evidence for population labels."
    },
    {
      "prompt": "A CellChat signal and a pseudotime ordering suggest a response pathway. What would strengthen the hypothesis most?",
      "options": [
        "Calling pseudotime elapsed hours without validation",
        "Perturbing the proposed signal and measuring the predicted response",
        "Increasing the point size in the embedding"
      ],
      "answer": 1,
      "explanation": "Communication and trajectory inference generate hypotheses. A suitable perturbation and independent readout can test the proposed biological effect."
    }
  ]
};
