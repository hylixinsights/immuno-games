import { objects } from './story.js';

// Stations are positions on a continuous ground plane, in paper-map units.
const paths = {
  river: { rbc:[2.6,-.82,'rbc',1.42], origin:[4.1,1.52,'origin',1.52], friend:[7.8,-.76,'friend',1.82], 'node-tab':[14.1,1.38,'node',3.4] },
  node: { macrophage:[4.1,-1.22,'macrophage',2.13], decoy:[4.7,.64,'antigen',1.08], trail:[8.8,.58,'trail',1.12], tonsil:[10.6,-1.72,'tonsil',1.83], follicle:[14.0,.32,'follicle',2.42] },
  recognition: { membrane:[10.8,.08,'membrane',1.95], mhc:[13.9,-.57,'mhc',1.61], helper:[17.1,.68,'helper',2.04], garden:[21,.04,'fan',2.65] },
  garden: { fan:[3.5,.38,'fan',2.35], 'sister-0':[6.6,-1.38,'sister',1.69], 'sister-1':[7.9,.08,'sister',1.74], 'sister-2':[6.5,1.43,'sister',1.62], choose:[7.4,-1.6,'fan',1.34], fdc:[11,.33,'fdc',2.78], tfh:[14.7,.71,'helper',2.01], il21:[15.2,-.73,'signal',1.15], marrow:[19.3,.12,'marrow',2.84] },
  marrow: { plasma:[4.6,.72,'plasma',2.32], antibody:[7.4,-1.18,'antibody',1.13], memory:[10,-.3,'memory',1.98], years:[15.4,.51,'years',2.19] },
  recall: { 'late-mica':[11.3,1.4,'friend',1.81], expand:[13.9,-.2,'family',2.19], antibody:[15.3,-1.28,'antibody',1.12], finish:[18.6,.4,'years',2.04], family:[18,.15,'family',2.11], tonsil:[20,-1.4,'tonsil',1.9] },
  tonsil: { friend:[3.1,-.48,'friend',1.95], vellum:[4.7,.22,'vellum',2.04], leaf:[5.5,.2,'vellum',2.14], back:[10,-.34,'venule',2.15] }
};
export const pathEnd = {river:15,node:15.2,recognition:22,garden:20.2,marrow:16.5,recall:21,tonsil:11.1};
const antigenBed = [[3.2,-1.35],[3.5,1.1],[6.5,.12],[9,-1.31],[9.5,1.25]];
export function stations(state) {
  const order = state.stage === 'recall' ? state.again : state.order;
  return objects(state).map(o => {
    let slot = paths[state.stage][o.id];
    if (o.id.startsWith('ant-')) {
      const [at,lane] = antigenBed[order.indexOf(o.variant)];
      slot = [at,lane,'antigen',1.17];
    }
    const [at,lane,art,height] = slot;
    return {...o,at,lane,art,height,variant:o.variant ?? 0};
  });
}
export function startPosition(state) {
  const step = state.steps[state.stage];
  if (state.stage === 'node' && step === 'witness') return {at:3.6,lane:.2};
  if (['drift','arrived','search','closed','visit','hello'].includes(step)) return {at:0,lane:0};
  const first = stations(state).find(o => !['choose','late-mica','back'].includes(o.id));
  return {at:Math.max(0,(first?.at || 2)-2.6),lane:0};
}
export function validPosition(stage,p) {
  if (!p || !Number.isFinite(p.at) || !Number.isFinite(p.lane)) return null;
  return {at:Math.max(0,Math.min(pathEnd[stage],p.at)),lane:Math.max(-2.15,Math.min(2.15,p.lane))};
}
