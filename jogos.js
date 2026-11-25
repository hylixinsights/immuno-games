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
    "micologia": {
      "pt": "Micologia",
      "en": "Mycology"
    },
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
    "optogenetica": {
      "pt": "Optogenética",
      "en": "Optogenetics"
    },
    "morte-celular": {
      "pt": "Morte celular regulada",
      "en": "Regulated cell death"
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
      "id": "arena",
      "url": "arena/",
      "capa": "capas/arena.webp",
      "publicado": "2026-09",
      "nivel": "graduacao",
      "duracao": 25,
      "temas": [
        "inata",
        "adaptativa",
        "vacinas",
        "tumor"
      ],
      "autores": [
        "Luca Foggia",
        "Helder Nakaya"
      ],
      "pt": {
        "nome": "Memória Imune",
        "subtitulo": "Resposta primária vs. secundária",
        "resumo": "Posicione células imunes para defender o tecido de bactérias, vermes e tumores. Quando o invasor volta, a curva de anticorpos mostra como a memória acelera a resposta.",
        "aprende": [
          "Comparar resposta primária e secundária na curva de anticorpos",
          "Associar cada célula e citocina ao invasor que ela combate",
          "Ver a vacina como memória sem doença e o anti-PD-L1 no tumor"
        ],
        "creditos": [
          {
            "papel": "Idealização e primeiro protótipo",
            "nome": "Luca Foggia"
          },
          {
            "papel": "Curadoria científica e evolução do jogo",
            "nome": "Helder Nakaya"
          }
        ]
      }
    },
    {
      "id": "immunorun",
      "url": "immunorun/",
      "capa": "capas/immunorun.webp",
      "publicado": "2026-10",
      "nivel": "graduacao",
      "duracao": 8,
      "temas": [
        "inata",
        "adaptativa",
        "infeccao"
      ],
      "autores": [
        "Luca Foggia",
        "Helder Nakaya"
      ],
      "pt": {
        "nome": "ImmunoRun",
        "subtitulo": "Fuga bacteriana",
        "resumo": "Você é uma bactéria tentando escapar de um macrófago. Pule, deslize e descubra como fagócitos, anticorpos e sinais inflamatórios participam da resposta à infecção. Jogue no modo arcade ou explore quatro etapas guiadas.",
        "aprende": [
          "Distinguir reconhecimento, fagocitose e eliminação",
          "Entender como IgG e C3b favorecem a captura",
          "Separar sinalização por TNF e proteção por biofilme"
        ],
        "creditos": [
          {
            "papel": "Idealização e primeiro protótipo",
            "nome": "Luca Foggia"
          },
          {
            "papel": "Finalização e curadoria científica",
            "nome": "Helder Nakaya"
          }
        ]
      },
    },
    {
      "id": "lumina",
      "url": "lumina/",
      "capa": "capas/lumina.webp",
      "publicado": "2026-10",
      "nivel": "medio",
      "duracao": 12,
      "temas": ["optogenetica"],
      "autores": ["Helder Nakaya"],
      "pt": {
        "nome": "Lúmina",
        "subtitulo": "Missões de Luz",
        "resumo": "Explore seis missões de optogenética: guie um verme, marque o ritmo de um coração, estimule circuitos motores e reconheça formas na retina. Compare proteínas sensíveis à luz e descubra por que os controles experimentais importam.",
        "aprende": [
          "Relacionar luz, opsinas e atividade celular",
          "Explorar aplicações no movimento, no coração e na visão",
          "Comparar ativação, inibição e controles experimentais"
        ]
      }
    },
    {
      "id": "hypha",
      "url": "hypha/",
      "capa": "capas/hypha.webp",
      "publicado": "2026-10",
      "nivel": "graduacao",
      "duracao": 15,
      "temas": ["micologia"],
      "autores": ["Pedro H. D. Santos", "Helder Nakaya"],
      "pt": {
        "nome": "HYPHA",
        "subtitulo": "Do laboratório à sobrevivência",
        "resumo": "Você é um fungo em busca de energia. Explore madeira em decomposição, uma folha de soja e uma rocha com líquen. No laboratório, descubra a estratégia de cada habitat; depois, guie suas hifas, colete recursos e use adaptações para sobreviver a desafios cada vez maiores.",
        "aprende": [
          "Distinguir decomposição, biotrofia e simbiose nos fungos",
          "Relacionar enzimas, haustórios e pigmentos a cada habitat",
          "Entender como água, nutrientes e defesas limitam o crescimento das hifas"
        ],
        "creditos": [
          { "papel": "Criação original — Hypha Lab e Hypha Run", "nome": "Prof. Pedro H. D. Santos" },
          { "papel": "Adaptação e integração dos jogos", "nome": "Helder Nakaya" }
        ]
      },
      "en": {
        "nome": "HYPHA",
        "subtitulo": "From lab to survival",
        "resumo": "You are a fungus in search of energy. Explore decaying wood, a soybean leaf and lichen on rock. In the lab, discover each habitat’s strategy; then guide your hyphae, collect resources and use adaptations to survive increasingly difficult challenges.",
        "aprende": [
          "Distinguish decomposition, biotrophy and symbiosis in fungi",
          "Connect enzymes, haustoria and pigments to each habitat",
          "Understand how water, nutrients and defenses limit hyphal growth"
        ],
        "creditos": [
          { "papel": "Original creation — Hypha Lab and Hypha Run", "nome": "Prof. Pedro H. D. Santos" },
          { "papel": "Game adaptation and integration", "nome": "Helder Nakaya" }
        ]
      }
    },
    {
      "id": "cell-fate",
      "url": "cell-fate/",
      "capa": "capas/cell-fate.webp",
      "publicado": "2026-11",
      "nivel": "graduacao",
      "duracao": 12,
      "temas": [
        "morte-celular"
      ],
      "autores": [
        "Helder Nakaya"
      ],
      "pt": {
        "nome": "Cell Fate",
        "subtitulo": "Pequena nave. Grandes destinos.",
        "resumo": "Quatro vias de morte celular regulada em um arcade orbital. Identifique o mecanismo, aprenda a diferença entre ferroptose, apoptose, piroptose e necroptose e encare o desafio final.",
        "aprende": [
          "Reconhecer quatro mecanismos distintos de morte celular",
          "Relacionar os alvos do jogo aos mecanismos moleculares",
          "Investigar pistas e testes de resgate no desafio final"
        ],
        "creditos": [
          {
            "papel": "Concepção e desenvolvimento",
            "nome": "Helder Nakaya"
          },
          {
            "papel": "Laboratório",
            "nome": "CSBL"
          },
          {
            "papel": "Apoio",
            "nome": "SBI · Einstein"
          }
        ]
      },
      "en": {
        "nome": "Cell Fate",
        "subtitulo": "Small ship. Great destinies.",
        "resumo": "Four regulated cell death pathways in an orbital arcade. Identify the mechanism, learn how ferroptosis, apoptosis, pyroptosis and necroptosis differ, and face the final challenge.",
        "aprende": [
          "Recognize four distinct cell death mechanisms",
          "Connect in-game targets to molecular pathways",
          "Investigate clues and rescue assays in the final challenge"
        ],
        "creditos": [
          {
            "papel": "Concept and development",
            "nome": "Helder Nakaya"
          },
          {
            "papel": "Laboratory",
            "nome": "CSBL"
          },
          {
            "papel": "Support",
            "nome": "SBI · Einstein"
          }
        ]
      }
    },
    {
      "id": "neutrodoom",
      "url": "neutrodoom/",
      "capa": "capas/neutrodoom.webp",
      "publicado": "2026-11",
      "nivel": "graduacao",
      "duracao": 8,
      "temas": [
        "inata",
        "infeccao",
        "micologia"
      ],
      "autores": [
        "Helder Nakaya"
      ],
      "pt": {
        "nome": "NEUTRODOOM",
        "subtitulo": "Na linha de frente da imunidade",
        "resumo": "Você é um neutrófilo em um FPS retrô. Enfrente sete ondas rápidas de bactérias e Candida, proteja o tecido e tente superar seu recorde. Compare sua nota de defesa de 0 a 1.000 e compartilhe o resultado.",
        "aprende": [
          "Combinar fagocitose, grânulos, NETs e espécies reativas de oxigênio",
          "Distinguir invasores de células do próprio tecido",
          "Equilibrar eliminação de microrganismos e dano colateral"
        ]
      },
      "en": {
        "nome": "NEUTRODOOM",
        "subtitulo": "The frontline of immunity",
        "resumo": "Become a neutrophil in a retro FPS. Face seven fast waves of bacteria and Candida, protect the tissue and beat your personal best. Compare your 0–1,000 defense rating and share your result.",
        "aprende": [
          "Combine phagocytosis, granules, NETs and reactive oxygen species",
          "Distinguish invaders from host tissue cells",
          "Balance microbial elimination against collateral damage"
        ]
      }
    },
    {
      "id": "coccichain",
      "url": "coccichain/",
      "capa": "capas/coccichain.webp",
      "publicado": "2026-11",
      "nivel": "graduacao",
      "duracao": 10,
      "temas": [
        "inata",
        "adaptativa",
        "infeccao"
      ],
      "autores": [
        "Helder Nakaya"
      ],
      "pt": {
        "nome": "CocciChain",
        "subtitulo": "Cresça em cadeia. Escape da defesa.",
        "resumo": "Guie uma cadeia de cocos Gram-positivos por quatro fases, da garganta à válvula cardíaca. Consuma glicose para crescer, ative a cápsula e escape de fagócitos, anticorpos e antibióticos enquanto explora a ciência por trás das regras.",
        "aprende": [
          "Relacionar divisão bacteriana e formação de cadeias de cocos",
          "Explorar o papel da cápsula na evasão do reconhecimento imune e da fagocitose",
          "Entender como a opsonização favorece a captura de bactérias por fagócitos",
          "Distinguir mecanismos biológicos das simplificações do jogo"
        ]
      },
      "en": {
        "nome": "CocciChain",
        "subtitulo": "Grow your chain. Escape the defenses.",
        "resumo": "Guide a chain of Gram-positive cocci through four levels, from the throat to a heart valve. Consume glucose to grow, activate your capsule, and escape phagocytes, antibodies, and antibiotics while exploring the science behind the rules.",
        "aprende": [
          "Connect bacterial division with the formation of chains of cocci",
          "Explore how the capsule helps bacteria evade immune recognition and phagocytosis",
          "Understand how opsonization helps phagocytes capture bacteria",
          "Distinguish biological mechanisms from the game's simplifications"
        ]
      }
    },
    {
      "id": "monocraft",
      "url": "monocraft/",
      "capa": "capas/monocraft.webp",
      "publicado": "2026-11",
      "nivel": "graduacao",
      "duracao": 20,
      "temas": [
        "inata",
        "adaptativa",
        "infeccao"
      ],
      "autores": [
        "Helder Nakaya"
      ],
      "pt": {
        "nome": "MonoCraft",
        "subtitulo": "Um mundo vivo. Seis missões.",
        "resumo": "Explore o interior de um macrófago em um mundo 3D de blocos. Investigue alvos, escolha rotas e transforme a célula em seis missões. Conheça pesquisadores da área e compartilhe a precisão das suas decisões.",
        "aprende": [
          "Conectar transporte do fagossomo, lisossomos e mitofagia seletiva",
          "Explorar ubiquitinação, proteassomo e sinalização por TLR4",
          "Relacionar apresentação de antígenos em MHC II e ativação do inflamassoma NLRP3",
          "Distinguir processos biológicos das simplificações do jogo"
        ]
      },
      "en": {
        "nome": "MonoCraft",
        "subtitulo": "One living world. Six missions.",
        "resumo": "Explore the inside of a macrophage in a 3D voxel world. Investigate targets, choose pathways, and transform the cell across six missions. Meet researchers in the field and share your decision accuracy.",
        "aprende": [
          "Connect phagosome transport, lysosomes, and selective mitophagy",
          "Explore ubiquitination, the proteasome, and TLR4 signaling",
          "Connect MHC II antigen presentation and NLRP3 inflammasome activation",
          "Distinguish biological processes from game simplifications"
        ]
      }
    },
    {
      "id": "impossible-save",
      "url": "impossible-save/?v=5",
      "capa": "capas/impossible-save.webp",
      "publicado": "2026-11",
      "nivel": "medio",
      "duracao": 3,
      "temas": [
        "autoimunidade"
      ],
      "autores": [
        "Helder Nakaya"
      ],
      "pt": {
        "nome": "A Defesa Impossível",
        "subtitulo": "Surf nos impulsos nervosos",
        "resumo": "Surfe de nó em nó nas vias nervosas de Joana, goleira que vive com EM. A mielina muda o tempo que o impulso leva para chegar. A bola continua a caminho do gol.",
        "aprende": [
          "Relacionar mielina, nós de Ranvier e condução saltatória",
          "Distinguir uma alteração visual de uma dificuldade de coordenação",
          "Entender como o local de uma lesão central influencia os sintomas da EM"
        ]
      },
      "en": {
        "nome": "The Impossible Save",
        "subtitulo": "Ride the nerve signal",
        "resumo": "Ride from node to node along the nerve pathways of Joana, a goalkeeper living with MS. Myelin changes how quickly the signal travels as the ball flies toward goal.",
        "aprende": [
          "Connect myelin and nodes of Ranvier to saltatory conduction",
          "Distinguish a visual change from a reaching difficulty",
          "Relate the site of a central lesion to symptoms in MS"
        ]
      }
    },
    {
      "id": "a-shape-to-remember",
      "url": "a-shape-to-remember/",
      "capa": "a-shape-to-remember/art/catalog.webp",
      "publicado": "2026-11",
      "nivel": "graduacao",
      "duracao": 10,
      "temas": [
        "adaptativa",
        "infeccao"
      ],
      "autores": [
        "Helder Nakaya"
      ],
      "pt": {
        "nome": "Uma Forma para Lembrar",
        "subtitulo": "Uma viagem pop-up com uma célula B",
        "resumo": "Dê nome a uma célula B e abra um linfonodo de cartolina. Siga uma família pelo centro germinativo, visite uma irmã na medula e tente reconhecer a mesma forma anos depois.",
        "aprende": [
          "Relacionar o contorno reconhecido pelo BCR ao antígeno intacto",
          "Acompanhar a apresentação de peptídeo no MHC II e a seleção no centro germinativo",
          "Distinguir células B de memória de plasmócitos de longa vida"
        ]
      },
      "en": {
        "nome": "A Shape to Remember",
        "subtitulo": "A pop-up journey with a B cell",
        "resumo": "Name a B cell and unfold a paper lymph node. Follow a family through a germinal center, visit a sister in the marrow, and recognize the same shape years later.",
        "aprende": [
          "Connect B-cell receptor specificity with recognition of intact antigen",
          "Follow peptide presentation on MHC II and selection in the germinal center",
          "Distinguish memory B cells from long-lived plasma cells"
        ]
      }
    }
  ]
};
