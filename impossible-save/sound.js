// A boot thump, fading crowd vowels and dry paper creases. All audio is generated locally.
export class MatchSound {
  constructor(enabled){this.enabled=enabled;this.ctx=null;this.master=null;this.buffer=null;}
  unlock(){
    try{
      if(!this.ctx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
        this.ctx=new AC();this.master=this.ctx.createGain();this.master.gain.value=this.enabled?.51:0;this.master.connect(this.ctx.destination);
        this.buffer=this.ctx.createBuffer(1,this.ctx.sampleRate*2,this.ctx.sampleRate);const a=this.buffer.getChannelData(0);let n=31;
        for(let i=0;i<a.length;i++){n=(Math.imul(n,1664525)+1013904223)>>>0;a[i]=n/2147483648-1;}
      }if(this.ctx.state==='suspended')this.ctx.resume().catch(()=>{});
    }catch{/* Muted play is always available. */}
  }
  set(value){this.enabled=value;this.unlock();if(this.master)this.master.gain.setTargetAtTime(value?.51:0,this.ctx.currentTime,.03)}
  sound(freq,end,len,vol,type='sine',when=0){if(!this.ctx||!this.enabled)return;
    const t=this.ctx.currentTime+when, osc=this.ctx.createOscillator(), gain=this.ctx.createGain();osc.type=type;
    osc.frequency.setValueAtTime(freq,t);osc.frequency.exponentialRampToValueAtTime(end,t+len);
    gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(vol,t+.008);gain.gain.exponentialRampToValueAtTime(.0001,t+len);
    osc.connect(gain).connect(this.master);osc.start(t);osc.stop(t+len+.012);
  }
  air(hz,to,len,vol,delay=0){if(!this.ctx||!this.enabled)return;const t=this.ctx.currentTime+delay,src=this.ctx.createBufferSource(),filter=this.ctx.createBiquadFilter(),g=this.ctx.createGain();src.buffer=this.buffer;src.loop=true;filter.type='bandpass';filter.Q.value=.7;filter.frequency.setValueAtTime(hz,t);filter.frequency.exponentialRampToValueAtTime(to,t+len);g.gain.setValueAtTime(.001,t);g.gain.exponentialRampToValueAtTime(vol,t+Math.min(.12,len*.2));g.gain.exponentialRampToValueAtTime(.001,t+len);src.connect(filter).connect(g).connect(this.master);src.start(t);src.stop(t+len+.02);}
  step(n){this.air(360+n*50,124,.078,.16);}
  kick(){this.sound(148,39,.24,.83);this.air(1500,190,.115,.48);this.air(1100,137,1.5,.54,.045);this.sound(260,84,1.05,.09,'triangle',.06);}
  jump(){this.sound(280,650,.13,.14,'sine');this.air(1700,540,.11,.12)}
  land(q,i){const tones=[268,342,417];this.sound(q>.78?tones[i]*1.6:148,q>.78?tones[i]*1.35:95,.15,.22,'triangle');this.air(900,180,.12,.16);}
  touch(){this.sound(105,53,.1,.36);this.air(1400,470,.12,.25);}
  result(saved){this.air(saved?650:410,saved?1100:240,saved?1.05:.66,.57);if(saved){[300,378,450].forEach((f,i)=>this.sound(f,f*.98,.25,.13,'triangle',i*.095))}else this.sound(134,77,.38,.19,'triangle');}
  fold(){this.air(1950,390,.26,.25);}
}
