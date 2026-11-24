const sequences=[[62,67,71],[69,65,60],[62,69,65]];
export function noteSketch(target,play=false){
  const steps=sequences[target]||sequences[0],low=Math.min(...steps);
  return '<span class="note-visual'+(play?' play':'')+'" aria-hidden="true">'+steps.map(n=>'<i style="transform:translateY('+(-.85*(n-low))+'px)"></i>').join('')+'</span>';
}
export function createSound(enabled){
  let ctx=null,volume=null,noise=null,lastPaper=0;
  function unlock(){
    if(!enabled)return;
    try{
      if(!ctx){
        const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;
        ctx=new Audio();volume=ctx.createGain();volume.gain.value=.52;volume.connect(ctx.destination);
        noise=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*.34),ctx.sampleRate);
        let seed=9181;const data=noise.getChannelData(0);
        for(let i=0;i<data.length;i++){seed=(seed*16807)%2147483647;data[i]=(seed/1073741823.5)-1;}
      }
      if(ctx.state==='suspended')ctx.resume().catch(()=>{});
    }catch{}
  }
  function tone(midi,at,level=.15){
    const osc=ctx.createOscillator(),g=ctx.createGain();osc.type='sine';
    osc.frequency.value=440*Math.pow(2,(midi-69)/12);g.gain.setValueAtTime(.0001,at);
    g.gain.exponentialRampToValueAtTime(level,at+.018);g.gain.exponentialRampToValueAtTime(.0002,at+.68);
    osc.connect(g);g.connect(volume);osc.start(at);osc.stop(at+.70);
  }
  function paper(at,strength){
    const source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),g=ctx.createGain();
    source.buffer=noise;filter.type='bandpass';filter.frequency.value=1100;filter.Q.value=.65;g.gain.setValueAtTime(.0001,at);g.gain.exponentialRampToValueAtTime(strength,at+.035);g.gain.exponentialRampToValueAtTime(.0001,at+.24);
    source.connect(filter);filter.connect(g);g.connect(volume);source.start(at);source.stop(at+.25);
  }
  return {unlock,set(v){enabled=v;if(v)unlock();if(volume&&ctx)volume.gain.setTargetAtTime(v?.52:0,ctx.currentTime,.015);},play(id,target=0){
    unlock();if(!enabled||!ctx||ctx.state==='closed')return;
    const now=ctx.currentTime+.025;
    if(id==='motif'){sequences[target].forEach((n,i)=>tone(n,now+.22*i));}
    else if(id==='signal'){tone(76,now,.095);tone(79,now+.32,.07);}
    else if(id==='years'){[0,.2,.42].forEach((t,i)=>paper(now+t,.14-i*.02));}
    else if(now-lastPaper>.25){paper(now,id==='brush'?.045:.115);lastPaper=now;}
  }};
}
