# immuno.games

Jogos gratuitos para ensinar e aprender imunologia. Site estático, sem build,
sem framework, sem dependência — só HTML, CSS e um catálogo em JavaScript.

---

## Como publicar no GitHub Pages

**1. Criar o repositório**

Crie um repositório **público** (o GitHub Pages só é gratuito em repositórios
públicos) e suba todos estes arquivos na raiz.

```bash
git init
git add .
git commit -m "Primeira versão do immuno.games"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/immuno-games.git
git push -u origin main
```

**2. Ligar o Pages**

Em `Settings` → `Pages`, escolha *Deploy from a branch*, branch `main`, pasta `/ (root)`.

**3. Registrar o domínio no GitHub ANTES de mexer no DNS**

Ainda em `Settings` → `Pages`, campo *Custom domain*: digite `immuno.games` e salve.

> Faça nesta ordem. Se você apontar o DNS antes de registrar o domínio no GitHub,
> outra pessoa pode reivindicar o domínio e hospedar um site nele.

**4. Configurar o DNS na GoDaddy**

Em *Meus produtos* → `immuno.games` → **DNS** → *Gerenciar zonas*.
Apague os registros `A` e `CNAME` que a GoDaddy cria sozinha (o
estacionamento `@` e o `www`) e crie estes seis:

| Tipo  | Nome | Valor                  |
|-------|------|------------------------|
| A     | @    | 185.199.108.153        |
| A     | @    | 185.199.109.153        |
| A     | @    | 185.199.110.153        |
| A     | @    | 185.199.111.153        |
| CNAME | www  | SEU-USUARIO.github.io  |

O `.` final no CNAME a GoDaddy coloca sozinha. TTL padrão (1 hora) serve.

**5. Ativar o HTTPS**

Espere o DNS propagar — em geral 15 minutos, mas pode levar até 24 horas.
Confira com:

```bash
dig immuno.games +short          # deve listar os quatro IPs
dig www.immuno.games +short      # deve mostrar SEU-USUARIO.github.io
```

Só **depois** que os dois resolverem, volte em `Settings` → `Pages` e marque
*Enforce HTTPS*. Se marcar antes, o certificado sai cobrindo só um dos dois
endereços e você terá que removê-lo e recriar o domínio para forçar a reemissão.

---

## Como adicionar um jogo novo

Três passos. A página inicial **não** precisa ser editada.

1. Crie a pasta com o jogo: `nome-do-jogo/index.html`
2. Coloque a capa em `capas/nome-do-jogo.webp` (proporção 3:2 ou mais alta)
3. Acrescente uma entrada no array `jogos` do `jogos.js`:

```json
{
  "id": "nome-do-jogo",
  "url": "nome-do-jogo/",
  "capa": "capas/nome-do-jogo.webp",
  "publicado": "2026-08",
  "nivel": "graduacao",
  "duracao": 10,
  "temas": ["vacinas"],
  "autores": ["Fulano de Tal"],
  "pt": {
    "nome": "Nome do Jogo",
    "subtitulo": "Subtítulo curto",
    "resumo": "Duas ou três frases sobre o que o jogo faz.",
    "aprende": [
      "Primeiro objetivo de aprendizagem",
      "Segundo objetivo"
    ]
  }
}
```

Os valores de `nivel` e `temas` precisam existir nos dicionários `niveis` e
`temas`, no topo do mesmo arquivo. Para criar um tema novo, some uma linha lá.

> **Atenção à vírgula.** As entradas são separadas por vírgula, e a última
> **não** leva vírgula depois. Um erro de sintaxe aqui deixa a página inicial
> em branco. Se isso acontecer, abra o console do navegador com F12 — ele
> aponta a linha exata.

A ordem no array define a posição na placa: o primeiro jogo é o poço `A1`,
o segundo `A2`, e assim por diante até `H12`. Cabem 96.

---

## Como traduzir para inglês

A estrutura já está pronta. Em cada jogo, ao lado do bloco `"pt"`, acrescente
um bloco `"en"` com os mesmos campos. O mesmo vale para `temas` e `niveis`:

```json
"inata": { "pt": "Imunidade inata", "en": "Innate immunity" }
```

Depois, no `index.html`, a constante `IDIOMA` no início do script passa a ler
o idioma escolhido em vez de ficar fixa em `'pt'`.

---

## Rodar localmente

Basta abrir o `index.html` com duplo clique — funciona direto, sem servidor.

É por isso que o catálogo é um arquivo `.js` e não `.json`: navegadores
bloqueiam a leitura de JSON via `file://`, mas carregam scripts normalmente.
O conteúdo dentro das chaves segue a mesma sintaxe de JSON.

---

## Estrutura

```
.
├── index.html          página inicial (catálogo)
├── jogos.js            catálogo — a única coisa que muda ao publicar um jogo
├── 404.html
├── CNAME               immuno.games
├── .nojekyll           impede o GitHub de processar o site com Jekyll
├── capas/
│   └── imunotropa.webp
└── imunotropa/
    └── index.html      o jogo, arquivo único e autossuficiente
```
