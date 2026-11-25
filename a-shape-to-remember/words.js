const text = (en, pt) => ({ en, pt });

export const placeNames = {
  river: text('Bloodstream', 'Corrente sanguínea'),
  node: text('Lymph node', 'Linfonodo'),
  recognition: text('B-cell follicle', 'Folículo B'),
  garden: text('Germinal center', 'Centro germinativo'),
  marrow: text('Bone marrow', 'Medula óssea'),
  recall: text('Lymph node, years later', 'Linfonodo, anos depois'),
  tonsil: text('Tonsil', 'Amígdala')
};

const prompts = {
  river: {
    drift: text('Drift with the red cells. A venule ahead leads into a lymph node.',
      'Siga com as hemácias. Mais adiante, uma vênula dá acesso a um linfonodo.')
  },
  node: {
    arrived: text('A macrophage holds a particle. Stop nearby and watch Mica.',
      'Um macrófago segura uma partícula. Pare por perto e observe Mica.'),
    witness: text('Mica turns back toward the particle you just passed. Stay a moment.',
      'Mica volta até a partícula que você deixou passar. Fique mais um instante.'),
    witnessed: text('Mica holds the particle. A trail of dots runs deeper into the follicle.',
      'Mica segura a partícula. Uma trilha de pontos segue para dentro do folículo.')
  },
  recognition: {
    search: text('Bring your receptor close to a shape. Does the outline look familiar?',
      'Aproxime seu receptor de uma forma. Algum contorno parece familiar?'),
    captured: text('Lift the fold in your membrane to follow the protein inside.',
      'Erga a dobra da membrana para acompanhar a proteína até o interior da célula.'),
    cut: text('Lift one of the peptides to the surface in the groove of MHC II.',
      'Leve um dos peptídeos até a superfície, no sulco do MHC II.'),
    presented: text('A helper T cell waits at the T-cell border. Show her the peptide on MHC II.',
      'Uma T auxiliar espera na borda da zona T. Mostre a ela o peptídeo no MHC II.'),
    helped: text('You have help from the T cell. Step into the germinal center.',
      'Sua célula recebeu ajuda da T auxiliar. Entre no centro germinativo.')
  },
  garden: {
    closed: text('Unfold the fan in the dark zone. Look for your family mark.',
      'Abra o leque na zona escura. Procure a marca da sua família.'),
    choose: text('Three sisters share your mark. Choose one to follow into the light zone.',
      'Três irmãs têm a sua marca. Escolha uma para acompanhar até a zona clara.'),
    trial: text('Reach for the antigen on the branching cell. Will the receptor hold?',
      'Aproxime o receptor do antígeno no ramo. Será que ele fica preso?'),
    offer: text('The sister caught the protein. Show a Tfh cell a peptide from it on MHC II.',
      'Sua irmã capturou a proteína. Mostre à Tfh um peptídeo dela no MHC II.'),
    helped: text('A signal lingers beside the Tfh cell. Listen, or follow a sister to the marrow.',
      'A Tfh emitiu um sinal. Escute ou acompanhe uma das irmãs até a medula.')
  },
  marrow: {
    visit: text('A sister has found shelter among the folds of bone. Draw close to her niche.',
      'Uma das irmãs se abrigou entre as dobras do osso. Aproxime-se desse nicho.'),
    ribbons: text('Antibodies drift from the plasma cell. Another sister waits nearby.',
      'Anticorpos saem do plasmócito. Há outra irmã por perto.'),
    branches: text('Stay in the marrow or travel through the years with the memory B cell.',
      'Fique na medula ou acompanhe a célula B de memória pelos anos seguintes.')
  },
  recall: {
    search: text('New faces in a familiar lymph node. Where will you stop this time?',
      'Há rostos novos no seu antigo linfonodo. Onde você vai parar desta vez?'),
    found: text('The three notes return. Stay with the memory cell as her family grows.',
      'As três notas voltaram. Acompanhe a célula de memória enquanto a família cresce.'),
    response: text('Some of the daughters release antibodies. Follow one through the current.',
      'Algumas filhas liberam anticorpos. Acompanhe um deles pela corrente.'),
    end: text('Both sisters are in your family tree. Pick a branch to visit again.',
      'As duas irmãs estão na árvore da família. Escolha um ramo para reencontrá-las.')
  },
  tonsil: {
    hello: text('Look for Mica’s coral sash. A thin sheet peeks out from beneath it.',
      'Procure a faixa coral de Mica. Debaixo dela aparece um cantinho de papel.'),
    flap: text('Mica lifts a corner. Look beneath the thin sheet of tracing paper.',
      'Mica levanta uma ponta. Olhe por baixo da folha de papel vegetal.'),
    trace: text('Turn the sheet with Mica. Keep an eye on the faint drawing.',
      'Vire a folha com Mica. Repare no traço que aparece por baixo.'),
    remains: text('The mark is still there. Linger with Mica or return to the main path.',
      'O desenho continua ali. Fique com Mica ou volte à trilha principal.')
  }
};

