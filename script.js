(function(){
  const wrap = document.getElementById('bm-wrap');
  const mc = document.getElementById('bm-canvas');
  const pc = document.getElementById('bm-p-canvas');
  const mCtx = mc.getContext('2d');
  const pCtx = pc.getContext('2d');
  let W, H;

  function resizeCanvas() {
    W = wrap.offsetWidth;
    H = window.innerHeight;

    mc.width = pc.width = W;
    mc.height = pc.height = H;
}

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  mc.width = pc.width = W;
  mc.height = pc.height = H;

  const chars = "HAPPYBIRTHDAYAMRITA1234567890@#$%&*".split("");
  const fs = 16;
  const cols = Math.floor(W / fs);
  const drops = Array(cols).fill(0).map(() => Math.random() * -50);

  const messages = ["3","2","1","HAPPY","BIRTHDAY","TO MY","AMRITA"];
  let msgIdx = 0;
  let particles = [];
  let stage = 'matrix';
  let settling = false;
  let settledFrames = 0;

  const magentaPalette = ["#FF1493","#FF69B4","#FF00FF","#FF00CC","#FF33AA","#FF66CC","#CC0066","#EE00AA"];

  function randMagenta(){ return magentaPalette[Math.floor(Math.random()*magentaPalette.length)]; }

  function drawMatrix(){
    mCtx.fillStyle = "rgba(0,0,0,0.055)";
    mCtx.fillRect(0,0,W,H);
    for(let i=0;i<drops.length;i++){
      const c = chars[Math.floor(Math.random()*chars.length)];
      const bright = Math.random() > 0.92;
      mCtx.fillStyle = bright ? "#FF99CC" : randMagenta();
      mCtx.font = fs+"px 'Courier New'";
      mCtx.fillText(c, i*fs, drops[i]*fs);
      if(drops[i]*fs > H && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 0.6;
    }
  }

  class Particle {
    constructor(x,y,color){
      this.x = Math.random()*W;
      this.y = Math.random()*H;
      this.tx = x; this.ty = y;
      this.color = color;
      this.size = Math.random()*1.5+1;
      this.ease = 0.08 + Math.random()*0.06;
      this.vx = (Math.random()-0.5)*6;
      this.vy = (Math.random()-0.5)*6;
      this.settled = false;
    }
    update(){
      this.x += (this.tx - this.x)*this.ease;
      this.y += (this.ty - this.y)*this.ease;
      const dx = this.tx-this.x, dy = this.ty-this.y;
      this.settled = Math.abs(dx)<1 && Math.abs(dy)<1;
    }
    draw(ctx){
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
      ctx.fill();
    }
  }

  function buildParticles(text){
    particles = [];
    settling = false; settledFrames = 0;
    const tmp = document.createElement('canvas');
    tmp.width = W; tmp.height = H;
    const tCtx = tmp.getContext('2d');
    const fsize = Math.min(W*0.22, 110);
    tCtx.fillStyle = '#fff';
    tCtx.font = `900 ${fsize}px Arial Black, Arial`;
    tCtx.textAlign = 'center';
    tCtx.textBaseline = 'middle';
    tCtx.fillText(text, W/2, H/2);
    const data = tCtx.getImageData(0,0,W,H).data;
    const step = text.length > 4 ? 5 : 4;
    for(let y=0;y<H;y+=step){
      for(let x=0;x<W;x+=step){
        const i=(y*W+x)*4;
        if(data[i+3]>120){
          const glitch = Math.random()>0.85;
          const col = glitch ? (Math.random()>0.5?"#FF00FF":"#FF99DD") : randMagenta();
          particles.push(new Particle(x,y,col));
        }
      }
    }
  }

  let frameCount = 0;
  function loop(){
    drawMatrix();
    pCtx.clearRect(0,0,W,H);

    if(stage === 'particles'){
      let allSettled = true;
      particles.forEach(p=>{
        p.update();
        p.draw(pCtx);
        if(!p.settled) allSettled = false;
      });
      if(allSettled){ settledFrames++; }
      if(settledFrames > 40){
        settling = true; settledFrames = 0;
        if(msgIdx < messages.length){
          buildParticles(messages[msgIdx++]);
        } else {
          stage = 'done';
          setTimeout(showPolaroid, 600);
        }
      }
    }
    frameCount++;
    requestAnimationFrame(loop);
  }

  function showPolaroid(){
    particles = [];
    pCtx.clearRect(0,0,W,H);
    document.getElementById('bm-polaroid').classList.add('show');
  }

  setTimeout(()=>{
    stage = 'particles';
    buildParticles(messages[msgIdx++]);
  }, 2000);

  loop();
  // Button click
const btn = document.getElementById("loveBtn");
const letterBox = document.getElementById("letterBox");
const letterText = document.getElementById("letterText");

const message = `Happy Birthday 🥳<br><br>
Dear Amrita 🥰<br>
You mean a lot to me... truly. 💖<br>
I wish you endless happiness,<br> 
success in everything you do,<br>
and all your dreams turning into reality. ✨<br>
Stay the same beautiful person you are,<br> 
always smiling. 🌸<br><br>
Yours lovingly,<br>
Nishanth 💫`;

const gif = document.querySelector("#bm-polaroid img");

btn.addEventListener("click", () => {
  gif.style.display = "none";
  btn.style.display = "none";

  // show empty letter frame first
  letterBox.classList.add("show");

  // start typing AFTER frame appears
  setTimeout(() => {
  typeLetter();
  startHearts();
}, 600);
});

// typing effect
function typeLetter() {
  let i = 0;
  letterText.innerHTML = "";

  function typing() {
    if (i < message.length) {

      // if tag starts
      if (message[i] === "<") {
        let tag = "";

        // collect full tag like <br>
        while (message[i] !== ">") {
          tag += message[i];
          i++;
        }
        tag += ">";
        i++;

        letterText.innerHTML += tag; // add full tag at once
      } else {
        letterText.innerHTML += message[i];
        i++;
      }

      setTimeout(typing, 30);
    }
  }

  typing();
}

// floating hearts
function startHearts() {
  setInterval(() => {
    const heart = document.createElement("div");
    heart.innerHTML = "💖";
    heart.style.position = "absolute";
    heart.style.left = Math.random() * 100 + "%";
    heart.style.top = "100%";
    heart.style.fontSize = "14px";
    heart.style.opacity = "0.7";
    heart.style.transition = "all 3s linear";

    letterBox.appendChild(heart);

    setTimeout(() => {
      heart.style.top = "-10%";
      heart.style.opacity = "0";
    }, 50);

    setTimeout(() => {
      heart.remove();
    }, 3000);

  }, 400);
}
})();
