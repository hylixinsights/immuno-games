// The result uses recorded inputs. The two comparison traces change only the central circuit.
export const coaching = {
  en: {
    rings: ['Short of node', 'Past the node', 'Perfect', 'Just short', 'Just long', 'Time expired'],
    windows: 'Release window', nerve: 'Along the axon', arriving: 'Signal arriving',
    intact: 'Myelin intact', optic: 'Left optic nerve', cerebellum: 'Cerebellar pathway',
    live: [
      'Current spreads under myelin. The impulse is renewed at the next node.',
      'The motor command starts the dive. A late take-off leaves less reach.',
      'The ball touched the glove. Sensory feedback helps Joana close her grip.'
    ],
    left: 'The red shirt looks faded. Damaged myelin slows the signal from this eye.',
    right: 'The stripe looks sharper. The right optic nerve carries the signal sooner.',
    coord: 'The corner is visible. Now the cerebellum has to fine-tune the reach.',
    slowOptic: 'The signal takes longer across this damaged optic segment.',
    slowMotor: 'The correction arrives late along this cerebellar pathway.',
    reason: {
      both: 'The read and the dive were late. The ball was already past the glove.',
      visual: 'Joana picked up the direction too late to get behind the shot.',
      motor: 'Joana found the corner, but the dive left the ball beyond her fingers.',
      coord: 'She went the right way. The final reach still missed the ball.',
      spill: 'She reached the ball squarely. It slipped through before her grip closed.',
      inside: 'The ball curled a fingertip back. The last touch was too weak to turn it wide.',
      rescue: 'A late read left only a fingertip. Your last landing turned the shot wide.',
      tip: 'At full stretch, the final touch sent the ball past the post.',
      parry: 'The palm arrived in time. Joana pushed the rebound clear.',
      catch: 'Early read, well-timed dive, firm grip. Joana held it.'
    },
    match: 'Inside this kick', missing: 'No contact', combo: 'Landing streak',
    baseline: [
      'Here myelin is intact. In MS, immune cells can damage this insulation. The signal can slow or fail on its way to the next node.',
      'Which pathway is affected matters in MS. Injury to motor pathways can impair movement even with vision intact.',
      'Touch signals from the fingers reach the central nervous system and help Joana adjust her grip.',
      'Inflammation in one optic nerve can wash out the red shirt in that eye. Try the visual circuit in the replay and compare when Joana reads the very same shot.',
      'One training day can feel different from the next. Replaying a penalty does not imply a new MS relapse.'
    ],
    leftFinding: 'Inflammation can damage the myelin of an optic nerve. For the same kick and jumps, Joana reads the corner later through her left eye.',
    rightFinding: 'Joana used her right eye. Compare the same inputs through her inflamed left optic nerve.',
    coordFinding: 'The read is the same as on reference day. Damage to a cerebellar pathway changes how her hand corrects its reach.',
    readFlight: 'Direction read · % of ball flight', used: 'played',
    comparison: 'Same kick and inputs', labTitle:'Compare replays', labPrompt:'Keep your landings. Change the circuit.', labTabs:['Reference','Optic nerve','Cerebellum'],
    counterfactual:'This comparison stops when the ball reaches the glove plane.', referenceNote:'Follow the shot and the hand with both pathways preserved.', actualPath: 'This glove', referencePath: 'Reference day',
    model: 'The marks show time in this kick and distance in ball widths.',
    distance: n=>'The two glove paths were up to '+n+' ball widths apart before contact.',
    distanceSingle: 'The two glove paths were up to one ball width apart before contact.',
    caseLink: 'Read the play', caseLabel: 'Joana asks', correct: 'Exactly.', reconsider: 'Look again.',
    testEye: 'Switch eyes and retry', seeTrace: 'Compare the glove paths', seeNerve: 'See the nerve',
    legacy: 'Personal best under the earlier timing rules', oldScore: 'pts',
    cases: [
      [
        ['My spark reached a gap between two myelin wraps. What happens there?', ['The impulse is regenerated at a node','The muscle starts to contract','Myelin releases a second spark'],0,
         'At a node of Ranvier, ion channels regenerate the action potential. Myelin helps current spread along the stretch leading to it.'],
        ['In MS, where can immune-mediated injury disrupt my signals?', ['In the leather of my glove','In my brain, spinal cord or optic nerve','Only where nerves meet muscle'],1,
         'MS affects the central nervous system. Immune-mediated inflammation can injure myelin and the axons it surrounds.'],
        ['Yesterday I played differently. What can you tell from my score?', ['How much myelin I lost','Whether a new relapse began','How this training session went'],2,
         'Performance can vary. A score cannot identify a relapse. We know how inflammatory lesions can cause symptoms, but the exact cause of MS in one person remains uncertain.']
      ],[
        ['Same red shirt, same light. Why does it look faded through my left eye?', ['A change in the shirt','Inflammation of the left optic nerve','A late hand correction'],1,
         'Optic neuritis can reduce colour intensity and contrast in one eye. The optic nerve carries that eye’s signals into the brain.'],
        ['Keep my jumps identical and switch from left to right eye. What changes first?', ['When I read the corner','The spin on the ball','The glove’s grip strength'],0,
         'On this training day the affected left optic nerve slows the visual signal. Switching eyes changes the read while the ball follows the same path.'],
        ['What can happen when a patch of myelin is damaged?', ['The shirt reflects less red light','The ball slows in the air','Conduction can slow or fail'],2,
         'Myelin helps current reach the next node. Demyelination can slow or block conduction along the affected segment.']
      ],[
        ['I saw the corner but my hand went past the ball. Which circuit helps correct that reach?', ['Optic nerve','Cerebellar pathways','Skin receptors in the glove'],1,
         'Cerebellar pathways coordinate the size and timing of a movement. Damage there can make a reach undershoot or overshoot. This is called dysmetria.'],
        ['Which replay would help you tell a late read from a poor reach?', ['Compare the shirt colours','Listen for the kick','Compare when I read and where my glove goes'],2,
         'With the same jumps, the reference and coordination days share the same visual read. It is the hand path that diverges near the ball.'],
        ['The camera came out through my glove. Where is the lesion in this session?', ['In a central pathway connected to the cerebellum','In the fingertips','At the wrist'],0,
         'The glove shows the effect of the movement. The lesion affecting its correction is in the central nervous system.']
      ]
    ]
  },
  pt: {
    rings: ['Ficou curto', 'Passou do nó', 'Perfeito', 'Quase · curto', 'Quase · longo', 'Tempo esgotado'],
    windows: 'Tempo para soltar', nerve: 'Ao longo do axônio', arriving: 'Chegada do sinal',
    intact: 'Mielina preservada', optic: 'Nervo óptico esquerdo', cerebellum: 'Via cerebelar',
    live: [
      'A corrente se propaga sob a mielina. O impulso é regenerado no nó seguinte.',
      'O comando motor inicia o mergulho. Quanto mais tarde a saída, menor o alcance.',
      'A bola tocou a luva. O retorno sensorial ajuda Joana a fechar a mão.'
    ],
    left: 'O vermelho parece desbotado. O dano à mielina atrasa o sinal desse olho.',
    right: 'A faixa aparece mais nítida. Pelo nervo óptico direito, o sinal chega antes.',
    coord: 'Joana vê o canto. Agora o cerebelo ajuda a ajustar o alcance da mão.',
    slowOptic: 'O sinal demora mais para atravessar este trecho do nervo óptico.',
    slowMotor: 'A correção chega atrasada por esta via cerebelar.',
    reason: {
      both: 'A leitura e a saída atrasaram. Quando a mão chegou, a bola já tinha passado.',
      visual: 'Joana demorou a ler a direção do chute e chegou sem alcance.',
      motor: 'Joana leu o canto, mas a saída do mergulho deixou a bola fora de alcance.',
      coord: 'Ela foi para o canto certo. Faltou acertar o alcance da mão no fim do mergulho.',
      spill: 'Ela chegou com a palma atrás da bola. A bola escapou antes de a mão se fechar.',
      inside: 'A bola dobrou a ponta da luva. O último toque foi fraco demais para desviá-la.',
      rescue: 'A leitura tardia só deixou a ponta da luva no lance. Seu último salto mandou a bola para fora.',
      tip: 'No limite do alcance, o último toque bastou para mandar a bola para fora.',
      parry: 'A palma chegou a tempo. Joana empurrou o rebote para longe.',
      catch: 'Leu cedo, saiu no tempo e fechou a mão. Encaixou.'
    },
    match: 'Por dentro da cobrança', missing: 'Sem contato', combo: 'Sequência precisa',
    baseline: [
      'Aqui a mielina está preservada. Na EM, células do sistema imune podem lesar esse isolamento. O sinal pode atrasar ou falhar a caminho do próximo nó.',
      'Na EM, o local da lesão influencia o sintoma. Uma lesão nas vias motoras pode prejudicar o movimento mesmo com a visão preservada.',
      'Sinais de toque dos dedos chegam ao sistema nervoso central e ajudam Joana a dosar a força da pegada.',
      'A inflamação em um nervo óptico pode deixar o vermelho apagado naquele olho. No replay, compare quando Joana lê a mesma cobrança por cada olho.',
      'O desempenho pode variar de um treino para outro. Repetir uma cobrança não significa que Joana teve um novo surto de EM.'
    ],
    leftFinding: 'A inflamação pode lesar a mielina do nervo óptico. Com o mesmo chute e os mesmos saltos, Joana lê o canto mais tarde pelo olho esquerdo.',
    rightFinding: 'Joana usou o olho direito. Compare os mesmos saltos com a leitura pelo nervo óptico esquerdo inflamado.',
    coordFinding: 'A leitura é igual à do dia de referência. O dano em uma via cerebelar muda a correção do alcance da mão.',
    readFlight: 'Leitura do canto · % do voo da bola', used: 'em jogo',
    comparison: 'Mesmo chute e mesmos saltos', labTitle:'Replay comparado', labPrompt:'Mantenha seus saltos. Troque o circuito.', labTabs:['Referência','Nervo óptico','Cerebelo'],
    counterfactual:'A comparação termina quando a bola chega ao plano do mergulho da goleira.', referenceNote:'Acompanhe o chute e a luva com as duas vias preservadas.', actualPath: 'Luva neste lance', referencePath: 'Dia de referência',
    model: 'As medidas representam o tempo desta cobrança e distâncias em diâmetros da bola.',
    distance: n=>'Na aproximação, a distância entre os dois trajetos da luva chegou a '+n+' diâmetros da bola.',
    distanceSingle: 'Na aproximação, a distância entre os trajetos da luva chegou ao diâmetro de uma bola.',
    caseLink: 'Leia o lance', caseLabel: 'Joana pergunta', correct: 'Isso!', reconsider: 'Olhe de novo.',
    testEye: 'Trocar de olho e repetir', seeTrace: 'Comparar os trajetos da luva', seeNerve: 'Ver o nervo',
    legacy: 'Recorde pelas regras de precisão anteriores', oldScore: 'pts',
    cases: [
      [
        ['Minha faísca chegou ao intervalo entre duas bainhas de mielina. O que acontece ali?', ['O impulso é regenerado em um nó','O músculo começa a se contrair','A mielina libera outra faísca'],0,
         'No nó de Ranvier, canais iônicos regeneram o potencial de ação. A mielina ajuda a corrente a percorrer o trecho que leva até ele.'],
        ['Na EM, onde a inflamação imunomediada pode prejudicar meus sinais?', ['No couro da luva','No encéfalo, na medula espinal ou no nervo óptico','Só no encontro do nervo com o músculo'],1,
         'A EM afeta o sistema nervoso central. A inflamação imunomediada pode lesar a mielina e os axônios que ela envolve.'],
        ['Ontem joguei diferente. O que dá para saber pela minha pontuação?', ['Quanta mielina eu perdi','Se começou um novo surto','Como foi este treino'],2,
         'O desempenho pode variar. A pontuação não identifica um surto. Sabemos como as lesões inflamatórias podem causar sintomas. A causa exata da EM em uma pessoa ainda é incerta.']
      ],[
        ['Mesma camisa, mesma luz. Por que o vermelho parece desbotado no meu olho esquerdo?', ['Uma mudança na camisa','Inflamação no nervo óptico esquerdo','Atraso na correção da mão'],1,
         'A neurite óptica pode reduzir a intensidade das cores e o contraste em um olho. O nervo óptico leva os sinais desse olho ao cérebro.'],
        ['Se eu repetir os saltos e trocar do olho esquerdo para o direito, o que muda primeiro?', ['O momento em que leio o canto','O efeito da bola','A força da pegada'],0,
         'Neste treino, o nervo óptico esquerdo afetado atrasa o sinal visual. Trocar de olho muda o momento da leitura, e a bola segue a mesma trajetória.'],
        ['O que pode acontecer quando um trecho da mielina sofre lesão?', ['A camisa reflete menos luz vermelha','A bola perde velocidade no ar','A condução pode ficar lenta ou falhar'],2,
         'A mielina ajuda a corrente a chegar ao nó seguinte. A desmielinização pode atrasar ou bloquear a condução no trecho afetado.']
      ],[
        ['Vi o canto, mas a mão passou da bola. Que circuito ajuda a corrigir esse alcance?', ['Nervo óptico','Vias cerebelares','Receptores da pele nos dedos'],1,
         'As vias cerebelares coordenam a amplitude e o tempo do movimento. Uma lesão ali pode fazer a mão parar antes ou passar do alvo. Isso se chama dismetria.'],
        ['Qual replay ajuda a distinguir leitura atrasada de erro de alcance?', ['Comparar as cores da camisa','Ouvir a pancada do chute','Comparar o momento da leitura e o trajeto da luva'],2,
         'Com os mesmos saltos, o treino de referência e o de coordenação têm a mesma leitura visual. Os trajetos da mão se separam na aproximação da bola.'],
        ['A câmera saiu pela minha luva. Onde está a lesão neste treino?', ['Em uma via central ligada ao cerebelo','Na ponta dos dedos','No punho'],0,
         'A luva mostra o efeito no movimento. A lesão que prejudica sua correção fica no sistema nervoso central.']
      ]
    ]
  }
};