export function stagePrompt(state) {
  return prompts[state.stage][state.steps[state.stage]];
}

// A station has a noun for the map and a short verb for the nearby action.
const stations = {
  origin: [text('Field journal', 'Diário de campo'), text('Read your journal', 'Ler o diário')],
  rbc: [text('Red blood cell', 'Hemácia'), text('Drift alongside', 'Seguir a hemácia')],
  friend: [text('Mica', 'Mica'), text('Meet Mica', 'Conhecer Mica')],
  'node-tab': [text('Venule', 'Vênula'), text('Enter the lymph node', 'Entrar no linfonodo')],
  macrophage: [text('Macrophage', 'Macrófago'), text('Visit the macrophage', 'Visitar o macrófago')],
  decoy: [text('Particle', 'Partícula'), text('Touch the particle', 'Tocar a partícula')],
  trail: [text('Dotted trail', 'Trilha pontilhada'), text('Sense the trail', 'Sentir o sinal')],
  tonsil: [text('Tonsil', 'Amígdala'), text('Visit the tonsil', 'Visitar a amígdala')],
  follicle: [text('Follicle', 'Folículo'), text('Enter the follicle', 'Entrar no folículo')],
  membrane: [text('Membrane fold', 'Dobra da membrana'), text('Lift the membrane', 'Erguer a membrana')],
  mhc: [text('MHC II', 'MHC II'), text('Present the peptide', 'Apresentar o peptídeo')],
  helper: [text('Helper T cell', 'T auxiliar'), text('Meet the helper T cell', 'Encontrar a T auxiliar')],
  garden: [text('Germinal center', 'Centro germinativo'), text('Follow the daughters', 'Acompanhar as filhas')],
  fan: [text('Paper fan', 'Leque de papel'), text('Unfold the fan', 'Abrir o leque')],
  'sister-0': [text('Fern', 'Flora'), text('Follow Fern', 'Acompanhar Flora')],
  'sister-1': [text('Iris', 'Íris'), text('Follow Iris', 'Acompanhar Íris')],
  'sister-2': [text('Sol', 'Sol'), text('Follow Sol', 'Acompanhar Sol')],
  fdc: [text('Follicular dendritic cell', 'Dendrítica folicular'), text('Reach for the antigen', 'Alcançar o antígeno')],
  choose: [text('The sisters', 'As irmãs'), text('Rejoin the sisters', 'Voltar às irmãs')],
  tfh: [text('Follicular helper T cell', 'T auxiliar folicular'), text('Meet the Tfh cell', 'Encontrar a Tfh')],
  il21: [text('Tfh signal', 'Sinal da Tfh'), text('Listen to the signal', 'Escutar o sinal')],
  marrow: [text('Bone marrow', 'Medula óssea'), text('Travel to the marrow', 'Viajar até a medula')],
  plasma: [text('Marrow sister', 'Irmã da medula'), text('Visit your sister', 'Visitar sua irmã')],
  memory: [text('Memory B cell', 'Célula B de memória'), text('Join the memory cell', 'Acompanhar a irmã')],
  antibody: [text('Antibody', 'Anticorpo'), text('Follow an antibody', 'Seguir um anticorpo')],
  years: [text('Passing years', 'Passagem dos anos'), text('Travel through time', 'Avançar alguns anos')],
  'late-mica': [text('Mica', 'Mica'), text('Sit with Mica', 'Ficar com Mica')],
  expand: [text('Memory cell’s family', 'Família da B de memória'), text('Follow the daughters', 'Acompanhar as filhas')],
  finish: [text('Family tree', 'Árvore da família'), text('Trace your lineage', 'Rever a linhagem')],
  family: [text('Family tree', 'Árvore da família'), text('Visit your family', 'Visitar a família')],
  vellum: [text('Tracing paper', 'Papel vegetal'), text('Lift the tracing paper', 'Erguer o papel vegetal')],
  leaf: [text('Faint drawing', 'Desenho no papel'), text('Turn the sheet', 'Virar a folha')],
  back: [text('Main path', 'Trilha principal'), text('Return to the path', 'Voltar à trilha')]
};

