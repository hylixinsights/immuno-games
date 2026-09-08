window.COURSE = {
  "id": "single-cell-essentials",
  "version": 1,
  "title": "Single-cell Transcriptomics",
  "subtitle": "From cells to defensible conclusions.",
  "blocks": [
    {
      "id": "A",
      "title": "The experiment",
      "subtitle": "Understand what was measured",
      "trophy": "Experiment Navigator",
      "question": "What is one observation?",
      "lessons": [
        1,
        2,
        3
      ]
    },
    {
      "id": "B",
      "title": "Quality & preparation",
      "subtitle": "Keep trustworthy cells",
      "trophy": "Quality Guardian",
      "question": "What should you keep?",
      "lessons": [
        4,
        5,
        6
      ]
    },
    {
      "id": "C",
      "title": "Cell populations",
      "subtitle": "Interpret the atlas",
      "trophy": "Atlas Explorer",
      "question": "What do the groups mean?",
      "lessons": [
        7,
        8,
        9
      ]
    },
    {
      "id": "D",
      "title": "Sample comparisons",
      "subtitle": "Compare donors, not independent cells",
      "trophy": "Evidence Analyst",
      "question": "What changed between donors?",
      "lessons": [
        10,
        11,
        12
      ]
    },
    {
      "id": "E",
      "title": "Biological hypotheses",
      "subtitle": "Know what the data support",
      "trophy": "Hypothesis Builder",
      "question": "What would you test next?",
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
      "title": "What does single-cell RNA-seq measure?",
      "subtitle": "A barcode is a starting point, not a verified cell.",
      "steps": [
        {
          "id": "1a",
          "title": "From cells to molecular counts",
          "body": [
            "The compartment-based methods introduced here separate cells into reaction compartments and tag captured RNA-derived molecules so reads can be assigned to their compartment of origin.",
            "The compartment differs: droplets in 10x Chromium; nanowells in BD Rhapsody; and microfluidics-free, vortex-generated partitions in PIPseq chemistry, used in Illumina Single Cell 3′ RNA Prep. These workflows produce libraries for short-read sequencing, typically on Illumina instruments.",
            "This course uses 10x Chromium 3′ gene expression and a compact Seurat workflow as its worked example; the core reasoning transfers across platforms.",
            "A cell barcode links reads to one compartment; a unique molecular identifier (UMI) helps distinguish captured molecules from amplification copies. A read is not a molecule, and a detected barcode is not automatically a cell. Empty compartments can carry ambient RNA; others capture more than one cell - multiplets, often called doublets.",
            "Platform-compatible software - Cell Ranger for 10x, or the appropriate BD or Illumina analysis pipeline - processes sequencing data and identifies cell-associated barcodes before further cell-level QC. Barcode layouts and chemistry differ, so choose a pipeline that supports the exact assay. STARsolo and alevin-fry are alternatives only where the required chemistry is supported and correctly configured."
          ],
          "takeaway": "Know what a read, UMI and barcode represent before interpreting a cell count.",
          "more": [
            "Platform versus sequencer: sequencing a BD or 10x library on an Illumina instrument does not make it an Illumina PIPseq assay. BD offers whole-transcriptome and targeted assays: a targeted panel measures a predefined gene set, so an unmeasured gene is not evidence of absent expression. Confirm the assay, read structure and gene coverage before importing a matrix. Do not copy QC thresholds or preprocessing settings blindly across platforms.",
            "Drop-seq and inDrop also use droplets. Full-length plate-based approaches such as Smart-seq and combinatorial-indexing methods use other designs and are outside this compact course. The barcode-and-UMI description above applies to the UMI-based workflows introduced here, not every single-cell protocol.",
            "Tissue dissociation and cell recovery affect what reaches the instrument. A population missing from the recovered suspension is not necessarily absent from the tissue. Single-nucleus RNA-seq can address some sample constraints, but its measurement profile and QC need separate consideration."
          ],
          "questions": [
            {
              "prompt": "Several reads share a cell barcode, gene and UMI. What may they represent?",
              "options": [
                "Amplification copies of one captured molecule",
                "Independent cells expressing the same gene",
                "An equal number of independent RNA molecules"
              ],
              "answer": 0,
              "explanation": "UMIs help collapse amplification duplicates, subject to sequencing and processing errors."
            },
            {
              "prompt": "A barcode has a small number of transcripts. What is still possible?",
              "options": [
                "An empty compartment containing ambient RNA",
                "A confirmed rare cell solely because RNA is present",
                "A technical replicate of the nearest high-count barcode"
              ],
              "answer": 0,
              "explanation": "RNA detection alone is not proof of a cell-containing compartment, whether droplets or nanowells are used."
            },
            {
              "prompt": "A cell type is rare in the recovered suspension. What can you conclude?",
              "options": [
                "It is rare among the recovered and retained cells",
                "It is equally rare in the original intact tissue",
                "Its recovery rate is identical to every other type"
              ],
              "answer": 0,
              "explanation": "Dissociation, recovery and filtering can bias the observed composition."
            }
          ],
          "refs": [
            "T1",
            "T2",
            "T3",
            "T4"
          ],
          "interactive": null,
          "code": null
        }
      ]
    },
    {
      "id": 2,
      "block": "A",
      "title": "Find your starting files",
      "subtitle": "Raw, filtered and normalized are different things.",
      "steps": [
        {
          "id": "2a",
          "title": "Open the right output",
          "body": [
            "FASTQ files store sequencing reads and quality scores. Cell Ranger produces alignments, processing summaries and feature-barcode matrices. A BAM contains aligned reads. The usual entry into Seurat is a matrix, not a BAM.",
            "The MEX representation uses matrix.mtx.gz with features.tsv.gz and barcodes.tsv.gz. HDF5 (.h5) is an alternative matrix container. A raw matrix includes background barcodes; a filtered matrix contains barcodes called as cell-associated by the pipeline. Neither label means that counts have been normalized."
          ],
          "takeaway": "Filtered means cell-associated barcodes, not analysis-ready cells.",
          "more": [
            "Read the web summary and keep the reference, chemistry and Cell Ranger version with the data. The feature file may include gene expression and other modalities; select the RNA features for this course. Barcodes can recur across libraries, so keep sample identifiers when combining them.",
            "A .h5 extension does not by itself identify a complete analysis object. A 10x matrix and an AnnData .h5ad file use related storage technology but different schemas. Preserve the original matrices even after saving your Seurat object."
          ],
          "questions": [
            {
              "prompt": "Which input normally starts the downstream Seurat analysis?",
              "options": [
                "The feature-barcode count matrix",
                "The BAM index without its alignment file",
                "The final UMAP coordinates alone"
              ],
              "answer": 0,
              "explanation": "Expression analysis begins from the counts and their identifiers."
            },
            {
              "prompt": "What does filtered_feature_bc_matrix indicate?",
              "options": [
                "Barcodes classified as cell-associated by Cell Ranger",
                "Counts transformed to a common library size",
                "Cells that passed every downstream biological review"
              ],
              "answer": 0,
              "explanation": "Cell calling is one stage. Additional QC and annotation are still required."
            },
            {
              "prompt": "Why keep all three MEX files together?",
              "options": [
                "Values need matching feature and barcode identities",
                "Each file is a backup copy of the same matrix",
                "The barcode file contains the normalization factors"
              ],
              "answer": 0,
              "explanation": "The matrix values alone do not identify the genes and observations."
            }
          ],
          "refs": [
            "T2"
          ],
          "interactive": "files",
          "code": "counts <- Read10X(data.dir = \"filtered_feature_bc_matrix/\")\n# If multiple modalities are returned, select Gene Expression.\nobj <- CreateSeuratObject(counts = counts)"
        }
      ]
    },
    {
      "id": 3,
      "block": "A",
      "title": "Understand the object and its zeros",
      "subtitle": "Storage structure is not biological evidence.",
      "steps": [
        {
          "id": "3a",
          "title": "Keep representations separate",
          "body": [
            "A Seurat object organizes expression, cell metadata and analysis results. The RNA counts layer stores input counts; the data layer commonly holds normalized values; scale.data holds scaled or model-derived values depending on the workflow. An .rds file can preserve the full R object.",
            "Single-cell matrices contain many zeros. Sparse storage records nonzero entries and their locations instead of every zero. This saves memory, but does not explain why a specific gene was undetected in a cell. Low abundance and sampling can produce a zero even when a gene is biologically expressed."
          ],
          "takeaway": "Sparse storage saves space. It does not turn an undetected gene into a measured absence.",
          "more": [
            "AnnData, commonly used with Scanpy, organizes the main matrix in X, cell metadata in obs, gene metadata in var and embeddings in obsm. Named layers can preserve alternate representations. Seurat conventionally uses genes by cells; AnnData uses cells by genes.",
            "Do not assume AnnData.raw contains original counts: it stores a snapshot of what was assigned. Likewise, inspect the actual Seurat assay and layer before extracting data. Converting a large sparse matrix to dense can consume substantial memory. Imputation is not a routine step in this course."
          ],
          "questions": [
            {
              "prompt": "A zero appears for a gene in one cell. What is justified?",
              "options": [
                "No count was observed for that gene in that cell",
                "The gene cannot be expressed by that cell type",
                "The gene must be absent from the cell’s genome"
              ],
              "answer": 0,
              "explanation": "Observed zeros can reflect sampling and detection limits as well as biological absence."
            },
            {
              "prompt": "What is the main benefit of sparse matrix storage?",
              "options": [
                "It avoids explicitly storing most zero entries",
                "It estimates the expression of undetected genes",
                "It removes low-quality cells from the experiment"
              ],
              "answer": 0,
              "explanation": "Sparse storage is a computational representation, not a denoising procedure."
            },
            {
              "prompt": "An AnnData object has a raw attribute. What should you check?",
              "options": [
                "Which representation was saved into that attribute",
                "Whether the name guarantees original UMI counts",
                "Whether it automatically preserves every input file"
              ],
              "answer": 0,
              "explanation": "Object names do not substitute for inspecting data provenance and transformations."
            }
          ],
          "refs": [
            "S2",
            "S3"
          ],
          "interactive": "sparse",
          "code": null
        }
      ]
    },
    {
      "id": 4,
      "block": "B",
      "title": "QC starts before filtering",
      "subtitle": "Two steps: protect the design, then inspect the cells.",
      "steps": [
        {
          "id": "4a",
          "title": "Protect the experiment before analysis",
          "body": [
            "Quality assurance (QA) defines handling procedures and records: sample identity, donor, condition, library, batch, chemistry and software versions. Quality control (QC) inspects the sample and output to detect problems. A reproducible analysis needs both.",
            "For a condition comparison, the donor or independently sampled experimental unit matters from the beginning. Distribute conditions across processing batches when possible. Collecting many cells from one donor improves sampling of that donor; it does not replace biological replication."
          ],
          "takeaway": "Preserve donor and sample identity before combining libraries.",
          "more": [
            "If every control was processed in one batch and every case in another, the design confounds condition with batch. Integration cannot reliably reconstruct information the experiment never separated.",
            "One donor may contribute several libraries, time points or conditions. Retain these relationships instead of assigning each library a new biological identity. Use anonymized donor labels; identifiable clinical information is unnecessary for this teaching workflow."
          ],
          "questions": [
            {
              "prompt": "Which metadata are essential for a paired stimulation study?",
              "options": [
                "Donor, condition and library identifiers",
                "Cell barcode and cluster label alone",
                "UMAP coordinates and total counts alone"
              ],
              "answer": 0,
              "explanation": "A paired analysis must retain which observations come from the same donor."
            },
            {
              "prompt": "All cases were processed separately from all controls. What is the main concern?",
              "options": [
                "Condition and technical batch are confounded",
                "The samples have too many metadata fields",
                "The number of detected genes must be identical"
              ],
              "answer": 0,
              "explanation": "No downstream correction can guarantee separation of perfectly confounded effects."
            },
            {
              "prompt": "Which activity is QA rather than only downstream QC?",
              "options": [
                "Standardizing handling and recording processing versions",
                "Removing cells below an observed count cutoff",
                "Inspecting a mitochondrial-percentage histogram"
              ],
              "answer": 0,
              "explanation": "QA establishes procedures and traceability; QC evaluates the resulting material and data."
            }
          ],
          "refs": [
            "S1",
            "S6"
          ],
          "interactive": null,
          "code": null
        },
        {
          "id": "4b",
          "title": "Choose filters with biological context",
          "body": [
            "Start with detected genes (nFeature_RNA), total UMIs (nCount_RNA) and mitochondrial count percentage. Inspect distributions and their relationships within each sample. Low complexity may indicate damaged cells; high counts may flag doublets, but neither observation is decisive alone.",
            "A fixed mitochondrial cutoff is not universal across tissues, cell types and preparations. Likewise, filtering genes by detection frequency trades noise reduction against losing rare-population markers. Record which cells and populations are removed, not just the final total."
          ],
          "takeaway": "Use thresholds as reviewable decisions, not universal constants.",
          "more": [
            "The interactive table below uses synthetic examples to isolate trade-offs. It deliberately includes an intact low-RNA cell and a high-count singlet. A rule that removes every unusual value can erase genuine biology.",
            "The PBMC3k tutorial contains example thresholds for its dataset. Reusing those numbers elsewhere requires justification. For human symbols, mitochondrial genes commonly begin with MT-; naming conventions differ by organism and reference. Ribosomal or hemoglobin signals can be informative, but are not automatic reasons to delete cells."
          ],
          "questions": [
            {
              "prompt": "A small lymphocyte has relatively few genes but otherwise consistent QC. What is appropriate?",
              "options": [
                "Review it against its sample and cell-type context",
                "Remove it because low complexity always means damage",
                "Impute counts until it resembles a larger cell"
              ],
              "answer": 0,
              "explanation": "Low RNA content can be a normal feature of a population."
            },
            {
              "prompt": "A cell has unusually high UMIs. What is a reasonable next step?",
              "options": [
                "Review doublet evidence and biological identity",
                "Classify it as a doublet from that metric alone",
                "Normalize it and assume the issue is resolved"
              ],
              "answer": 0,
              "explanation": "High counts can have technical or biological explanations."
            },
            {
              "prompt": "A gene is detected mainly in a rare population. What can an aggressive prevalence filter do?",
              "options": [
                "Remove a biologically useful population marker",
                "Guarantee that only technical noise is removed",
                "Increase the number of independent donors"
              ],
              "answer": 0,
              "explanation": "Gene filters can selectively erase rare-cell information."
            }
          ],
          "refs": [
            "S1"
          ],
          "interactive": "qc",
          "code": "obj[[\"percent.mt\"]] <- PercentageFeatureSet(obj, pattern = \"^MT-\")\nVlnPlot(obj, features = c(\"nFeature_RNA\", \"nCount_RNA\", \"percent.mt\"))\nFeatureScatter(obj, feature1 = \"nCount_RNA\", feature2 = \"nFeature_RNA\")"
        }
      ]
    },
    {
      "id": 5,
      "block": "B",
      "title": "One barcode, more than one explanation",
      "subtitle": "Doublets and ambient RNA need different checks.",
      "steps": [
        {
          "id": "5a",
          "title": "A mixed profile is not automatically a new cell type",
          "body": [
            "A doublet contains contributions from more than one cell in one partition. scDblFinder is the single doublet-detection example in this course. Assess doublets in the context of the capture library and loading conditions, not by treating all pooled donors as one loading event.",
            "Ambient RNA comes from RNA outside intact captured cells. SoupX is the single correction example: it estimates background contamination using droplet data and cellular expression structure. A raw droplet matrix can therefore contain useful information even after cells have been called."
          ],
          "takeaway": "Doublet detection and ambient-RNA correction address different sources of mixed signal.",
          "more": [
            "A doublet score is an estimate, not a direct observation of two cells. Similar-cell-type doublets can be harder to distinguish from singlets. Examine the expected loading context and the populations that filtering would affect.",
            "Ambient correction is not a mandatory cosmetic step. Inspect suspicious expression, available background information and the effect of correction. Keep original counts and the correction history. Neither method should be used merely to make an atlas look cleaner."
          ],
          "questions": [
            {
              "prompt": "A barcode strongly expresses incompatible T-cell and B-cell marker programs. What should be considered?",
              "options": [
                "A heterotypic doublet among the explanations",
                "A new lineage established by marker coexpression",
                "A batch effect that necessarily affects every cell"
              ],
              "answer": 0,
              "explanation": "Mixed marker programs warrant doublet review before a novelty claim."
            },
            {
              "prompt": "A low-level abundant lineage transcript appears across unrelated cell types. What is plausible?",
              "options": [
                "Ambient RNA contamination",
                "Every unrelated type has converted lineage",
                "All affected cells are necessarily doublets"
              ],
              "answer": 0,
              "explanation": "An abundant extracellular RNA source can contaminate many droplets."
            },
            {
              "prompt": "Why retain the raw droplet matrix for SoupX?",
              "options": [
                "Background droplets can inform the ambient profile",
                "It already contains normalized singlet expression",
                "It guarantees removal of every technical artifact"
              ],
              "answer": 0,
              "explanation": "Empty or background droplets help characterize ambient RNA; correction remains model-dependent."
            }
          ],
          "refs": [
            "S4",
            "S5"
          ],
          "interactive": null,
          "code": null
        }
      ]
    },
    {
      "id": 6,
      "block": "B",
      "title": "Normalize and select useful variation",
      "subtitle": "One main route and one alternative.",
      "steps": [
        {
          "id": "6a",
          "title": "Make the representation fit the next question",
          "body": [
            "The main route uses Seurat LogNormalize: scale counts by each cell’s total and apply log(1 + x). Select highly variable genes with FindVariableFeatures, scale the selected representation and use PCA to summarize major expression variation.",
            "SCTransform is the alternative: a UMI count-model-based normalization and variance-stabilization workflow. It replaces parts of the log-normalization route rather than being a compulsory second normalization step. Preserve original RNA counts for models that require them."
          ],
          "takeaway": "Normalization, variable-gene selection and PCA solve different problems.",
          "more": [
            "Library-size scaling can mix technical and biological differences in RNA content. Inspect consequences rather than assuming equal totals imply equal biological states. A highly variable gene is useful for representation learning; it is not automatically a DEG between conditions.",
            "Scaling may create a dense representation, so routinely scaling every gene can increase memory use. Regressing mitochondrial content or cell-cycle scores is not automatic: the covariate may overlap the biology you want to study. Use a justified, documented choice."
          ],
          "questions": [
            {
              "prompt": "What does selecting highly variable genes primarily support?",
              "options": [
                "Building an informative exploratory representation",
                "Proving a condition effect for each selected gene",
                "Recovering the original tissue position of each cell"
              ],
              "answer": 0,
              "explanation": "HVG selection identifies variation useful for exploration, not a replicated condition test."
            },
            {
              "prompt": "How should SCTransform relate to the main LogNormalize route?",
              "options": [
                "As an alternative workflow with its own assumptions",
                "As an obligatory additional transform after LogNormalize",
                "As a substitute for donor-level replication"
              ],
              "answer": 0,
              "explanation": "These are alternative normalization approaches, not a universal serial recipe."
            },
            {
              "prompt": "Which input should be preserved for count-based pseudo-bulk analysis?",
              "options": [
                "The original untransformed RNA counts",
                "The UMAP coordinates for each cell",
                "The centered and scaled PCA input alone"
              ],
              "answer": 0,
              "explanation": "Count-based models need suitable count inputs rather than arbitrary transformed values."
            }
          ],
          "refs": [
            "S1",
            "S7"
          ],
          "interactive": "normalize",
          "code": "obj <- NormalizeData(obj, normalization.method = \"LogNormalize\")\nobj <- FindVariableFeatures(obj, selection.method = \"vst\", nfeatures = 2000)\nobj <- ScaleData(obj, features = VariableFeatures(obj))\nobj <- RunPCA(obj, features = VariableFeatures(obj))\n# Alternative route: SCTransform(), followed by PCA. Do not stack both recipes."
        }
      ]
    },
    {
      "id": 7,
      "block": "C",
      "title": "Biology or batch?",
      "subtitle": "Integration is a decision, not a default obligation.",
      "steps": [
        {
          "id": "7a",
          "title": "Correct technical structure without erasing the question",
          "body": [
            "First inspect the representation by sample, donor, condition and QC metrics. A separation can reflect a technical batch, a biological state, different composition or a combination. Mixing all samples perfectly is not a biological objective.",
            "Harmony is the one integration example here. It adjusts a low-dimensional representation to reduce specified batch-associated structure. The corrected representation can support neighbors and clustering; it does not turn the original count matrix into batch-free measurements."
          ],
          "takeaway": "Integrate when a technical problem is supported, and check what biology is lost.",
          "more": [
            "Compare the unintegrated and integrated results with relevant markers and cell populations. Closely matching unrelated or condition-specific states can be overcorrection. When batch and condition are perfectly confounded, there is no reliable computational guarantee of separation.",
            "For differential expression, preserve donor-level counts and model the experimental design. Do not substitute an integrated embedding for expression counts. Details of Seurat layer handling depend on the assay and workflow; follow the documented version rather than copying mixed-version code."
          ],
          "questions": [
            {
              "prompt": "A UMAP separates stimulated and control cells. What should be checked before integration?",
              "options": [
                "Whether the separation reflects the intended response",
                "Whether an algorithm can remove the separation completely",
                "Whether the same number of cells can be forced into each cluster"
              ],
              "answer": 0,
              "explanation": "The condition effect may be the biology, not an artifact."
            },
            {
              "prompt": "What does Harmony primarily adjust in this workflow?",
              "options": [
                "A low-dimensional representation used downstream",
                "The number of independent biological replicates",
                "The original molecules captured by each droplet"
              ],
              "answer": 0,
              "explanation": "Integration operates on a representation; it cannot change sampling or original capture."
            },
            {
              "prompt": "What result would raise concern about overcorrection?",
              "options": [
                "A supported condition-specific state is erased",
                "Samples overlap within a well-supported shared type",
                "The corrected embedding has different numerical coordinates"
              ],
              "answer": 0,
              "explanation": "Losing expected biological structure can signal excessive correction."
            }
          ],
          "refs": [
            "S8"
          ],
          "interactive": null,
          "code": null
        }
      ]
    },
    {
      "id": 8,
      "block": "C",
      "title": "Read a UMAP carefully",
      "subtitle": "An island is not a diagnosis.",
      "steps": [
        {
          "id": "8a",
          "title": "Separate the graph, the clusters and the picture",
          "body": [
            "Use the selected PCs to construct a cell-neighbor graph. Leiden clustering groups cells on a graph. UMAP creates a two-dimensional visualization. Clustering is not performed by drawing boundaries around the UMAP islands.",
            "The atlas below uses real public 10x PBMC3k cells. Compare two UMAP parameter settings computed from the same supplied PCA representation. Cell identities and expression measurements have not changed. Distances between separated islands, their areas and their orientation are not calibrated biological quantities."
          ],
          "takeaway": "Use UMAP to inspect structure, then return to markers, samples and the analysis graph.",
          "more": [
            "The reference dataset was processed by the Scanpy PBMC3k example. Its existing broad cell labels are retained for this visualization; they are not newly validated by this course and were not generated by the Seurat workflow shown here.",
            "Neighbor number and minimum distance affect UMAP layout; clustering resolution affects graph communities. Neither parameter has one correct value for every dataset. Reproducibility requires recording seeds, representations and settings. PCA is also a model of variation, not a direct biological pathway map."
          ],
          "questions": [
            {
              "prompt": "Two UMAP layouts show different spacing between the same cell types. What changed?",
              "options": [
                "The visualization may have changed without changing the measurements",
                "The cells must have changed their RNA profiles",
                "The donors must have become more biologically different"
              ],
              "answer": 0,
              "explanation": "Embedding parameters can change geometry without altering expression data."
            },
            {
              "prompt": "What does Leiden act on in this workflow?",
              "options": [
                "A graph of cell relationships",
                "The pixels of the final UMAP image",
                "The donor-level count matrix after pseudo-bulk only"
              ],
              "answer": 0,
              "explanation": "The clustering input is a graph, not the displayed UMAP coordinates."
            },
            {
              "prompt": "A large UMAP island occupies twice the area of another. What follows?",
              "options": [
                "Its plotted area is not a calibrated abundance estimate",
                "It contains exactly twice as many recovered cells",
                "Its cells contain exactly twice as much RNA"
              ],
              "answer": 0,
              "explanation": "Use counts and sample-aware summaries for abundance, not visual island area."
            }
          ],
          "refs": [
            "S1",
            "D1"
          ],
          "interactive": "umap",
          "code": "# Use the PCs supported by inspection; 1:20 is an example.\nobj <- FindNeighbors(obj, dims = 1:20)\nobj <- FindClusters(obj, algorithm = 4, resolution = 0.5)\nobj <- RunUMAP(obj, dims = 1:20, seed.use = 42)\nDimPlot(obj, reduction = \"umap\", label = TRUE)"
        }
      ]
    },
    {
      "id": 9,
      "block": "C",
      "title": "Give clusters defensible names",
      "subtitle": "Distinguish cell type from cell state.",
      "steps": [
        {
          "id": "9a",
          "title": "Use marker combinations and uncertainty",
          "body": [
            "Begin with several compatible markers, not a single familiar gene. A T-cell annotation might be supported by a coherent T-cell program, while interferon-response genes describe a state that can occur across types. A cluster can also be enriched for poor-quality cells or doublets.",
            "Reference label transfer in Seurat is the second annotation approach. It compares the query with an annotated reference. A missing or mismatched reference population can produce misleading assignments, so retain an uncertain or broader label when evidence is weak."
          ],
          "takeaway": "A cluster is a computational group. A cell label is an interpretation.",
          "more": [
            "Inspect expression patterns, marker specificity, donor distribution and technical metrics. A marker can be real without being unique to one type. Reference labels also inherit the reference’s granularity and mistakes.",
            "The PBMC atlas can support broad introductory labels, but detailed subtypes require stronger evidence. Automated transfer should be reviewed against the actual genes measured and the biological system."
          ],
          "questions": [
            {
              "prompt": "A cluster expresses an interferon-response program across several lineage markers. What is plausible?",
              "options": [
                "A shared activation state rather than a new lineage",
                "A single new cell type defined by interferon alone",
                "A population that must be removed as ambient RNA"
              ],
              "answer": 0,
              "explanation": "States can occur across cell types; lineage and state are different axes."
            },
            {
              "prompt": "A reference lacks a population present in the query. What is a risk?",
              "options": [
                "Assignment to the closest available but incorrect label",
                "Guaranteed discovery of a new reference label",
                "Automatic removal of all affected query cells"
              ],
              "answer": 0,
              "explanation": "Reference-based predictions are limited by reference coverage."
            },
            {
              "prompt": "What is appropriate when subtype markers conflict?",
              "options": [
                "Keep a broader or uncertain annotation pending review",
                "Choose the narrowest label with any supporting gene",
                "Use the cluster number as proof of subtype identity"
              ],
              "answer": 0,
              "explanation": "Uncertainty should remain visible when the evidence cannot resolve identity."
            }
          ],
          "refs": [
            "S1",
            "S9"
          ],
          "interactive": null,
          "code": null
        }
      ]
    },
    {
      "id": 10,
      "block": "D",
      "title": "Did the population change?",
      "subtitle": "A percentage is relative to the other populations.",
      "steps": [
        {
          "id": "10a",
          "title": "Compare composition across samples",
          "body": [
            "Count each cell type within each biological sample, then inspect proportions per sample and condition. Cells pooled across donors do not provide the variability between donors. Dissociation, recovery and QC can all influence the observed composition.",
            "propeller is the primary R example for testing sample-level cell-type proportions with biological replication. scCODA is the optional second approach: it models composition jointly and interprets effects relative to a reference population. These are different statistical formulations, not interchangeable guarantees."
          ],
          "takeaway": "A falling percentage does not necessarily mean fewer cells of that type in the tissue.",
          "more": [
            "If one population expands, the percentage of another can fall even when its absolute number stays unchanged. The activity below isolates this arithmetic. Real scRNA-seq recovery counts are not direct absolute counts of cells in the intact tissue.",
            "propeller uses transformed sample proportions and linear modeling; it is not the same as a joint reference-based compositional model. For either approach, report the denominator, design, uncertainty and sampling limitations. Absolute abundance requires an appropriate additional measurement."
          ],
          "questions": [
            {
              "prompt": "B-cell counts stay fixed while another population increases. What can happen to the B-cell fraction?",
              "options": [
                "It decreases because the denominator increased",
                "It must remain fixed because B-cell counts stayed fixed",
                "It proves B cells were depleted from the tissue"
              ],
              "answer": 0,
              "explanation": "Proportions depend on all populations included in the denominator."
            },
            {
              "prompt": "What is the appropriate input level for a replicated composition comparison?",
              "options": [
                "Cell-type counts or proportions per biological sample",
                "One pooled proportion for each condition",
                "Every cell treated as an independent proportion estimate"
              ],
              "answer": 0,
              "explanation": "Sample-level variation is necessary for a biological comparison."
            },
            {
              "prompt": "What distinguishes scCODA’s interpretation here?",
              "options": [
                "Effects are relative to a selected reference population",
                "Effects are direct absolute tissue cell counts",
                "The number of captured cells replaces donor replication"
              ],
              "answer": 0,
              "explanation": "A reference-based compositional effect is relative, not an absolute tissue count."
            }
          ],
          "refs": [
            "S10",
            "S11"
          ],
          "interactive": "composition",
          "code": null
        }
      ]
    },
    {
      "id": 11,
      "block": "D",
      "title": "Cells are not biological replicates",
      "subtitle": "Build pseudo-bulk without losing the design.",
      "steps": [
        {
          "id": "11a",
          "title": "Why pseudo-bulk at all?",
          "body": [
            "Cells from the same donor are not independent biological replicates. They share donor genetics and aspects of collection and handling. Treating every cell as an independent sample in a donor-level differential-expression test overstates biological replication and can inflate false positives.",
            "Pseudo-bulk preserves the unit of replication: sum raw UMI counts - not normalized or log-transformed values - within each donor × condition × cell type. Each aggregate becomes one expression profile. Preserve donor identity, pairing and relevant experimental covariates for the downstream model.",
            "Compare the profiles with an established bulk RNA-seq method. We use edgeR here; DESeq2 is a common alternative. Your biological n is the number of independent donors, not the number of cells or aggregated columns. Paired conditions remain repeated observations from the same donor. More cells improve the profile of a donor; they do not create more donors."
          ],
          "takeaway": "Aggregate counts by the biological unit, not by condition alone.",
          "more": [
            "Use AggregateExpression with explicit donor, condition and cell-type grouping. Use summed counts, not an average of log-normalized expression, for a count-based pseudo-bulk model.",
            "Inspect how many cells contribute to each aggregate. A missing cell type in a sample is not equivalent to an observed zero-expression pseudo-bulk for that type. Define inclusion rules and compare biologically comparable populations.",
            "Pseudo-bulk does not repair missing replication or a batch perfectly confounded with condition. For non-human experiments, use the appropriate independent biological unit, such as animal or independently treated culture, rather than assuming that every sample label is a replicate."
          ],
          "questions": [
            {
              "prompt": "What should be summed for an edgeR pseudo-bulk input?",
              "options": [
                "Original RNA counts within each sample and cell type",
                "Log-normalized values across all donors in a condition",
                "UMAP coordinates within each cluster"
              ],
              "answer": 0,
              "explanation": "Count-based pseudo-bulk uses summed count data with sample identity retained."
            },
            {
              "prompt": "A donor provides 10,000 cells before and after stimulation. How many independent donors are present?",
              "options": [
                "One donor with paired observations",
                "Two donors because there are two conditions",
                "Twenty thousand donors because cells differ"
              ],
              "answer": 0,
              "explanation": "Repeated conditions from one person remain dependent observations."
            },
            {
              "prompt": "A cell type was not recovered in one sample. What should you do before DE?",
              "options": [
                "Review inclusion and comparability rather than invent a zero profile",
                "Fill its pseudo-bulk with zeros and treat it as observed expression",
                "Copy counts from the most similar donor"
              ],
              "answer": 0,
              "explanation": "Missing recovery is not the same as measuring zero expression in that cell type."
            }
          ],
          "refs": [
            "S6",
            "S15"
          ],
          "interactive": "pseudobulk",
          "code": "pb <- AggregateExpression(\n  obj, assays = \"RNA\",\n  group.by = c(\"donor_id\", \"condition\", \"cell_type\"),\n  return.seurat = FALSE\n)$RNA\n# Retain metadata identifying each aggregated column."
        }
      ]
    },
    {
      "id": 12,
      "block": "D",
      "title": "Markers are not condition DEGs",
      "subtitle": "Two questions require different evidence.",
      "steps": [
        {
          "id": "12a",
          "title": "Use markers to describe populations",
          "body": [
            "A cluster marker distinguishes a group from the chosen comparison cells. Seurat’s Wilcoxon test is a familiar exploratory option in FindMarkers or FindAllMarkers. Marker results depend on the reference group, expression thresholds and clustering decisions.",
            "Inspect effect size, detection fraction and coherent marker programs. A tiny cell-level p-value is not enough to claim a robust treatment or disease effect across donors. The clustering and marker selection may have used the same data."
          ],
          "takeaway": "A cluster marker is not automatically a replicated condition effect.",
          "more": [
            "Useful annotation can be exploratory without being a confirmatory donor-level test. Be explicit about the purpose of the comparison. Markers are relative to the groups compared; specificity must be checked against relevant alternative populations.",
            "Use normalized RNA expression for the intended marker workflow, not arbitrary integrated coordinates. Retain a separate path for condition-level count modeling."
          ],
          "questions": [
            {
              "prompt": "A gene distinguishes one cluster from the rest. What is the immediate interpretation?",
              "options": [
                "A marker relative to that particular comparison",
                "A disease effect replicated across patients",
                "A unique marker across every possible tissue"
              ],
              "answer": 0,
              "explanation": "Marker interpretation depends on the population and contrast used."
            },
            {
              "prompt": "Which evidence is useful for annotating a cluster?",
              "options": [
                "A coherent set of markers with plausible specificity",
                "The smallest p-value regardless of effect size",
                "The gene with the largest count in one cell"
              ],
              "answer": 0,
              "explanation": "Multiple consistent markers are more informative than a single extreme result."
            },
            {
              "prompt": "Why should cell-level marker p-values not establish a patient-level condition effect?",
              "options": [
                "Cells from the same donor are not independent patients",
                "Wilcoxon can never rank exploratory markers",
                "Marker genes cannot change with condition"
              ],
              "answer": 0,
              "explanation": "The scope of inference must match the biological replication."
            }
          ],
          "refs": [
            "S1",
            "S6"
          ],
          "interactive": null,
          "code": "markers <- FindAllMarkers(\n  obj, assay = \"RNA\", test.use = \"wilcox\", only.pos = TRUE\n)\n# Explore marker programs; do not substitute this for donor-level DE."
        },
        {
          "id": "12b",
          "title": "Test condition effects with biological replication",
          "body": [
            "For the main condition comparison, use edgeR on cell-type-specific pseudo-bulk counts. Build a design that represents condition and, when appropriate, donor pairing or other justified covariates. Filter lowly expressed genes using the design-aware filterByExpr approach.",
            "The pseudo-bulk workflow uses TMM library normalization and a count model, such as edgeR’s quasi-likelihood framework. TMM belongs to this sample-level analysis; it is not an additional normalization of the exploratory single-cell representation. Interpret log-fold change, FDR and consistency across samples together."
          ],
          "takeaway": "Donor-level effect size and uncertainty matter more than the number of sequenced cells.",
          "more": [
            "For paired observations, donor belongs in the design when identifiable with the other terms. A batch perfectly confounded with condition cannot be separated simply by adding both terms. The model matrix must be estimable.",
            "The linked Seurat interferon example provides donor-aware aggregation instructions. The browser’s effect table is synthetic and does not fit edgeR. It lets you practice choosing an interpretation without fabricating a real test result."
          ],
          "questions": [
            {
              "prompt": "Which design preserves a paired stimulation comparison?",
              "options": [
                "Condition plus donor pairing when the model is identifiable",
                "Condition alone after discarding donor identifiers",
                "Each cell barcode as a new biological replicate"
              ],
              "answer": 0,
              "explanation": "A paired design should account for the within-donor relationship."
            },
            {
              "prompt": "A gene has a tiny FDR but a negligible estimated effect. What should be assessed?",
              "options": [
                "Biological magnitude and consistency, not significance alone",
                "Whether the FDR proves a large biological response",
                "Whether more decimal places strengthen the mechanism"
              ],
              "answer": 0,
              "explanation": "Statistical evidence and biological relevance are different judgments."
            },
            {
              "prompt": "Why filter lowly expressed genes before the count-model test?",
              "options": [
                "To restrict testing to genes with adequate count support",
                "To keep only genes already known to be significant",
                "To force every gene to have the same mean count"
              ],
              "answer": 0,
              "explanation": "Filtering should be based on support and design, not selected from the final significance results."
            }
          ],
          "refs": [
            "S6",
            "S12"
          ],
          "interactive": "de",
          "code": null
        }
      ]
    },
    {
      "id": 13,
      "block": "E",
      "title": "Who might be communicating?",
      "subtitle": "An interaction score is a hypothesis.",
      "steps": [
        {
          "id": "13a",
          "title": "Use CellChat without inventing cell contact",
          "body": [
            "CellChat uses expression and curated ligand-receptor knowledge to infer candidate relationships between annotated populations. Its scores are model-based summaries, not measured probabilities that two particular cells communicated.",
            "Unlike spatial data, dissociated scRNA-seq does not preserve who was next to whom. A ligand in one type and a receptor in another can motivate a hypothesis, but does not establish contact, secretion, receptor activation or a causal response."
          ],
          "takeaway": "Expression supports a candidate interaction; mechanism needs additional evidence.",
          "more": [
            "Cell labels, recovery, filtering and the interaction database affect the inferred network. Check that the relevant subunits and populations are measured and that the result is not driven by one donor.",
            "For a stronger claim, consider orthogonal protein or localization evidence and a suitable perturbation with a downstream readout. A denser network is not evidence of better inference."
          ],
          "questions": [
            {
              "prompt": "What does dissociated scRNA-seq alone not establish for a candidate interaction?",
              "options": [
                "Whether the two populations were physically adjacent",
                "Whether an assayed transcript was detected",
                "Whether an annotated population is in the recovered dataset"
              ],
              "answer": 0,
              "explanation": "The original spatial neighborhood is not retained by conventional dissociation."
            },
            {
              "prompt": "A CellChat score increases between two populations. What can you report?",
              "options": [
                "A change in the inferred relationship under the model",
                "A measured increase in direct physical cell contacts",
                "A proven increase in receptor activation"
              ],
              "answer": 0,
              "explanation": "The score is an inference sensitive to the input data and model."
            },
            {
              "prompt": "Which follow-up most directly tests a proposed signaling mechanism?",
              "options": [
                "A suitable perturbation with a downstream response measurement",
                "A different network-layout algorithm",
                "A lower plotting threshold for weak interactions"
              ],
              "answer": 0,
              "explanation": "A functional test challenges the proposed relationship rather than redrawing it."
            }
          ],
          "refs": [
            "S13"
          ],
          "interactive": "signaling",
          "code": null
        }
      ]
    },
    {
      "id": 14,
      "block": "E",
      "title": "Order states without inventing time",
      "subtitle": "A trajectory is a model of progression.",
      "steps": [
        {
          "id": "14a",
          "title": "Choose a defensible starting state",
          "body": [
            "Slingshot is the single trajectory example. It uses a low-dimensional representation and cluster relationships to infer lineages and pseudotime. Use a biologically relevant subset with evidence of a progression, rather than forcing unrelated mature PBMC types onto one developmental path.",
            "Pseudotime is an inferred relative ordering, not elapsed hours or lineage tracing. The chosen root, cell selection, representation and available intermediate states affect the result. The activity below changes the root on a fixed synthetic graph; it does not run Slingshot."
          ],
          "takeaway": "An ordered snapshot is not a direct observation of a cell changing fate.",
          "more": [
            "For a real follow-up, the resources include a public 10x bone-marrow dataset. A defensible progenitor subset and evidence supporting the starting state would still be required. We do not present a lineage result as already established for that dataset.",
            "Inspect candidate trajectories using biological markers and, where available, temporal or lineage information. Missing intermediates can distort an inferred path. RNA velocity and extra trajectory methods are outside this introductory course."
          ],
          "questions": [
            {
              "prompt": "What does pseudotime represent?",
              "options": [
                "Relative position along an inferred progression",
                "Elapsed experimental time measured in hours",
                "A directly observed parent-child cell relationship"
              ],
              "answer": 0,
              "explanation": "Pseudotime is an inferred ordering; it is not a clock or lineage-tracing record."
            },
            {
              "prompt": "Why is the choice of a root important?",
              "options": [
                "It influences the direction assigned to the progression",
                "It creates missing intermediate cells",
                "It converts the dataset into a longitudinal experiment"
              ],
              "answer": 0,
              "explanation": "Direction requires assumptions or supporting biological information."
            },
            {
              "prompt": "Which subset is most suitable for a trajectory question?",
              "options": [
                "Related states with evidence of a biological progression",
                "All mature cell types pooled solely because they share a UMAP",
                "Only the cells with the highest library sizes"
              ],
              "answer": 0,
              "explanation": "Trajectory inference should match a plausible process in a relevant subset."
            }
          ],
          "refs": [
            "S14",
            "D3"
          ],
          "interactive": "trajectory",
          "code": null
        }
      ]
    },
    {
      "id": 15,
      "block": "E",
      "title": "Defend your conclusion",
      "subtitle": "Choose the next test that reduces uncertainty.",
      "steps": [
        {
          "id": "15a",
          "title": "Connect design, processing and interpretation",
          "body": [
            "A useful single-cell conclusion connects the question to suitable sampling, transparent QC, supported labels and a comparison that respects biological replication. More clusters and smaller p-values do not automatically make that conclusion stronger.",
            "In the final investigation, you will audit a paired stimulation study, protect donor identity and distinguish composition, expression and signaling hypotheses. Finish all five blocks and score at least 4/5 on that investigation to complete the course."
          ],
          "takeaway": "The strength of the conclusion must match the design and measurements.",
          "more": [
            "Use one small PBMC dataset to learn the mechanics, a donor-aware dataset for between-condition analysis, and a separate appropriate system for trajectory. The public resources provide real starting points; the browser activities do not execute R or analyze uploaded samples.",
            "The main workflow is Seurat. Other packages appear only for specific tasks. All points and achievements are a local learning record, not a verified professional certificate. Export your progress before moving devices."
          ],
          "questions": [
            {
              "prompt": "A condition effect is present in only one donor. What should the report acknowledge?",
              "options": [
                "The effect is not consistent across the sampled donors",
                "The total cell count removes the inconsistency",
                "The most significant cell-level result should replace donor review"
              ],
              "answer": 0,
              "explanation": "Between-donor consistency is part of evaluating generalization."
            },
            {
              "prompt": "Which addition most improves an auditable analysis?",
              "options": [
                "Data provenance, processing decisions and an explicit design",
                "Only the final embedding image at higher resolution",
                "Only a longer list of software packages"
              ],
              "answer": 0,
              "explanation": "An audit needs the choices and inputs behind the result."
            },
            {
              "prompt": "What should determine the next experiment?",
              "options": [
                "The uncertainty remaining in the proposed explanation",
                "The number of unused analysis tools",
                "The amount of empty space in the figure layout"
              ],
              "answer": 0,
              "explanation": "A focused follow-up addresses a concrete unresolved question."
            }
          ],
          "refs": [
            "S6",
            "D1",
            "D2",
            "D3"
          ],
          "interactive": null,
          "code": null
        }
      ]
    }
  ],
  "figures": {
    "umap-1": {
      "id": "umap-1",
      "title": "PBMC3k UMAP, setting 1",
      "src": "assets/pbmc-umap-1.png",
      "ref": "D0",
      "caption": "Public 10x PBMC3k: 2,638 retained cells, one donor. UMAP recomputed from the first 20 supplied PCs with 10 neighbors, minimum distance 0.1 and seed 42. Scanpy reference preprocessing and supplied broad labels retained. The figure was generated for this course; it is not an output of the Seurat commands shown.",
      "credit": "10x Genomics data, CC BY 4.0. Processed reference: Scanpy / cellxgene. New visualization derived for this course."
    },
    "umap-2": {
      "id": "umap-2",
      "title": "PBMC3k UMAP, setting 2",
      "src": "assets/pbmc-umap-2.png",
      "ref": "D0",
      "caption": "Public 10x PBMC3k: 2,638 retained cells, one donor. UMAP recomputed from the first 20 supplied PCs with 40 neighbors, minimum distance 0.6 and seed 42. Scanpy reference preprocessing and supplied broad labels retained. The figure was generated for this course; it is not an output of the Seurat commands shown.",
      "credit": "10x Genomics data, CC BY 4.0. Processed reference: Scanpy / cellxgene. New visualization derived for this course."
    }
  },
  "references": {
    "T1": {
      "title": "10x Genomics. Universal 3′ Gene Expression: official support.",
      "url": "https://www.10xgenomics.com/support/universal-three-prime-gene-expression",
      "note": "Primary publication or official documentation. Selected for this focused course."
    },
    "T2": {
      "title": "10x Genomics. Cell Ranger feature-barcode matrices: MEX format and cell calling.",
      "url": "https://www.10xgenomics.com/support/software/cell-ranger/latest/analysis/cr-outputs-mex-matrices",
      "note": "Primary publication or official documentation. Selected for this focused course."
    },
    "S1": {
      "title": "Seurat. Guided clustering tutorial for 10x PBMC3k.",
      "url": "https://satijalab.org/seurat/articles/pbmc3k_tutorial",
      "note": "Primary publication or official documentation. Selected for this focused course."
    },
    "S2": {
      "title": "Seurat v5. Essential commands, assays and layers.",
      "url": "https://satijalab.org/seurat/articles/seurat5_essential_commands.html",
      "note": "Primary publication or official documentation. Selected for this focused course."
    },
    "S3": {
      "title": "AnnData. Annotated matrix structure and storage.",
      "url": "https://anndata.readthedocs.io/en/stable/generated/anndata.AnnData.html",
      "note": "Primary publication or official documentation. Selected for this focused course."
    },
    "S4": {
      "title": "scDblFinder. Introduction and doublet-detection guidance.",
      "url": "https://bioconductor.posit.co/packages/3.23/bioc/vignettes/scDblFinder/inst/doc/introduction.html",
      "note": "Primary publication or official documentation. Selected for this focused course."
    },
    "S5": {
      "title": "Young and Behjati. SoupX removes ambient RNA contamination from droplet-based single-cell RNA sequencing data. GigaScience (2020).",
      "url": "https://doi.org/10.1093/gigascience/giaa151",
      "note": "Primary publication or official documentation. Selected for this focused course."
    },
    "S6": {
      "title": "Seurat. Differential expression testing and donor-aware pseudo-bulk aggregation.",
      "url": "https://satijalab.org/seurat/articles/de_vignette",
      "note": "Primary publication or official documentation. Selected for this focused course."
    },
    "S7": {
      "title": "Seurat. SCTransform normalization and variance stabilization.",
      "url": "https://satijalab.org/seurat/reference/sctransform",
      "note": "Primary publication or official documentation. Selected for this focused course."
    },
    "S8": {
      "title": "Seurat. Integrative analysis and Harmony integration.",
      "url": "https://satijalab.org/seurat/articles/seurat5_integration",
      "note": "Primary publication or official documentation. Selected for this focused course."
    },
    "S9": {
      "title": "Seurat. Mapping and annotating query datasets.",
      "url": "https://satijalab.org/seurat/articles/integration_mapping",
      "note": "Primary publication or official documentation. Selected for this focused course."
    },
    "S10": {
      "title": "Phipson et al. propeller: testing for differences in cell type proportions in single cell data. Bioinformatics (2022).",
      "url": "https://academic.oup.com/bioinformatics/article/38/20/4720/6675456",
      "note": "Primary publication or official documentation. Selected for this focused course."
    },
    "S11": {
      "title": "Büttner et al. scCODA is a Bayesian model for compositional single-cell data analysis. Nature Communications (2021).",
      "url": "https://doi.org/10.1038/s41467-021-27150-6",
      "note": "Primary publication or official documentation. Selected for this focused course."
    },
    "S12": {
      "title": "Bioconductor. edgeR package and user guide.",
      "url": "https://bioconductor.org/packages/release/bioc/html/edgeR.html",
      "note": "Primary publication or official documentation. Selected for this focused course."
    },
    "S13": {
      "title": "Jin et al. Inference and analysis of cell-cell communication using CellChat. Nature Communications (2021).",
      "url": "https://doi.org/10.1038/s41467-021-21246-9",
      "note": "Primary publication or official documentation. Selected for this focused course."
    },
    "S14": {
      "title": "Street et al. Slingshot: cell lineage and pseudotime inference for single-cell transcriptomics. BMC Genomics (2018).",
      "url": "https://doi.org/10.1186/s12864-018-4772-0",
      "note": "Primary publication or official documentation. Selected for this focused course."
    },
    "D1": {
      "title": "Scanpy. Processed public 10x PBMC3k dataset and processing provenance.",
      "url": "https://scanpy.readthedocs.io/en/stable/api/scanpy.datasets.pbmc3k_processed.html",
      "note": "Primary publication or official documentation. Selected for this focused course."
    },
    "D2": {
      "title": "Seurat. Interferon-stimulation data with instructions to recover donor identity for replicated analysis.",
      "url": "https://satijalab.org/seurat/articles/de_vignette",
      "note": "Primary publication or official documentation. Selected for this focused course."
    },
    "D3": {
      "title": "10x Genomics. 10k bone-marrow mononuclear cells, 5′ v2.0. Optional real-data starting point, not a validated trajectory result.",
      "url": "https://www.10xgenomics.com/datasets/10-k-bone-marrow-mononuclear-cells-bmmn-cs-5-v-2-0-2-standard-6-1-0",
      "note": "Primary publication or official documentation. Selected for this focused course."
    },
    "D0": {
      "title": "10x Genomics. 3k PBMCs from a Healthy Donor. Public dataset, CC BY 4.0.",
      "url": "https://www.10xgenomics.com/datasets/3-k-pbm-cs-from-a-healthy-donor-1-standard-1-1-0",
      "note": "Original public dataset and attribution license."
    },
    "T3": {
      "title": "BD Rhapsody single-cell multiomics: microwell capture, whole-transcriptome and targeted assays",
      "url": "https://www.bdbiosciences.com/en-tw/learn/applications/single-cell-multiomics"
    },
    "T4": {
      "title": "Illumina Single Cell 3′ RNA Prep: PIPseq chemistry and particle-templated partitions",
      "url": "https://www.illumina.com/products/by-type/sequencing-kits/library-prep-kits/single-cell-rna-prep.html"
    },
    "S15": {
      "title": "Squair et al. (2021). Confronting false discoveries in single-cell differential expression",
      "url": "https://www.nature.com/articles/s41467-021-25960-2"
    }
  },
  "cases": [
    {
      "id": "case-A",
      "block": "A",
      "title": "The unexpected delivery",
      "scenario": "A collaborator sends filtered_feature_bc_matrix.h5, a Cell Ranger web summary and a spreadsheet. They call the matrix “already normalized.”",
      "questions": [
        {
          "prompt": "What should you verify first?",
          "options": [
            "The matrix contents and what filtered means in this output",
            "Whether its filename contains the word normalized",
            "Whether the spreadsheet has a UMAP column"
          ],
          "answer": 0,
          "explanation": "Filtered Cell Ranger matrices contain cell-associated barcodes, not normalized expression."
        },
        {
          "prompt": "Which metadata must be connected before combining libraries?",
          "options": [
            "Sample and donor identifiers linked to barcodes",
            "Only the order of rows in the spreadsheet",
            "Only the total number of detected genes"
          ],
          "answer": 0,
          "explanation": "Barcodes alone can recur across libraries and do not encode the biological design."
        },
        {
          "prompt": "A sparse matrix uses little memory. What does that imply?",
          "options": [
            "Its storage avoids representing most zero entries explicitly",
            "The biological noise has already been removed",
            "Every zero was verified by an independent measurement"
          ],
          "answer": 0,
          "explanation": "Sparse representation is a storage property, not a quality or biological guarantee."
        }
      ]
    },
    {
      "id": "case-B",
      "block": "B",
      "title": "A filter that removes the signal",
      "scenario": "A strict gene-count threshold removes most small lymphocytes. A few remaining barcodes coexpress strong T-cell and B-cell programs.",
      "questions": [
        {
          "prompt": "What should happen to the gene-count filter?",
          "options": [
            "Review its population-specific impact and QC context",
            "Raise it until all retained populations have equal complexity",
            "Accept it because fewer cells simplify the analysis"
          ],
          "answer": 0,
          "explanation": "A global threshold may preferentially remove a valid low-RNA population."
        },
        {
          "prompt": "What should be investigated for the mixed-marker barcodes?",
          "options": [
            "Doublet evidence in the relevant capture libraries",
            "A new lineage inferred from marker coexpression alone",
            "Whether log-normalization removes their cell barcodes"
          ],
          "answer": 0,
          "explanation": "Mixed programs can arise from doublets and need review."
        },
        {
          "prompt": "Which record should accompany the retained matrix?",
          "options": [
            "Thresholds, exclusions, correction history and original counts",
            "Only the names of the final clusters",
            "Only the number of retained genes"
          ],
          "answer": 0,
          "explanation": "Reanalysis requires knowing what was changed and retaining the source data."
        }
      ]
    },
    {
      "id": "case-C",
      "block": "C",
      "title": "An atlas that looks too clean",
      "scenario": "After integration, donors mix well, but a supported stimulated-cell program disappears. The analyst prefers the smoother UMAP.",
      "questions": [
        {
          "prompt": "What is the strongest concern?",
          "options": [
            "Integration may have removed relevant biological variation",
            "Any donor mixing is evidence of invalid analysis",
            "UMAP must always keep each sample in a separate island"
          ],
          "answer": 0,
          "explanation": "Integration should be assessed for both technical improvement and biological preservation."
        },
        {
          "prompt": "What should be compared across the two representations?",
          "options": [
            "Markers, states and sample structure, not only visual mixing",
            "Only the distance between the largest islands",
            "Only the total area of each colored region"
          ],
          "answer": 0,
          "explanation": "An attractive layout is not a validation metric for biology."
        },
        {
          "prompt": "How should an uncertain small cluster be annotated?",
          "options": [
            "With a supported broad or uncertain label",
            "With the most detailed available reference name",
            "With a novel type name because it forms an island"
          ],
          "answer": 0,
          "explanation": "An annotation should reflect the strength and specificity of evidence."
        }
      ]
    },
    {
      "id": "case-D",
      "block": "D",
      "title": "A large study with one donor",
      "scenario": "One donor contributes 15,000 control cells and 15,000 stimulated cells. The analyst pools each condition and reports population-wide disease effects.",
      "questions": [
        {
          "prompt": "How many independent donors support the comparison?",
          "options": [
            "One, with observations under two conditions",
            "Two, because stimulation defines a new donor",
            "Thirty thousand, because each cell has its own barcode"
          ],
          "answer": 0,
          "explanation": "Cells and conditions do not substitute for independent donor sampling."
        },
        {
          "prompt": "What scope of conclusion is supported?",
          "options": [
            "An exploratory response in the sampled donor",
            "A general disease effect across a patient population",
            "A replicated donor-level result from many barcodes"
          ],
          "answer": 0,
          "explanation": "The scope of the inference is limited by the biological replication."
        },
        {
          "prompt": "What would strengthen a general condition comparison?",
          "options": [
            "Independent donors with condition and sample identity retained",
            "More cells from the same two libraries alone",
            "A smaller UMAP minimum-distance parameter"
          ],
          "answer": 0,
          "explanation": "More independent biological samples address generalization."
        }
      ]
    },
    {
      "id": "case-E",
      "block": "E",
      "title": "A signaling trajectory",
      "scenario": "A snapshot dataset suggests a progression between related states and a ligand-receptor relationship. The team wants to claim a causal differentiation mechanism.",
      "questions": [
        {
          "prompt": "What does the inferred trajectory establish by itself?",
          "options": [
            "A model-based relative ordering of sampled states",
            "The elapsed duration of differentiation",
            "Direct proof of parent-child lineage relationships"
          ],
          "answer": 0,
          "explanation": "Trajectory inference is not a clock or a lineage-tracing experiment."
        },
        {
          "prompt": "What is missing from dissociated expression for the signaling claim?",
          "options": [
            "Direct evidence of interaction and the original spatial context",
            "The possibility of identifying assayed transcripts",
            "The ability to examine population marker programs"
          ],
          "answer": 0,
          "explanation": "The network needs additional evidence about location and mechanism."
        },
        {
          "prompt": "What next step best tests the proposed mechanism?",
          "options": [
            "A targeted perturbation with suitable temporal or functional readouts",
            "Changing the trajectory colors to show direction",
            "Increasing the number of displayed predicted interactions"
          ],
          "answer": 0,
          "explanation": "A mechanistic claim needs evidence that can challenge the proposed causal relation."
        }
      ]
    }
  ],
  "mastery": [
    {
      "id": "mastery-A",
      "block": "A",
      "title": "Mastery: The experiment",
      "scenario": "Five different questions to revisit this block. Score at least 4/5 to earn a mastery distinction. Review your selections before submitting. Feedback appears after your one saved submission; this set cannot be retried.",
      "questions": [
        {
          "prompt": "What distinguishes a UMI from a cell barcode?",
          "options": [
            "A UMI helps track molecules; a cell barcode identifies a partition",
            "A UMI identifies a donor; a barcode identifies a gene",
            "A UMI is a normalized count; a barcode is a p-value"
          ],
          "answer": 0,
          "explanation": "The two tags serve different levels of molecular assignment."
        },
        {
          "prompt": "Which output is most useful for inspecting sequencing alignments?",
          "options": [
            "The BAM file with its supporting index",
            "The UMAP coordinate table",
            "The scaled expression layer"
          ],
          "answer": 0,
          "explanation": "Alignments are stored in BAM, while matrices summarize expression."
        },
        {
          "prompt": "Which statement about a 10x H5 file is correct?",
          "options": [
            "Its schema must be checked before treating it as an analysis object",
            "It always contains every downstream result",
            "Its extension guarantees log-normalized expression"
          ],
          "answer": 0,
          "explanation": "A container format does not identify the full semantics of the stored data."
        },
        {
          "prompt": "Why can converting counts to a dense matrix be costly?",
          "options": [
            "It allocates entries for zeros that sparse storage omitted",
            "It increases the number of biological cells",
            "It automatically computes all pairwise DE tests"
          ],
          "answer": 0,
          "explanation": "Dense conversion can expand memory without adding measurements."
        },
        {
          "prompt": "What does an .rds file provide for a Seurat workflow?",
          "options": [
            "A way to serialize the R object and its stored components",
            "A replacement for read alignment in Cell Ranger",
            "A guarantee that all stored values are raw counts"
          ],
          "answer": 0,
          "explanation": "RDS preserves the object that was saved, including its processing state."
        }
      ]
    },
    {
      "id": "mastery-B",
      "block": "B",
      "title": "Mastery: Quality & preparation",
      "scenario": "Five different questions to revisit this block. Score at least 4/5 to earn a mastery distinction. Review your selections before submitting. Feedback appears after your one saved submission; this set cannot be retried.",
      "questions": [
        {
          "prompt": "A high-mitochondrial population is expected in this tissue. What is appropriate?",
          "options": [
            "Evaluate quality using its broader context and sample metrics",
            "Apply a PBMC cutoff without inspecting the population",
            "Remove the mitochondrial genes and declare the cells healthy"
          ],
          "answer": 0,
          "explanation": "A metric is not a universal biological classification."
        },
        {
          "prompt": "Why assess doublets by capture context?",
          "options": [
            "Loading and processing affect the expected multiplet behavior",
            "The largest donor is always the only source of doublets",
            "Every merged dataset has the same doublet rate"
          ],
          "answer": 0,
          "explanation": "The technical capture unit matters for detection and expectations."
        },
        {
          "prompt": "SoupX changes low-level ectopic marker signal. What must remain available?",
          "options": [
            "Original counts and a record of the correction",
            "Only the corrected matrix and its plot",
            "Only the list of clusters with changed names"
          ],
          "answer": 0,
          "explanation": "Correction should be traceable and reviewable."
        },
        {
          "prompt": "What does a highly variable gene selection not establish?",
          "options": [
            "A replicated treatment effect across donors",
            "Variation useful for building a representation",
            "A candidate feature for exploratory PCA"
          ],
          "answer": 0,
          "explanation": "HVG selection is not a condition-level inference."
        },
        {
          "prompt": "Which cells should a fixed threshold be checked against?",
          "options": [
            "The sample’s biological populations and other QC evidence",
            "Only the cells that already pass it",
            "Only the most abundant reference population"
          ],
          "answer": 0,
          "explanation": "Assessing exclusions is necessary to detect selective loss."
        }
      ]
    },
    {
      "id": "mastery-C",
      "block": "C",
      "title": "Mastery: Cell populations",
      "scenario": "Five different questions to revisit this block. Score at least 4/5 to earn a mastery distinction. Review your selections before submitting. Feedback appears after your one saved submission; this set cannot be retried.",
      "questions": [
        {
          "prompt": "A UMAP rotation changes the direction of an island. What changes biologically?",
          "options": [
            "Nothing follows from orientation alone",
            "The lineage root must have changed",
            "The cells have reversed their expression state"
          ],
          "answer": 0,
          "explanation": "Embedding orientation has no inherent biological meaning."
        },
        {
          "prompt": "What distinguishes clustering resolution from UMAP minimum distance?",
          "options": [
            "They affect graph communities and visualization, respectively",
            "Both define independent donors",
            "Both measure absolute differentiation time"
          ],
          "answer": 0,
          "explanation": "These settings act on different parts of the workflow."
        },
        {
          "prompt": "A marker is shared across several lineages. What should annotation use?",
          "options": [
            "A broader combination of compatible markers",
            "The shared gene as a unique identity label",
            "The smallest UMAP island as the reference truth"
          ],
          "answer": 0,
          "explanation": "Specificity is assessed in context with multiple markers."
        },
        {
          "prompt": "What is an appropriate use of a Harmony embedding?",
          "options": [
            "Constructing relationships for exploratory clustering",
            "Supplying gene counts to a pseudo-bulk count model",
            "Replacing sample metadata in the experimental design"
          ],
          "answer": 0,
          "explanation": "An embedding and a count matrix have different purposes."
        },
        {
          "prompt": "A reference transfer assigns low-confidence labels. What should be preserved?",
          "options": [
            "The uncertainty and a broader interpretation when needed",
            "Only the most specific predicted label",
            "Only cells with the largest total RNA"
          ],
          "answer": 0,
          "explanation": "Confidence and coverage limits belong in the result."
        }
      ]
    },
    {
      "id": "mastery-D",
      "block": "D",
      "title": "Mastery: Sample comparisons",
      "scenario": "Five different questions to revisit this block. Score at least 4/5 to earn a mastery distinction. Review your selections before submitting. Feedback appears after your one saved submission; this set cannot be retried.",
      "questions": [
        {
          "prompt": "A population’s proportion rises after other cells are lost during QC. What is possible?",
          "options": [
            "The rise partly reflects a changed denominator",
            "The population necessarily expanded in the tissue",
            "The proportion is independent of filtering"
          ],
          "answer": 0,
          "explanation": "Filtering can alter observed composition."
        },
        {
          "prompt": "What does pseudo-bulk preserve when grouped correctly?",
          "options": [
            "Biological sample structure for count-based comparison",
            "Every original cell-level variance component",
            "The tissue coordinates lost during dissociation"
          ],
          "answer": 0,
          "explanation": "Aggregation preserves sample-level structure, not every single-cell feature."
        },
        {
          "prompt": "Why not average log-normalized values for edgeR count input?",
          "options": [
            "They are not the summed count observations expected by the model",
            "Averages always have higher biological replication",
            "Log values remove all condition differences"
          ],
          "answer": 0,
          "explanation": "The model input should match its count-data assumptions."
        },
        {
          "prompt": "A gene changes consistently with a moderate effect across donors. What matters?",
          "options": [
            "Effect size, uncertainty and experimental design together",
            "Only the number of zero cells in a UMAP island",
            "Only its marker rank in a pooled analysis"
          ],
          "answer": 0,
          "explanation": "A condition claim needs sample-aware evidence."
        },
        {
          "prompt": "A reference-based compositional effect is positive. What is its scope?",
          "options": [
            "An increase relative to the reference under the model",
            "An absolute increase in cells per gram of tissue",
            "Proof that recovery bias is absent"
          ],
          "answer": 0,
          "explanation": "Relative compositional changes are not absolute tissue abundance."
        }
      ]
    },
    {
      "id": "mastery-E",
      "block": "E",
      "title": "Mastery: Biological hypotheses",
      "scenario": "Five different questions to revisit this block. Score at least 4/5 to earn a mastery distinction. Review your selections before submitting. Feedback appears after your one saved submission; this set cannot be retried.",
      "questions": [
        {
          "prompt": "A receptor RNA is detected. What remains unmeasured by that fact?",
          "options": [
            "Whether its protein is active in the proposed interaction",
            "Whether the RNA target was observed",
            "Whether a count was assigned in the matrix"
          ],
          "answer": 0,
          "explanation": "RNA abundance does not directly establish receptor activation."
        },
        {
          "prompt": "Why avoid forcing every PBMC type into one trajectory?",
          "options": [
            "Unrelated mature populations need not form a sampled progression",
            "Trajectory methods require equal cluster sizes",
            "PBMCs cannot ever contain transitional states"
          ],
          "answer": 0,
          "explanation": "A trajectory should reflect a defensible biological process and subset."
        },
        {
          "prompt": "What can a different root alter on a fixed trajectory?",
          "options": [
            "The assigned direction and relative ordering",
            "The original captured transcript counts",
            "The number of independent experiments"
          ],
          "answer": 0,
          "explanation": "Changing the root changes the interpretation of progression."
        },
        {
          "prompt": "What is useful when a conclusion changes under plausible QC choices?",
          "options": [
            "Report sensitivity and examine what drives the change",
            "Select the most significant setting without reporting alternatives",
            "Treat the variation as a new biological replicate"
          ],
          "answer": 0,
          "explanation": "Sensitivity is evidence about uncertainty in the result."
        },
        {
          "prompt": "Which next step addresses generalization across people?",
          "options": [
            "Replication in independently sampled donors",
            "Repeated UMAP runs on the same cells",
            "Additional sequencing of one existing library only"
          ],
          "answer": 0,
          "explanation": "Independent biological sampling is needed for generalization."
        }
      ]
    }
  ],
  "final": {
    "id": "final",
    "title": "The final investigation",
    "scenario": "Fictional study: independently sampled donors provide paired control and stimulated 10x libraries. The team wants to distinguish changes in population composition, expression within cell types and candidate signaling. Audit five decisions before accepting the conclusion.",
    "questions": [
      {
        "prompt": "What must survive data merging?",
        "options": [
          "Donor, condition and capture-library identities",
          "Only cell labels after pooling all samples",
          "Only the UMAP coordinates from each run"
        ],
        "answer": 0,
        "explanation": "The identifiers preserve replication, pairing and technical context."
      },
      {
        "prompt": "A QC rule removes a low-RNA population preferentially. What should happen?",
        "options": [
          "Review biological context and the impact of that rule",
          "Apply it because all populations must have equal RNA",
          "Use integration to restore the discarded cells"
        ],
        "answer": 0,
        "explanation": "Selective filtering can change composition and downstream conclusions."
      },
      {
        "prompt": "Which input fits the within-type condition DE question?",
        "options": [
          "Summed raw counts per donor, condition and cell type",
          "All cells in each condition pooled into one normalized vector",
          "Integrated PCA coordinates grouped by condition"
        ],
        "answer": 0,
        "explanation": "The sample-level count model must retain the biological design."
      },
      {
        "prompt": "A population’s fraction increases. What is the defensible interpretation?",
        "options": [
          "A relative change among recovered cells, with sampling limits",
          "A proven absolute expansion in the intact tissue",
          "A direct estimate of cells per unit blood volume"
        ],
        "answer": 0,
        "explanation": "Relative recovered fractions do not establish absolute tissue abundance."
      },
      {
        "prompt": "What can a predicted ligand-receptor change support?",
        "options": [
          "A candidate mechanism for additional experimental testing",
          "Direct proof that receptor activation caused the phenotype",
          "A measured count of physical contacts between the cells"
        ],
        "answer": 0,
        "explanation": "Expression-based inference motivates a test rather than proving the mechanism."
      }
    ]
  },
  "glossary": {
    "Barcode": "A sequence used to assign reads to a partition or library context; a detected barcode is not automatically a confirmed cell.",
    "UMI": "A molecular tag that helps distinguish captured molecules from amplification copies.",
    "Cell calling": "Identifying barcodes associated with cells, before additional analyst-level QC.",
    "QA": "Quality assurance: procedures and records supporting sample integrity and reproducibility.",
    "QC": "Quality control: evaluating samples and data to identify problems.",
    "Sparse matrix": "A representation that stores nonzero values and indices instead of explicitly storing most zeros.",
    "Doublet": "A partition containing contributions from two cells; analogous multiplets can contain more.",
    "Ambient RNA": "RNA outside the intended intact cell that contributes to a droplet’s measured signal.",
    "HVG": "A highly variable gene selected to help build an exploratory representation, not automatically a condition DEG.",
    "PCA": "A linear summary of major variation in a chosen expression representation.",
    "UMAP": "A low-dimensional visualization whose layout depends on representation and parameters.",
    "Integration": "An adjustment intended to reduce technical structure while preserving relevant biology.",
    "Cell type": "A biological identity inferred from coherent supporting evidence.",
    "Cell state": "A condition or program that can change within a cell type.",
    "Composition": "Relative abundances constrained by the total population included in the denominator.",
    "Pseudo-bulk": "Counts aggregated within a biological sample and a comparable cell population.",
    "DEG": "A gene with evidence of differential expression for a specified contrast and statistical model.",
    "FDR": "A multiple-testing criterion controlling an expected proportion of false discoveries under the method’s assumptions.",
    "Pseudotime": "Relative ordering along an inferred trajectory, not directly measured elapsed time."
  },
  "toolkit": [
    [
      "Technology",
      "10x Chromium worked example; BD Rhapsody nanowells and Illumina PIPseq compared briefly"
    ],
    [
      "Doublets / ambient RNA",
      "scDblFinder / SoupX, for different problems"
    ],
    [
      "Normalization",
      "LogNormalize; SCTransform as an alternative"
    ],
    [
      "Representation",
      "Highly variable genes, scaling and PCA"
    ],
    [
      "Integration",
      "Harmony, only when justified"
    ],
    [
      "Clustering / visualization",
      "Leiden / UMAP"
    ],
    [
      "Annotation",
      "Marker combinations / Seurat reference transfer"
    ],
    [
      "Composition",
      "propeller; scCODA in Read more"
    ],
    [
      "Condition DE",
      "Pseudo-bulk counts with edgeR, including TMM and quasi-likelihood"
    ],
    [
      "Exploratory markers",
      "Wilcoxon in Seurat"
    ],
    [
      "Communication / trajectory",
      "CellChat / Slingshot"
    ],
    [
      "Main environment",
      "Seurat; AnnData/Scanpy equivalences only"
    ]
  ]
};
