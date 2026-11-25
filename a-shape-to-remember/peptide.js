// Both the drag and the two-tap gesture dock the same fragment in the MHC II groove.
export function peptidePuzzler(host,lang,onDock) {
  const t=(en,pt)=>lang==='pt'?pt:en;
  host.innerHTML='<div class="vesicle"><div class="vesicle-wall"></div><button type="button" class="mhc-socket" aria-label="'+t('MHC II groove','Sulco do MHC II')+'"><svg viewBox="0 0 110 98" aria-hidden="true"><path d="M17 9c-5-1-11 5-10 12l4 24c2 13 9 21 23 27l-3 24h15l7-27c2-8-6-12-16-16-8-4-10-13-9-22l2-14c1-3-5-7-13-8z" fill="#75a8a0" stroke="#31594e" stroke-width="2.5"/><path d="M88 9c7-2 14 5 13 13l-6 24c-3 13-9 20-22 25l2 25H60l-5-27c0-8 6-12 14-16 9-5 12-13 12-22l-2-13c-1-4 4-8 9-9z" fill="#80ad8c" stroke="#355b4b" stroke-width="2.5"/><path d="M29 39q25 24 51-2" fill="none" stroke="#bc974d" stroke-width="4" stroke-dasharray="3 5"/></svg><span>MHC II</span></button><button type="button" class="peptide-strip" aria-label="'+t('Peptide','Peptídeo')+'"><svg viewBox="0 0 90 38" aria-hidden="true"><path d="M4 13q9-9 20-2l14 9q8 5 17 0l15-9q8-5 16-1l-2 10q-5-2-11 2l-15 9q-13 7-24 0l-16-10q-8-4-13 1z" fill="#e8af6b" stroke="#84552e" stroke-width="2"/><path d="m13 15 3 5m12-1 3 6m13 0 2 5m12-6 3 4m11-14 4 4" stroke="#ac6e38" stroke-width="2"/></svg></button></div><p class="dock-help" aria-live="polite">'+t('Drag the peptide into the groove, or tap the two pieces.','Arraste o peptídeo até o sulco ou toque nas duas peças.')+'</p>';
  const tray=host.querySelector('.vesicle'),strip=host.querySelector('.peptide-strip'),socket=host.querySelector('.mhc-socket'),help=host.querySelector('.dock-help');
  let pointer=null,selected=false,done=false,skipClick=false;
  function select(){
    if(done)return;selected=true;strip.setAttribute('aria-pressed','true');tray.classList.add('selected');
    help.textContent=t('Now touch the groove of MHC II.','Agora toque no sulco do MHC II.');
  }
  function dock(){
    if(done||!selected)return;
    done=true;strip.style.removeProperty('transform');tray.classList.add('docked');strip.disabled=true;socket.disabled=true;
    help.textContent=t('The peptide fits. The complex travels to the cell surface.','O peptídeo se encaixa. O complexo segue até a superfície.');
    onDock();
  }
  strip.setAttribute('aria-pressed','false');
  strip.addEventListener('click',()=>{if(skipClick){skipClick=false;return;}select();});
  strip.addEventListener('pointerdown',e=>{
    if(done||!e.isPrimary||e.button!==0)return;
    pointer={id:e.pointerId,x:e.clientX,y:e.clientY,dragged:false};strip.setPointerCapture?.(e.pointerId);
  });
  strip.addEventListener('pointermove',e=>{
    if(!pointer||!e.isPrimary||pointer.id!==e.pointerId)return;
    const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;
    if(!pointer.dragged&&Math.hypot(dx,dy)<5)return;
    if(!pointer.dragged)select();pointer.dragged=true;strip.style.transform='translate('+dx+'px,'+dy+'px)';
  });
  function cancel(){pointer=null;strip.style.removeProperty('transform');}
  strip.addEventListener('pointercancel',cancel);
  strip.addEventListener('pointerup',e=>{
    if(!pointer||e.pointerId!==pointer.id)return;
    const wasDrag=pointer.dragged,r=socket.getBoundingClientRect();cancel();
    if(wasDrag){skipClick=true;const b=18;if(e.clientX>=r.left-b&&e.clientX<=r.right+b&&e.clientY>=r.top-b&&e.clientY<=r.bottom+b)dock();}
  });
  socket.addEventListener('click',()=>{if(selected)dock();else help.textContent=t('Touch the loose peptide first.','Toque primeiro no peptídeo solto.');});
}