// All five shapes use the same language, irrespective of the player's receptor.
const shapeStations = [
  [text('Trefoil', 'Trevo'), text('Touch the trefoil', 'Tocar o trevo')],
  [text('Crescent', 'Lua crescente'), text('Touch the crescent', 'Tocar a lua crescente')],
  [text('Kite', 'Pipa'), text('Touch the kite', 'Tocar a pipa')],
  [text('Fan', 'Leque'), text('Touch the fan', 'Tocar o leque')],
  [text('Ring', 'Anel'), text('Touch the ring', 'Tocar o anel')]
];

function shapeStation(station) {
  return station.id.startsWith('ant-') ? shapeStations[Number(station.id.slice(4))] : undefined;
}

export function stationName(station, stage) {
  const shape = shapeStation(station);
  if (shape) return station.label?.en && station.label?.pt ? station.label : shape[0];
  if (station.id === 'trail' && stage?.notes?.includes('cxcl13')) return text('CXCL13 trail', 'Trilha de CXCL13');
  if (station.id === 'il21' && stage?.notes?.includes('il21')) return text('IL-21', 'IL-21');
  return stations[station.id]?.[0] || station.label;
}

export function actionName(station, stage) {
  const place = typeof stage === 'string' ? stage : stage?.stage;
  if (station.id === 'friend' && place === 'tonsil') return stations['late-mica'][1];
  return shapeStation(station)?.[1] || stations[station.id]?.[1] || station.label;
}

const observations = {
  origin: text('Your first journey began in the marrow and took you through the spleen.',
    'Sua primeira viagem começou na medula e passou pelo baço.'),
  rbc: text('A red cell turns edge-on. For a moment, you glimpse the vessel wall.',
    'Uma hemácia gira de lado. Pela fresta, você vê a parede do vaso.'),
  friend: text('A B cell drifts alongside you. Her coral sash ripples in the current. Mica!',
    'Uma célula B vem ao seu lado. A faixa coral ondula na corrente. É Mica!'),
  'node-tab': text('You crossed a venule from the blood. The particles here came in with the lymph.',
    'Você veio do sangue pela parede da vênula. Já as partículas chegaram pela linfa.'),
  macrophage: text('An intact particle rests on the macrophage, within reach of passing B cells.',
    'O macrófago segura a partícula intacta ao alcance das células B que passam.'),
  decoy: text('Your receptor brushes the particle. It slips free. Mica is turning back.',
    'A partícula roça seu receptor e escapa. Mica está voltando.'),
  '@watch': text('Mica turns. Something on the macrophage caught her attention.',
    'Mica se vira. Algo no macrófago chamou a atenção dela.'),
  '@seen': text('Mica’s receptor holds the very particle yours let go.',
    'O receptor de Mica prende a mesma partícula que o seu deixou escapar.'),
  trail: text('The dots trace CXCL13, a chemical signal that draws B cells into the follicle.',
    'Os pontos são CXCL13, um sinal químico que atrai células B para o folículo.'),
  follicle: text('Shapes line the follicle. You can move among them and try your receptor.',
    'O folículo está cheio de formas. Passe entre elas e experimente seu receptor.'),
  membrane: text('Inside a vesicle, the captured protein is cut into short peptides.',
    'Dentro de uma vesícula, a proteína capturada é cortada em pequenos peptídeos.'),
  mhc: text('A peptide from the protein now sits in MHC II on your cell’s surface.',
    'Um peptídeo da proteína aparece na superfície da sua célula, ligado ao MHC II.'),
  helper: text('The helper T cell recognizes the peptide on MHC II and gives your B cell help.',
    'A T auxiliar reconhece o peptídeo no MHC II e envia sinais de ajuda à sua B.'),
  garden: text('Your B cell divides. Her daughters carry the mark you chose at the river.',
    'Sua célula B se divide. As filhas guardam a marca que você escolheu lá no rio.'),
  fan: text('Three sisters carry your mark. Look at the small differences in their receptors.',
    'Três irmãs têm a sua marca. Repare nas pequenas diferenças entre os receptores.'),
  choose: text('The sisters gather in the light zone. You can try a different receptor.',
    'As irmãs se reúnem na zona clara. Você pode experimentar outro receptor.'),
  tfh: text('The Tfh cell recognizes the peptide on MHC II. A soft note passes between them.',
    'A Tfh reconhece o peptídeo no MHC II. Uma nota suave passa de uma célula à outra.'),
  il21: text('That note stands for IL-21, a Tfh signal that helps the B cell differentiate.',
    'A nota representa a IL-21, um sinal da Tfh que ajuda a célula B a se diferenciar.'),
  marrow: text('One sister travels in the blood as a plasmablast and settles in the marrow.',
    'Uma irmã viaja pelo sangue como plasmablasto e encontra abrigo na medula.'),
  plasma: text('Your sister is a long-lived plasma cell. Antibodies drift from her niche.',
    'Sua irmã se tornou um plasmócito de longa vida. Anticorpos saem do seu nicho.'),
  memory: text('This sister kept her surface receptors. She is a memory B cell now.',
    'Esta irmã manteve os receptores na superfície. Ela agora é uma célula B de memória.'),
  antibody: text('At each tip of the Y is a binding site you have seen before.',
    'Em cada ponta do Y há um sítio de ligação que você já conhece.'),
  years: text('Years pass. The memory cell returns to a familiar lymph node.',
    'Os anos passam. A célula de memória volta a um linfonodo conhecido.'),
  expand: text('The memory cell divides. Some daughters become plasma cells and release antibodies.',
    'A B de memória se divide. Algumas filhas viram plasmócitos e liberam anticorpos.'),
  finish: text('Your family’s mark lives on in the marrow and in the memory cell’s daughters.',
    'A marca da família continua na medula e nas filhas da célula de memória.'),
  tonsil: text('Mica is resting in a fold of the tonsil. You can sit beside her.',
    'Mica descansa numa dobra da amígdala. Você pode ficar ao lado dela.'),
  vellum: text('A faint drawing shows through the tracing paper.',
    'Um desenho bem fino aparece através do papel vegetal.'),
  leaf: text('The drawing stays. It represents the EBV genome, still present inside Mica.',
    'O desenho permanece. Ele representa o genoma do EBV, que continua dentro de Mica.')
};

