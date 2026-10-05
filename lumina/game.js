/* Lúmina — jogo estático, sem bibliotecas ou serviços externos. */
(() => {
'use strict';
const $ = id => document.getElementById(id);
const TAU = Math.PI * 2;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const angleDiff = a => Math.atan2(Math.sin(a), Math.cos(a));
const COLORS = { mint:'#b8e9be', gold:'#f6ca75', blue:'#87d8f7', coral:'#eaa391', purple:'#c5b5f0' };
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const SOURCES = {
  worm:['Stirman et al. · Nature Methods, 2011','https://pubmed.ncbi.nlm.nih.gov/21240278/'],
  heart:['Bruegmann et al. · Nature Methods, 2010','https://pubmed.ncbi.nlm.nih.gov/20881965/'],
  brain:['Kravitz et al. · Nature, 2010','https://www.nature.com/articles/nature09159'],
  retina:['Sahel et al. · Nature Medicine, 2021','https://www.nature.com/articles/s41591-021-01351-4'],
  lab:['Zhang et al. · Nature, 2007','https://pubmed.ncbi.nlm.nih.gov/17410168/']
};
const MISSIONS = [
  {id:'primeira-luz', type:'worm', world:'01 / COMPORTAMENTO', tag:'Placa de Petri', name:'Uma luz, muitas curvas', short:'Ajude Nema a encontrar três colônias.', title:'Encontre o caminho.', goal:3, time:85,
    description:'Nema está explorando a placa. Use a luz para mudar sua direção e recolha as três colônias douradas.',
    instructions:['Segure e arraste na direção desejada. Nema faz a curva aos poucos.','Solte para seguir reto e recuperar a reserva de luz.','Teclado: ← e → ou A/D. Os botões abaixo também fazem curvas.'],
    live:'O projetor acompanha células-alvo com ChR2. A luz muda sua atividade; o movimento é a resposta do circuito.',
    model:'O direcionamento pelo cursor é uma adaptação de jogo. C. elegans não segue uma lanterna; seus olhos e sua expressão aqui são ficcionais.',
    discovery:'Da luz ao movimento',
    science:'Em C. elegans, sistemas de rastreamento permitem iluminar regiões selecionadas enquanto o animal se move. Neurônios ou músculos que expressam opsinas podem ter sua atividade modificada. A resposta depende da população estimulada.',
    lesson:'No jogo, o projetor acompanha Nema automaticamente. Na pesquisa, acertar o alvo e medir a resposta são partes do experimento.', source:'worm',
    question:'Por que a luz muda o movimento nesta missão?', answers:['Porque o verme gosta de luz azul.','Porque células selecionadas expressam uma proteína sensível à luz.','Porque a luz empurra o corpo.'], correct:1,
    explanation:'A opsina converte a iluminação em uma mudança celular. O circuito transforma essa mudança em comportamento.'},
  {id:'dose-certa', type:'worm', world:'02 / PRECISÃO', tag:'Placa de Petri', name:'A dose certa', short:'Faça curvas entre obstáculos e economize luz.', title:'Pequenos pulsos. Bom caminho.', goal:4, time:100,
    description:'Contorne as ilhas corais e colete quatro colônias. Planeje a curva, use a luz e aproveite os trechos retos.',
    instructions:['Ilumine na direção da próxima colônia.','Evite as ilhas marcadas com ×. A borda da placa não tira chances.','Solte a luz quando estiver alinhado. Reserva vazia precisa se recuperar.'],
    live:'O lugar e o momento do estímulo importam. A precisão temporal permite relacionar uma intervenção à resposta observada.',
    model:'As ilhas, a reserva recarregável e os limites de tempo são desafios lúdicos, não parâmetros experimentais.',
    discovery:'Onde, quando e por quanto tempo',
    science:'A iluminação direcionada permite comparar respostas em regiões diferentes de um mesmo animal. A interpretação depende tanto da expressão da opsina quanto do local e do tempo da estimulação.',
    lesson:'Uma intervenção localizada ajuda a testar a participação de células específicas. Ela não explica, sozinha, todo o comportamento.', source:'worm',
    question:'O que importa além de acender a luz?', answers:['Apenas deixar tudo mais brilhante.','Usar qualquer cor por bastante tempo.','Escolher as células, o local e o momento do estímulo.'],correct:2,
    explanation:'Especificidade genética, espacial e temporal trabalham juntas.'},
  {id:'pulso',type:'heart',world:'03 / RITMO CARDÍACO',tag:'Coração',name:'No ritmo da luz',short:'Dê a Pulsar oito batimentos bem sincronizados.',title:'Encontre o ritmo de Pulsar.',goal:8,time:60,
    description:'Células cardíacas com ChR2 respondem a pulsos. Toque quando o marcador passar pela faixa verde do compasso.',
    instructions:['Espere o marcador chegar à faixa verde.','Toque no coração ou em “Dar um pulso”. Teclado: Espaço.','Solte entre os pulsos. Tocar muitas vezes não acelera a recuperação do tecido.'],
    live:'Um pulso pode iniciar uma onda elétrica no tecido cardíaco. Depois de responder, as células precisam se recuperar.',
    model:'O compasso é uma ajuda musical. A frequência, a janela de acerto e a recuperação foram adaptadas para jogar; não representam um protocolo clínico.',
    discovery:'Um marca-passo de luz',
    science:'Experimentos com músculo cardíaco expressando ChR2 mostraram que a luz pode controlar atividade elétrica e contração. A propagação do sinal pelo tecido permite que uma estimulação local desencadeie uma resposta mais ampla.',
    lesson:'Após a excitação, existe um período de recuperação. Estímulos próximos demais podem não gerar uma nova resposta.', source:'heart',
    question:'Por que muitos toques rápidos podem falhar?',answers:['Porque o tecido ainda está se recuperando.','Porque ChR2 só responde à luz âmbar.','Porque cada pulso remove a opsina.'],correct:0,
    explanation:'A resposta depende do estado elétrico do tecido, além da luz e da proteína.'},
  {id:'circuito',type:'brain',world:'04 / CIRCUITOS MOTORES',tag:'Cérebro',name:'Dois lados, uma decisão',short:'Guie o explorador ativando um lado do circuito.',title:'Uma curva começa no circuito.',goal:4,time:100,
    description:'Guie o camundongo até os quatro pontos de exploração. Nesta representação da via direta, iluminar um lado favorece a curva para o lado oposto.',
    instructions:['Use os botões abaixo para escolher a curva.','← estimula o lado direito; → estimula o esquerdo. Segure para continuar virando.','Solte para seguir reto. No tabuleiro, arrastar escolhe a curva automaticamente.'],
    live:'ChR2 está em uma população da via direta do estriado. A luz chega ao alvo por uma fibra óptica representada no painel.',
    model:'É uma simplificação de um circuito específico. “Esquerda → direita” não é uma regra para qualquer neurônio ou comportamento.',
    discovery:'Ativar uma célula, mudar uma rede',
    science:'Em camundongos, a ativação optogenética de populações da via direta e da via indireta do estriado produziu efeitos distintos no movimento. A estimulação unilateral também permitiu investigar assimetrias motoras.',
    lesson:'O resultado depende de quais células recebem a opsina e de suas conexões. A mesma proteína pode produzir efeitos comportamentais diferentes em circuitos diferentes.', source:'brain',
    question:'A mesma opsina sempre produz o mesmo comportamento?',answers:['Sim: luz azul sempre aumenta o movimento.','Não: o efeito depende da população e das conexões.','Sim: a cor escolhe sozinha o comportamento.'],correct:1,
    explanation:'A luz atua na célula que expressa a opsina; o comportamento emerge da rede.'},
  {id:'visao',type:'retina',world:'05 / VISÃO',tag:'Retina',name:'Desenhar com luz',short:'Explore sinais luminosos e reconheça três formas.',title:'Transforme luz em informação.',goal:3,time:100,
    description:'Um padrão foi projetado sobre uma retina simplificada com ChrimsonR. Varra a grade com luz âmbar e identifique a forma.',
    instructions:['Segure e arraste sobre a grade para revelar os sinais.','Depois de explorar, escolha a forma nos botões abaixo. São três rodadas.','Teclado: setas movem o foco; segure Espaço para iluminar.'],
    live:'Aqui, ChrimsonR responde à estimulação âmbar e favorece a ativação. Isso mostra por que “âmbar sempre inibe” está errado.',
    model:'Os desenhos são uma metáfora de codificação visual. O estudo de referência relatou recuperação parcial em um participante usando óculos especiais; não visão normal.',
    discovery:'Novas entradas para o sistema visual',
    science:'Um estudo de 2021 descreveu recuperação parcial de função visual em um participante após expressão de ChrimsonR em células da retina, combinada a óculos que projetavam estímulos luminosos. Houve treinamento e avaliação da percepção de objetos.',
    lesson:'A missão transforma sinais em formas para ensinar o princípio. Os pixels, as cores e o reconhecimento imediato não reproduzem a experiência clínica.', source:'retina',
    question:'O que esta missão ensina sobre a luz âmbar?',answers:['Ela sempre silencia qualquer célula.','Ela restaura qualquer visão sem treinamento.','Seu efeito depende da opsina: aqui, ChrimsonR favorece a ativação.'],correct:2,
    explanation:'Comprimento de onda e proteína precisam ser considerados juntos. A cor não determina sozinha a resposta.'},
  {id:'controle',type:'lab',world:'06 / MÉTODO CIENTÍFICO',tag:'Laboratório',name:'A prova está no controle',short:'Compare três condições e descubra o papel da opsina.',title:'Faça a comparação que importa.',goal:3,time:120,
    description:'Registre três condições: ChR2 + azul, sem opsina + azul e NpHR + âmbar. Selecione a amostra, escolha a luz e segure para medir.',
    instructions:['Escolha a amostra e a cor nos botões abaixo.','Segure “Iluminar” por um segundo para registrar a condição.','Compare o traçado antes e durante a luz. Registre as três condições pedidas.'],
    live:'Comparamos a mudança em relação à atividade basal. O controle sem opsina não apresenta a resposta direta mediada por ela.',
    model:'Os traçados e a separação das cores são idealizados. Espectros reais se sobrepõem; intensidade, expressão e outros efeitos da luz também importam.',
    discovery:'Ativar, inibir, comparar',
    science:'ChR2 e NpHR permitem intervenções com efeitos celulares diferentes: um canal de cátions pode favorecer a excitação, enquanto uma bomba de cloreto pode favorecer a inibição. Controles ajudam a avaliar se a resposta está ligada à manipulação.',
    lesson:'“Sem resposta direta pela opsina” não significa que a luz jamais tenha outros efeitos. Um controle isolado não exclui toda explicação alternativa.', source:'lab',
    question:'Por que iluminar uma amostra sem a opsina?',answers:['Para ajudar a separar o efeito da opsina de outros efeitos.','Para provar que a luz nunca aquece tecidos.','Para criar uma opsina nova durante o teste.'],correct:0,
    explanation:'Comparar condições é parte da evidência. Outros controles podem ser necessários.'}
];
const STORAGE = 'lumina-progress-v1';
let saved = {stars:{}, practice:false};
try {const raw=JSON.parse(localStorage.getItem(STORAGE)); if(raw && typeof raw==='object') {saved.practice=raw.practice===true; for(const m of MISSIONS) {const n=raw.stars?.[m.id]; if(Number.isInteger(n)&&n>=1&&n<=3)saved.stars[m.id]=n;}}} catch {}
const save = () => {try {localStorage.setItem(STORAGE,JSON.stringify(saved));}catch {}};
const canvas=$('board'), ctx=canvas.getContext('2d');
const heartImage=new Image(); heartImage.src='assets/coracao.webp';
let screen='home', g=null, last=0, hudTime=0, sound=false, audioContext=null;
const input={down:false, x:450, y:230, left:false, right:false, up:false, bottom:false, light:false, pointerId:null, control:null};
const particles=[];
const starsHTML = n => `<span class="stars" aria-label="${n} de 3 estrelas">${'★'.repeat(n)}${'☆'.repeat(3-n)}</span>`;
function svgArt(type){
  const wrap=body=>`<svg viewBox="0 0 360 132" aria-hidden="true">${body}</svg>`;
  if(type==='brain')return wrap('<g fill="none" stroke="#ac99c2" stroke-width="2"><path d="m112 30 21 29-15 26-42 17m57-43 35 18 47-29 35-22m-35 22 32 36 40 18M168 77l-8 42m55-71-8-28"/></g><circle cx="165" cy="73" r="25" fill="#c5b5df"/><circle cx="157" cy="69" r="3" fill="#254443"/><circle cx="174" cy="69" r="3" fill="#254443"/><path d="M159 80q7 7 14 0" fill="none" stroke="#254443" stroke-width="2"/><g fill="#fff7dc" stroke="#d1b277" stroke-width="2"><circle cx="112" cy="30" r="5"/><circle cx="76" cy="102" r="5"/><circle cx="250" cy="26" r="5"/><circle cx="287" cy="102" r="5"/></g>');
  if(type==='retina')return wrap('<ellipse cx="180" cy="68" rx="78" ry="42" fill="#f8f4e6" stroke="#cbbd93" stroke-width="2"/><circle cx="180" cy="68" r="32" fill="#a7bd9d"/><circle cx="180" cy="68" r="19" fill="#284e47"/><circle cx="188" cy="59" r="7" fill="#f7e9bd"/><path d="m71 35 40 17m-46 18h37m-26 37 35-18" stroke="#d9aa55" stroke-width="3" stroke-linecap="round"/>');
  return wrap('<g fill="#f5f3de" stroke="#a8bba4" stroke-width="2"><rect x="99" y="35" width="42" height="70" rx="21"/><rect x="159" y="35" width="42" height="70" rx="21"/><rect x="219" y="35" width="42" height="70" rx="21"/></g><path d="M108 64h24v21a12 12 0 0 1-24 0z" fill="#9dd6d4"/><path d="M168 70h24v15a12 12 0 0 1-24 0z" fill="#c5ccb5"/><path d="M228 60h24v25a12 12 0 0 1-24 0z" fill="#eaca89"/><g fill="#3b6455" font-family="monospace" font-size="9" text-anchor="middle"><text x="120" y="26">ChR2</text><text x="180" y="26">CTRL</text><text x="240" y="26">NpHR</text></g>');
}
function renderHome(){
  $('practice').checked=saved.practice;
  $('mission-grid').innerHTML=MISSIONS.map((m,i)=>`<button class="mission-card" data-mission="${i}" aria-label="Missão ${i+1}: ${m.name}"><div class="card-art ${m.type==='worm'?'petri':m.type}"><span class="card-number">0${i+1}</span>${m.type==='worm'?'<img src="assets/laboratorio.webp" alt="" loading="lazy">':m.type==='heart'?'<img src="assets/coracao.webp" alt="" loading="lazy">':svgArt(m.type)}</div><div class="card-body"><div class="card-top"><span>${m.tag}</span>${starsHTML(saved.stars[m.id]||0)}</div><h3>${m.name}</h3><p>${m.short}</p><div class="card-foot"><span>${saved.stars[m.id]?'Explorar novamente':'Entrar na missão'} · ${m.type==='lab'?'2':'1–2'} min</span><span>↗</span></div></div></button>`).join('');
  $('mission-grid').querySelectorAll('[data-mission]').forEach(b=>b.onclick=()=>openMission(Number(b.dataset.mission)));
  $('discovery-count').textContent=Object.keys(saved.stars).length;
}
function renderNotebook(){
  $('notes').innerHTML=MISSIONS.map((m,i)=>`<article class="note ${saved.stars[m.id]?'complete':''}"><span class="note-badge">${saved.stars[m.id]?'✓ DESCOBERTA REGISTRADA':'○ PRONTA PARA EXPLORAR'} / 0${i+1}</span><h2>${m.discovery}</h2><p>${m.science}</p><small>${m.lesson}</small><a href="${SOURCES[m.source][1]}" target="_blank" rel="noopener">${SOURCES[m.source][0]} ↗</a></article>`).join('');
}
function showScreen(next){
  if(g?.mode==='playing')pause(); release(); screen=next;document.body.classList.toggle('in-game',next==='play');
  for(const id of ['home','notebook','play'])$(id).hidden=id!==next;
  $('nav-missions').classList.toggle('active',next==='home');$('nav-notebook').classList.toggle('active',next==='notebook');
  if(next==='home')renderHome();if(next==='notebook')renderNotebook();
  window.scrollTo({top:0,behavior:'instant'});
}
function say(message){$('announcer').textContent=message;}
function note(message,duration=3){if(!g)return;g.message=message;g.messageTime=duration;$('feedback').textContent=message;}
function tone(freq=620,duration=.08){
  if(!sound)return;
  try {audioContext ||= new (window.AudioContext||window.webkitAudioContext)();if(audioContext.state==='suspended')audioContext.resume();const o=audioContext.createOscillator(),a=audioContext.createGain();o.type='sine';o.frequency.value=freq;a.gain.setValueAtTime(.035,audioContext.currentTime);a.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+duration);o.connect(a);a.connect(audioContext.destination);o.start();o.stop(audioContext.currentTime+duration);}catch{}
}
function burst(x,y,color){if(reducedMotion)return;for(let i=0;i<16;i++){const a=TAU*i/16;particles.push({x,y,vx:Math.cos(a)*75,vy:Math.sin(a)*75,life:.8,color});}}
function release(){Object.assign(input,{down:false,left:false,right:false,up:false,bottom:false,light:false,pointerId:null,control:null});document.querySelectorAll('.holding').forEach(b=>b.classList.remove('holding'));if(g){g.light=false;g.side=0;}}
function openMission(index){
  release(); const m=MISSIONS[index];
  g={index,m,mode:'ready',practice:saved.practice,t:0,left:m.time,hp:3,energy:100,locked:false,light:false,side:0,got:0,used:0,collisions:0,mistakes:0,hit:0,message:'',messageTime:0,x:205,y:350,angle:-.55,body:[],trail:[],pulses:[],beatAt:-10,goodAt:-10,labOpsin:'chr2',color:m.type==='retina'?'amber':'blue',recorded:new Set(),sampleHold:0,trace:[],activity:30,retinaRound:0,retinaSeen:new Set(),retinaCooldown:0,quizDone:false,quizFirst:true,litSince:0};
  particles.length=0;
  if(m.type==='worm'){
    g.food=(index===0?[[420,250],[449,405],[263,195]]:[[223,172],[495,203],[480,439],[232,450]]).map(([x,y])=>({x,y,got:false}));
    g.hazards=index===0?[]:[{x:355,y:254,r:41},{x:373,y:403,r:36}];
    for(let i=0;i<25;i++)g.body.push({x:g.x-Math.cos(g.angle)*i*3.1,y:g.y-Math.sin(g.angle)*i*3.1});
  }
  if(m.type==='brain'){g.x=168;g.y=343;g.angle=-.8;g.food=[[207,193],[490,170],[518,368],[334,418]].map(([x,y])=>({x,y,got:false}));g.hazards=[{x:349,y:263,r:48}];}
  if(m.type==='retina'){g.retinaOrder=[0,1,2].sort(()=>Math.random()-.5);input.x=360;input.y=280;}
  showScreen('play');
  $('world-label').textContent=m.world;$('mission-title').textContent=m.name;$('side-title').textContent=m.title;$('side-copy').textContent=m.description;
  $('instructions').innerHTML='<ol>'+m.instructions.map(x=>`<li>${x}</li>`).join('')+'</ol>';
  $('science-live').textContent=m.live;$('model-note').textContent=m.model;
  $('legend').innerHTML=['worm','brain'].includes(m.type)?'<div><i></i>Ponto dourado: colete</div><div><i class="coral"></i>Ilha ×: desvie</div><div><i class="blue"></i>Brilho azul: estímulo</div>':m.type==='heart'?'<div><i></i>Marcador: momento do pulso</div><div><i class="blue"></i>Onda: resposta ao estímulo</div>':m.type==='retina'?'<div><i></i>Âmbar: sinal revelado</div><div><i class="blue"></i>Círculo: foco de iluminação</div>':'<div>↑ ChR2 + azul: atividade aumenta</div><div>— Sem opsina + azul: nível basal</div><div>↓ NpHR + âmbar: atividade diminui</div>';
  buildControls();
  overlay('EXPERIMENTO 0'+(index+1),m.title,m.description,'Vamos experimentar ↗',start);
  $('overlay-secondary').hidden=true;updateHUD();resize();draw();
}
function overlay(label,title,copy,button,action){
  $('overlay-label').textContent=label;$('overlay-title').textContent=title;$('overlay-copy').textContent=copy;
  $('quiz').hidden=true;$('quiz').replaceChildren();$('overlay-action').hidden=false;$('overlay-action').textContent=button;$('overlay-action').onclick=action;
  $('overlay').hidden=false;$('overlay-action').focus({preventScroll:true});say(title);
}
function start(){g.mode='playing';release();$('overlay').hidden=true;canvas.focus({preventScroll:true});note(defaultHint(),4);updateHUD();}
function pause(){if(g?.mode!=='playing')return;g.mode='paused';release();overlay('PAUSA','Pode respirar.','Sua experiência está no mesmo lugar. O tempo e a luz estão parados.','Continuar ↗',()=>{g.mode='playing';$('overlay').hidden=true;release();canvas.focus({preventScroll:true});});$('overlay-secondary').hidden=true;updateHUD();}
function defaultHint(){
  if(g.m.type==='worm')return g.locked?'Luz em recuperação. Solte e espere um instante.':'Segure na placa para fazer curvas. Solte nos trechos retos.';
  if(g.m.type==='brain')return 'Escolha uma curva: a luz atua no lado oposto do circuito.';
  if(g.m.type==='heart')return 'Um toque quando o marcador entrar na faixa verde.';
  if(g.m.type==='retina')return 'Varra a grade com luz âmbar. Depois identifique a forma.';
  return 'Selecione uma amostra e uma luz. Segure para registrar a resposta.';
}
function control(label,id,small='',classes=''){return `<button class="control ${classes}" id="${id}">${label}${small?'<small>'+small+'</small>':''}</button>`;}
function bindHold(button,kind){
  const down=e=>{if(g.mode!=='playing'||e.isPrimary===false)return;e.preventDefault();button.focus({preventScroll:true});release();input.control=kind;input.down=false;if(kind==='left')input.left=true;if(kind==='right')input.right=true;if(kind==='light')input.light=true;button.classList.add('holding');try{button.setPointerCapture(e.pointerId);}catch{}};
  const up=()=>{if(input.control===kind)release();};
  button.addEventListener('pointerdown',down);['pointerup','pointercancel','lostpointercapture'].forEach(name=>button.addEventListener(name,up));
  button.addEventListener('keydown',e=>{if(![' ','Enter'].includes(e.key)||g.mode!=='playing')return;e.preventDefault();if(e.repeat)return;input.control=kind;input[kind]=true;button.classList.add('holding');});
  button.addEventListener('keyup',e=>{if([' ','Enter'].includes(e.key)){e.preventDefault();up();}});button.addEventListener('blur',up);
}
function buildControls(){
  const box=$('controls'),type=g.m.type;
  if(type==='worm'||type==='brain'){
    box.innerHTML=control('↶ Virar à esquerda','turn-left',type==='brain'?'Estimula estriado direito':'Segure · tecla ←','large')+control('Virar à direita ↷','turn-right',type==='brain'?'Estimula estriado esquerdo':'Segure · tecla →','large');bindHold($('turn-left'),'left');bindHold($('turn-right'),'right');
  }else if(type==='heart'){
    box.innerHTML=control('✦ Dar um pulso de luz','pulse','Toque e solte · tecla Espaço','large');$('pulse').onclick=()=>{if(g.mode==='playing')heartPulse();};
  }else if(type==='retina'){
    box.innerHTML='<span class="control-label">QUAL FORMA APARECEU?</span>'+['Círculo','Cruz','Seta'].map((x,i)=>control(x,'shape-'+i)).join('');[0,1,2].forEach(i=>$('shape-'+i).onclick=()=>guessShape(i));updateRetinaButtons();
  }else{
    box.innerHTML='<span class="control-label">1 / AMOSTRA</span>'+control('ChR2','opsin-chr2')+control('Sem opsina','opsin-none')+control('NpHR','opsin-nphr')+'<span class="control-label">2 / ESTÍMULO</span>'+control('Luz azul','color-blue')+control('Luz âmbar','color-amber','','amber')+control('✦ Iluminar','lab-light','Segure · ou Espaço','large');
    for(const op of ['chr2','none','nphr'])$('opsin-'+op).onclick=()=>{if(g.mode!=='playing')return;release();g.labOpsin=op;g.sampleHold=0;setLabButtons();note('Amostra selecionada. Compare a atividade antes e durante a luz.');};
    for(const color of ['blue','amber'])$('color-'+color).onclick=()=>{if(g.mode!=='playing')return;release();g.color=color;g.sampleHold=0;setLabButtons();};
    bindHold($('lab-light'),'light');setLabButtons();
  }
}
function setLabButtons(){for(const op of ['chr2','none','nphr'])$('opsin-'+op).setAttribute('aria-pressed',String(g.labOpsin===op));for(const c of ['blue','amber'])$('color-'+c).setAttribute('aria-pressed',String(g.color===c));}
function updateRetinaButtons(){for(let i=0;i<3;i++)$('shape-'+i).disabled=g.retinaSeen.size<10||g.mode!=='playing';}
function finish(win){
  if(g.mode!=='playing')return;g.mode=win?'won':'lost';release();
  if(!win){overlay('MAIS UMA TENTATIVA?',g.hp<=0?'Antecipe a próxima curva.':'O tempo acabou.',g.hp<=0?'Use pequenos pulsos e contorne as ilhas. Você também pode ativar o modo tranquilo no mapa.':'Tente de novo ou ative o modo tranquilo no mapa para explorar sem pressa.','Tentar novamente ↗',()=>openMission(g.index));$('overlay-secondary').hidden=true;updateHUD();return;}
  const careful=g.m.type==='worm'||g.m.type==='brain'?g.collisions===0:g.m.type==='heart'?g.mistakes<=3:g.m.type==='retina'?g.mistakes===0:true;
  g.stars=careful?2:1;saved.stars[g.m.id]=Math.max(saved.stars[g.m.id]||0,g.stars);save();renderHome();
  overlay('DESCOBERTA 0'+(g.index+1)+' REGISTRADA',g.m.discovery,g.m.science,'Conectar as ideias ↗',showQuiz);
  $('overlay-secondary').hidden=false;$('overlay-secondary').textContent='Repetir missão';$('overlay-secondary').onclick=()=>openMission(g.index);tone(780,.18);updateHUD();
}
function showQuiz(){
  const m=g.m;g.mode='quiz';$('overlay-label').textContent='UMA IDEIA PARA LEVAR';$('overlay-title').textContent='O que você descobriu?';$('overlay-copy').textContent='Acerte para ganhar uma estrela de descoberta.';$('quiz').hidden=false;$('overlay-action').hidden=true;$('overlay-secondary').hidden=true;
  $('quiz').innerHTML=`<div class="quiz-question">${m.question}</div>${m.answers.map((a,i)=>`<button class="quiz-option" data-answer="${i}">${a}</button>`).join('')}<div class="quiz-feedback" id="quiz-feedback" role="status"></div>`;
  $('quiz').querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{
    if(g.quizDone)return;
    if(Number(b.dataset.answer)!==m.correct){b.classList.add('wrong');b.disabled=true;g.quizFirst=false;$('quiz-feedback').textContent='Ainda não. Relembre: a resposta depende da proteína, da célula e do circuito. Tente outra opção.';return;}
    g.quizDone=true;b.classList.add('correct');g.stars=Math.min(3,g.stars+1);saved.stars[m.id]=Math.max(saved.stars[m.id]||0,g.stars);save();renderHome();
    $('quiz-feedback').textContent=m.explanation+'  '+g.stars+' de 3 estrelas nesta missão.';tone(900,.12);
    $('quiz').querySelectorAll('button').forEach(x=>x.disabled=true);$('overlay-action').hidden=false;$('overlay-action').textContent=g.index<5?'Próxima missão ↗':'Voltar ao mapa ↗';$('overlay-action').onclick=()=>g.index<5?openMission(g.index+1):showScreen('home');
    $('overlay-secondary').hidden=false;$('overlay-secondary').textContent='Ver no caderno';$('overlay-secondary').onclick=()=>showScreen('notebook');$('overlay-action').focus({preventScroll:true});
  });$('quiz').querySelector('button').focus({preventScroll:true});
}
function updateMovement(dt){
  const mouse=g.m.type==='brain', turn=mouse?2.35:2.9;
  let error=0;g.side=0;
  if(g.light){error=(input.left||input.right)?((input.left?-1:0)+(input.right?1:0))*1.5:angleDiff(Math.atan2(input.y-g.y,input.x-g.x)-g.angle);g.side=Math.abs(error)<.06?0:error<0?-1:1;g.angle+=clamp(error*4,-turn,turn)*dt;}
  const speed=(mouse?77:g.index===0?64:73)*(g.light&&Math.abs(error)>.65?.65:1);
  g.x+=Math.cos(g.angle)*speed*dt;g.y+=Math.sin(g.angle)*speed*dt;
  if(mouse){if(g.x<108||g.x>612){g.x=clamp(g.x,108,612);g.angle=Math.PI-g.angle;}if(g.y<118||g.y>445){g.y=clamp(g.y,118,445);g.angle=-g.angle;}}
  else{const d=Math.hypot(g.x-360,g.y-310);if(d>249){const nx=(g.x-360)/d,ny=(g.y-310)/d;g.x=360+nx*249;g.y=310+ny*249;const vx=Math.cos(g.angle),vy=Math.sin(g.angle),dot=vx*nx+vy*ny;if(dot>0)g.angle=Math.atan2(vy-2*dot*ny,vx-2*dot*nx);}}
  for(const h of g.hazards){const dx=g.x-h.x,dy=g.y-h.y,d=Math.hypot(dx,dy),limit=h.r+13;if(d<limit){const nx=d>.01?dx/d:1,ny=d>.01?dy/d:0;g.x=h.x+nx*(limit+1);g.y=h.y+ny*(limit+1);const vx=Math.cos(g.angle),vy=Math.sin(g.angle),dot=Math.min(0,vx*nx+vy*ny);g.angle=Math.atan2(vy-2*dot*ny,vx-2*dot*nx);if(g.hit<=0){g.collisions++;if(!g.practice)g.hp--;g.hit=1.6;burst(g.x,g.y,COLORS.coral);tone(160,.12);note(g.practice?'Uma colisão. Tente uma curva mais aberta.':'Colisão! Antecipe a próxima curva.');if(g.hp<=0){finish(false);return;}}}}
  for(const f of g.food)if(!f.got&&Math.hypot(g.x-f.x,g.y-f.y)<30){f.got=true;g.got++;burst(f.x,f.y,COLORS.gold);tone(500+g.got*100);note(`${g.got} de ${g.m.goal} pontos explorados. Continue!`);say(g.got+' de '+g.m.goal+' coletados.');if(g.got===g.m.goal){finish(true);return;}}
  if(!mouse){g.body[0]={x:g.x,y:g.y};for(let i=1;i<g.body.length;i++){const p=g.body[i-1],b=g.body[i],a=Math.atan2(b.y-p.y,b.x-p.x);b.x=p.x+Math.cos(a)*3.1;b.y=p.y+Math.sin(a)*3.1;}}
  g.trail.push({x:g.x,y:g.y});if(g.trail.length>210)g.trail.shift();
}
const BEAT_PERIOD=1.65, BEAT_TARGET=.72, BEAT_WINDOW=.14;
function heartPulse(){
  if(g.mode!=='playing'||g.m.type!=='heart')return;
  const elapsed=g.t-g.beatAt;
  if(elapsed<.48){g.mistakes++;note('Cedo demais: o tecido ainda está se recuperando.',2);tone(180);return;}
  if(g.energy<10){note('Espere a reserva de luz recuperar.');return;}
  g.beatAt=g.t;g.energy=Math.max(0,g.energy-10);g.pulses.push(g.t);tone(330,.13);
  const phase=(g.t%BEAT_PERIOD)/BEAT_PERIOD;
  if(Math.abs(phase-BEAT_TARGET)<=BEAT_WINDOW){g.got++;g.goodAt=g.t;burst(360,275,COLORS.mint);note('Bom pulso! '+g.got+' de 8 batimentos no compasso.',2);if(g.got>=g.m.goal)finish(true);}
  else{g.mistakes++;note('O tecido respondeu. Para pontuar, acompanhe a faixa verde.',2.5);}
}
const SHAPES=[['01110','10001','10001','10001','01110'],['00100','00100','11111','00100','00100'],['00100','00010','11111','00010','00100']];
function retinaCell(row,col){return{x:240+col*60,y:170+row*60};}
function updateRetina(dt){
  const move=210*dt;input.x=clamp(input.x+((input.right?1:0)-(input.left?1:0))*move,200,520);input.y=clamp(input.y+((input.bottom?1:0)-(input.up?1:0))*move,130,450);
  if(g.light)for(let row=0;row<5;row++)for(let col=0;col<5;col++){const p=retinaCell(row,col);if(Math.hypot(p.x-input.x,p.y-input.y)<75)g.retinaSeen.add(row*5+col);}
  updateRetinaButtons();
}
function guessShape(index){
  if(g.mode!=='playing'||g.retinaSeen.size<10||g.retinaCooldown>0)return;
  if(index!==g.retinaOrder[g.retinaRound]){g.mistakes++;g.retinaCooldown=.7;note('Observe mais um pouco. Essa forma não corresponde ao padrão.');tone(200);return;}
  release();g.got++;tone(720);burst(360,300,COLORS.gold);
  if(g.got===3){finish(true);return;}
  g.retinaRound++;g.retinaSeen.clear();g.energy=Math.min(100,g.energy+35);g.retinaCooldown=.8;note('Forma identificada! Explore o próximo padrão.');updateRetinaButtons();
}
function updateLab(dt){
  const exc=g.light&&g.labOpsin==='chr2'&&g.color==='blue';const inh=g.light&&g.labOpsin==='nphr'&&g.color==='amber';
  const target=exc?88:inh?5:30;g.activity+=(target-g.activity)*Math.min(1,dt*9);
  if(g.light){g.sampleHold+=dt;const key=g.labOpsin+'-'+g.color;
    if(g.sampleHold>=1.1&&!g.recorded.has(key)){
      g.recorded.add(key);
      if(['chr2-blue','none-blue','nphr-amber'].includes(key)){g.got++;tone(620+g.got*70);note(key==='none-blue'?'Controle registrado: mesma luz, sem resposta direta pela opsina.':key==='chr2-blue'?'ChR2 + azul: atividade aumentada registrada.':'NpHR + âmbar: atividade reduzida registrada.');burst(360,230,COLORS.mint);if(g.got===3){finish(true);return;}}
      else note('Condição extra registrada. Compare agora as três condições pedidas.');
    }
  }else g.sampleHold=0;
  const cycle=(g.t*(g.activity/25))%1;const spike=cycle<.09?Math.sin(cycle/.09*Math.PI)*g.activity:Math.sin(g.t*8)*1.5;
  g.trace.push({v:spike,lit:g.light,color:g.color});if(g.trace.length>250)g.trace.shift();
}
function update(dt){
  if(!g||g.mode!=='playing')return;
  g.t+=dt;if(!g.practice)g.left=Math.max(0,g.left-dt);g.hit=Math.max(0,g.hit-dt);g.messageTime=Math.max(0,g.messageTime-dt);g.retinaCooldown=Math.max(0,g.retinaCooldown-dt);
  if(g.locked&&g.energy>=30){g.locked=false;note('Luz pronta. Continue explorando.',2);}
  const type=g.m.type, wants=type==='retina'||type==='lab'?(input.down||input.light):(input.down||input.left||input.right);
  g.light=type==='heart'?g.t-g.beatAt<.18:wants&&!g.locked;
  if(type!=='heart'){
    if(g.light){g.energy=Math.max(0,g.energy-dt*16);g.used+=dt;g.litSince+=dt;if(g.energy===0){g.locked=true;g.light=false;note('Reserva vazia. Solte para recuperar a luz.');}}
    else{g.energy=Math.min(100,g.energy+dt*26);g.litSince=0;}
  }else g.energy=Math.min(100,g.energy+dt*18);
  if(type==='worm'||type==='brain')updateMovement(dt);else if(type==='retina')updateRetina(dt);else if(type==='lab')updateLab(dt);
  for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;if(p.life<=0)particles.splice(i,1);}
  if(!g.practice&&g.left<=0&&g.mode==='playing')finish(false);
}
function updateHUD(){
  if(!g)return;const type=g.m.type;
  $('goal-label').textContent={worm:'COLÔNIAS',brain:'EXPLORAÇÕES',heart:'BONS PULSOS',retina:'FORMAS',lab:'CONDIÇÕES'}[type];$('goal-value').textContent=g.got+' / '+g.m.goal;
  $('time-value').textContent=g.practice?'Livre':Math.ceil(g.left)+' s';
  $('quality-label').textContent=['worm','brain'].includes(type)?'CHANCES':type==='heart'?'COMPASSO':'EXPERIMENTO';
  $('quality-value').textContent=['worm','brain'].includes(type)?g.practice?'∞':'● '.repeat(g.hp)+'○ '.repeat(3-g.hp):type==='heart'?'1,65 s':type==='retina'?(g.retinaRound+1)+' / 3':'Comparar';
  $('energy').value=g.energy;$('energy-value').textContent=Math.round(g.energy)+'%';
  $('pause').disabled=!['playing','paused'].includes(g.mode);$('pause').textContent=g.mode==='paused'?'Continuar':'Pausar';
  $('feedback').textContent=g.messageTime>0?g.message:defaultHint();
  $('board-badge').textContent=type==='retina'?'CHRIMSONR / LUZ ÂMBAR':type==='lab'?`${{chr2:'ChR2',none:'SEM OPSINA',nphr:'NpHR'}[g.labOpsin]} / LUZ ${g.color==='blue'?'AZUL':'ÂMBAR'}`:'ChR2 / LUZ AZUL';
}
// Desenho em coordenadas lógicas, independente da densidade de pixels da tela.
function circle(x,y,r,fill,stroke,width=1){ctx.beginPath();ctx.arc(x,y,r,0,TAU);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}}
function line(points,color,width=1){if(!points.length)return;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();}
function rect(x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke();}}
function textLabel(text,x,y,size=12,color='#b3c9bd',align='center'){ctx.font=`${size}px "Segoe UI",sans-serif`;ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(text,x,y);}
function glow(x,y,r,color){const grd=ctx.createRadialGradient(x,y,0,x,y,r);grd.addColorStop(0,color+'45');grd.addColorStop(1,color+'00');circle(x,y,r,grd);}
function beam(x,y,color=COLORS.blue){glow(x,y,67,color);circle(x,y,32,color+'12',color+'aa',1.4);circle(x,y,3,'#f7f6df');ctx.setLineDash([3,7]);circle(x,y,43,null,color+'55');ctx.setLineDash([]);}
function background(){
  const gradient=ctx.createRadialGradient(330,260,15,360,310,480);gradient.addColorStop(0,'#1b4645');gradient.addColorStop(1,'#102e30');ctx.fillStyle=gradient;ctx.fillRect(0,0,720,620);
  for(let i=0;i<70;i++){const x=(i*173.71)%720,y=(i*113.47)%620;circle(x,y,i%3===0?1.3:.6,'#add7bb12');}
}
function drawDish(){
  glow(360,310,290,'#75b39b');circle(360,310,280,'#102b2e','#b9daca38',2);circle(360,310,270,'#19433e','#9cd8b952',3);circle(360,310,259,'#1b413a','#c1ead02d',1);
  ctx.save();ctx.beginPath();ctx.arc(360,310,257,0,TAU);ctx.clip();
  for(let i=0;i<55;i++){const a=i*2.39996,r=Math.sqrt((i+.5)/55)*250;circle(360+Math.cos(a)*r,310+Math.sin(a)*r,1+i%3*.8,'#b0d4b91c');}
  for(let y=100;y<570;y+=40)line([{x:90,y},{x:630,y}],'#b7d9c007');for(let x=80;x<640;x+=40)line([{x,y:45},{x,y:575}],'#b7d9c007');
  ctx.restore();ctx.save();ctx.translate(546,116);ctx.rotate(.72);rect(-40,-10,80,20,4,'#e7e5c8');textLabel('C. elegans',0,4,10,'#426151');ctx.restore();
  textLabel('PROJETOR COM RASTREAMENTO DO ALVO',360,604,9,'#7ea698');
}
function drawFood(){
  for(const [i,f] of g.food.entries()){
    if(f.got){circle(f.x,f.y,16,null,'#8bc89c35');textLabel('✓',f.x,f.y+5,13,'#8bc89c70');continue;}
    const wobble=reducedMotion?0:Math.sin(g.t*3+i)*1.5;glow(f.x,f.y,36,COLORS.gold);circle(f.x,f.y,19+wobble,'#e6be6430','#f0cc80b0',1.3);
    for(let k=0;k<5;k++){const a=k*2.4,r=k===0?0:9;circle(f.x+Math.cos(a)*r,f.y+Math.sin(a)*r,3.5,'#efd490');}textLabel(String(i+1),f.x,f.y+36,10,'#e8ce94');
  }
}
function drawHazards(){
  for(const h of g.hazards){glow(h.x,h.y,h.r+15,'#b78173');circle(h.x,h.y,h.r,'#755950','#dbab8b',1);circle(h.x-7,h.y-8,h.r*.68,'#9b7b6240');
    ctx.save();ctx.beginPath();ctx.arc(h.x,h.y,h.r-2,0,TAU);ctx.clip();for(let i=-90;i<90;i+=13)line([{x:h.x+i,y:h.y-h.r},{x:h.x+i+h.r*2,y:h.y+h.r}],'#d7a59120',3);ctx.restore();textLabel('×',h.x,h.y+7,23,'#efc4a6');}
}
function drawWorm(){
  if(g.trail.length>1)line(g.trail,'#bbefd513',3);
  ctx.save();if(g.hit>0&&Math.floor(g.t*9)%2)ctx.globalAlpha=.55;
  for(let i=g.body.length-1;i>=0;i--){const p=g.body[i],r=(1-i/g.body.length)*10+3;circle(p.x+2,p.y+5,r+2,'#071c2340');circle(p.x,p.y,r,'#70b7a6');circle(p.x-1.5,p.y-2,r*.82,'#b9e9c8a0');if(i%5===0)circle(p.x-2,p.y-3,2,'#f4f2b6b0');}
  ctx.translate(g.x,g.y);ctx.rotate(g.angle);circle(1,0,12,'#c5ecc7');circle(5,-6,3.5,'#133e3b');circle(5,6,3.5,'#133e3b');circle(6,-7,1,'#fff');circle(6,5,1,'#fff');ctx.restore();
  if(g.light){beam(g.x,g.y);ctx.setLineDash([4,7]);line([{x:g.x,y:g.y},{x:input.down?input.x:g.x+Math.cos(g.angle+g.side*.8)*70,y:input.down?input.y:g.y+Math.sin(g.angle+g.side*.8)*70}],'#8ed9ee70');ctx.setLineDash([]);}
  textLabel('NEMA',g.x,g.y-24,9,'#c3ddc8');
}
function drawBrain(){
  rect(84,91,552,387,28,'#1c4042','#78969460');rect(98,105,524,358,22,null,'#92aaab20');
  for(let x=126;x<620;x+=42)for(let y=130;y<450;y+=42)circle(x,y,1,'#b9d6d520');
  if(g.trail.length>1)line(g.trail,'#c5b5f018',3);drawHazards();drawFood();
  ctx.save();ctx.translate(g.x,g.y);ctx.rotate(g.angle);if(g.hit>0&&Math.floor(g.t*9)%2)ctx.globalAlpha=.55;
  ctx.beginPath();ctx.moveTo(-20,0);ctx.bezierCurveTo(-45,4,-35,26,-53,22);ctx.strokeStyle='#d6b3aa';ctx.lineWidth=3;ctx.stroke();ctx.beginPath();ctx.ellipse(-3,0,24,15,0,0,TAU);ctx.fillStyle='#cfc7ba';ctx.fill();circle(10,-12,9,'#d9b9ae');circle(10,12,9,'#d9b9ae');circle(16,0,12,'#e5dcca');circle(21,-5,2.3,'#1c3838');circle(21,5,2.3,'#1c3838');circle(28,0,2,'#bd8c82');ctx.restore();
  rect(145,504,430,91,18,'#0f2c30','#71919a50');textLabel('FIBRAS ÓPTICAS → ESTRIADO / VIA DIRETA',360,525,9,'#9ebbb8');
  for(const [i,x] of [267,453].entries()){
    const active=g.light&&((i===0&&g.side>0)||(i===1&&g.side<0));circle(x,558,23,active?'#6eafc275':'#afa4ca25',active?COLORS.blue:'#a69bb370');line([{x,y:534},{x,y:548}],active?COLORS.blue:'#809697',3);if(active)glow(x,558,35,COLORS.blue);textLabel(i===0?'ESQUERDO':'DIREITO',x,591,8,'#bfcbcb');textLabel(i===0?'→':'←',x,564,19,active?'#d6f9ff':'#a9abb8');}
  textLabel('Estímulo',360,553,10,'#98aeb0');textLabel('↓',360,571,16,'#c7d9c7');if(g.light)beam(g.x,g.y);
}
function drawHeart(){
  const age=g.t-g.beatAt;const pulse=age<.55?Math.sin(age/.55*Math.PI):0;glow(360,248,185,COLORS.coral);
  for(const t of g.pulses){const a=g.t-t;if(a>2)continue;ctx.globalAlpha=Math.max(0,1-a/2);circle(360,265,65+a*130,null,COLORS.blue,1.5);ctx.globalAlpha=1;}g.pulses=g.pulses.filter(t=>g.t-t<2);
  const size=300+pulse*18;
  if(heartImage.complete&&heartImage.naturalWidth)ctx.drawImage(heartImage,360-size/2,238-size/2,size,size);
  else{ctx.save();ctx.translate(360,245);ctx.scale(1+pulse*.06,1+pulse*.06);ctx.beginPath();ctx.moveTo(0,65);ctx.bezierCurveTo(-130,-20,-70,-100,0,-45);ctx.bezierCurveTo(70,-100,130,-20,0,65);ctx.fillStyle=COLORS.coral;ctx.fill();ctx.restore();}
  textLabel('PULSAR',360,414,10,'#e7b6a1');
  const x=115,w=490,y=484,phase=(g.t%BEAT_PERIOD)/BEAT_PERIOD;
  rect(x,y,w,22,11,'#07272b','#68867b50');rect(x+w*(BEAT_TARGET-BEAT_WINDOW),y,w*BEAT_WINDOW*2,22,7,'#92c69b60');
  line([{x:x+w*phase,y:y-12},{x:x+w*phase,y:y+34}],COLORS.gold,3);circle(x+w*phase,y+11,5,COLORS.gold);
  textLabel('ESPERE',x+70,y+49,10,'#8ca9a0');textLabel('PULSE AQUI',x+w*BEAT_TARGET,y+49,10,'#cee7b9');
  const pts=[];for(let px=110;px<=610;px+=3){let v=0;for(const t of g.pulses){const pos=610-(g.t-t)*200;const d=(px-pos)/13;if(Math.abs(d)<3)v+=Math.exp(-d*d)*Math.sin(d*3.5)*20;}pts.push({x:px,y:440-v});}line(pts,'#91cebf',1.7);
  textLabel(age<.48?'RECUPERANDO A EXCITABILIDADE':'TECIDO PRONTO PARA RESPONDER',360,584,10,age<.48?'#e6c994':'#90b5a2');
}
function drawRetina(){
  const shape=SHAPES[g.retinaOrder[g.retinaRound]];rect(176,107,368,368,23,'#092b30','#89a29b60');
  for(let row=0;row<5;row++)for(let col=0;col<5;col++){const p=retinaCell(row,col),seen=g.retinaSeen.has(row*5+col),on=shape[row][col]==='1';circle(p.x,p.y,22,seen&&on?'#d9b568':'#284541',seen&&on?'#f3d898':'#65817b60',1.2);if(seen&&on){glow(p.x,p.y,27,COLORS.gold);circle(p.x-4,p.y-5,5,'#ffefbc50');}if(seen&&!on)textLabel('·',p.x,p.y+5,18,'#7e9990');}
  if(g.light)beam(input.x,input.y,COLORS.gold);else{ctx.setLineDash([3,4]);circle(input.x,input.y,32,null,'#c4c69c65');ctx.setLineDash([]);}
  textLabel('CÉLULAS COM CHRIMSONR · PADRÃO PROJETADO',360,76,10,'#d3c6a1');
  rect(176,505,368,65,12,'#16383a','#698a7b40');textLabel(g.retinaSeen.size<10?'Explore pelo menos 10 células para comparar as formas.':'Agora escolha uma forma nos botões abaixo.',360,530,12,'#c6d4bc');textLabel(`${g.retinaSeen.size} / 25 células exploradas · rodada ${g.retinaRound+1} de 3`,360,552,10,'#91ab9a');
}
function drawLab(){
  const lightColor=g.color==='blue'?COLORS.blue:COLORS.gold;
  const c=g.activity>60?COLORS.blue:g.activity<15?COLORS.gold:COLORS.purple;
  for(let i=0;i<7;i++){const a=i*TAU/7;const x=360+Math.cos(a)*120,y=226+Math.sin(a)*85;line([{x:360,y:226},{x,y},{x:x+Math.cos(a+.4)*28,y:y+Math.sin(a+.4)*20}],c+'75',3);circle(x,y,4,c);}
  glow(360,226,105,c);circle(360,226,61,'#9387b350',c+'c0',2);circle(360,226,40,'#bcabcf30');circle(348,220,5,'#e5e7d5');circle(375,220,5,'#e5e7d5');
  if(g.labOpsin!=='none')for(let i=0;i<7;i++){const a=i/7*TAU;ctx.save();ctx.translate(360+Math.cos(a)*62,226+Math.sin(a)*62);ctx.rotate(a);rect(-4,-7,8,14,2,g.labOpsin==='chr2'?'#81cce0':'#dfb86d');ctx.restore();}
  if(g.light){glow(360,190,145,lightColor);ctx.fillStyle=lightColor+'18';ctx.beginPath();ctx.moveTo(341,69);ctx.lineTo(379,69);ctx.lineTo(420,212);ctx.lineTo(300,212);ctx.fill();}
  rect(332,51,56,32,9,'#dcdcc3');circle(360,82,12,g.light?lightColor:'#657f79');textLabel({chr2:'AMOSTRA COM ChR2',none:'CONTROLE SEM OPSINA',nphr:'AMOSTRA COM NpHR'}[g.labOpsin],360,337,12,'#c6d3c3');
  rect(114,366,492,106,12,'#09272c','#78998b40');
  for(let i=0;i<5;i++)line([{x:126,y:388+i*17},{x:594,y:388+i*17}],'#69958112');
  const pts=[];g.trace.forEach((sample,i)=>{const x=128+i*1.85;if(sample.lit){ctx.fillStyle=(sample.color==='blue'?'#87d8f7':'#f6ca75')+'0b';ctx.fillRect(x,374,2,89);}pts.push({x,y:452-sample.v*.75});});line(pts,c,1.8);
  textLabel(`ATIVIDADE RELATIVA: ${Math.round(g.activity)} · TRAÇADO ILUSTRATIVO`,360,491,10,'#9db7aa');
  const items=[['chr2-blue','ChR2 + azul'],['none-blue','Controle + azul'],['nphr-amber','NpHR + âmbar']];
  items.forEach(([key,label],i)=>{const x=121+i*163,done=g.recorded.has(key);rect(x,529,153,41,9,done?'#47765460':'#183a36',done?'#a4cd9b80':'#6f897540');textLabel((done?'✓ ':'○ ')+label,x+76,554,11,done?'#d0e8b5':'#96b3a0');});
}
function draw(){
  if(!g||screen!=='play'||!ctx)return;ctx.save();ctx.setTransform(canvas.width/720,0,0,canvas.height/620,0,0);background();
  if(g.m.type==='worm'){drawDish();drawHazards();drawFood();drawWorm();}
  else if(g.m.type==='brain')drawBrain();else if(g.m.type==='heart')drawHeart();else if(g.m.type==='retina')drawRetina();else drawLab();
  for(const p of particles){ctx.globalAlpha=Math.max(0,p.life/.8);circle(p.x,p.y,2.5,p.color);}ctx.globalAlpha=1;ctx.restore();
}
function resize(){if(screen!=='play')return;const r=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);draw();}
function pointerPos(e){const r=canvas.getBoundingClientRect();input.x=clamp((e.clientX-r.left)/r.width*720,0,720);input.y=clamp((e.clientY-r.top)/r.height*620,0,620);}
canvas.addEventListener('pointerdown',e=>{if(g?.mode!=='playing'||e.isPrimary===false)return;e.preventDefault();release();canvas.focus({preventScroll:true});pointerPos(e);input.down=true;input.pointerId=e.pointerId;try{canvas.setPointerCapture(e.pointerId);}catch{}if(g.m.type==='heart')heartPulse();});
canvas.addEventListener('pointermove',e=>{if(input.down&&e.pointerId===input.pointerId){e.preventDefault();pointerPos(e);}});
for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,e=>{if(input.pointerId===e.pointerId)release();});canvas.addEventListener('contextmenu',e=>e.preventDefault());
window.addEventListener('keydown',e=>{
  if(screen!=='play'||!g||e.ctrlKey||e.metaKey||e.altKey)return;
  if(e.key==='Escape'||e.key.toLowerCase()==='p'){e.preventDefault();if(e.repeat)return;if(g.mode==='playing')pause();else if(g.mode==='paused')$('overlay-action').click();return;}
  if(g.mode!=='playing'||['BUTTON','INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName))return;
  const key=e.key.toLowerCase();if(!['arrowleft','arrowright','arrowup','arrowdown','a','d','w','s',' '].includes(key))return;e.preventDefault();
  if(key===' '){if(g.m.type==='heart'){if(!e.repeat)heartPulse();}else if(['lab','retina'].includes(g.m.type))input.light=true;else if(!e.repeat)pause();return;}
  if(['arrowleft','a'].includes(key))input.left=true;if(['arrowright','d'].includes(key))input.right=true;if(['arrowup','w'].includes(key))input.up=true;if(['arrowdown','s'].includes(key))input.bottom=true;
});
window.addEventListener('keyup',e=>{const k=e.key.toLowerCase();if(['arrowleft','a'].includes(k))input.left=false;if(['arrowright','d'].includes(k))input.right=false;if(['arrowup','w'].includes(k))input.up=false;if(['arrowdown','s'].includes(k))input.bottom=false;if(k===' ')input.light=false;});
window.addEventListener('blur',()=>{release();if(g?.mode==='playing')pause();});document.addEventListener('visibilitychange',()=>{if(document.hidden){release();if(g?.mode==='playing')pause();}});
window.addEventListener('resize',resize);
$('nav-missions').onclick=()=>showScreen('home');$('nav-notebook').onclick=()=>showScreen('notebook');$('how-science').onclick=()=>showScreen('notebook');$('back-missions').onclick=()=>showScreen('home');$('exit').onclick=()=>showScreen('home');
$('begin').onclick=()=>{let i=MISSIONS.findIndex(m=>!saved.stars[m.id]);openMission(i<0?0:i);};$('practice').onchange=e=>{saved.practice=e.target.checked;save();};
$('pause').onclick=()=>g.mode==='paused'?$('overlay-action').click():pause();$('restart').onclick=()=>openMission(g.index);
$('sound').onclick=()=>{sound=!sound;$('sound').textContent=sound?'Som ligado':'Som desligado';$('sound').setAttribute('aria-pressed',String(sound));$('sound').setAttribute('aria-label',sound?'Desativar sons':'Ativar sons');tone();};
function frame(t){const dt=last?Math.min((t-last)/1000,.04):0;last=t;if(screen==='play'){update(dt);draw();hudTime+=dt;if(hudTime>.1){updateHUD();hudTime=0;}}requestAnimationFrame(frame);}
renderHome();requestAnimationFrame(frame);
})();
