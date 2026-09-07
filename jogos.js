/* ---------------------------------------------------------------
   CATÁLOGO DO immuno.games

   Este é o único arquivo que você edita para publicar um jogo novo.
   A página inicial se monta sozinha a partir daqui.

   É um arquivo .js e não .json de propósito: assim o site funciona
   tanto no GitHub Pages quanto abrindo o index.html com duplo clique.
   O conteúdo entre as chaves segue exatamente a sintaxe de JSON.
   --------------------------------------------------------------- */

const CATALOGO = {
  "idiomaPadrao": "pt",
  "temas": {
    "inata": {
      "pt": "Imunidade inata"
    },
    "adaptativa": {
      "pt": "Imunidade adaptativa"
    },
    "infeccao": {
      "pt": "Resposta a infecções"
    },
    "vacinas": {
      "pt": "Vacinas e imunização"
    },
    "autoimunidade": {
      "pt": "Autoimunidade"
    },
    "tumor": {
      "pt": "Imunologia tumoral"
    },
    "transplante": {
      "pt": "Transplante"
    },
    "transcriptomics": {
      "pt": "Transcriptomics",
      "en": "Transcriptomics"
    }
  },
  "niveis": {
    "medio": {
      "pt": "Ensino médio"
    },
    "graduacao": {
      "pt": "Graduação"
    },
    "pos": {
      "pt": "Pós-graduação"
    }
  },
  "jogos": [
    {
      "id": "imunotropa",
      "url": "imunotropa/",
      "capa": "capas/imunotropa.webp",
      "publicado": "2026-07",
      "nivel": "graduacao",
      "duracao": 15,
      "temas": [
        "inata",
        "adaptativa",
        "infeccao"
      ],
      "autores": [
        "Helder Nakaya"
      ],
      "pt": {
        "nome": "ImunoTropa",
        "subtitulo": "Defesa Celular",
        "resumo": "Você comanda seis células imunes, uma por fase, do macrófago ao linfócito B. Cada uma tem um alvo e um mecanismo próprio — e errar o alvo destrói o tecido que você deveria proteger.",
        "aprende": [
          "Reconhecer o mecanismo efetor de seis células imunes",
          "Distinguir alvo legítimo de célula do próprio tecido",
          "Relacionar resposta excessiva com dano tecidual"
        ]
      }
    },
    {
      "id": "imunidade-coletiva",
      "url": "imunidade-coletiva/",
      "capa": "capas/imunidade-coletiva.webp",
      "publicado": "2026-08",
      "nivel": "medio",
      "duracao": 10,
      "temas": [
        "vacinas",
        "infeccao"
      ],
      "autores": [
        "Helder Nakaya"
      ],
      "pt": {
        "nome": "Imunidade Coletiva",
        "subtitulo": "Estratégia de Vacinação",
        "resumo": "Uma criança não pode se vacinar. A cada turno você recebe doses e escolhe onde posicionar pessoas vacinadas para romper as cadeias de transmissão. Não é preciso vacinar todo mundo — bem posicionadas, poucas barreiras já protegem quem não pôde receber a vacina.",
        "aprende": [
          "Entender como a imunidade coletiva protege quem não pode se vacinar",
          "Ver a vacinação como forma de interromper cadeias de transmissão",
          "Perceber que diálogo e confiança podem reduzir a hesitação vacinal"
        ]
      }
    },
    {
      "id": "tetrismhc",
      "url": "tetrismhc/",
      "capa": "capas/tetrismhc.webp",
      "publicado": "2026-08",
      "nivel": "graduacao",
      "duracao": 10,
      "temas": [
        "adaptativa"
      ],
      "autores": [
        "Helder Nakaya"
      ],
      "pt": {
        "nome": "TetrisMHC",
        "subtitulo": "Apresente o antígeno",
        "resumo": "Organize as proteínas capturadas pela célula dendrítica, como num Tetris. Cada faixa completa é digerida em peptídeos: alguns entram no MHC II, chegam à membrana e podem — ou não — ser reconhecidos por uma célula T CD4.",
        "aprende": [
          "Seguir a via do antígeno: endossomo, peptídeo, MHC II e membrana",
          "Entender por que nem todo peptídeo é apresentado e nem todo TCR reconhece",
          "Relacionar o reconhecimento pela T CD4 com citocinas e expansão clonal"
        ]
      }
    },
    {
      "id": "single-cell",
      "url": "single-cell/",
      "capa": "capas/single-cell.svg",
      "publicado": "2026-09",
      "nivel": "pos",
      "duracao": 90,
      "temas": [
        "transcriptomics"
      ],
      "autores": [
        "immuno.games",
        "CSBL"
      ],
      "pt": {
        "nome": "Single-cell Transcriptomics",
        "subtitulo": "From counts to biological insight - in English",
        "resumo": "Explore 10x single-cell RNA-seq through short lessons, interactive data exercises and quizzes. Build confidence with QC, Seurat workflows and research decisions.",
        "aprende": [
          "Understand sparse counts, QC and normalization",
          "Interpret clusters, UMAP, pseudo-bulk and differential expression",
          "Explore composition, cell communication and trajectories"
        ]
      },
      "en": {
        "nome": "Single-cell Transcriptomics",
        "subtitulo": "From counts to biological insight - in English",
        "resumo": "Explore 10x single-cell RNA-seq through short lessons, interactive data exercises and quizzes. Build confidence with QC, Seurat workflows and research decisions.",
        "aprende": [
          "Understand sparse counts, QC and normalization",
          "Interpret clusters, UMAP, pseudo-bulk and differential expression",
          "Explore composition, cell communication and trajectories"
        ]
      }
    },
    {
      "id": "spatial",
      "url": "spatial/",
      "capa": "capas/spatial.svg",
      "publicado": "2026-09",
      "nivel": "pos",
      "duracao": 90,
      "temas": [
        "transcriptomics"
      ],
      "autores": [
        "Marcos Toquetão",
        "CSBL"
      ],
      "pt": {
        "nome": "Spatial Transcriptomics",
        "subtitulo": "Put gene expression on the map - in English",
        "resumo": "Connect gene expression to tissue structure through illustrated lessons, quizzes and research cases. Designed for learners with basic single-cell knowledge.",
        "aprende": [
          "Understand core spatial technologies and data types",
          "Reason about spatial QC, analysis and interpretation",
          "Apply your learning to tissue-based research cases"
        ]
      },
      "en": {
        "nome": "Spatial Transcriptomics",
        "subtitulo": "Put gene expression on the map - in English",
        "resumo": "Connect gene expression to tissue structure through illustrated lessons, quizzes and research cases. Designed for learners with basic single-cell knowledge.",
        "aprende": [
          "Understand core spatial technologies and data types",
          "Reason about spatial QC, analysis and interpretation",
          "Apply your learning to tissue-based research cases"
        ]
      }
    }
  ]
};
