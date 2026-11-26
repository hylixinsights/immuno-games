// A boot thump, fading crowd vowels and dry paper creases. All audio is generated locally.
export class MatchSound {
  constructor(enabled,music=true){this.enabled=enabled;this.ctx=null;this.master=null;this.buffer=null;this.musicOn=music;this.musicBus=null;this.mood='full';this.step16=0;this.nextAt=0;this.timer=null;}
  unlock(){
    try{
      if(!this.ctx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
        this.ctx=new AC();this.master=this.ctx.createGain();this.master.gain.value=this.enabled?.51:0;this.master.connect(this.ctx.destination);this.musicBus=this.ctx.createGain();this.musicBus.gain.value=this.musicOn?1.3:0;this.musicBus.connect(this.master);
        this.buffer=this.ctx.createBuffer(1,this.ctx.sampleRate*2,this.ctx.sampleRate);const a=this.buffer.getChannelData(0);let n=31;
        for(let i=0;i<a.length;i++){n=(Math.imul(n,1664525)+1013904223)>>>0;a[i]=n/2147483648-1;}
      }if(this.ctx.state==='suspended')this.ctx.resume().catch(()=>{});this.startMusic();
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
  // Short interface and feedback cues.
  click(){this.air(2300,1100,.045,.07);}
  urgent(){this.sound(880,820,.05,.05,'triangle');}
  cue(){this.sound(700,930,.09,.1,'triangle');}
  bind(){this.sound(392,588,.12,.14,'triangle');this.sound(588,784,.16,.11,'triangle',.09);}
  miss(){this.sound(196,131,.3,.13,'triangle');}
  quiz(ok){if(ok){this.sound(523,523,.12,.12,'triangle');this.sound(784,784,.2,.12,'triangle',.11)}else this.sound(233,196,.26,.1,'triangle');}
  held(){this.sound(880,1320,.3,.07,'sine',.12);this.sound(1320,1760,.34,.05,'sine',.24);}
  series(won){if(won){[392,494,587,784].forEach((f,i)=>this.sound(f,f,.34,.13,'triangle',.5+i*.13));this.air(700,1300,1.9,.4,.5)}else{this.sound(330,330,.3,.09,'triangle',.5);this.sound(247,247,.5,.09,'triangle',.78)}}
  // Background music: a quiet samba-flavoured loop, generated locally like every other sound.
  // 'full' plays percussion, bass and a plucked figure. 'pulse' keeps only light percussion and bass during a kick.
  setMusic(value){this.musicOn=value;this.unlock();if(this.musicBus)this.musicBus.gain.setTargetAtTime(value?1.3:0,this.ctx.currentTime,.08)}
  scene(mood){this.mood=mood}
  startMusic(){
    if(this.timer||!this.ctx)return;
    this.timer=setInterval(()=>{try{this.schedule()}catch{/* Music is optional. */}},70);
  }
  note(freq,len,vol,type,at){
    const osc=this.ctx.createOscillator(),gain=this.ctx.createGain();osc.type=type;osc.frequency.setValueAtTime(freq,at);
    gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(vol,at+.012);gain.gain.exponentialRampToValueAtTime(.0001,at+len);
    osc.connect(gain).connect(this.musicBus);osc.start(at);osc.stop(at+len+.02);
  }
  drum(from,to,len,vol,at){
    const osc=this.ctx.createOscillator(),gain=this.ctx.createGain();osc.frequency.setValueAtTime(from,at);osc.frequency.exponentialRampToValueAtTime(to,at+len);
    gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(vol,at+.006);gain.gain.exponentialRampToValueAtTime(.0001,at+len);
    osc.connect(gain).connect(this.musicBus);osc.start(at);osc.stop(at+len+.02);
  }
  shake(hz,len,vol,at){
    const src=this.ctx.createBufferSource(),filter=this.ctx.createBiquadFilter(),gain=this.ctx.createGain();src.buffer=this.buffer;
    filter.type='bandpass';filter.Q.value=1.4;filter.frequency.value=hz;
    gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(vol,at+.004);gain.gain.exponentialRampToValueAtTime(.0001,at+len);
    src.connect(filter).connect(gain).connect(this.musicBus);src.start(at,(this.step16%29)*.05);src.stop(at+len+.02);
  }
  schedule(){
    const c=this.ctx;
    if(!c||c.state!=='running'||!this.enabled||!this.musicOn||document.hidden){this.nextAt=0;return}
    const sixteenth=60/92/4;
    if(this.nextAt<c.currentTime)this.nextAt=c.currentTime+.06;
    while(this.nextAt<c.currentTime+.24){this.playStep(this.step16,this.nextAt);this.step16=(this.step16+1)%64;this.nextAt+=sixteenth}
  }
  playStep(n,at){
    const beat=n%16,bar=n>>4,full=this.mood==='full',hz=m=>440*Math.pow(2,(m-69)/12);
    // D major: Dmaj7, Bm7, Em7, A7.
    const chord=[[50,66,69,73,78],[47,66,69,74,78],[52,67,71,74,79],[45,67,69,73,76]][bar];
    const swing=beat%2?.012:0,t=at+swing;
    this.shake(6400,.045,[.05,.018,.03,.04][beat%4]*(full?1:.7),t);
    if(beat===4||beat===12)this.drum(84,52,.3,full?.2:.13,t);
    else if(beat===0||beat===8)this.drum(98,74,.09,.07,t);
    if(full&&[0,3,6,10,12,15].includes(beat))this.shake(2900,.03,.035,t);
    if(beat===0||beat===10)this.note(hz(chord[0]+(beat?7:0)),.42,full?.11:.07,'sine',t);
    if(full){
      const figure=[0,3,6,8,11,14].indexOf(beat);
      if(figure>=0)this.note(hz(chord[1+(figure+bar)%4]),.32,.045,'triangle',t);
    }
  }
}
