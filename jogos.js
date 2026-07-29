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
    "inata":         { "pt": "Imunidade inata" },
    "adaptativa":    { "pt": "Imunidade adaptativa" },
    "infeccao":      { "pt": "Resposta a infecções" },
    "vacinas":       { "pt": "Vacinas e imunização" },
    "autoimunidade": { "pt": "Autoimunidade" },
    "tumor":         { "pt": "Imunologia tumoral" },
    "transplante":   { "pt": "Transplante" }
  },

  "niveis": {
    "medio":     { "pt": "Ensino médio" },
    "graduacao": { "pt": "Graduação" },
    "pos":       { "pt": "Pós-graduação" }
  },

  "jogos": [

    {
      "id": "imunotropa",
      "url": "imunotropa/",
      "capa": "capas/imunotropa.webp",
      "publicado": "2026-07",
      "nivel": "graduacao",
      "duracao": 15,
      "temas": ["inata", "adaptativa", "infeccao"],
      "autores": ["Helder Nakaya"],
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
    }

  ]
};