const bindingOutcomes = [
  text('Fern’s receptor slips. The antigen stays on the branch. Try another sister.',
    'O receptor de Flora se solta. O antígeno fica no ramo. Tente com outra irmã.'),
  text('Iris holds the antigen just long enough to draw it inside.',
    'Íris segura o antígeno pelo tempo necessário para capturá-lo.'),
  text('Sol binds the antigen firmly and draws the protein inside.',
    'Sol se liga com firmeza ao antígeno e leva a proteína para dentro.')
];

export function momentText(id, beforeStage, state, result = {}) {
  if (id.startsWith('ant-')) {
    if (result.sound === 'brush') return text('The particle brushes your receptor and slips away.',
      'A partícula roça seu receptor e escapa.');
    if (result.sound !== 'motif') return null;
    return beforeStage === 'recall'
      ? text('There they are again. Three notes, years after the first encounter.',
        'Lá estão elas de novo. As mesmas três notas, anos depois do primeiro encontro.')
      : text('Three notes. Your receptor has caught the intact protein.',
        'Três notas. Seu receptor capturou a proteína intacta.');
  }
  if (id === 'fdc') return bindingOutcomes[state.selected];
  if (id.startsWith('sister-')) {
    const sister = stations[id][0];
    return text(`${sister.en} carries your family mark into the light zone.`,
      `${sister.pt} leva a marca da sua família até a zona clara.`);
  }
  if (id === 'friend' && beforeStage === 'tonsil') {
    return state.steps.tonsil === 'remains' ? observations.leaf
      : text('Mica lifts her coral sash. A thin sheet lies underneath.',
        'Mica levanta a faixa coral. Há uma folha bem fina por baixo.');
  }
  if (id === 'late-mica') {
    return state.notes.includes('ebv')
      ? text('Mica wears the coral sash. The EBV tracing is still there in the memory B cell.',
        'Mica ainda usa a faixa coral. O traço do EBV permanece nela, agora uma B de memória.')
      : text('You recognize the coral sash. Here is Mica again, now a memory B cell.',
        'Você reconhece a faixa coral. É Mica, agora uma célula B de memória.');
  }
  return observations[id] || null;
}
