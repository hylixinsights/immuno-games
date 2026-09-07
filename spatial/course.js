window.COURSE = {
  "id": "spatial-essentials",
  "version": 1,
  "title": "Spatial Transcriptomics",
  "subtitle": "Read the tissue. Make the call.",
  "blocks": [
    {
      "id": "A",
      "title": "Foundations",
      "subtitle": "Ask a spatial question",
      "trophy": "Spatial Thinker",
      "question": "What does location add?",
      "lessons": [
        1,
        2,
        3
      ]
    },
    {
      "id": "B",
      "title": "Technologies",
      "subtitle": "Choose what to measure",
      "trophy": "Technology Navigator",
      "question": "Visium or Xenium?",
      "lessons": [
        4,
        5,
        6
      ]
    },
    {
      "id": "C",
      "title": "Tissue to data",
      "subtitle": "Know your measurement",
      "trophy": "Data Steward",
      "question": "What is one observation?",
      "lessons": [
        7
      ]
    },
    {
      "id": "D",
      "title": "Analysis",
      "subtitle": "Make defensible decisions",
      "trophy": "Spatial Analyst",
      "question": "Which patterns survive scrutiny?",
      "lessons": [
        8,
        9,
        10,
        11,
        12
      ]
    },
    {
      "id": "E",
      "title": "Application",
      "subtitle": "Build a credible conclusion",
      "trophy": "Evidence Builder",
      "question": "What can you actually conclude?",
      "lessons": [
        13,
        14,
        15
      ]
    }
  ],
  "lessons": [
    {
      "id": 1,
      "block": "A",
      "title": "Start with a question",
      "subtitle": "Learn what coordinates let you ask.",
      "steps": [
        {
          "id": "1a",
          "title": "What changes when you keep location?",
          "body": [
            "Single-cell RNA-seq tells you which cells and expression states were sampled. Spatial transcriptomics adds where the measured signal came from within a tissue section. This makes boundaries, neighborhoods and regional differences directly accessible.",
            "Your task in this course is to follow a tissue from a biological question to a defensible interpretation. Read a short explanation, inspect a figure and make three decisions. You may visit the lessons in any order."
          ],
          "takeaway": "Choose spatial data when location is needed to answer the question.",
          "more": [
            "The course assumes basic familiarity with single-cell RNA-seq. It deliberately teaches a small set of common approaches, rather than a catalog of platforms. “Common” does not mean universally best: tissue, assay chemistry, panel design and the biological question still matter.",
            "The five blocks follow the source course by Marcos Toquetão and CSBL: foundations, technologies, tissue and data, analysis, and application. Each block ends with a fictional research case. Published figures are clearly credited."
          ],
          "questions": [
            {
              "prompt": "Which question most directly needs spatial information?",
              "options": [
                "Are T cells inside the tumor or restricted to its edge?",
                "Which genes are expressed in a purified T-cell sample?",
                "What is the total RNA yield of a sample?"
              ],
              "answer": 0,
              "explanation": "The first question depends on the location of T cells relative to the tumor."
            },
            {
              "prompt": "What should determine whether to use spatial transcriptomics?",
              "options": [
                "Whether location is needed for the biological question",
                "Whether it is the newest available assay",
                "Whether it can replace every single-cell experiment"
              ],
              "answer": 0,
              "explanation": "Start with the question. Spatial data add context, but do not automatically replace other measurements."
            },
            {
              "prompt": "What does a completed course demonstrate?",
              "options": [
                "Completion of introductory learning activities",
                "Professional certification to run any spatial experiment",
                "Independent validation of the learner’s research"
              ],
              "answer": 0,
              "explanation": "The course records learning progress and performance on its own exercises, not professional accreditation."
            }
          ],
          "figure": null,
          "refs": [
            "R1"
          ],
          "interactive": null
        }
      ]
    },
    {
      "id": 2,
      "block": "A",
      "title": "One matrix, different units",
      "subtitle": "A short bridge from single-cell.",
      "steps": [
        {
          "id": "2a",
          "title": "What does one expression profile represent?",
          "body": [
            "Bulk RNA-seq combines signal from a mixture of cells. Single-cell RNA-seq separates profiles by cell, but dissociation usually removes their original tissue coordinates. Spatial data pair expression with a location.",
            "The spatial unit can be a capture spot, a geometric bin or a segmented cell. A small bin is not automatically a cell. Before reading a map, identify the unit represented by each profile. Matrix orientation depends on the software: AnnData usually stores observations in rows."
          ],
          "takeaway": "The meaning of an observation matters more than the orientation of the table.",
          "more": [
            "A bulk difference can reflect changing cell composition, changing expression within a cell type, or both. Single-cell profiles help distinguish these explanations. Spatial profiles add the location of these changes, subject to the assay’s measurement and assignment errors.",
            "RNA abundance is a snapshot shaped by production, processing and degradation. It is not a direct measurement of protein abundance, pathway activity or transcription rate. Capture efficiency and sampling also affect observed counts."
          ],
          "questions": [
            {
              "prompt": "A capture spot overlaps several cells. What does its expression profile represent?",
              "options": [
                "A mixture of transcripts from contributing cells",
                "A guaranteed single-cell transcriptome",
                "Only the cell closest to the spot center"
              ],
              "answer": 0,
              "explanation": "A capture spot can combine multiple cells. Its center is a coordinate, not a cell identity."
            },
            {
              "prompt": "A gene has higher bulk expression in a tumor. Which explanation remains possible?",
              "options": [
                "The tumor contains more cells of a type that expresses that gene",
                "Every tumor cell must have activated the gene",
                "The protein must be more abundant in every cell"
              ],
              "answer": 0,
              "explanation": "Cell composition can change a bulk signal without a within-cell expression change."
            },
            {
              "prompt": "Which statement about a small spatial bin is correct?",
              "options": [
                "It is a geometric unit that may contain partial or mixed cellular signal",
                "It always corresponds to one complete cell",
                "Its dimensions guarantee error-free RNA assignment"
              ],
              "answer": 0,
              "explanation": "A geometric grid is not a cell boundary. The downstream representation must be inspected."
            }
          ],
          "figure": "2-1",
          "refs": [
            "R46"
          ],
          "interactive": null
        }
      ]
    },
    {
      "id": 3,
      "block": "A",
      "title": "The information dissociation loses",
      "subtitle": "Composition is not organization.",
      "steps": [
        {
          "id": "3a",
          "title": "Same cells, different neighborhoods",
          "body": [
            "Two tissues can have similar cell-type proportions and very different arrangements. In one tumor, T cells enter malignant regions. In another, they remain in the surrounding stroma. A cell-type count alone cannot distinguish these patterns.",
            "Coordinates let you ask about boundaries, distances and local composition. They do not make every nearby pair functionally connected. The physical neighborhood is evidence about context, not proof of signaling."
          ],
          "takeaway": "Location can change the interpretation even when composition stays the same.",
          "more": [
            "The original course uses mouse spleen to show how tissue compartments can emerge from expression and position together. A predominant-cell-type map compresses a mixture into one label, so inspect the underlying estimates before treating its colors as individual cells.",
            "Dissociation can also alter which cells are recovered and their expression states. Spatial assays have their own biases. The comparison diagram illustrates information structure, not equal recovery across real experiments."
          ],
          "questions": [
            {
              "prompt": "Two sections have the same number of T cells. What can still differ?",
              "options": [
                "Whether T cells contact or avoid the tumor compartment",
                "Their spatial organization must be identical",
                "The sections must share the same clinical outcome"
              ],
              "answer": 0,
              "explanation": "Equal abundance does not imply equal localization."
            },
            {
              "prompt": "What did conventional dissociation remove in the diagram?",
              "options": [
                "The original spatial relationships between cells",
                "All cell-type information",
                "Every RNA molecule"
              ],
              "answer": 0,
              "explanation": "Single-cell profiles can retain identity information while losing the original arrangement."
            },
            {
              "prompt": "Two cell types are adjacent. What is justified?",
              "options": [
                "A spatial association that may motivate a signaling hypothesis",
                "A demonstrated ligand-receptor interaction",
                "Proof that one cell type caused the other to appear"
              ],
              "answer": 0,
              "explanation": "Proximity supports a hypothesis but does not establish molecular interaction or causality."
            }
          ],
          "figure": "3-1",
          "refs": [
            "R48",
            "R43"
          ],
          "interactive": null
        }
      ]
    },
    {
      "id": 4,
      "block": "B",
      "title": "Two ways to keep position",
      "subtitle": "A focused choice: Visium and Xenium.",
      "steps": [
        {
          "id": "4a",
          "title": "Choose breadth or targeted localization",
          "body": [
            "We focus on two widely used platform families. Visium reads spatially barcoded expression with sequencing. Xenium images targeted RNA molecules in tissue and assigns them to segmented cells. Both link expression to location, but they measure and process it differently.",
            "For broad exploration of regional expression, consider Visium. For localizing selected genes and resolving cellular neighborhoods, consider Xenium, provided the panel covers the question. Sample compatibility, assay version and the required unit must be checked before ordering."
          ],
          "takeaway": "Choose the measurement that can observe the biology you need.",
          "more": [
            "This is a teaching selection, not an audited market-share ranking. Other platforms exist, but adding their specifications would not help the central decision here. Older and newer products within the Visium family differ in chemistry and spatial units.",
            "Broad gene coverage is still constrained by the assay. Probe-based measurements cover the genes represented by their probes; RNA capture and imaging each have detection limits. “Not detected” is not equivalent to “not expressed.”"
          ],
          "questions": [
            {
              "prompt": "You want a broad survey of regional expression before selecting candidate genes. Which is the course’s natural starting point?",
              "options": [
                "Visium, after confirming assay coverage and sample compatibility",
                "Xenium regardless of which genes are in the panel",
                "A platform selected only by its advertised resolution"
              ],
              "answer": 0,
              "explanation": "Broad exploration favors the sequencing-based route, with explicit checks of assay chemistry and coverage."
            },
            {
              "prompt": "You need precise localization of a defined set of RNA targets. What is essential before choosing Xenium?",
              "options": [
                "Confirm that the panel includes the relevant targets",
                "Assume every transcript is measured",
                "Select the method with the largest image file"
              ],
              "answer": 0,
              "explanation": "A targeted assay cannot answer a question about genes absent from its panel."
            },
            {
              "prompt": "Why does this course focus on two platforms?",
              "options": [
                "To teach the main trade-off without a product catalog",
                "Because all other technologies are invalid",
                "Because one of them is always optimal"
              ],
              "answer": 0,
              "explanation": "A small selection makes the decision understandable. Suitability remains question- and sample-dependent."
            }
          ],
          "figure": null,
          "refs": [
            "T1",
            "T2",
            "R44"
          ],
          "interactive": null
        }
      ]
    },
    {
      "id": 5,
      "block": "B",
      "title": "Read a Visium spot",
      "subtitle": "Resolution is more than a number.",
      "steps": [
        {
          "id": "5a",
          "title": "A coordinate is not a cell",
          "body": [
            "The source figure overlays capture spots on a medulloblastoma section. Look at how many nuclei can lie under one spot. Its expression signal combines contributors; a color assigned to that spot is not an individual cell label.",
            "Classic Visium spots are useful for learning this principle. Visium HD uses a finer grid, but a bin remains geometric. Aggregation and cell segmentation change the unit of analysis. Always inspect which representation was delivered."
          ],
          "takeaway": "Nominal feature size does not guarantee effective cellular resolution.",
          "more": [
            "Effective resolution depends on more than the capture geometry: RNA movement, tissue handling, alignment and computational assignment can all affect where signal is recorded. Avoid treating a vendor’s smallest feature as the biological resolution of every dataset.",
            "Keep the original count data and the mapping between barcodes, coordinates and tissue images. For mixed units, deconvolution estimates composition; it does not recover the exact original transcriptome of each contributing cell."
          ],
          "questions": [
            {
              "prompt": "In the figure, several nuclei fall under a capture spot. What is the safest interpretation?",
              "options": [
                "The spot may contain a mixture of cell types",
                "The strongest color identifies every cell under the spot",
                "The spot is a direct measurement of one nucleus"
              ],
              "answer": 0,
              "explanation": "Histology reveals why a single spot label can conceal a mixture.",
              "figure": "5-1"
            },
            {
              "prompt": "Does a finer grid by itself guarantee complete single-cell profiles?",
              "options": [
                "No, grid geometry and biological cell boundaries are different",
                "Yes, if the bin is smaller than a cell",
                "Yes, if the map looks sharp"
              ],
              "answer": 0,
              "explanation": "Small bins may capture fragments of cells; segmentation and aggregation need separate evaluation."
            },
            {
              "prompt": "What must be checked before using a Visium HD matrix?",
              "options": [
                "Whether observations are bins, aggregated bins or segmented cells",
                "Only the file size",
                "Only the number of clusters"
              ],
              "answer": 0,
              "explanation": "The unit determines which downstream questions and assumptions are appropriate."
            }
          ],
          "figure": "5-1",
          "refs": [
            "T1",
            "T3",
            "R44"
          ],
          "interactive": null
        }
      ]
    },
    {
      "id": 6,
      "block": "B",
      "title": "Read a Xenium cell",
      "subtitle": "Panels and boundaries shape the answer.",
      "steps": [
        {
          "id": "6a",
          "title": "A cell boundary is an inference",
          "body": [
            "Xenium detects selected RNA targets through imaging. Molecule coordinates are then related to cell boundaries estimated from imaging and segmentation. A cell-by-gene table therefore contains both measurement and assignment decisions.",
            "Inspect representative boundaries, especially in dense tissue and at interfaces. A merged pair of cells can look like an unusual hybrid cell type. A misplaced boundary can attribute transcripts to the wrong neighbor."
          ],
          "takeaway": "Validate the panel and inspect segmentation before trusting cell labels.",
          "more": [
            "The source figure compares algorithmic and manually reviewed boundaries. Manual review is useful for auditing, but it is not automatically perfect ground truth. Inspect several regions and cell morphologies rather than one convincing example.",
            "Targeted panels require assay-specific QC. Mitochondrial fractions may be absent or uninformative if the panel does not support them. Transcript counts, detected targets, cell area, control probes and morphology must be interpreted together."
          ],
          "questions": [
            {
              "prompt": "A supposed cell contains incompatible marker programs and spans two nuclei. What should you inspect first?",
              "options": [
                "Whether segmentation merged two cells",
                "A new cell type as the only possible explanation",
                "Only the color palette used in the plot"
              ],
              "answer": 0,
              "explanation": "Segmentation errors can produce mixed profiles that resemble novel biology."
            },
            {
              "prompt": "A gene is absent from the Xenium panel. What does a zero for it establish?",
              "options": [
                "Nothing about its biological absence; it was not assayed",
                "That no cell in the tissue expresses it",
                "That its protein is absent"
              ],
              "answer": 0,
              "explanation": "Unmeasured and undetected are different states."
            },
            {
              "prompt": "Can a mitochondrial-percentage cutoff from scRNA-seq be copied into any targeted panel?",
              "options": [
                "No, panel composition may make the metric unavailable or misleading",
                "Yes, the same cutoff is valid for every assay",
                "Yes, provided the tissue is human"
              ],
              "answer": 0,
              "explanation": "Quality metrics must be meaningful for the assay and its target list."
            }
          ],
          "figure": "6-2",
          "refs": [
            "T2",
            "R20",
            "R45"
          ],
          "interactive": null
        }
      ]
    },
    {
      "id": 7,
      "block": "C",
      "title": "From tissue to trustworthy files",
      "subtitle": "QA starts before the count matrix.",
      "steps": [
        {
          "id": "7a",
          "title": "Keep the measurement traceable",
          "body": [
            "Quality assurance (QA) prevents avoidable problems: define sample handling, document assay and software versions, record donors and batches, and decide what will be reviewed. Quality control (QC) examines the material and output to identify problems. They work together.",
            "A usable spatial dataset joins a count matrix, observation identifiers, coordinates and reference images. Imaging data may also include molecule coordinates and cell boundaries. Check that identifiers and coordinate systems agree before interpreting an overlay."
          ],
          "takeaway": "Trace the result back to a donor, an assay and a reproducible processing history.",
          "more": [
            "Primary processing is part of the measurement. Changes in alignment, decoding, segmentation or transcript assignment can alter the matrix. Save the software version and settings, not just the final output filename.",
            "For donor-level comparisons, distribute conditions across processing batches where possible. If every control is processed in one batch and every case in another, a correction algorithm cannot reliably identify which difference was biological."
          ],
          "questions": [
            {
              "prompt": "Which action is quality assurance?",
              "options": [
                "Recording and standardizing handling and processing procedures",
                "Deleting all low-count observations after seeing a plot",
                "Choosing the prettiest clustering result"
              ],
              "answer": 0,
              "explanation": "QA establishes processes and traceability; QC assesses the resulting material and data."
            },
            {
              "prompt": "An expression overlay does not align with histology. What should be checked first?",
              "options": [
                "Coordinate transforms, scale factors and matching sample identifiers",
                "The number of significant genes",
                "Whether the legend has enough colors"
              ],
              "answer": 0,
              "explanation": "A coordinate or identity mismatch can invalidate every apparent spatial pattern."
            },
            {
              "prompt": "All controls were processed on Monday and all cases on Friday. What is the problem?",
              "options": [
                "Condition and processing batch may be confounded",
                "More normalization always resolves the design",
                "The weekday is a biological replicate"
              ],
              "answer": 0,
              "explanation": "When condition and batch coincide, their effects cannot be separated reliably from these data alone."
            }
          ],
          "figure": "7-1",
          "refs": [
            "R20",
            "R38"
          ],
          "interactive": null
        }
      ]
    },
    {
      "id": 8,
      "block": "D",
      "title": "A compact analysis workflow",
      "subtitle": "Keep raw data; make choices explicit.",
      "steps": [
        {
          "id": "8a",
          "title": "Know what each step is for",
          "body": [
            "A practical route is: inspect tissue and QC, choose filters, normalize for exploratory comparisons, summarize expression with PCA, then examine cell identity and spatial organization. Revisit earlier decisions when a downstream result exposes a problem.",
            "For the practical example we use Seurat. The essential ideas also apply to other software. PCA summarizes expression variation; a clustering result groups similar profiles. Neither automatically makes a cluster a cell type or a tissue domain."
          ],
          "takeaway": "A pipeline is a sequence of assumptions, not a guarantee of biological truth.",
          "more": [
            "This course uses one main analysis environment rather than parallel software tutorials. SCTransform provides a common Seurat route for UMI count data; log-normalization provides an understandable baseline. Assay-specific checks are still required, especially for targeted panels.",
            "Preserve raw counts in a separate assay or layer. Exploratory transformed values and the inputs to count-based statistical models are not interchangeable. Record filters and parameters so a sensitivity check can be repeated."
          ],
          "questions": [
            {
              "prompt": "What should you retain before normalizing?",
              "options": [
                "The original count matrix and its identifiers",
                "Only the normalized values",
                "Only the UMAP coordinates"
              ],
              "answer": 0,
              "explanation": "Raw counts support reanalysis and methods that require count input."
            },
            {
              "prompt": "What does PCA primarily summarize?",
              "options": [
                "Major axes of variation in the expression representation",
                "Physical distance between every cell",
                "Validated biological pathways"
              ],
              "answer": 0,
              "explanation": "PCA is a dimension-reduction method. Its axes are not automatically spatial or mechanistic."
            },
            {
              "prompt": "A cluster appears after analysis. What is it initially?",
              "options": [
                "A grouping that needs biological and technical interpretation",
                "A newly discovered cell type by definition",
                "An independent biological replicate"
              ],
              "answer": 0,
              "explanation": "Markers, morphology, location and stability help interpret a cluster."
            }
          ],
          "figure": "8-1",
          "refs": [
            "S1"
          ],
          "interactive": null
        }
      ]
    },
    {
      "id": 9,
      "block": "D",
      "title": "QC, filters and normalization",
      "subtitle": "Two short steps, no universal cutoff.",
      "steps": [
        {
          "id": "9a",
          "title": "Inspect before filtering",
          "body": [
            "Map total counts and detected genes back onto the tissue. Compare suspicious observations with nearby tissue and morphology. Low counts in a damaged edge and low counts in a naturally sparse region can have different meanings.",
            "Use simple, documented filters for off-tissue observations and clear technical failures. Review low-count regions before deciding. For imaging data, add cell-area and segmentation checks. Report what was removed and where."
          ],
          "takeaway": "A global threshold can remove a real tissue compartment.",
          "more": [
            "The source spleen figure shows regional variation in total counts. A histogram hides where that variation occurs. Spatial review does not replace numerical QC; it supplies the context needed to interpret it.",
            "Gene filtering can remove features with almost no support, but an aggressive prevalence filter may erase rare-cell markers. Check whether the rule matches the downstream method and the biological question. QA includes keeping a record of thresholds and reviewing sensitivity to plausible alternatives."
          ],
          "questions": [
            {
              "prompt": "A contiguous low-count region matches a recognizable structure. What is the next step?",
              "options": [
                "Review its morphology and local context before filtering",
                "Delete it because it is below the tissue-wide median",
                "Normalize until it looks like every other region"
              ],
              "answer": 0,
              "explanation": "Low RNA content can be biological. Spatial context helps distinguish it from failure.",
              "figure": "9-1"
            },
            {
              "prompt": "A gene occurs in very few units. What should guide a filter?",
              "options": [
                "Its support, the question and whether rare-cell signal could be lost",
                "A requirement that every gene appear everywhere",
                "Keeping it only if it has a familiar name"
              ],
              "answer": 0,
              "explanation": "Prevalence filters trade noise reduction against loss of rare but meaningful signal."
            },
            {
              "prompt": "Which record makes a filtering decision reviewable?",
              "options": [
                "Thresholds, reasons and maps of retained and removed units",
                "Only the final number of clusters",
                "Only the smallest p-value"
              ],
              "answer": 0,
              "explanation": "Review requires knowing what changed, why and where."
            }
          ],
          "figure": "9-1",
          "refs": [
            "R43",
            "R20"
          ],
          "interactive": "qc"
        },
        {
          "id": "9b",
          "title": "Normalize without erasing the tissue",
          "body": [
            "Log-normalization divides counts by a library-size factor, rescales them and applies log(1 + x). It is a common exploratory baseline. It assumes that the scaling makes observations meaningfully comparable; real regional RNA-content differences can challenge that assumption.",
            "SCTransform models UMI counts to account for depth-related variation and provides a variance-stabilized representation. It is a common Seurat workflow for Visium. It is not a spatial correction, and it does not automatically remove batch effects or preserve every biological difference."
          ],
          "takeaway": "Use log-normalization or SCTransform with explicit assumptions and spatial checks.",
          "more": [
            "Do not apply both as a mandatory serial recipe. They are alternative exploratory representations. Inspect whether recognizable regions, relevant markers and major conclusions remain sensible after the chosen transformation.",
            "On a targeted imaging panel, the measured total depends strongly on the selected genes and cell state. Do not transfer a whole-transcriptome normalization recipe without checking that it fits the assay. Methods such as cell2location need their specified count input, not an arbitrary transformed matrix."
          ],
          "questions": [
            {
              "prompt": "Why might total-count scaling be problematic in spatial tissue?",
              "options": [
                "Some total-RNA differences can reflect real regional biology",
                "It always increases the original molecule count",
                "It directly corrects every segmentation error"
              ],
              "answer": 0,
              "explanation": "Normalizing totals can remove both technical and biological differences."
            },
            {
              "prompt": "What is SCTransform in this course?",
              "options": [
                "An alternative count-model-based normalization route for exploration",
                "A required second step after every log-normalization",
                "A method that proves all batches are comparable"
              ],
              "answer": 0,
              "explanation": "It is an alternative representation with assumptions, not a universal batch or spatial correction."
            },
            {
              "prompt": "How should a normalization choice be evaluated?",
              "options": [
                "Inspect spatial patterns and check whether conclusions depend on plausible alternatives",
                "Choose whichever gives the brightest plot",
                "Assume the software default proves correctness"
              ],
              "answer": 0,
              "explanation": "The useful test is how the decision affects interpretable patterns and conclusions."
            }
          ],
          "figure": null,
          "refs": [
            "S1",
            "S2"
          ],
          "interactive": null
        }
      ]
    },
    {
      "id": 10,
      "block": "D",
      "title": "Who is where?",
      "subtitle": "Annotation and deconvolution solve different problems.",
      "steps": [
        {
          "id": "10a",
          "title": "Choose identity or composition",
          "body": [
            "For segmented cells, start with marker-based annotation. Reference label transfer is a second common approach when the reference and panel cover the relevant cell types. Keep an uncertain label when the evidence is insufficient.",
            "For units containing mixtures, this course focuses on cell2location. It estimates cell-type abundance using a single-cell reference. Other methods may report proportions or weights; outputs should not be treated as interchangeable. Inspect uncertainty and whether the reference contains the expected populations."
          ],
          "takeaway": "Annotate cells. Estimate composition for mixtures.",
          "more": [
            "The source diagram illustrates the distinction using proportions. cell2location’s native abundance estimates are not automatically fractions summing to one. If you convert an output to proportions for display, state the transformation.",
            "An incomplete reference can force an unfamiliar population into an available label or redistribute its signal. Check multiple markers, reference coverage, spatial plausibility and independent evidence. A predominant-type map hides close mixtures and uncertainty."
          ],
          "questions": [
            {
              "prompt": "A spot mixes lymphocytes and fibroblasts. Which task fits?",
              "options": [
                "Estimate its cellular composition",
                "Assign every transcript to one cell type with certainty",
                "Declare that the spot itself is a fibroblast"
              ],
              "answer": 0,
              "explanation": "Deconvolution addresses mixtures, subject to model and reference limitations."
            },
            {
              "prompt": "What should happen when a segmented cell lacks enough supporting markers?",
              "options": [
                "Retain an uncertain or broader annotation",
                "Force the most specific label available",
                "Remove its coordinates"
              ],
              "answer": 0,
              "explanation": "Uncertainty is a legitimate result when the assay or reference cannot resolve identity."
            },
            {
              "prompt": "What does an incomplete reference risk?",
              "options": [
                "Misassigning or redistributing signal from missing cell types",
                "Creating an independent validation dataset",
                "Eliminating uncertainty from deconvolution"
              ],
              "answer": 0,
              "explanation": "A model cannot reliably recover a missing reference identity simply because its output has a label."
            }
          ],
          "figure": "10-1",
          "refs": [
            "R25"
          ],
          "interactive": "composition"
        }
      ]
    },
    {
      "id": 11,
      "block": "D",
      "title": "Domains and neighborhoods",
      "subtitle": "Expression similarity is not the whole story.",
      "steps": [
        {
          "id": "11a",
          "title": "Look beyond cell labels",
          "body": [
            "A spatial domain is a region with coherent molecular or cellular characteristics, such as a cortical layer or a tumor-stroma interface. A niche describes a local microenvironment and can recur in separated regions.",
            "Begin with expression clusters mapped back onto histology. For one spatially informed example, the course introduces BANKSY, which incorporates neighborhood expression. Check boundaries, markers and sensitivity to neighborhood choices rather than optimizing only for smooth-looking maps."
          ],
          "takeaway": "A plausible domain needs more support than a neat color boundary.",
          "more": [
            "Leiden clustering is a common expression-based starting point, but it does not use tissue position unless the representation or graph explicitly includes spatial information. BANKSY illustrates how adding neighborhood information changes the question.",
            "Neighborhood radius or graph construction sets the scale of the analysis. Too much smoothing can erase small structures or impose artificial continuity. Compare across sections or donors when claiming a recurring organization."
          ],
          "questions": [
            {
              "prompt": "The same cellular microenvironment occurs in distant tumor regions. What can it represent?",
              "options": [
                "A recurring niche",
                "One necessarily contiguous physical region",
                "A technical artifact by definition"
              ],
              "answer": 0,
              "explanation": "A niche is defined by the local environment and can recur at different locations."
            },
            {
              "prompt": "What does BANKSY add to an expression-only representation?",
              "options": [
                "Information from the spatial neighborhood",
                "Independent patients",
                "Direct protein-interaction measurements"
              ],
              "answer": 0,
              "explanation": "It incorporates neighborhood expression to support spatially informed analysis."
            },
            {
              "prompt": "A domain map looks smoother after a parameter change. Is that enough to prefer it?",
              "options": [
                "No, compare markers, morphology and preservation of relevant structures",
                "Yes, smoothness is the definition of accuracy",
                "Yes, if the number of colors decreases"
              ],
              "answer": 0,
              "explanation": "A smooth map can reflect over-smoothing rather than better biology."
            }
          ],
          "figure": "11-2",
          "refs": [
            "R28",
            "R45"
          ],
          "interactive": null
        }
      ]
    },
    {
      "id": 12,
      "block": "D",
      "title": "Patterns, differences and signals",
      "subtitle": "Separate three questions.",
      "steps": [
        {
          "id": "12a",
          "title": "Pattern is not a condition effect",
          "body": [
            "A spatially variable gene changes with location within a section. Moran’s I is a common introductory measure of spatial autocorrelation. A pattern can arise from cell composition, technical variation or within-cell regulation.",
            "Differential expression asks whether expression differs between conditions or defined groups. For donor-level comparisons, aggregate raw counts within comparable cell types or regions per donor, then use a replicated count-based analysis such as edgeR. Thousands of spots from one donor do not create thousands of donors."
          ],
          "takeaway": "The independent unit must match the scope of the conclusion.",
          "more": [
            "Pseudobulk preserves donor-level replication when aggregation respects the question. Paired designs, batch and other justified covariates still belong in the model. Missing cell types or noncomparable regions require attention before aggregation.",
            "A within-section contrast is useful, but cannot by itself establish a general condition effect across patients. Spatial tests also require appropriate null models and multiple-testing correction. The course teaches the distinction rather than a catalog of statistical tests."
          ],
          "questions": [
            {
              "prompt": "A gene has a spatial pattern. What does this establish on its own?",
              "options": [
                "Its distribution is structured under the tested spatial model",
                "Position caused the gene to be activated",
                "A treatment changed its expression"
              ],
              "answer": 0,
              "explanation": "Spatial structure is descriptive evidence. Its source must still be investigated."
            },
            {
              "prompt": "One patient provides 8,000 spots. How many independent patients were sampled?",
              "options": [
                "One",
                "Eight thousand",
                "As many as there are clusters"
              ],
              "answer": 0,
              "explanation": "Spatial sampling density does not increase the number of independent donors."
            },
            {
              "prompt": "For a donor-level comparison, what is a reasonable pseudobulk unit?",
              "options": [
                "A comparable cell type or region within each donor",
                "All cases pooled into one vector and all controls into another",
                "Each spot treated as a new patient"
              ],
              "answer": 0,
              "explanation": "Separate donor-level aggregates retain biological replication."
            }
          ],
          "figure": "12-1",
          "refs": [
            "R22",
            "S3",
            "S4"
          ],
          "interactive": null
        },
        {
          "id": "12b",
          "title": "Nearby does not mean communicating",
          "body": [
            "Ligand-receptor analysis uses expression and prior interaction knowledge to propose signaling relationships. Spatial proximity can make a proposal more plausible. It does not demonstrate ligand release, receptor activation or a causal effect.",
            "We use CellChat as one familiar example of ligand-receptor inference. The important skill is judging the evidence: are the genes measured, are the cells plausibly located, are findings consistent across donors, and is there a way to test the proposed interaction?"
          ],
          "takeaway": "Report a signaling hypothesis until there is functional evidence.",
          "more": [
            "Expression is only one layer of the mechanism. Protein abundance, localization, receptor state and downstream response can all diverge from RNA measurements. Targeted panels may omit components of an interaction.",
            "A useful follow-up could combine orthogonal protein localization with an appropriate perturbation and response measurement. Neither an interaction score nor a small p-value substitutes for that test."
          ],
          "questions": [
            {
              "prompt": "A ligand and receptor are expressed in neighboring populations. What can you report?",
              "options": [
                "A candidate signaling relationship",
                "A demonstrated causal interaction",
                "Proof that the receptor is active"
              ],
              "answer": 0,
              "explanation": "The observation supports a hypothesis; functional evidence remains necessary."
            },
            {
              "prompt": "Which result strengthens a mechanistic claim most directly?",
              "options": [
                "A suitable perturbation changes the predicted downstream response",
                "A more saturated color on the interaction plot",
                "A larger network of predicted interactions"
              ],
              "answer": 0,
              "explanation": "A designed perturbation tests the proposed mechanism rather than only restating the association."
            },
            {
              "prompt": "The receptor gene was not in a targeted panel. What is the limitation?",
              "options": [
                "The assay cannot directly evaluate its RNA expression",
                "The receptor must be biologically absent",
                "The ligand-receptor hypothesis is proven false"
              ],
              "answer": 0,
              "explanation": "Missing measurement limits the evidence; it is not evidence of absence."
            }
          ],
          "figure": null,
          "refs": [
            "S5"
          ],
          "interactive": null
        }
      ]
    },
    {
      "id": 13,
      "block": "E",
      "title": "Read a published result",
      "subtitle": "The figure is evidence, not the conclusion.",
      "steps": [
        {
          "id": "13a",
          "title": "Audit a spatial claim",
          "body": [
            "The source figure shows histology from a colorectal tumor benchmark. Use it to practice asking whether a reported molecular compartment aligns with recognizable tissue structure. Differences between assays can reflect sampling, chemistry and processing, not only biology.",
            "When reading a paper, identify the measurement unit, independent samples, QC decisions and validation. Then state what the data establish and what remains an interpretation. The same questions apply to cancer, brain and immune tissues."
          ],
          "takeaway": "Read the sampling and processing behind the map.",
          "more": [
            "The original material includes benchmark figures from Du and colleagues, Rademacher and colleagues, and Ren and colleagues. Their platform comparisons are specific experiments, not a universal ranking for every tissue and analysis task.",
            "Use the figure collection to compare a predominant-type map, a deconvolution output, QC maps and histology. Each encodes a different quantity. A similar visual style does not make those quantities equivalent."
          ],
          "questions": [
            {
              "prompt": "Two technologies produce different maps from adjacent sections. What should be considered?",
              "options": [
                "Section differences, chemistry and processing as well as biology",
                "Only which map is sharper",
                "That one map must be fabricated"
              ],
              "answer": 0,
              "explanation": "Adjacent sections are not identical, and assays differ in what and how they measure."
            },
            {
              "prompt": "Which detail is essential for a claim about patients in general?",
              "options": [
                "The number and design of independent donor samples",
                "Only the number of spots",
                "Only the image resolution"
              ],
              "answer": 0,
              "explanation": "Generalization depends on biological replication and sampling."
            },
            {
              "prompt": "A figure colors each spot by its most abundant estimated cell type. What does it hide?",
              "options": [
                "The remaining mixture and estimation uncertainty",
                "The fact that all spots are pure cells",
                "The number of genes in the human genome"
              ],
              "answer": 0,
              "explanation": "A dominant label compresses the composition into one color."
            }
          ],
          "figure": "13-1",
          "refs": [
            "R43",
            "R44",
            "R45"
          ],
          "interactive": null
        }
      ]
    },
    {
      "id": 14,
      "block": "E",
      "title": "Your first analysis plan",
      "subtitle": "A small, reproducible start.",
      "steps": [
        {
          "id": "14a",
          "title": "Start with one public Visium section",
          "body": [
            "Use the official Seurat spatial tutorial as a worked entry point. Inspect its reference image and count maps, record the dataset and software versions, and follow the SCTransform-based exploratory route. The goal is to understand one section, not run every available method.",
            "Before interpreting clusters, place them back onto the tissue and inspect marker support. Save raw data, the script, chosen parameters and a short QC record. One section can teach the workflow; it cannot establish a patient-level condition effect."
          ],
          "takeaway": "Produce an auditable first result before adding complexity.",
          "more": [
            "The linked tutorial supplies the executable workflow and data instructions. The browser activity here practices decisions; it does not execute Seurat or analyze a real dataset. Software examples should be run in the documented R environment.",
            "A minimal report records the observation unit, image alignment, filters, normalization choice, major patterns and limitations. For deconvolution, add a suitable single-cell reference only when the question requires composition estimates."
          ],
          "questions": [
            {
              "prompt": "What is the best scope for a first practical run?",
              "options": [
                "One public section with documented QC and an interpretable map",
                "Every public dataset processed at once",
                "A claim about treatment efficacy from one section"
              ],
              "answer": 0,
              "explanation": "A bounded first run makes the data and assumptions easier to inspect."
            },
            {
              "prompt": "Which first result is most useful?",
              "options": [
                "A map with traceable inputs, QC decisions and supported interpretation",
                "A UMAP without sample metadata",
                "A list of tools installed on the machine"
              ],
              "answer": 0,
              "explanation": "A result is useful when another researcher can understand how it was obtained."
            },
            {
              "prompt": "Where does the real Seurat analysis run?",
              "options": [
                "In an R environment following the linked tutorial",
                "Inside this browser quiz",
                "Inside the social-sharing card"
              ],
              "answer": 0,
              "explanation": "The course is an educational interface. It links to a runnable external workflow."
            }
          ],
          "figure": null,
          "refs": [
            "S1"
          ],
          "interactive": null
        }
      ]
    },
    {
      "id": 15,
      "block": "E",
      "title": "Know when to stop",
      "subtitle": "A short course should end in a better decision.",
      "steps": [
        {
          "id": "15a",
          "title": "From observation to a testable hypothesis",
          "body": [
            "A credible spatial result connects a clear question to a suitable measurement, interpretable QC, a justified analysis and an appropriately limited conclusion. More methods do not automatically strengthen that chain.",
            "Finish by identifying the next experiment or independent dataset that could challenge your interpretation. Complete the block case and final investigation to earn the course completion achievement. A separate mastery challenge uses new questions for each block."
          ],
          "takeaway": "The next step should reduce uncertainty, not just add another plot.",
          "more": [
            "Keep the practical scope small: one main workflow and one or two choices where the decision matters. Advanced topics such as multi-omics integration, model benchmarking and three-dimensional reconstruction are outside this course.",
            "Your progress stays in this browser unless you export it. Completion cards summarize activities and achievements in this course; they are not professional certificates. No account or public leaderboard is required."
          ],
          "questions": [
            {
              "prompt": "When is another method worth adding?",
              "options": [
                "When it addresses a specific remaining uncertainty",
                "Whenever it creates an additional figure",
                "Whenever its name is newer"
              ],
              "answer": 0,
              "explanation": "Method choice should follow an unresolved question, not a desire for more outputs."
            },
            {
              "prompt": "What is an appropriate final claim for an observational spatial association?",
              "options": [
                "A supported association with explicit limits and a proposed validation",
                "A proven mechanism without a functional test",
                "A clinical recommendation from one section"
              ],
              "answer": 0,
              "explanation": "Keep the strength of the claim aligned with the evidence."
            },
            {
              "prompt": "What should accompany a reproducible result?",
              "options": [
                "Data provenance, parameters, software versions and limitations",
                "Only the final image",
                "Only the course completion score"
              ],
              "answer": 0,
              "explanation": "Reproducibility requires the decisions and inputs behind the result."
            }
          ],
          "figure": null,
          "refs": [
            "S1"
          ],
          "interactive": null
        }
      ]
    }
  ],
  "figures": {
    "2-1": {
      "id": "2-1",
      "title": "One tissue, three measurements",
      "caption": "Original course Figure 2.1. The same tissue represented as bulk, single-cell and spatial expression. English labels adapted from the source diagram.",
      "ref": "course",
      "src": "assets/figure-2-1.png",
      "credit": "Marcos Toquetão and CSBL. Diagram labels adapted into English."
    },
    "3-1": {
      "id": "3-1",
      "title": "Before and after dissociation",
      "caption": "Original course Figure 3.1. Cell arrangement is lost during dissociation. English labels adapted from the source diagram.",
      "ref": "course",
      "src": "assets/figure-3-1.png",
      "credit": "Marcos Toquetão and CSBL. Diagram labels adapted into English."
    },
    "3-2": {
      "id": "3-2",
      "title": "Mouse spleen compartments",
      "caption": "Original course Figure 3.2, reproduced panel from Du et al. (2025), Figure 3h. Predominant cell-type labels summarize mixed spatial observations.",
      "ref": "R43",
      "src": "assets/figure-3-2.png",
      "credit": "Reproduced from the supplied course PDF. CC BY 4.0, with source attribution; panel crop retained."
    },
    "5-1": {
      "id": "5-1",
      "title": "Capture spots over a tumor section",
      "caption": "Original course Figure 5.1, reproduced panel from Rademacher et al. (2025), Figure 1b. Spots overlap multiple nuclei in medulloblastoma tissue. Source image resolution is limited.",
      "ref": "R44",
      "src": "assets/figure-5-1.png",
      "credit": "Reproduced from the supplied course PDF. CC BY 4.0, with source attribution; panel crop retained."
    },
    "5-2": {
      "id": "5-2",
      "title": "Tissue and off-tissue signal",
      "caption": "Original course Figure 5.2, reproduced panel from Ren et al. (2025), Figure 2d. Histology, tissue-associated signal and signal beyond the tissue boundary.",
      "ref": "R45",
      "src": "assets/figure-5-2.png",
      "credit": "Reproduced from the supplied course PDF. CC BY 4.0, with source attribution; panel crop retained."
    },
    "6-2": {
      "id": "6-2",
      "title": "Inspect cell boundaries",
      "caption": "Original course Figure 6.2, reproduced panel from Ren et al. (2025), Figure 4a. Algorithmic and manual segmentation with a comparison overlay. This source panel uses Stereo-seq and illustrates a general segmentation problem, not a Xenium-specific result.",
      "ref": "R45",
      "src": "assets/figure-6-2.png",
      "credit": "Reproduced from the supplied course PDF. CC BY 4.0, with source attribution; panel crop retained."
    },
    "6-3": {
      "id": "6-3",
      "title": "The same markers across assays",
      "caption": "Original course Figure 6.3, reproduced panels from Rademacher et al. (2025), Figure 1. The source includes additional platforms for visual context; they are outside the main course.",
      "ref": "R44",
      "src": "assets/figure-6-3.png",
      "credit": "Reproduced from the supplied course PDF. CC BY 4.0, with source attribution; panel crop retained."
    },
    "7-1": {
      "id": "7-1",
      "title": "From section to expression matrix",
      "caption": "Original course Figure 7.1. A simplified capture and imaging workflow. English labels adapted; specific chemistries and processing steps vary by assay.",
      "ref": "course",
      "src": "assets/figure-7-1.png",
      "credit": "Marcos Toquetão and CSBL. Diagram labels adapted into English."
    },
    "8-1": {
      "id": "8-1",
      "title": "The analysis workflow",
      "caption": "Original course Figure 8.1. An overview of analysis tasks, adapted with English labels. Real workflows are iterative, and tasks need not follow one fixed order.",
      "ref": "course",
      "src": "assets/figure-8-1.png",
      "credit": "Marcos Toquetão and CSBL. Diagram labels adapted into English."
    },
    "9-1": {
      "id": "9-1",
      "title": "Total counts across spleen sections",
      "caption": "Original course Figure 9.1, reproduced panel from Du et al. (2025), Figure 2a. Spatially structured count variation needs anatomical interpretation.",
      "ref": "R43",
      "src": "assets/figure-9-1.png",
      "credit": "Reproduced from the supplied course PDF. CC BY 4.0, with source attribution; panel crop retained."
    },
    "10-1": {
      "id": "10-1",
      "title": "Annotation or deconvolution?",
      "caption": "Original course Figure 10.1, adapted with English labels. The proportions are illustrative. Some methods, including cell2location, instead estimate abundance.",
      "ref": "course",
      "src": "assets/figure-10-1.png",
      "credit": "Marcos Toquetão and CSBL. Diagram labels adapted into English."
    },
    "10-2": {
      "id": "10-2",
      "title": "A deconvolution output",
      "caption": "Original course Figure 10.2, reproduced panel from Du et al. (2025), Figure 3g. Estimated cell-type contributions vary across the tissue.",
      "ref": "R43",
      "src": "assets/figure-10-2.png",
      "credit": "Reproduced from the supplied course PDF. CC BY 4.0, with source attribution; panel crop retained."
    },
    "11-1": {
      "id": "11-1",
      "title": "Scales of tissue organization",
      "caption": "Original course Figure 11.1, adapted with English labels. These are useful scales of description, not a strict universal nesting of niches and domains.",
      "ref": "course",
      "src": "assets/figure-11-1.png",
      "credit": "Marcos Toquetão and CSBL. Diagram labels adapted into English."
    },
    "11-2": {
      "id": "11-2",
      "title": "Domains and tissue structure",
      "caption": "Original course Figure 11.2, reproduced panel from Ren et al. (2025), Figure 6a. Benchmark maps from multiple assays provide context beyond the two platforms taught here.",
      "ref": "R45",
      "src": "assets/figure-11-2.png",
      "credit": "Reproduced from the supplied course PDF. CC BY 4.0, with source attribution; panel crop retained."
    },
    "12-1": {
      "id": "12-1",
      "title": "Spots are not independent donors",
      "caption": "Original course Figure 12.1, adapted with English labels. Many units from one donor do not provide the replication of five donors.",
      "ref": "course",
      "src": "assets/figure-12-1.png",
      "credit": "Marcos Toquetão and CSBL. Diagram labels adapted into English."
    },
    "12-2": {
      "id": "12-2",
      "title": "Independent samples in a spatial study",
      "caption": "Original course Figure 12.2, reproduced panel from Du et al. (2025), Figure 4c. Independent sample structure must be distinguished from within-section observations.",
      "ref": "R43",
      "src": "assets/figure-12-2.png",
      "credit": "Reproduced from the supplied course PDF. CC BY 4.0, with source attribution; panel crop retained."
    },
    "13-1": {
      "id": "13-1",
      "title": "Histology across a benchmark",
      "caption": "Original course Figure 13.1, reproduced panel from Ren et al. (2025), Figure 6c. Colorectal tumor histology from a multi-platform benchmark.",
      "ref": "R45",
      "src": "assets/figure-13-1.png",
      "credit": "Reproduced from the supplied course PDF. CC BY 4.0, with source attribution; panel crop retained."
    }
  },
  "references": {
    "R1": {
      "title": "Ståhl et al. Visualization and analysis of gene expression in tissue sections. Science (2016).",
      "url": "https://doi.org/10.1126/science.aaf2403",
      "note": "Core course reference."
    },
    "R2": {
      "title": "Rao A, Barkley D, França GS, Yanai I. Exploring tissue architecture using spatial transcriptomics. Nature 596:211-220 (2021).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Rao%20A%2C%20Barkley%20D%2C%20Fran%C3%A7a%20GS%2C%20Yanai%20I.%20Exploring%20tissue%20architecture%20using%20spatial%20transcriptomics.%20Nature%20596%3A211-220%20%282021%29.",
      "note": "Reference retained from the source PDF."
    },
    "R3": {
      "title": "Williams CG, Lee HJ, Asatsuma T, Vento-Tormo R, Haque A. An introduction to spatial transcriptomics for biomedical research. Genome Medicine 14:68 (2022).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Williams%20CG%2C%20Lee%20HJ%2C%20Asatsuma%20T%2C%20Vento-Tormo%20R%2C%20Haque%20A.%20An%20introduction%20to%20spatial%20transcriptomics%20for%20biomedical%20research.%20Genome%20Medicine%2014%3A68%20%282022%29.",
      "note": "Reference retained from the source PDF."
    },
    "R4": {
      "title": "Tian L, Chen F, Macosko EZ. The expanding vistas of spatial transcriptomics. Nature Biotechnology 41:773-782 (2023).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Tian%20L%2C%20Chen%20F%2C%20Macosko%20EZ.%20The%20expanding%20vistas%20of%20spatial%20transcriptomics.%20Nature%20Biotechnology%2041%3A773-782%20%282023%29.",
      "note": "Reference retained from the source PDF."
    },
    "R5": {
      "title": "Asp M, Bergenstråhle J, Lundeberg J. Spatially resolved transcriptomes: next-generation tools for tissue exploration. BioEssays 42:1900221 (2020).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Asp%20M%2C%20Bergenstr%C3%A5hle%20J%2C%20Lundeberg%20J.%20Spatially%20resolved%20transcriptomes%3A%20next-generation%20tools%20for%20tissue%20exploration.%20BioEssays%2042%3A1900221%20%282020%29.",
      "note": "Reference retained from the source PDF."
    },
    "R6": {
      "title": "Burgess DJ. Spatial transcriptomics coming of age. Nature Reviews Genetics 20:317 (2019).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Burgess%20DJ.%20Spatial%20transcriptomics%20coming%20of%20age.%20Nature%20Reviews%20Genetics%2020%3A317%20%282019%29.",
      "note": "Reference retained from the source PDF."
    },
    "R7": {
      "title": "Vandereyken K, Sifrim A, Thienpont B, Voet T. Methods and applications for single-cell and spatial multi-omics. Nature Reviews Genetics 24:494-515 (2023).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Vandereyken%20K%2C%20Sifrim%20A%2C%20Thienpont%20B%2C%20Voet%20T.%20Methods%20and%20applications%20for%20single-cell%20and%20spatial%20multi-omics.%20Nature%20Reviews%20Genetics%2024%3A494-515%20%282023%29.",
      "note": "Reference retained from the source PDF."
    },
    "R8": {
      "title": "Rodriques SG et al. Slide-seq: a scalable technology for measuring genome-wide expression at high spatial resolution. Science 363:1463-1467 (2019).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Rodriques%20SG%20et%20al.%20Slide-seq%3A%20a%20scalable%20technology%20for%20measuring%20genome-wide%20expression%20at%20high%20spatial%20resolution.%20Science%20363%3A1463-1467%20%282019%29.",
      "note": "Bibliographic details retained from the source PDF; verify before formal citation."
    },
    "R9": {
      "title": "Stickels RR et al. Highly sensitive spatial transcriptomics at near-cellular resolution with Slide-seqV2. Nature Biotechnology 39:313-319 (2021).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Stickels%20RR%20et%20al.%20Highly%20sensitive%20spatial%20transcriptomics%20at%20near-cellular%20resolution%20with%20Slide-seqV2.%20Nature%20Biotechnology%2039%3A313-319%20%282021%29.",
      "note": "Reference retained from the source PDF."
    },
    "R10": {
      "title": "Chen KH, Boettiger AN, Moffitt JR, Wang S, Zhuang X. Spatially resolved, highly multiplexed RNA profiling in single cells. Science 348:aaa6090 (2015).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Chen%20KH%2C%20Boettiger%20AN%2C%20Moffitt%20JR%2C%20Wang%20S%2C%20Zhuang%20X.%20Spatially%20resolved%2C%20highly%20multiplexed%20RNA%20profiling%20in%20single%20cells.%20Science%20348%3Aaaa6090%20%282015%29.",
      "note": "Bibliographic details retained from the source PDF; verify before formal citation."
    },
    "R11": {
      "title": "Eng CL et al. Transcriptome-scale super-resolved imaging in tissues by RNA seqFISH+. Nature 568:235-239 (2019).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Eng%20CL%20et%20al.%20Transcriptome-scale%20super-resolved%20imaging%20in%20tissues%20by%20RNA%20seqFISH%2B.%20Nature%20568%3A235-239%20%282019%29.",
      "note": "Bibliographic details retained from the source PDF; verify before formal citation."
    },
    "R12": {
      "title": "Wang X et al. Three-dimensional intact-tissue sequencing of single-cell transcriptional states. Science 361:eaat5691 (2018).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Wang%20X%20et%20al.%20Three-dimensional%20intact-tissue%20sequencing%20of%20single-cell%20transcriptional%20states.%20Science%20361%3Aeaat5691%20%282018%29.",
      "note": "Bibliographic details retained from the source PDF; verify before formal citation."
    },
    "R13": {
      "title": "He S et al. High-plex imaging of RNA and proteins at subcellular resolution in fixed tissue by spatial molecular imaging. Nature Biotechnology 40:1794-1806 (2022).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=He%20S%20et%20al.%20High-plex%20imaging%20of%20RNA%20and%20proteins%20at%20subcellular%20resolution%20in%20fixed%20tissue%20by%20spatial%20molecular%20imaging.%20Nature%20Biotechnology%2040%3A1794-1806%20%282022%29.",
      "note": "Bibliographic details retained from the source PDF; verify before formal citation."
    },
    "R14": {
      "title": "Janesick A et al. High resolution mapping of the tumor microenvironment using integrated single-cell, spatial and in situ analysis. Nature Communications 14:8353 (2023).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Janesick%20A%20et%20al.%20High%20resolution%20mapping%20of%20the%20tumor%20microenvironment%20using%20integrated%20single-cell%2C%20spatial%20and%20in%20situ%20analysis.%20Nature%20Communications%2014%3A8353%20%282023%29.",
      "note": "Bibliographic details retained from the source PDF; verify before formal citation."
    },
    "R15": {
      "title": "Merritt CR et al. Multiplex digital spatial profiling of proteins and RNA in fixed tissue. Nature Biotechnology 38:586-599 (2020).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Merritt%20CR%20et%20al.%20Multiplex%20digital%20spatial%20profiling%20of%20proteins%20and%20RNA%20in%20fixed%20tissue.%20Nature%20Biotechnology%2038%3A586-599%20%282020%29.",
      "note": "Bibliographic details retained from the source PDF; verify before formal citation."
    },
    "R16": {
      "title": "Chen A et al. Spatiotemporal transcriptomic atlas of mouse organogenesis using DNA nanoball-patterned arrays. Cell 185:1777-1792 (2022).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Chen%20A%20et%20al.%20Spatiotemporal%20transcriptomic%20atlas%20of%20mouse%20organogenesis%20using%20DNA%20nanoball-patterned%20arrays.%20Cell%20185%3A1777-1792%20%282022%29.",
      "note": "Bibliographic details retained from the source PDF; verify before formal citation."
    },
    "R17": {
      "title": "Stereo-seq V2: spatial mapping of total RNA on FFPE sections with high resolution. Cell (2025).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Stereo-seq%20V2%3A%20spatial%20mapping%20of%20total%20RNA%20on%20FFPE%20sections%20with%20high%20resolution.%20Cell%20%282025%29.",
      "note": "Reference retained from the source PDF."
    },
    "R18": {
      "title": "Schott M et al. Open-ST: high-resolution spatial transcriptomics in 3D. Cell 187 (2024).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Schott%20M%20et%20al.%20Open-ST%3A%20high-resolution%20spatial%20transcriptomics%20in%203D.%20Cell%20187%20%282024%29.",
      "note": "Reference retained from the source PDF."
    },
    "R19": {
      "title": "Wang H et al. Systematic benchmarking of imaging spatial transcriptomics platforms in FFPE tissues. Nature Communications 16:10215 (2025).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Wang%20H%20et%20al.%20Systematic%20benchmarking%20of%20imaging%20spatial%20transcriptomics%20platforms%20in%20FFPE%20tissues.%20Nature%20Communications%2016%3A10215%20%282025%29.",
      "note": "Reference retained from the source PDF."
    },
    "R20": {
      "title": "Marco Salas et al. Optimizing Xenium In Situ data utility by quality assessment and best-practice analysis workflows. Nature Methods (2025).",
      "url": "https://doi.org/10.1038/s41592-025-02617-2",
      "note": "Core course reference."
    },
    "R21": {
      "title": "Totty M, Hicks SC, Guo B. SpotSweeper: spatially aware quality control for spatial transcriptomics. Nature Methods 22:1520-1530 (2025).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Totty%20M%2C%20Hicks%20SC%2C%20Guo%20B.%20SpotSweeper%3A%20spatially%20aware%20quality%20control%20for%20spatial%20transcriptomics.%20Nature%20Methods%2022%3A1520-1530%20%282025%29.",
      "note": "Reference retained from the source PDF."
    },
    "R22": {
      "title": "Squair et al. Confronting false discoveries in single-cell differential expression. Nature Communications (2021).",
      "url": "https://doi.org/10.1038/s41467-021-25960-2",
      "note": "Core course reference."
    },
    "R23": {
      "title": "Maynard KR et al. Transcriptome-scale spatial gene expression in the human dorsolateral prefrontal cortex. Nature Neuroscience 24:425-436 (2021).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Maynard%20KR%20et%20al.%20Transcriptome-scale%20spatial%20gene%20expression%20in%20the%20human%20dorsolateral%20prefrontal%20cortex.%20Nature%20Neuroscience%2024%3A425-436%20%282021%29.",
      "note": "Bibliographic details retained from the source PDF; verify before formal citation."
    },
    "R24": {
      "title": "Cable DM et al. Robust decomposition of cell type mixtures in spatial transcriptomics. Nature Biotechnology 40:517-526 (2022).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Cable%20DM%20et%20al.%20Robust%20decomposition%20of%20cell%20type%20mixtures%20in%20spatial%20transcriptomics.%20Nature%20Biotechnology%2040%3A517-526%20%282022%29.",
      "note": "Reference retained from the source PDF."
    },
    "R25": {
      "title": "Kleshchevnikov et al. Cell2location maps fine-grained cell types in spatial transcriptomics. Nature Biotechnology (2022).",
      "url": "https://doi.org/10.1038/s41587-021-01139-4",
      "note": "Core course reference."
    },
    "R26": {
      "title": "Li H et al. A comprehensive benchmarking with practical guidelines for cellular deconvolution of spatial transcriptomics. Nature Communications 14:1548 (2023).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Li%20H%20et%20al.%20A%20comprehensive%20benchmarking%20with%20practical%20guidelines%20for%20cellular%20deconvolution%20of%20spatial%20transcriptomics.%20Nature%20Communications%2014%3A1548%20%282023%29.",
      "note": "Reference retained from the source PDF."
    },
    "R27": {
      "title": "Cheng J, Jin X, Smyth GK, Chen Y. Benchmarking cell type annotation methods for 10x Xenium spatial transcriptomics data. BMC Bioinformatics 26:22 (2025).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Cheng%20J%2C%20Jin%20X%2C%20Smyth%20GK%2C%20Chen%20Y.%20Benchmarking%20cell%20type%20annotation%20methods%20for%2010x%20Xenium%20spatial%20transcriptomics%20data.%20BMC%20Bioinformatics%2026%3A22%20%282025%29.",
      "note": "Reference retained from the source PDF."
    },
    "R28": {
      "title": "Singhal et al. BANKSY unifies cell typing and tissue domain segmentation for scalable spatial omics data analysis. Nature Genetics (2024).",
      "url": "https://doi.org/10.1038/s41588-024-01664-3",
      "note": "Core course reference."
    },
    "R29": {
      "title": "Zhao E et al. Spatial transcriptomics at subspot resolution with BayesSpace. Nature Biotechnology 39:1375-1384 (2021).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Zhao%20E%20et%20al.%20Spatial%20transcriptomics%20at%20subspot%20resolution%20with%20BayesSpace.%20Nature%20Biotechnology%2039%3A1375-1384%20%282021%29.",
      "note": "Bibliographic details retained from the source PDF; verify before formal citation."
    },
    "R30": {
      "title": "Birk S et al. Quantitative characterization of cell niches in spatially resolved omics data. Nature Genetics (2025).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Birk%20S%20et%20al.%20Quantitative%20characterization%20of%20cell%20niches%20in%20spatially%20resolved%20omics%20data.%20Nature%20Genetics%20%282025%29.",
      "note": "Reference retained from the source PDF."
    },
    "R31": {
      "title": "Dimitrov D et al. LIANA+ provides an all-in-one framework for cell-cell communication inference. Nature Cell Biology (2024).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Dimitrov%20D%20et%20al.%20LIANA%2B%20provides%20an%20all-in-one%20framework%20for%20cell-cell%20communication%20inference.%20Nature%20Cell%20Biology%20%282024%29.",
      "note": "Reference retained from the source PDF."
    },
    "R32": {
      "title": "Cang Z et al. Screening cell-cell communication in spatial transcriptomics via collective optimal transport. Nature Methods 20:218-228 (2023).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Cang%20Z%20et%20al.%20Screening%20cell-cell%20communication%20in%20spatial%20transcriptomics%20via%20collective%20optimal%20transport.%20Nature%20Methods%2020%3A218-228%20%282023%29.",
      "note": "Reference retained from the source PDF."
    },
    "R33": {
      "title": "Ma C et al. Inferring allele-specific copy number aberrations and tumor phylogeography from spatially resolved transcriptomics. Nature Methods (2024).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Ma%20C%20et%20al.%20Inferring%20allele-specific%20copy%20number%20aberrations%20and%20tumor%20phylogeography%20from%20spatially%20resolved%20transcriptomics.%20Nature%20Methods%20%282024%29.",
      "note": "Reference retained from the source PDF."
    },
    "R34": {
      "title": "Jin Y et al. Advances in spatial transcriptomics and its applications in cancer research. Molecular Cancer 23:129 (2024).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Jin%20Y%20et%20al.%20Advances%20in%20spatial%20transcriptomics%20and%20its%20applications%20in%20cancer%20research.%20Molecular%20Cancer%2023%3A129%20%282024%29.",
      "note": "Reference retained from the source PDF."
    },
    "R35": {
      "title": "Choe K, Pak U, Pang Y, Hao W, Yang X. Advances and challenges in spatial transcriptomics for developmental biology. Biomolecules 13:156 (2023).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Choe%20K%2C%20Pak%20U%2C%20Pang%20Y%2C%20Hao%20W%2C%20Yang%20X.%20Advances%20and%20challenges%20in%20spatial%20transcriptomics%20for%20developmental%20biology.%20Biomolecules%2013%3A156%20%282023%29.",
      "note": "Reference retained from the source PDF."
    },
    "R36": {
      "title": "Jaume G et al. HEST-1k: a dataset for spatial transcriptomics and histology image analysis. NeurIPS (2024).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Jaume%20G%20et%20al.%20HEST-1k%3A%20a%20dataset%20for%20spatial%20transcriptomics%20and%20histology%20image%20analysis.%20NeurIPS%20%282024%29.",
      "note": "Reference retained from the source PDF."
    },
    "R37": {
      "title": "Tejada-Lapuerta A et al. Nicheformer: a foundation model for single-cell and spatial omics. Nature Methods 22:2525-2538 (2025).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Tejada-Lapuerta%20A%20et%20al.%20Nicheformer%3A%20a%20foundation%20model%20for%20single-cell%20and%20spatial%20omics.%20Nature%20Methods%2022%3A2525-2538%20%282025%29.",
      "note": "Reference retained from the source PDF."
    },
    "R38": {
      "title": "Marconato L et al. SpatialData: an open and universal data framework for spatial omics. Nature Methods (2024).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Marconato%20L%20et%20al.%20SpatialData%3A%20an%20open%20and%20universal%20data%20framework%20for%20spatial%20omics.%20Nature%20Methods%20%282024%29.",
      "note": "Reference retained from the source PDF."
    },
    "R39": {
      "title": "Palla G et al. Squidpy: a scalable framework for spatial omics analysis. Nature Methods 19:171-178 (2022).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Palla%20G%20et%20al.%20Squidpy%3A%20a%20scalable%20framework%20for%20spatial%20omics%20analysis.%20Nature%20Methods%2019%3A171-178%20%282022%29.",
      "note": "Bibliographic details retained from the source PDF; verify before formal citation."
    },
    "R40": {
      "title": "Chen J et al. Giotto Suite: a multiscale and technology-agnostic spatial multiomics analysis ecosystem. Nature Methods (2025).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Chen%20J%20et%20al.%20Giotto%20Suite%3A%20a%20multiscale%20and%20technology-agnostic%20spatial%20multiomics%20analysis%20ecosystem.%20Nature%20Methods%20%282025%29.",
      "note": "Reference retained from the source PDF."
    },
    "R41": {
      "title": "Weber LM et al. Orchestrating Spatial Transcriptomics Analysis with Bioconductor (OSTA), online book. Available at lmweber.org/OSTA.",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Weber%20LM%20et%20al.%20Orchestrating%20Spatial%20Transcriptomics%20Analysis%20with%20Bioconductor%20%28OSTA%29%2C%20online%20book.%20Available%20at%20lmweber.org/OSTA.",
      "note": "Reference retained from the source PDF."
    },
    "R42": {
      "title": "Bhuva DD, Salim A, Mohamed A. SpaNorm: spatially-aware normalization for spatial transcriptomics data. Genome Biology 26 (2025).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Bhuva%20DD%2C%20Salim%20A%2C%20Mohamed%20A.%20SpaNorm%3A%20spatially-aware%20normalization%20for%20spatial%20transcriptomics%20data.%20Genome%20Biology%2026%20%282025%29.",
      "note": "Reference retained from the source PDF."
    },
    "R43": {
      "title": "Du et al. Benchmarking spatial transcriptomics technologies with the multi-sample SpatialBenchVisium dataset. Genome Biology 26, 77 (2025).",
      "url": "https://doi.org/10.1186/s13059-025-03543-4",
      "note": "Core course reference."
    },
    "R44": {
      "title": "Rademacher et al. Comparison of spatial transcriptomics technologies using tumor cryosections. Genome Biology 26, 176 (2025).",
      "url": "https://doi.org/10.1186/s13059-025-03624-4",
      "note": "Core course reference."
    },
    "R45": {
      "title": "Ren et al. Systematic benchmarking of high-throughput subcellular spatial transcriptomics platforms across human tumors. Nature Communications 16, 9232 (2025).",
      "url": "https://doi.org/10.1038/s41467-025-64292-3",
      "note": "Core course reference."
    },
    "R46": {
      "title": "Tirosh I et al. Dissecting the multicellular ecosystem of metastatic melanoma by single-cell RNA-seq. Science 352:189-196 (2016).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Tirosh%20I%20et%20al.%20Dissecting%20the%20multicellular%20ecosystem%20of%20metastatic%20melanoma%20by%20single-cell%20RNA-seq.%20Science%20352%3A189-196%20%282016%29.",
      "note": "Reference retained from the source PDF."
    },
    "R47": {
      "title": "Regev A et al. The Human Cell Atlas. eLife 6:e27041 (2017).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Regev%20A%20et%20al.%20The%20Human%20Cell%20Atlas.%20eLife%206%3Ae27041%20%282017%29.",
      "note": "Reference retained from the source PDF."
    },
    "R48": {
      "title": "Ji AL et al. Multimodal analysis of composition and spatial architecture in human squamous cell carcinoma. Cell 182:497-514 (2020).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Ji%20AL%20et%20al.%20Multimodal%20analysis%20of%20composition%20and%20spatial%20architecture%20in%20human%20squamous%20cell%20carcinoma.%20Cell%20182%3A497-514%20%282020%29.",
      "note": "Reference retained from the source PDF."
    },
    "R49": {
      "title": "Moncada R et al. Integrating microarray-based spatial transcriptomics and single-cell RNA-seq reveals tissue architecture in pancreatic ductal adenocarcinomas. Nature Biotechnology 38:333-342 (2020).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Moncada%20R%20et%20al.%20Integrating%20microarray-based%20spatial%20transcriptomics%20and%20single-cell%20RNA-seq%20reveals%20tissue%20architecture%20in%20pancreatic%20ductal%20adenocarcinomas.%20Nature%20Biotechnology%2038%3A333-342%20%282020%29.",
      "note": "Reference retained from the source PDF."
    },
    "R50": {
      "title": "Chen WT et al. Spatial transcriptomics and in situ sequencing to study Alzheimer's disease. Cell 182:976-991 (2020).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Chen%20WT%20et%20al.%20Spatial%20transcriptomics%20and%20in%20situ%20sequencing%20to%20study%20Alzheimer%27s%20disease.%20Cell%20182%3A976-991%20%282020%29.",
      "note": "Reference retained from the source PDF."
    },
    "R51": {
      "title": "Kuppe C et al. Spatial multi-omic map of human myocardial infarction. Nature 608:766-777 (2022).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Kuppe%20C%20et%20al.%20Spatial%20multi-omic%20map%20of%20human%20myocardial%20infarction.%20Nature%20608%3A766-777%20%282022%29.",
      "note": "Reference retained from the source PDF."
    },
    "R52": {
      "title": "Asp M et al. A spatiotemporal organ-wide gene expression and cell atlas of the developing human heart. Cell 179:1647-1660 (2019).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Asp%20M%20et%20al.%20A%20spatiotemporal%20organ-wide%20gene%20expression%20and%20cell%20atlas%20of%20the%20developing%20human%20heart.%20Cell%20179%3A1647-1660%20%282019%29.",
      "note": "Reference retained from the source PDF."
    },
    "R53": {
      "title": "Thrane K et al. Spatially resolved transcriptomics enables dissection of genetic heterogeneity in stage III cutaneous malignant melanoma. Cancer Research 78:5970-5979 (2018).",
      "url": "https://pubmed.ncbi.nlm.nih.gov/?term=Thrane%20K%20et%20al.%20Spatially%20resolved%20transcriptomics%20enables%20dissection%20of%20genetic%20heterogeneity%20in%20stage%20III%20cutaneous%20malignant%20melanoma.%20Cancer%20Research%2078%3A5970-5979%20%282018%29.",
      "note": "Reference retained from the source PDF."
    },
    "T1": {
      "title": "10x Genomics. Visium Spatial Gene Expression for Fresh Frozen: official documentation.",
      "url": "https://www.10xgenomics.com/support/spatial-gene-expression-fresh-frozen",
      "note": "Practical resource selected for this adaptation."
    },
    "T2": {
      "title": "10x Genomics. Xenium In Situ: official platform and support resources.",
      "url": "https://www.10xgenomics.com/platforms/xenium",
      "note": "Practical resource selected for this adaptation."
    },
    "T3": {
      "title": "10x Genomics. HD Spatial Gene Expression: official documentation.",
      "url": "https://www.10xgenomics.com/support/spatial-gene-expression-hd",
      "note": "Practical resource selected for this adaptation."
    },
    "S1": {
      "title": "Seurat. Analysis, visualization, and integration of spatial datasets: official worked tutorial.",
      "url": "https://satijalab.org/seurat/articles/spatial_vignette",
      "note": "Practical resource selected for this adaptation."
    },
    "S2": {
      "title": "Seurat. SCTransform: count-model-based normalization and variance stabilization.",
      "url": "https://satijalab.org/seurat/reference/sctransform",
      "note": "Practical resource selected for this adaptation."
    },
    "S3": {
      "title": "Squidpy. Spatial autocorrelation with Moran’s I and Geary’s C: official documentation.",
      "url": "https://squidpy.readthedocs.io/en/stable/api/squidpy.gr.spatial_autocorr.html",
      "note": "Practical resource selected for this adaptation."
    },
    "S4": {
      "title": "Bioconductor. edgeR: differential analysis of count data and user guide.",
      "url": "https://bioconductor.org/packages/release/bioc/html/edgeR.html",
      "note": "Practical resource selected for this adaptation."
    },
    "S5": {
      "title": "Jin et al. Inference and analysis of cell-cell communication using CellChat. Nature Communications (2021).",
      "url": "https://doi.org/10.1038/s41467-021-21246-9",
      "note": "Practical resource selected for this adaptation."
    }
  },
  "cases": [
    {
      "id": "case-A",
      "block": "A",
      "title": "An immune boundary",
      "scenario": "Two tumors contain similar proportions of T cells. In one, T cells appear to remain outside malignant regions. You need to test the spatial difference.",
      "questions": [
        {
          "prompt": "What is the primary endpoint?",
          "options": [
            "T-cell location relative to the tumor boundary",
            "The total number of genes in the genome",
            "Whether the image has enough colors"
          ],
          "answer": 0,
          "explanation": "The question concerns tissue organization."
        },
        {
          "prompt": "Which additional information is necessary?",
          "options": [
            "Cell or spot coordinates and a supported definition of the tumor region",
            "Only a dissociated cell-type frequency table",
            "Only total RNA yield"
          ],
          "answer": 0,
          "explanation": "The relation to a tumor boundary requires spatial context and a defensible boundary."
        },
        {
          "prompt": "What could this observational study establish?",
          "options": [
            "A difference in localization under the sampled conditions",
            "Proof that exclusion caused treatment failure",
            "A universal clinical cutoff"
          ],
          "answer": 0,
          "explanation": "Observational localization differences are useful, but causal or clinical conclusions need more evidence."
        }
      ]
    },
    {
      "id": "case-B",
      "block": "B",
      "title": "Choose an assay",
      "scenario": "A team has a defined set of immune and tumor RNA markers and needs cellular localization at the tumor-stroma interface.",
      "questions": [
        {
          "prompt": "Which course platform best fits if the targets are covered?",
          "options": [
            "Xenium",
            "Classic mixed-spot data solely because spots are larger",
            "Bulk RNA-seq alone"
          ],
          "answer": 0,
          "explanation": "Targeted imaging can localize the selected RNA molecules and support cellular analysis."
        },
        {
          "prompt": "What must be checked before committing?",
          "options": [
            "Panel coverage and compatibility with the actual specimen",
            "Only the brand name",
            "Only whether the instrument is new"
          ],
          "answer": 0,
          "explanation": "An otherwise suitable platform may fail the actual target or specimen requirements."
        },
        {
          "prompt": "What needs review after the run?",
          "options": [
            "Segmentation and transcript assignment at the dense interface",
            "Only the output folder name",
            "Only the overall image brightness"
          ],
          "answer": 0,
          "explanation": "Dense interfaces are places where boundary errors can affect interpretation."
        }
      ]
    },
    {
      "id": "case-C",
      "block": "C",
      "title": "A shifted overlay",
      "scenario": "You receive a count matrix and histology image. The expression overlay is displaced, and the files were assembled from multiple processing runs.",
      "questions": [
        {
          "prompt": "What is the first response?",
          "options": [
            "Check sample identities, coordinate transforms and scale factors",
            "Proceed to ligand-receptor analysis",
            "Delete every low-count spot"
          ],
          "answer": 0,
          "explanation": "Basic alignment and identity must be resolved before downstream analysis."
        },
        {
          "prompt": "What processing information should be recovered?",
          "options": [
            "Assay and software versions and settings",
            "Only the analyst’s preferred plotting colors",
            "Only the current date"
          ],
          "answer": 0,
          "explanation": "Primary processing choices can alter the resulting data."
        },
        {
          "prompt": "What should the QA record preserve?",
          "options": [
            "The resolved input identities and the correction made",
            "Only a screenshot after moving the overlay manually",
            "Only the final score from this course"
          ],
          "answer": 0,
          "explanation": "Traceability requires documenting the correction rather than hiding it."
        }
      ]
    },
    {
      "id": "case-D",
      "block": "D",
      "title": "A suspiciously clean result",
      "scenario": "A single tumor section has a low-count stromal region. A strict cutoff removes it. The remaining spots give a very small p-value for a tumor-versus-stroma contrast.",
      "questions": [
        {
          "prompt": "What should happen to the filtering decision?",
          "options": [
            "Revisit it using morphology and spatial QC",
            "Accept it because the final map is cleaner",
            "Remove additional stroma until counts match"
          ],
          "answer": 0,
          "explanation": "A technical threshold may have selectively erased biology."
        },
        {
          "prompt": "Can the many spots support a general patient-level conclusion?",
          "options": [
            "No, this study still has only one independent tumor donor",
            "Yes, each spot is another patient",
            "Yes, if the p-value is below 0.001"
          ],
          "answer": 0,
          "explanation": "Sampling density does not fix a lack of biological replication."
        },
        {
          "prompt": "What is a justified output?",
          "options": [
            "An exploratory within-section contrast with limits and a plan for replication",
            "A general tumor biomarker proven in patients",
            "A causal explanation of stromal exclusion"
          ],
          "answer": 0,
          "explanation": "State the scope of the evidence and design the next independent test."
        }
      ]
    },
    {
      "id": "case-E",
      "block": "E",
      "title": "Prepare a figure for a paper",
      "scenario": "Across multiple donors, you find a recurring immune-rich interface. Ligand and receptor RNA are detected nearby.",
      "questions": [
        {
          "prompt": "What belongs in the report?",
          "options": [
            "Independent sample structure, QC, method choices and uncertainty",
            "Only the most attractive tissue map",
            "Only the interaction network"
          ],
          "answer": 0,
          "explanation": "The reader needs the sampling and analysis behind the figure."
        },
        {
          "prompt": "How should the signaling result be described?",
          "options": [
            "A candidate interaction supported by expression and location",
            "Direct proof of receptor activation",
            "A treatment recommendation"
          ],
          "answer": 0,
          "explanation": "RNA and location support a hypothesis, not a demonstrated mechanism."
        },
        {
          "prompt": "What next step best addresses the mechanism?",
          "options": [
            "An appropriate perturbation with an independent response measurement",
            "Another decorative network layout",
            "Removing donors that weaken the effect"
          ],
          "answer": 0,
          "explanation": "A functional experiment can test the proposed relationship."
        }
      ]
    }
  ],
  "mastery": [
    {
      "id": "mastery-A",
      "block": "A",
      "title": "Mastery: Foundations",
      "scenario": "Five new decisions. Score at least 4 out of 5 on this attempt. Feedback appears after submission. You may retry; your best result is retained.",
      "questions": [
        {
          "prompt": "Which comparison isolates an organizational difference?",
          "options": [
            "Similar cell proportions but different locations relative to a vessel",
            "Different RNA extraction volumes only",
            "Different legend positions"
          ],
          "answer": 0,
          "explanation": "Arrangement can differ independently of abundance."
        },
        {
          "prompt": "A spatial observation is stored as a row. Does that make it a cell?",
          "options": [
            "No, the assay metadata defines the biological unit",
            "Yes, rows always represent cells",
            "Only if the row contains more than 1,000 genes"
          ],
          "answer": 0,
          "explanation": "Storage orientation does not define the measurement."
        },
        {
          "prompt": "A tissue-wide RNA difference disappears after accounting for cell composition. What is plausible?",
          "options": [
            "Composition contributed to the original difference",
            "All original counts were necessarily incorrect",
            "Spatial coordinates have become meaningless"
          ],
          "answer": 0,
          "explanation": "Mixture effects can explain an aggregate signal."
        },
        {
          "prompt": "Which claim needs an additional measurement beyond RNA?",
          "options": [
            "That a receptor protein is activated",
            "That the assay detected a target transcript",
            "That a measured spot has coordinates"
          ],
          "answer": 0,
          "explanation": "RNA abundance does not directly measure protein activation."
        },
        {
          "prompt": "Why keep histology alongside expression?",
          "options": [
            "It provides structural context for interpreting the molecular map",
            "It replaces all molecular QC",
            "It increases the number of donors"
          ],
          "answer": 0,
          "explanation": "Histology can help interpret boundaries and artifacts, but it is not a replacement for other checks."
        }
      ]
    },
    {
      "id": "mastery-B",
      "block": "B",
      "title": "Mastery: Technologies",
      "scenario": "Five new decisions. Score at least 4 out of 5 on this attempt. Feedback appears after submission. You may retry; your best result is retained.",
      "questions": [
        {
          "prompt": "A discovery question concerns genes not yet chosen. What is a suitable direction?",
          "options": [
            "A broad-expression assay with its actual coverage checked",
            "A narrow fixed panel without coverage review",
            "Choose by smallest file size"
          ],
          "answer": 0,
          "explanation": "Discovery needs an assay that can observe unselected candidates."
        },
        {
          "prompt": "An HD dataset uses cell-segmented outputs. How should the task be chosen?",
          "options": [
            "Inspect the actual cell representation before selecting annotation or mixture analysis",
            "Treat every Visium output as the same spot geometry",
            "Ignore segmentation because the product name says HD"
          ],
          "answer": 0,
          "explanation": "Product family alone does not define the final observation."
        },
        {
          "prompt": "A large segmented cell has markers of two adjacent populations. What is a plausible technical explanation?",
          "options": [
            "A boundary merged neighboring cells",
            "A larger sequencing library proves a new type",
            "The coordinate table is always irrelevant"
          ],
          "answer": 0,
          "explanation": "Merged boundaries can combine RNA from different populations."
        },
        {
          "prompt": "A transcript is detected outside the tissue boundary. What is warranted?",
          "options": [
            "Inspect background, alignment and possible signal spread",
            "Call it a new extracellular cell type",
            "Assume that more normalization fixes its origin"
          ],
          "answer": 0,
          "explanation": "Several technical processes can explain off-tissue signal."
        },
        {
          "prompt": "Why avoid a universal platform ranking?",
          "options": [
            "Performance depends on tissue, assay and evaluation task",
            "Platforms measure exactly the same thing",
            "Every benchmark is meaningless"
          ],
          "answer": 0,
          "explanation": "Benchmarks are informative within their tested conditions."
        }
      ]
    },
    {
      "id": "mastery-C",
      "block": "C",
      "title": "Mastery: Tissue to data",
      "scenario": "Five new decisions. Score at least 4 out of 5 on this attempt. Feedback appears after submission. You may retry; your best result is retained.",
      "questions": [
        {
          "prompt": "Which belongs in the experimental metadata?",
          "options": [
            "Donor, condition, batch and assay version",
            "Only a sequential filename",
            "Only the final cell labels"
          ],
          "answer": 0,
          "explanation": "These fields support interpretation and reproducibility."
        },
        {
          "prompt": "What does a coordinate transform connect?",
          "options": [
            "Locations expressed in different image or measurement coordinate systems",
            "RNA counts and p-values",
            "Donor identities and gene names"
          ],
          "answer": 0,
          "explanation": "Transforms and scale factors relate coordinate systems."
        },
        {
          "prompt": "Two processing versions yield different boundaries. What should be reported?",
          "options": [
            "The version and settings used for the analyzed output",
            "Only whichever output has more cells",
            "Neither version if the figure looks plausible"
          ],
          "answer": 0,
          "explanation": "Processing history is part of the method."
        },
        {
          "prompt": "What is a useful pre-analysis consistency check?",
          "options": [
            "Every matrix observation has the expected spatial identifier",
            "Every observation has the same count total",
            "Every gene is detected everywhere"
          ],
          "answer": 0,
          "explanation": "Identifier joins should be checked before maps are interpreted."
        },
        {
          "prompt": "Why distribute conditions across batches?",
          "options": [
            "To reduce confounding of biological and technical differences",
            "To guarantee significance",
            "To avoid recording batch metadata"
          ],
          "answer": 0,
          "explanation": "Balanced processing supports separation of biological and technical effects."
        }
      ]
    },
    {
      "id": "mastery-D",
      "block": "D",
      "title": "Mastery: Analysis",
      "scenario": "Five new decisions. Score at least 4 out of 5 on this attempt. Feedback appears after submission. You may retry; your best result is retained.",
      "questions": [
        {
          "prompt": "Why retain raw counts when using SCTransform?",
          "options": [
            "Some downstream models require untransformed counts",
            "Transformed data are always unusable",
            "Raw counts automatically remove batch effects"
          ],
          "answer": 0,
          "explanation": "Downstream input requirements differ."
        },
        {
          "prompt": "What distinguishes cell2location from a hard spot label?",
          "options": [
            "It models cellular abundance in mixed measurements",
            "It directly images cell membranes",
            "It makes each spot an independent donor"
          ],
          "answer": 0,
          "explanation": "Composition estimates retain information lost by a single dominant label."
        },
        {
          "prompt": "A spatial pattern follows total-count artifacts. What should be reconsidered?",
          "options": [
            "QC and technical explanations for the pattern",
            "Only the gene’s name",
            "Only the final p-value display"
          ],
          "answer": 0,
          "explanation": "A spatially structured artifact can mimic biology."
        },
        {
          "prompt": "Which dataset supports a donor-level group contrast?",
          "options": [
            "Replicated donors per group with comparable aggregation units",
            "One donor with 30,000 spots",
            "One image duplicated five times"
          ],
          "answer": 0,
          "explanation": "Biological replication requires independent donors."
        },
        {
          "prompt": "What does increasing neighborhood size risk?",
          "options": [
            "Blurring small structures through excessive spatial smoothing",
            "Creating more independent samples",
            "Guaranteeing better domain boundaries"
          ],
          "answer": 0,
          "explanation": "The neighborhood scale affects the structures that can be resolved."
        }
      ]
    },
    {
      "id": "mastery-E",
      "block": "E",
      "title": "Mastery: Application",
      "scenario": "Five new decisions. Score at least 4 out of 5 on this attempt. Feedback appears after submission. You may retry; your best result is retained.",
      "questions": [
        {
          "prompt": "What is a strong first deliverable from a public section?",
          "options": [
            "A documented QC review and a limited spatial interpretation",
            "A claim of clinical efficacy",
            "A ranking of all spatial methods"
          ],
          "answer": 0,
          "explanation": "An auditable first result is useful without overstating its scope."
        },
        {
          "prompt": "A finding disappears under modest defensible filter changes. What should be reported?",
          "options": [
            "Sensitivity to the analysis choice",
            "Only the original significant run",
            "That filtering does not matter"
          ],
          "answer": 0,
          "explanation": "Fragility is information about uncertainty."
        },
        {
          "prompt": "A result recurs in an independent dataset. What improves?",
          "options": [
            "Evidence for reproducibility in the tested settings",
            "Proof of every proposed mechanism",
            "The original sample size retrospectively"
          ],
          "answer": 0,
          "explanation": "Replication supports robustness but not all causal explanations."
        },
        {
          "prompt": "Which follow-up addresses a missing protein-level claim?",
          "options": [
            "An appropriate protein measurement",
            "A new RNA color scale",
            "A larger course score"
          ],
          "answer": 0,
          "explanation": "Different claims require different measurements."
        },
        {
          "prompt": "What should determine the next analysis?",
          "options": [
            "The remaining biological or technical uncertainty",
            "The length of the available tool list",
            "The desire to fill another panel"
          ],
          "answer": 0,
          "explanation": "A focused follow-up is tied to a specific uncertainty."
        }
      ]
    }
  ],
  "final": {
    "id": "final",
    "title": "The final investigation",
    "scenario": "Fictional study: a team wants to investigate an immune-rich tumor interface across independently sampled donors. They have matched histology and a targeted RNA panel covering their main cell markers and candidate signaling genes. Build a defensible study in five decisions.",
    "questions": [
      {
        "prompt": "What is the first design priority?",
        "options": [
          "Independent donors and processing that avoids confounding condition with batch",
          "Maximizing spots from one convenient donor",
          "Choosing the prettiest reference image"
        ],
        "answer": 0,
        "explanation": "The design must support the intended donor-level claim."
      },
      {
        "prompt": "Which assay fits targeted cellular localization if specimen compatibility is confirmed?",
        "options": [
          "Xenium",
          "Bulk RNA-seq alone",
          "Any assay regardless of target coverage"
        ],
        "answer": 0,
        "explanation": "Targeted imaging fits the stated localization question when coverage and tissue compatibility hold."
      },
      {
        "prompt": "What should precede interpretation at the dense interface?",
        "options": [
          "Segmentation review and spatial QC with histology",
          "Automatic deletion of every low-count cell",
          "A claim of a new hybrid cell type"
        ],
        "answer": 0,
        "explanation": "Assignment errors and tissue context must be reviewed first."
      },
      {
        "prompt": "How should expression be compared across donor groups?",
        "options": [
          "Use comparable donor-level aggregates and an appropriate replicated model",
          "Treat every cell as an independent patient",
          "Pool all donors and discard their identifiers"
        ],
        "answer": 0,
        "explanation": "The statistical unit should preserve donor replication and the actual design."
      },
      {
        "prompt": "What can nearby ligand and receptor RNA justify?",
        "options": [
          "A candidate mechanism to test with orthogonal and functional evidence",
          "Proof that blocking the ligand will benefit patients",
          "A completed clinical validation"
        ],
        "answer": 0,
        "explanation": "Expression and proximity support a hypothesis; they do not establish benefit or causal signaling."
      }
    ]
  },
  "glossary": {
    "Spatial unit": "The entity represented by an expression profile: a spot, bin or segmented cell.",
    "QA": "Quality assurance: procedures and records that prevent avoidable problems and make the work traceable.",
    "QC": "Quality control: inspection of samples and data to identify technical problems.",
    "Bin": "A geometric subdivision of a capture grid, not automatically a biological cell.",
    "Segmentation": "An inferred boundary that delineates a cell and affects transcript assignment.",
    "Log-normalization": "Library-size scaling followed by a log(1 + x) transformation for exploratory comparison.",
    "SCTransform": "A UMI count-model-based normalization and variance-stabilization approach used in Seurat.",
    "Deconvolution": "Estimation of cell-type composition or abundance in a mixed expression measurement.",
    "Domain": "A spatially coherent tissue region defined using molecular or cellular characteristics.",
    "Niche": "A local microenvironment that may recur in different tissue regions.",
    "Pseudoreplication": "Treating dependent observations as independent replicates for the question being tested.",
    "Pseudobulk": "Aggregation of counts within a biological replicate and a comparable cell type or region.",
    "Spatial autocorrelation": "Statistical association between a value and values at neighboring locations.",
    "Targeted panel": "A predefined set of targets measured by an assay. Missing targets are not evidence of biological absence."
  }
};
