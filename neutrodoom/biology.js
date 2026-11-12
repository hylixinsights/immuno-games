(() => {
  'use strict';
  const data = window.NEUTRO_BIOLOGY;
  const preferenceKey = 'neutrodoom.preferences';
  const readPreferences = () => {
    try {
      const value = JSON.parse(localStorage.getItem(preferenceKey) || '{}');
      return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    } catch (_) { return {}; }
  };
  const requestedLanguage = new URLSearchParams(location.search).get('lang');
  let language = ['pt', 'en'].includes(requestedLanguage) ? requestedLanguage : (readPreferences().lang === 'pt' ? 'pt' : 'en');
  let activeAbility = data.abilities.some(a => a.id === location.hash.slice(1)) ? location.hash.slice(1) : 'phagocytosis';
  const diagramStates = Object.fromEntries(data.abilities.map(a => [a.id, 0]));
  const answers = Array(data.quiz.length).fill(null);
  let quizSubmitted = false;
  let quizIncomplete = false;
  const $ = id => document.getElementById(id);
  const tr = value => Array.isArray(value) ? value[language === 'pt' ? 1 : 0] : value;
  const L = (en, pt) => language === 'pt' ? pt : en;
  const node = (tag, className, text) => {
    const n = document.createElement(tag);
    if (className) n.className = className;
    if (text !== undefined) n.textContent = text;
    return n;
  };
  const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const text = (x,y,value,size=16,extra='') => `<text x="${x}" y="${y}" font-size="${size}" ${extra}>${esc(value)}</text>`;
  const arrow = (x1,y1,x2,y2,color='#ffe3a0') => `<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="2.5" marker-end="url(#arrow-${activeDiagramId})"/>`;
  let activeDiagramId = '';
  const nucleus = (x,y,scale=1) => `<g transform="translate(${x} ${y}) scale(${scale})" fill="#8054a7" stroke="#b894e4" stroke-width="2"><path d="M-30 -5Q-7 -32 14 -13T45 5" fill="none" stroke-width="7"/><ellipse cx="-34" cy="0" rx="21" ry="30" transform="rotate(-24 -34 0)"/><ellipse cx="4" cy="-16" rx="22" ry="25"/><ellipse cx="41" cy="7" rx="22" ry="28" transform="rotate(22 41 7)"/></g>`;
  const bacterium = (x,y,scale=1) => `<g transform="translate(${x} ${y}) scale(${scale})"><rect x="-29" y="-14" width="58" height="28" rx="14" fill="#afcb83" stroke="#d2ed97" stroke-width="2"/><path d="M-16 0l9 -5 9 8 12 -5" fill="none" stroke="#425a38" stroke-width="2"/></g>`;

  function svgWrap(ability, drawing) {
    return `<svg viewBox="0 0 440 330" role="img" aria-labelledby="diagram-title-${ability.id} diagram-desc-${ability.id}" xmlns="http://www.w3.org/2000/svg"><title id="diagram-title-${ability.id}">${esc(tr(ability.name))}: ${esc(tr(ability.states[diagramStates[ability.id]]))}</title><desc id="diagram-desc-${ability.id}">${esc(tr(ability.captions[diagramStates[ability.id]]))}</desc><defs><marker id="arrow-${ability.id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#ffe3a0"/></marker></defs>${drawing}</svg>`;
  }

  function phagocytosisDiagram(state) {
    if (state === 2) {
      return `<ellipse cx="213" cy="167" rx="180" ry="134" fill="#38203b" stroke="#e29ab6" stroke-width="3"/>${nucleus(117,173,.8)}<circle cx="285" cy="144" r="62" fill="#211229" stroke="#f8a7bd" stroke-width="3"/>${bacterium(285,144,.8)}<rect x="260" y="79" width="42" height="12" rx="4" fill="#ffe3a0"/>${arrow(281,92,281,119)}${text(276,59,'NOX2',16,'text-anchor="middle"')}${text(271,199,'ROS',15)}<g fill="#f8a7bd" stroke="#ffd5e0" stroke-width="1.5"><circle cx="207" cy="210" r="9"/><circle cx="190" cy="232" r="7"/><circle cx="215" cy="249" r="8"/></g>${arrow(221,210,244,181)}${text(157,282,L('Granule fusion','Fusão de grânulos'),15)}${text(309,237,L('Phagosome','Fagossomo'),16,'text-anchor="middle"')}${text(28,24,L('INSIDE THE CELL','DENTRO DA CÉLULA'),13)}`;
    }
    const cell = `<ellipse cx="115" cy="166" rx="101" ry="113" fill="#38203b" stroke="#e29ab6" stroke-width="3"/>${nucleus(96,180,.7)}<circle cx="152" cy="109" r="5" fill="#f8a7bd"/><circle cx="167" cy="221" r="6" fill="#f8a7bd"/>`;
    const target = `<circle cx="321" cy="155" r="57" fill="#5a48604d" stroke="#b894e4" stroke-width="14" opacity=".9"/>${bacterium(321,155,.9)}`;
    if (state === 0) return `${cell}${target}${text(19,24,L('NEUTROPHIL','NEUTRÓFILO'),13)}${text(321,48,L('Capsule','Cápsula'),17,'text-anchor="middle"')}<path d="M321 58v28" stroke="#b894e4" stroke-width="2"/><path d="M228 140l20 20m0 -20l-20 20" stroke="#f8a7bd" stroke-width="3"/>${text(220,300,L('Recognition can be hindered','O reconhecimento pode ser dificultado'),15,'text-anchor="middle"')}`;
    const antibody = (x,y,r) => `<path d="M-8 -8L0 0L8 -8M0 0V13" transform="translate(${x} ${y}) rotate(${r})" fill="none" stroke="#f8a7bd" stroke-width="4" stroke-linecap="round"/>`;
    return `${cell}${target}${antibody(298,82,-25)}${antibody(381,127,70)}${antibody(337,226,170)}<g fill="#ffe3a0" stroke="#ffe3a0"><path d="M265 99l7 7-7 7-7-7zM386 178l7 7-7 7-7-7zM282 211l7 7-7 7-7-7z"/></g><path d="M206 137h16v-9M211 178h17v9" stroke="#f8a7bd" stroke-width="3" fill="none"/>${arrow(265,153,231,153)}${text(220,27,L('OPSONINS IMPROVE CONTACT','OPSONINAS FACILITAM O CONTATO'),13,'text-anchor="middle"')}${text(220,278,'IgG → FcγR',17,'text-anchor="middle"')}${text(220,306,'C3b / iC3b → CR1 / CR3',16,'text-anchor="middle"')}`;
  }

  function granulesDiagram(state) {
    const colors = ['#f8a7bd','#ffe3a0','#b894e4'];
    const groups = [[[180,101],[203,128],[185,209],[161,231]],[[216,161],[110,91],[202,190],[102,227]],[[71,122],[69,198],[139,86],[226,151]]];
    let granules = '';
    groups.forEach((group, type) => group.forEach(([x,y]) => {granules += `<circle cx="${x}" cy="${y}" r="${type === state ? 8 : 4}" fill="${colors[type]}" opacity="${type === state ? 1 : .35}" stroke="${type === state ? '#fff0e9' : 'none'}" stroke-width="1.5"/>`;}));
    const cargo = [['MPO','NE / ELANE','CTSG',L('α-defensins','α-defensinas')],['LTF',L('Lactoferrin','Lactoferrina'),'LYZ',L('Lysozyme','Lisozima')],['MMP9',L('Gelatinase','Gelatinase'),L('Matrix','Matriz'),L('remodeling','remodelação')]][state];
    return `<ellipse cx="143" cy="161" rx="125" ry="111" fill="#38203b" stroke="#e29ab6" stroke-width="3"/>${nucleus(119,165,.67)}${granules}<rect x="288" y="65" width="140" height="186" rx="4" fill="#2d1834" stroke="${colors[state]}" stroke-width="2"/>${arrow(234,160,279,160)}${cargo.map((value,i) => text(358,104+i*36,value,i === 0 ? 20 : 16,'text-anchor="middle"')).join('')}${text(220,25,L('REPRESENTATIVE CARGO','EXEMPLOS DE CONTEÚDO'),13,'text-anchor="middle"')}${text(220,295,L('Fusion with a phagosome or the cell surface','Fusão com fagossomo ou superfície celular'),14,'text-anchor="middle"')}`;
  }

  function rosDiagram(state) {
    const outside = state === 1;
    return `<path d="M10 56h161v220H10z" fill="#38203b"/><path d="M180 56h249v220H180z" fill="${outside ? '#402332' : '#22312c'}"/><path d="M174 55v222" stroke="#f8a7bd" stroke-width="8"/><path d="M184 55v222" stroke="#b87d9f" stroke-width="3"/>${text(82,32,L('Cytosol','Citosol'),17,'text-anchor="middle"')}${text(304,32,outside ? L('Extracellular space','Espaço extracelular') : L('Phagosome lumen','Lúmen do fagossomo'),16,'text-anchor="middle"')}<rect x="148" y="109" width="63" height="47" rx="11" fill="#ffe3a0" stroke="#ffedc1" stroke-width="2"/>${text(180,139,'NOX2',15,'text-anchor="middle" style="fill:#160b1c;font-weight:bold"')}${text(69,107,'NADPH',17,'text-anchor="middle"')}${arrow(87,132,137,132)}${arrow(217,132,258,132)}${text(237,114,'e−',16,'text-anchor="middle"')}${text(303,91,'O₂',21,'text-anchor="middle"')}${arrow(303,101,303,118)}${text(303,145,'O₂•−',22,'text-anchor="middle"')}${arrow(303,156,303,178)}${text(303,201,'H₂O₂',21,'text-anchor="middle"')}${arrow(303,211,303,238)}${text(367,228,'MPO + Cl−',14,'text-anchor="middle"')}${text(303,263,'HOCl',22,'text-anchor="middle"')}${text(84,192,L('Assembly','Montagem'),16,'text-anchor="middle"')}${text(84,220,'NCF1/2/4',15,'text-anchor="middle"')}${text(84,245,'RAC2',15,'text-anchor="middle"')}${text(220,307,outside ? L('Microbes and host tissue can be exposed','Microrganismos e tecido podem ser expostos') : L('Activity concentrated around the microbe','Atividade concentrada ao redor do microrganismo'),14,'text-anchor="middle"')}`;
  }

  function netsDiagram(state) {
    const intact = state === 1;
    const membrane = intact ? '<ellipse cx="112" cy="166" rx="94" ry="101" fill="#38203b" stroke="#e29ab6" stroke-width="3"/>' : '<path d="M190 111A94 101 0 1 0 190 221" fill="#38203b" stroke="#e29ab6" stroke-width="3"/>';
    let network = '';
    for (let i=0;i<5;i++) network += `<path d="M252 ${80+i*38}Q302 ${61+i*38} 341 ${84+i*38}T423 ${80+i*38}" fill="none" stroke="#b894e4" stroke-width="2"/>`;
    for (let i=0;i<5;i++) network += `<path d="M${257+i*38} 66Q${232+i*38} 155 ${263+i*38} 250" fill="none" stroke="#b894e4" stroke-width="2"/>`;
    const release = intact ? `${nucleus(99,170,.65)}<g fill="#b894e4" stroke="#f8a7bd" stroke-width="2"><circle cx="187" cy="132" r="9"/><circle cx="213" cy="142" r="8"/><circle cx="238" cy="154" r="7"/></g>${arrow(214,186,250,186)}` : '<path d="M55 150q10 -45 45 -9t32 35q-17 24 -41 -1t29 -54q31 -4 39 39t73 -9l31 5" fill="none" stroke="#b894e4" stroke-width="4"/><path d="M178 111l14 7-7 13m0 82l12 8-7 12" fill="none" stroke="#f8a7bd" stroke-width="3"/>';
    return `${membrane}${release}${network}${bacterium(337,163,.64)}<g fill="#f8a7bd"><circle cx="276" cy="117" r="5"/><circle cx="381" cy="202" r="5"/><circle cx="365" cy="94" r="5"/></g><g fill="#ffe3a0"><circle cx="301" cy="217" r="5"/><circle cx="399" cy="128" r="5"/><circle cx="327" cy="85" r="5"/></g>${text(331,34,L('DNA + histones','DNA + histonas'),17,'text-anchor="middle"')}${text(332,281,'NE + MPO',16,'text-anchor="middle"')}${text(120,300,intact ? L('Membrane initially intact','Membrana inicialmente íntegra') : L('Membrane rupture','Ruptura da membrana'),13,'text-anchor="middle"')}`;
  }

  function renderDiagram(ability) {
    activeDiagramId = ability.id;
    const renderers = {phagocytosis:phagocytosisDiagram,granules:granulesDiagram,ros:rosDiagram,nets:netsDiagram};
    const selected = diagramStates[ability.id];
    $('diagram-'+ability.id).innerHTML = svgWrap(ability, renderers[ability.id](selected));
    $('caption-'+ability.id).textContent = tr(ability.captions[selected]);
    document.querySelectorAll(`[data-diagram="${ability.id}"]`).forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.state) === selected)));
  }

  function sourceLinks(ids) {
    const links = node('div','sources');
    links.append(node('span','',L('READ THE SCIENCE:','LEIA A CIÊNCIA:')));
    ids.forEach(id => {
      const source = data.references.find(reference => reference.n === id);
      const a = node('a','',`${id} · ${source.authors} (${source.year})`);
      a.href = source.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
      links.append(a);
    });
    return links;
  }

  function activateAbility(id, updateHash = false) {
    activeAbility = id;
    data.abilities.forEach(ability => {
      const selected = ability.id === id;
      $('tab-'+ability.id).setAttribute('aria-selected',String(selected));
      $('tab-'+ability.id).tabIndex = selected ? 0 : -1;
      $(ability.id).hidden = !selected;
    });
    if (updateHash) history.replaceState(null,'','#'+id);
  }

  function renderAbilities() {
    const tabs = $('ability-tabs'); const panels = $('ability-panels');
    tabs.replaceChildren(); panels.replaceChildren();
    tabs.setAttribute('aria-label',L('Neutrophil mechanisms','Mecanismos dos neutrófilos'));
    data.abilities.forEach((ability,index) => {
      const tab = node('button');
      tab.type = 'button'; tab.id = 'tab-'+ability.id; tab.setAttribute('role','tab'); tab.setAttribute('aria-controls',ability.id);
      tab.append(node('kbd','',ability.key),node('span','',tr(ability.name)));
      tab.addEventListener('click',() => activateAbility(ability.id,true));
      tab.addEventListener('keydown', event => {
        let next = index;
        if(event.key === 'ArrowRight') next = (index+1)%data.abilities.length;
        else if(event.key === 'ArrowLeft') next = (index+data.abilities.length-1)%data.abilities.length;
        else if(event.key === 'Home') next = 0;
        else if(event.key === 'End') next = data.abilities.length-1;
        else return;
        event.preventDefault(); activateAbility(data.abilities[next].id,true); $('tab-'+data.abilities[next].id).focus();
      });
      tabs.append(tab);
      const panel = node('section','ability-panel'); panel.id = ability.id; panel.setAttribute('role','tabpanel'); panel.setAttribute('aria-labelledby',tab.id); panel.tabIndex = 0;
      const heading = node('div','ability-heading'); const title = node('div');
      title.append(node('h3','',tr(ability.name)),node('p','',tr(ability.subtitle)));
      const count = node('span','ability-number','0'+(index+1));count.setAttribute('aria-hidden','true');heading.append(title,count);panel.append(heading);
      const grid = node('div','ability-grid');const diagramCard = node('div','diagram-card');
      diagramCard.append(node('h4','',L('EXPLORE THE DIAGRAM','EXPLORE O DIAGRAMA')));
      const controls = node('div','diagram-controls'); controls.setAttribute('role','group');controls.setAttribute('aria-label',L('Diagram states','Estados do diagrama'));
      ability.states.forEach((state,i) => {const button=node('button','',tr(state));button.type='button';button.dataset.diagram=ability.id;button.dataset.state=String(i);button.addEventListener('click',()=>{diagramStates[ability.id]=i;renderDiagram(ability);});controls.append(button);});
      const illustration=node('div','diagram');illustration.id='diagram-'+ability.id;
      const caption=node('p','diagram-caption');caption.id='caption-'+ability.id;caption.setAttribute('aria-live','polite');caption.setAttribute('aria-atomic','true');
      diagramCard.append(controls,illustration,caption,node('p','diagram-key',L('Schematic · not to scale','Esquema · sem escala')));
      const mechanism=node('div','mechanism');
      const game=node('section');game.append(node('h4','label',L('IN THE GAME','NO JOGO')),node('p','',tr(ability.game)));
      const biology=node('section');biology.append(node('h4','label',L('IN THE CELL','NA CÉLULA')));ability.biology.forEach(paragraph=>biology.append(node('p','',tr(paragraph))));mechanism.append(game,biology);
      grid.append(diagramCard,mechanism);panel.append(grid,node('h4','molecule-heading',L('MOLECULES & COMPARTMENTS','MOLÉCULAS E COMPARTIMENTOS')));
      const molecules=node('div','molecule-grid');ability.molecules.forEach(molecule=>{const box=node('section','molecule');box.append(node('h5','',tr(molecule.name)),node('p','',tr(molecule.text)));molecules.append(box);});panel.append(molecules);
      const boundary=node('div','boundary');boundary.append(node('strong','',L('WHERE THE GAME SIMPLIFIES · ','ONDE O JOGO SIMPLIFICA · ')),document.createTextNode(tr(ability.limitation)));panel.append(boundary,sourceLinks(ability.refs));panels.append(panel);renderDiagram(ability);
    });
    activateAbility(activeAbility);
  }

  function renderWaves() {
    const open = new Set([...document.querySelectorAll('.wave[open]')].map(wave=>wave.id));
    const list=$('wave-list');list.replaceChildren();
    data.waves.forEach(wave=>{
      const detail=node('details','wave');detail.id='wave-'+wave.n;detail.open=open.has(detail.id);
      const summary=node('summary');const number=node('span','wave-number',String(wave.n).padStart(2,'0'));number.setAttribute('aria-hidden','true');const name=node('span','wave-title');
      const episode = [L('BACTERIAL INFECTION','INFECÇÃO BACTERIANA'),L('ENCAPSULATED','ENCAPSULADOS'),'CANDIDA'][wave.episode-1];
      name.append(node('span','wave-episode',L('EPISODE ','EPISÓDIO ')+wave.episode+' · '+episode),document.createTextNode(tr(wave.name)));summary.append(number,name);
      const body=node('div','wave-body');body.append(node('p','wave-enemies',tr(wave.enemies)));const columns=node('div','wave-columns');
      [[L('IN THE GAME','NO JOGO'),wave.game],[L('THE BIOLOGICAL CONNECTION','A CONEXÃO BIOLÓGICA'),wave.biology]].forEach(([label,copy])=>{const section=node('section');section.append(node('h3','label',label),node('p','',tr(copy)));columns.append(section);});
      body.append(columns,node('p','wave-note',tr(wave.note)));detail.append(summary,body);list.append(detail);
    });
    $('enemy-sources').replaceChildren(sourceLinks([2,8,9,10,11]));
  }

  function renderRecruitment() {
    const section=$('recruitment-content');section.replaceChildren();
    const steps=node('div','recruitment-steps');data.recruitment.steps.forEach((step,index)=>{const item=node('section','recruitment-step');item.append(node('span','step-count','0'+(index+1)),node('h3','',tr(step.title)),node('p','',tr(step.text)));steps.append(item);});
    const signals=node('div','signal-row');data.recruitment.signals.forEach(signal=>{const item=node('section','signal');item.append(node('h4','',signal.name),node('p','',tr(signal.text)));signals.append(item);});
    const boundary=node('div','boundary');boundary.append(node('strong','',L('IN NEUTRODOOM · ','NO NEUTRODOOM · ')),document.createTextNode(tr(data.recruitment.game)));
    section.append(steps,signals,boundary,sourceLinks(data.recruitment.refs));
  }

  function renderQuiz() {
    const form=$('biology-quiz');form.replaceChildren();
    data.quiz.forEach((question,index)=>{
      const fieldset=node('fieldset','quiz-question');fieldset.id='question-'+index;fieldset.tabIndex=-1;
      const legend=node('legend');legend.append(node('span','',String(index+1).padStart(2,'0')),document.createTextNode(tr(question.q)));fieldset.append(legend);
      const options=node('div','quiz-options');question.options.forEach((option,choice)=>{
        const label=node('label','quiz-option');const input=node('input');input.type='radio';input.name='question-'+index;input.value=String(choice);input.checked=answers[index]===choice;input.disabled=quizSubmitted;
        input.addEventListener('change',()=>{answers[index]=choice;});
        if(quizSubmitted){if(choice===question.correct)label.classList.add('correct');else if(choice===answers[index])label.classList.add('incorrect');}
        label.append(input,node('span','',tr(option)));options.append(label);
      });fieldset.append(options);
      if(quizSubmitted){const feedback=node('p','feedback');const right=answers[index]===question.correct;feedback.append(node('strong','',right ? L('Correct.','Correto.') : L('Review this mechanism. Correct answer: ','Revise este mecanismo. Resposta correta: ')+tr(question.options[question.correct])),document.createTextNode(' '+tr(question.explanation)));fieldset.append(feedback);}
      form.append(fieldset);
    });
    const actions=node('div','quiz-actions');
    if(!quizSubmitted){const check=node('button','primary',L('CHECK MY ANSWERS','CONFERIR RESPOSTAS'));check.type='submit';actions.append(check);}
    const retry=node('button','secondary',quizSubmitted ? L('TRY AGAIN','TENTAR NOVAMENTE') : L('CLEAR ANSWERS','LIMPAR RESPOSTAS'));retry.type='button';retry.addEventListener('click',()=>{answers.fill(null);quizSubmitted=false;quizIncomplete=false;renderQuiz();$('question-0').focus();});actions.append(retry);form.append(actions);
    const result=node('div','quiz-result');result.id='quiz-result';result.setAttribute('role','status');result.tabIndex=-1;
    if(quizSubmitted){const correct=answers.filter((answer,index)=>answer===data.quiz[index].correct).length;result.textContent=correct+'/5 · '+(correct===5 ? L('Well connected! Review the explanations above or explore another mechanism.','Conexões feitas! Revise as explicações acima ou explore outro mecanismo.') : L('The explanations above show why each answer works. You can try again at any time.','As explicações acima mostram o motivo de cada resposta. Você pode tentar novamente quando quiser.'));}
    else if(quizIncomplete)result.textContent=L('Answer all five questions before checking. Your current choices are preserved.','Responda às cinco perguntas antes de conferir. Suas escolhas atuais foram mantidas.');
    form.append(result);
  }

  function renderReferences() {
    const list=$('reference-list');list.replaceChildren();
    data.references.forEach(reference=>{const item=node('li');item.id='reference-'+reference.n;const link=node('a','',reference.title);link.href=reference.url;link.target='_blank';link.rel='noopener noreferrer';link.lang='en';item.append(link,node('span','reference-meta',reference.authors+' · '+reference.journal+' · '+reference.year));list.append(item);});
  }

  function routeHash(scroll=true) {
    const id=location.hash.slice(1);
    if(data.abilities.some(ability=>ability.id===id))activateAbility(id);
    const target=$(id);if(target?.classList.contains('wave'))target.open=true;
    if(scroll&&target)target.scrollIntoView({block:'start'});
  }

  function applyLanguage() {
    document.documentElement.lang=language==='pt'?'pt-BR':'en';
    document.title=L('The biology · NEUTRODOOM','A biologia · NEUTRODOOM');
    document.querySelector('meta[name="description"]').content=L('Explore the real immunology behind NEUTRODOOM: phagocytosis, granules, oxidative burst, NETs, microbial evasion and neutrophil recruitment.','Explore a imunologia real por trás do NEUTRODOOM: fagocitose, grânulos, burst oxidativo, NETs, evasão microbiana e recrutamento de neutrófilos.');
    document.querySelectorAll('[data-en]').forEach(element=>{element.textContent=element.dataset[language];});
    document.querySelector('[data-language-group]').setAttribute('aria-label',L('Language','Idioma'));
    document.querySelector('[data-section-nav]').setAttribute('aria-label',L('Biology sections','Seções de biologia'));
    document.querySelectorAll('[data-lang]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.lang===language)));
    document.querySelectorAll('[data-back]').forEach(link=>{link.href='./?lang='+language;});
    renderAbilities();renderWaves();renderRecruitment();renderQuiz();renderReferences();
    try{localStorage.setItem(preferenceKey,JSON.stringify({...readPreferences(),lang:language}));}catch(_){/* Explicit language links continue to work without storage. */}
  }

  document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>{language=button.dataset.lang;applyLanguage();try{const url=new URL(location.href);url.searchParams.set('lang',language);history.replaceState(null,'',url);}catch(_){}routeHash(false);}));
  $('biology-quiz').addEventListener('submit',event=>{event.preventDefault();quizIncomplete=answers.some(answer=>answer===null);quizSubmitted=!quizIncomplete;renderQuiz();if(quizIncomplete)$('question-'+answers.findIndex(answer=>answer===null)).focus();else $('quiz-result').focus();});
  addEventListener('hashchange',()=>routeHash());
  applyLanguage();routeHash();
})();
