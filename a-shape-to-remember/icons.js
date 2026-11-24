const lineIcons={
  book:'<path d="M3 5c3.3-1.4 6.2-.8 9 1.2C15 4.1 18 3.6 21 5v14c-3.2-1.1-6.2-.8-9 1.2-2.8-2-5.8-2.3-9-1.2z"/><path d="M12 6.2v14M5.8 8.2c1.7-.3 2.9.1 4 1M14.4 9.2c1.3-.9 2.5-1.3 4-1"/>',
  journal:'<path d="M5 3.5h13.5a1.3 1.3 0 011.3 1.3v15.4H6.5c-1.4 0-2.4-1-2.4-2.3V5c0-.9.3-1.5.9-1.5zM4.3 16.7c.4-.6 1.1-.9 2-.9h13.1M7.5 3.8v12M10.5 8h5.2"/>',
  sound:'<path d="M3.5 9h4l5-4.2v14.4l-5-4.2h-4zM16 8.3a5 5 0 010 7.4M18.9 5.3a9 9 0 010 13.4"/>',
  mute:'<path d="M3.5 9h4l5-4.2v14.4l-5-4.2h-4zM16.2 9l5.2 6M21.4 9l-5.2 6"/>',
  globe:'<circle cx="12" cy="12" r="8.5"/><path d="M3.7 12h16.6M12 3.6c-4 4-4.2 12.7 0 16.8 4.1-4.1 4.1-12.9 0-16.8z"/>',
  help:'<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9a2.5 2.5 0 015 .3c0 2.1-2.6 2-2.6 4M12 16.2h.01"/>',
  close:'<path d="M6 6l12 12M18 6L6 18"/>',back:'<path d="M18.5 12H5.5m5.6-5.7L5.5 12l5.6 5.6"/>',
  fold:'<path d="M3.5 17.5l5-12 4.5 8L19 5l2 12.5-8 2zM8.5 5.5l.6 11M13 13.5v5.5"/>',
  leaf:'<path d="M19.8 3.8C10 3 4.4 7.9 5.4 14.1c.8 3.7 4.6 5.4 8.4 3.2 4.4-2.6 5.8-8.2 6-13.5zM4.5 20.2c2.8-5.2 6.5-9.1 11.3-12.5"/>',
  tree:'<circle cx="12" cy="4.8" r="2"/><circle cx="6" cy="18.2" r="2"/><circle cx="18" cy="18.2" r="2"/><path d="M12 6.8v3.8M6 16v-3l6-2.5 6 2.5v3.1"/>',
  clock:'<circle cx="12" cy="12" r="8.2"/><path d="M12 6.3V12l3.5 2.2"/>',
  map:'<path d="M3.3 6.7l5.8-2.6 5.8 2.7 5.8-2.3v13l-5.8 2.3-5.8-2.7-5.8 2.6zM9.1 4.7v12M14.9 7.2v12"/>',
  music:'<path d="M9 16V6l10-2v10M9 8.5l10-2"/><ellipse cx="6.6" cy="17.6" rx="2.5" ry="1.9"/><ellipse cx="16.5" cy="15.4" rx="2.5" ry="1.9"/>',
  turn:'<path d="M3 17.5c3-2.4 6-3.5 9-3.4l6.2.3m-3.6-4 4.5 4.1-4.5 3.6M4.6 10.6c3.1-3.1 6.8-4.8 11.1-5.2"/>',
  tag:'<path d="M6 4.2h12v16L12 16l-6 4.2z"/>',
  home:'<path d="M3 10l9-6.5 9 6.5M5.5 8.8v11h13v-11"/>',
  touch:'<path d="M8 10.4V7c0-2.1 3-2.1 3 0v6-2.3c0-1.9 2.6-2 2.8-.2.4-1.7 2.8-1.4 2.8.1 1.4-.9 2.7.1 2.7 1.5v2.8c0 3-1.2 5.1-3.2 6.2h-4.6c-2.3-1.7-3.8-4.6-5.7-7.3-.8-1.2.7-2.5 1.7-1.6l.5.4zM4 8a5.4 5.4 0 016.6-5"/>',
  lock:'<rect x="5.5" y="10" width="13" height="10" rx="2"/><path d="M8.7 10V7a3.3 3.3 0 016.6 0v3"/>',
  check:'<path d="M4.5 12.5l5.2 5.1L20 6.7"/>',
  tiles:'<path d="M4 5h16v14H4zM12 5v14M4 12h16"/>',
  popup:'<path d="M3 15l9 4 9-4-9-4zM7.8 13.1V8l4-3.2v6.3M12 11.2l4 1.9V8l-4.2-3.2"/>',
  info:'<circle cx="12" cy="12" r="8.6"/><path d="M12 11v5M12 7.9h.01"/>',
  replay:'<path d="M5.4 8.3a7.2 7.2 0 111 9.3M5.3 4.4v4.2h4.3"/>'
};
export function icon(id,cls=''){return '<svg class="ico '+cls+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(lineIcons[id]||lineIcons.leaf)+'</svg>';}
export function sigil(){return '<svg class="sigil" viewBox="0 0 42 42" fill="none" aria-hidden="true"><path d="M21 2.5c3.5 4 4.1 6.9 2.3 10.1 4.1-2.3 7.5-2.3 12.2-1.6-1.7 4.6-4 7.3-8.3 8.8 4.6 1.1 7.3 4.3 9.2 8.4-4.4 1.4-8.4 1.4-12.3-.6.6 4.7-.7 8.5-3.1 12-3-3.5-4.1-7.6-3.3-11.9-3.9 2.2-7.9 2.2-12.3.7C7.3 24 10 21 14.6 20c-4.2-1.4-7.1-4.7-8.3-8.8 4.6-.7 8.6-.6 12.2 1.6C16.8 9.4 17.6 6.2 21 2.5Z" fill="currentColor"/><circle cx="21" cy="20.4" r="3.4" fill="var(--pine)"/><g stroke="var(--pine)" stroke-width=".8"><path d="M21 5v10m11-2-8.6 5M32 27l-8-5M21 35V24M10 27l8-5M10 13l8.5 5"/></g></svg>';}
export const outlines=[
  'M24 17C13 7 11 19 14 25C2 23 6 37 17 35C17 43 28 46 30 36C41 39 49 29 38 24C45 13 31 10 26 20Z',
  'M35 7C21 6 11 16 11 27C11 39 22 45 35 40C24 39 20 32 21 25C21 18 26 11 35 7Z',
  'M24 5L40 21L26 43L10 23Z','M23 40L6 22L10 15L16 14L19 8L26 11L33 8L37 15L42 17L43 23Z',
  'M24 7a17 17 0 1 1-.01 0M24 17a7 7 0 1 0 .01 0'
];
export function shapeIcon(v,cls=''){return '<svg class="shape-icon '+cls+'" viewBox="0 0 48 48" aria-hidden="true"><path d="'+outlines[v%5]+'" fill="currentColor" fill-rule="evenodd" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round"/></svg>';}
export function markIcon(v){const paths=['<path d="M12 1l1.8 6.8L20.2 4l-3.5 6.5 6.5 1.5-6.5 1.7 3.7 6.4-6.7-3.4L12 23l-1.8-6.4-6.5 3.3 3.5-6.2L1 12l6.5-1.6L4 4.2l6.3 3.7z" fill="currentColor"/>','<path d="M4 18L12 5m0 14l8-13" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="3.6"/>','<path d="M2 17c1.8-5.2 3.3-6.5 6.4-4.6 2.1-6 4.7-7 7.1-.8 2.6-2 4.5-.7 6.4 4.7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2.5"/>'];return '<svg class="mark-icon" viewBox="0 0 24 24" aria-hidden="true">'+paths[v]+'</svg>';}
const propIcons={
  origin:'book',rbc:'fold',friend:'leaf',tab:'fold',macrophage:'leaf',trail:'map',tonsil:'map',membrane:'fold',mhc:'tag',helper:'leaf',fan:'fold',sister:'leaf',fdc:'tree',signal:'music',plasma:'leaf',memory:'tag',years:'turn',vellum:'fold',antibody:'tree'
};
export function propIcon(o){if(o.kind==='antigen')return shapeIcon(o.variant);if(o.kind==='rbc')return '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="12" rx="9" ry="6" transform="rotate(-24 12 12)" fill="none" stroke="currentColor" stroke-width="2"/><ellipse cx="12" cy="12" rx="4.2" ry="2.3" transform="rotate(-24 12 12)" fill="currentColor"/></svg>';return icon(propIcons[o.kind]);}
export function cellPlate(mark,variant){
  let arms='';for(let i=0;i<10;i++){arms+='<g transform="rotate('+(i*36+7)+' 70 66)"><path d="M70 28v-8m0 2-5-6m5 6 5-6" fill="none" stroke="#946c3d" stroke-width="3.6" stroke-linecap="round"/></g>';}
  let dots='';for(let i=0;i<21;i++){const a=i*2.4, r=20+(i%4)*4;dots+='<circle cx="'+(70+Math.cos(a)*r).toFixed(1)+'" cy="'+(65+Math.sin(a)*r).toFixed(1)+'" r="1.4" fill="#d7cc92"/>';}
  return '<svg class="cell-plate" viewBox="0 0 140 132" aria-hidden="true"><circle cx="70" cy="66" r="52.5" fill="none" stroke="#bb9e68" stroke-dasharray="1 4"/>'+arms+'<path d="M92 37l8-10" fill="none" stroke="#846b3b" stroke-width="2"/><circle cx="105" cy="23" r="11" fill="#b08a4f" stroke="#715c36"/><path transform="translate(95.5 13.7) scale(.39)" d="'+outlines[variant]+'" fill="#f2e6ca" fill-rule="evenodd"/><path d="M68 28c16-2 35 11 40 27 5 18-4 36-19 45-18 10-40 5-51-11-10-15-8-34 4-47 6-8 14-12 26-14z" fill="#75a390" stroke="#365f53" stroke-width="2"/><path d="M66 35c-17 1-28 16-27 31 0 18 11 31 27 33" fill="none" stroke="#b8c1a0" stroke-width="3"/><path d="M72 44c13-3 24 6 24 17-1 9-11 10-13 19-3 9-13 13-23 7-10-5-13-20-6-31 3-6 9-10 18-12z" fill="#345e59" stroke="#29483f" stroke-width="1.8"/>'+dots+'<g transform="translate(77 81) scale(.60)" style="color:#ecc477">'+markIcon(mark) .replace('<svg class="mark-icon" viewBox="0 0 24 24" aria-hidden="true">','').replace('</svg>','')+'</g></svg>';
}
