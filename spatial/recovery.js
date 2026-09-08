window.COURSE.recovery = {
  "id": "final-review",
  "block": "E",
  "title": "A fresh investigation",
  "scenario": "Apply the course ideas to a new set of research decisions. Review the relevant lessons first. This separate recovery set allows one submission and does not add XP.",
  "questions": [
    {
      "prompt": "An immune-rich region is visible on H&E. Which question specifically benefits from spatial gene-expression data?",
      "options": [
        "Which transcriptional states occupy the tumor-immune boundary?",
        "What is the total protein concentration in a serum tube?",
        "What is the overall cell count in a dissociated suspension?"
      ],
      "answer": 0,
      "explanation": "Spatial expression links molecular states to tissue locations. Other assays can answer the non-spatial questions more directly."
    },
    {
      "prompt": "A Visium observation contains markers of T cells and fibroblasts. Which interpretation should remain open?",
      "options": [
        "Every fibroblast has become a T cell",
        "Multiple cell populations contribute to the observation",
        "The observation must be a single hybrid cell"
      ],
      "answer": 1,
      "explanation": "Capture observations can contain more than one cell population. Mixtures and local tissue context must be considered before claiming a new cell identity."
    },
    {
      "prompt": "A targeted imaging panel lacks a gene of interest. Can you conclude that the tissue does not express it?",
      "options": [
        "Yes, because every zero is a measured absence",
        "Yes, if neighboring genes are detected",
        "No; the gene was outside the measurement panel"
      ],
      "answer": 2,
      "explanation": "A gene that was not targeted was not tested. Panel coverage limits the biological conclusions available from the experiment."
    },
    {
      "prompt": "Thousands of neighboring spots come from one section per patient. What should define independent replication for a patient-level comparison?",
      "options": [
        "Patients, with the section and spatial dependence considered",
        "Every spot as an unrelated patient",
        "Each image pixel as a new biological sample"
      ],
      "answer": 0,
      "explanation": "Nearby observations share tissue context and patient identity. Large numbers of spots do not replace independent patients."
    },
    {
      "prompt": "A candidate ligand and receptor are expressed near one another. What is the strongest warranted claim?",
      "options": [
        "The receptor was certainly activated",
        "Their spatial pattern supports a communication hypothesis to test",
        "The ligand has been proven to cause the tissue phenotype"
      ],
      "answer": 1,
      "explanation": "Proximity and expression support plausibility. They do not demonstrate binding, activation or causality without additional evidence."
    }
  ]
};
