import './style.css';

// ==========================================
// 🔊 RETRO SYNTH AUDIO ENGINE (Web Audio API)
// ==========================================
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.bgmInterval = null;
    this.tempo = 110;
    this.beatCount = 0;
  }

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.startBGM();
  }

  startBGM() {
    if (this.muted || !this.ctx) return;
    this.stopBGM();

    const playBeat = () => {
      if (this.muted || !this.ctx) return;
      const t = this.ctx.currentTime;
      
      // Simple retro synth bassline
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      
      // Cyberpunk arpeggio bassline in E minor
      const notes = [41.20, 41.20, 48.99, 41.20, 55.00, 41.20, 48.99, 41.20]; // E1, E1, G1, E1, A1, E1, G1, E1
      const note = notes[this.beatCount % notes.length];
      
      osc.frequency.setValueAtTime(note, t);
      
      // Pulse kick on beat 0 and 4
      if (this.beatCount % 4 === 0) {
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.frequency.setValueAtTime(150, t);
        kickOsc.frequency.exponentialRampToValueAtTime(0.01, t + 0.15);
        kickGain.gain.setValueAtTime(0.6, t);
        kickGain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
        kickOsc.connect(kickGain);
        kickGain.connect(this.ctx.destination);
        kickOsc.start(t);
        kickOsc.stop(t + 0.15);
        
        // Add a tiny hi-hat noise on kicks
        const hatNode = this.ctx.createBufferSource();
        const bufferSize = this.ctx.sampleRate * 0.03;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        hatNode.buffer = buffer;
        const hatGain = this.ctx.createGain();
        hatGain.gain.setValueAtTime(0.08, t);
        hatGain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
        hatNode.connect(hatGain);
        hatGain.connect(this.ctx.destination);
        hatNode.start(t);
        hatNode.stop(t + 0.03);
      }

      // Bass notes styling
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(t);
      osc.stop(t + 0.28);
      
      this.beatCount++;
    };

    // Run interval based on tempo
    const intervalMs = (60 / this.tempo) * 500; // Eighth notes
    this.bgmInterval = setInterval(playBeat, intervalMs);
  }

  stopBGM() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  setTempoForWave(wave) {
    // Speed up background music as waves advance to increase tension!
    this.tempo = 110 + Math.min(wave * 8, 80);
    if (this.bgmInterval && !this.muted) {
      this.startBGM();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      this.stopBGM();
    } else {
      if (this.ctx) {
        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        this.startBGM();
      }
    }
    return this.muted;
  }

  playPunch() {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime;
    
    // Short noise-like low-end thump
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.08);
    
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.09);
  }

  playHit() {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime;
    
    // Snappy mid-range smack
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.12);
    
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.13);
  }

  playKO() {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime;
    
    // Retro success coin-like arpeggio (C5 -> E5 -> G5)
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t + index * 0.06);
      
      gain.gain.setValueAtTime(0.1, t + index * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + index * 0.06 + 0.15);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + index * 0.06);
      osc.stop(t + index * 0.06 + 0.16);
    });
  }

  playSpinKick() {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime;
    
    // High-pitched laser sweep swoosh
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(1200, t + 0.25);
    
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.26);
  }

  playPickUp() {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime;
    
    // Ascending warm tone
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(450, t + 0.1);
    
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  playThrow() {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime;
    
    // Whipping descending pitch swoosh
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.2);
    
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  playAlert() {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime;
    
    // Harsh dual tone warning alarm
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc1.type = 'sawtooth';
    osc2.type = 'square';
    osc1.frequency.setValueAtTime(320, t);
    osc2.frequency.setValueAtTime(325, t);
    
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.35);
    osc2.stop(t + 0.35);
  }

  playGameOver() {
    this.stopBGM();
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime;
    
    // Melancholy descending synth chords
    const chord = [220, 165, 130]; // A Minor-ish triad
    chord.forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.linearRampToValueAtTime(freq - 40, t + 1.2);
      
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 1.2);
    });
  }
}

const audio = new SoundEngine();

// ==========================================
// 🎮 GAME INITIALIZATION & CONFIGURATION
// ==========================================
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const DIFFICULTY_CONFIGS = {
  easy: {
    objectCount: 16,
    grabSlowdown: 0.18, // 18% speed penalty per kindergartener
    spawnSpeed: 2.0,    // Base speed of kids
    hpMultiplier: 0.8,
    waveInterval: 30.0,
    spawnCount: 5,
  },
  medium: {
    objectCount: 8,
    grabSlowdown: 0.25, // 25% speed penalty per kindergartener
    spawnSpeed: 2.4,
    hpMultiplier: 1.0,
    waveInterval: 23.0,
    spawnCount: 6,
  },
  hard: {
    objectCount: 0,     // Absolutely empty classroom!
    grabSlowdown: 0.33, // 33% speed penalty per kindergartener (3 kids fully immobolizes!)
    spawnSpeed: 2.8,
    hpMultiplier: 1.2,
    waveInterval: 16.0,
    spawnCount: 7,
  }
};

// Physics Constraints (Classroom is 40 x 25 feet, canvas is 1000 x 625, scaling 1 foot = 25px)
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 625;
const PLAYER_RADIUS = 28;
const KID_RADIUS = 20;

// Doors (4 spawn doors around classroom walls)
const SPAWN_DOORS = [
  { x: 30, y: 0, w: 70, h: 10, align: 'top' }, // Top left door
  { x: CANVAS_WIDTH - 100, y: 0, w: 70, h: 10, align: 'top' }, // Top right door
  { x: 30, y: CANVAS_HEIGHT - 10, w: 70, h: 10, align: 'bottom' }, // Bottom left door
  { x: CANVAS_WIDTH - 100, y: CANVAS_HEIGHT - 10, w: 70, h: 10, align: 'bottom' } // Bottom right door
];

// Game State variables
let gameState = 'START_SCREEN'; // START_SCREEN, PLAYING, GAME_OVER
let selectedDifficulty = 'medium';
let gameTime = 0;
let wave = 1;
let waveTimer = 30.0;
let kos = 0;
let pinSeconds = 0.0; // Cumulative consecutive pinned seconds (max 15s)
let cameraShake = { x: 0, y: 0, intensity: 0, decay: 0.9 };

// Input states
const keys = {
  w: false, a: false, s: false, d: false,
  ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false,
  Space: false,
  e: false, f: false,
  Shift: false
};

// Entity Arrays
let player = null;
let enemies = [];
let objects = [];
let particles = [];
let floatingTexts = [];

// Screen elements cache
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const pinnedAlert = document.getElementById('pinned-alert');
const pinnedCountdown = document.getElementById('pinned-countdown');
const alertProgressFill = document.getElementById('alert-progress-fill');
const cdSpinBar = document.getElementById('cd-spin-bar');
const heldObjectText = document.getElementById('held-object-text');
const btnSoundToggle = document.getElementById('btn-sound-toggle');

// ==========================================
// 🛠️ HELPERS & MATH UTIL
// ==========================================
function randRange(min, max) {
  return Math.random() * (max - min) + min;
}

function getDistance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

// Spark Particle Class
class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = randRange(-6, 6);
    this.vy = randRange(-6, 6);
    this.radius = randRange(2, 6);
    this.alpha = 1;
    this.color = color;
    this.decay = randRange(0.015, 0.035);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.96;
    this.vy *= 0.96;
    this.alpha -= this.decay;
  }

  draw(c) {
    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.shadowBlur = 10;
    c.shadowColor = this.color;
    c.fill();
    c.restore();
  }
}

// Floating Damage/KO Indicators
class FloatingText {
  constructor(x, y, text, color, isArcade = false) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.vy = randRange(-1.5, -2.5);
    this.alpha = 1.0;
    this.isArcade = isArcade;
  }

  update() {
    this.y += this.vy;
    this.alpha -= 0.02;
  }

  draw(c) {
    c.save();
    c.globalAlpha = this.alpha;
    c.fillStyle = this.color;
    if (this.isArcade) {
      c.font = "bold 14px 'Press Start 2P'";
      c.shadowBlur = 6;
      c.shadowColor = this.color;
    } else {
      c.font = "bold 16px 'Outfit'";
    }
    c.textAlign = 'center';
    c.fillText(this.text, this.x, this.y);
    c.restore();
  }
}

// Classroom Desk or Chair Entity
class ClassroomObject {
  constructor(x, y, type = 'DESK') {
    this.x = x;
    this.y = y;
    this.type = type; // DESK (rect 90x45) or CHAIR (rect 40x40)
    this.width = type === 'DESK' ? 84 : 42;
    this.height = type === 'DESK' ? 44 : 42;
    this.vx = 0;
    this.vy = 0;
    this.friction = 0.94;
    this.state = 'STATIC'; // STATIC, HELD, THROWN, SLIDING
    this.durability = type === 'DESK' ? 4 : 2; // Hits before breaking
    this.maxDurability = this.durability;
    this.throwDamage = type === 'DESK' ? 100 : 60;
  }

  update() {
    if (this.state === 'THROWN' || this.state === 'SLIDING') {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= this.friction;
      this.vy *= this.friction;

      // Class boundaries collision
      if (this.x < this.width/2) {
        this.x = this.width/2;
        this.vx *= -0.5;
        this.onWallHit();
      }
      if (this.x > CANVAS_WIDTH - this.width/2) {
        this.x = CANVAS_WIDTH - this.width/2;
        this.vx *= -0.5;
        this.onWallHit();
      }
      if (this.y < this.height/2) {
        this.y = this.height/2;
        this.vy *= -0.5;
        this.onWallHit();
      }
      if (this.y > CANVAS_HEIGHT - this.height/2) {
        this.y = CANVAS_HEIGHT - this.height/2;
        this.vy *= -0.5;
        this.onWallHit();
      }

      const velocityMagnitude = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (this.state === 'THROWN' && velocityMagnitude < 3.5) {
        this.state = 'SLIDING';
      }
      if (this.state === 'SLIDING' && velocityMagnitude < 0.1) {
        this.state = 'STATIC';
        this.vx = 0;
        this.vy = 0;
      }
    }
  }

  onWallHit() {
    audio.playHit();
    triggerScreenShake(4);
    // Lose durability on hard wall bounces
    if (this.state === 'THROWN') {
      this.takeDamage();
    }
  }

  takeDamage() {
    this.durability--;
    // Emit wood splinter particles
    spawnSparks(this.x, this.y, '#e5ba73', 8);
    
    if (this.durability <= 0) {
      floatingTexts.push(new FloatingText(this.x, this.y, 'BROKEN', '#ff3366', true));
      return true; // Indicate deletion
    }
    return false;
  }

  draw(c) {
    if (this.state === 'HELD') return; // Rendered relative to player instead

    c.save();
    c.translate(this.x, this.y);
    
    // Subtle shadow
    c.shadowColor = 'rgba(0, 0, 0, 0.4)';
    c.shadowBlur = 8;
    c.shadowOffsetY = 4;

    // Glowing Neon borders indicating item state
    let strokeColor = 'rgba(0, 243, 255, 0.3)';
    if (this.state === 'THROWN') strokeColor = 'rgba(255, 170, 0, 0.8)';
    if (this.durability === 1) strokeColor = 'rgba(255, 0, 85, 0.5)';

    // Fill
    c.fillStyle = 'rgba(18, 25, 38, 0.9)';
    c.strokeStyle = strokeColor;
    c.lineWidth = this.state === 'THROWN' ? 3 : 2;

    // Rounded rectangle draw
    c.beginPath();
    const rx = -this.width/2;
    const ry = -this.height/2;
    c.roundRect(rx, ry, this.width, this.height, 4);
    c.fill();
    c.stroke();

    // Secondary line to show desktop design / grid
    c.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    c.beginPath();
    c.moveTo(-this.width/2 + 6, -this.height/2 + 6);
    c.lineTo(this.width/2 - 6, -this.height/2 + 6);
    c.stroke();

    // Render tiny glowing durability notches
    c.fillStyle = 'rgba(255, 255, 255, 0.15)';
    for (let i = 0; i < this.maxDurability; i++) {
      if (i < this.durability) {
        c.fillStyle = this.durability === 1 ? varColor('neon-red') : varColor('neon-blue');
      } else {
        c.fillStyle = 'rgba(255, 255, 255, 0.05)';
      }
      c.fillRect(-this.width/2 + 10 + i * 8, this.height/2 - 8, 5, 3);
    }

    c.restore();
  }
}

function varColor(variable) {
  if (variable === 'neon-blue') return '#00f3ff';
  if (variable === 'neon-red') return '#ff0055';
  if (variable === 'neon-green') return '#39ff14';
  if (variable === 'neon-orange') return '#ffaa00';
  return '#ffffff';
}

// ==========================================
// 🦸 PLAYER PLAYER CLASS
// ==========================================
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.baseSpeed = 4.2;
    this.facingAngle = 0;
    
    // Combat
    this.stamina = 100;
    this.maxStamina = 100;
    this.attackCooldown = 0; // Cooldown frames for basic punch
    this.strikeTime = 0; // Animation frame timer for visual strike sweep
    this.spinCooldown = 0; // Cooldown for spin kick (frames)
    this.isSpinning = false;
    this.spinAnimTime = 0;
    
    this.heldObject = null; // Stores carrying ClassroomObject
    this.trail = [];
  }

  update(config, dt) {
    // 1. Calculate grappling speed multiplier
    const grappleCount = getGrapplingCount();
    const penalty = config.grabSlowdown;
    const currentSpeed = Math.max(0, this.baseSpeed * (1.0 - grappleCount * penalty));

    // Regenerate stamina (25 per second)
    this.stamina = Math.min(this.maxStamina, this.stamina + 25 * dt);

    // Disable control if completely pinned (3+ grabbers in Hard/Medium generally stops you)
    let moveX = 0;
    let moveY = 0;

    if (currentSpeed > 0) {
      if (keys.w || keys.ArrowUp) moveY -= 1;
      if (keys.s || keys.ArrowDown) moveY += 1;
      if (keys.a || keys.ArrowLeft) moveX -= 1;
      if (keys.d || keys.ArrowRight) moveX += 1;
    }

    // Normalize diagonal vectors
    if (moveX !== 0 && moveY !== 0) {
      const length = Math.sqrt(moveX * moveX + moveY * moveY);
      moveX /= length;
      moveY /= length;
    }

    this.vx = moveX * currentSpeed;
    this.vy = moveY * currentSpeed;

    // Shift speed reduction if carrying an object
    if (this.heldObject) {
      this.vx *= 0.75;
      this.vy *= 0.75;
    }

    // Update positions
    this.x += this.vx;
    this.y += this.vy;

    // Track direction facing based on movement direction
    if (moveX !== 0 || moveY !== 0) {
      this.facingAngle = Math.atan2(moveY, moveX);
    }

    // Boundary containment
    if (this.x < PLAYER_RADIUS) this.x = PLAYER_RADIUS;
    if (this.x > CANVAS_WIDTH - PLAYER_RADIUS) this.x = CANVAS_WIDTH - PLAYER_RADIUS;
    if (this.y < PLAYER_RADIUS) this.y = PLAYER_RADIUS;
    if (this.y > CANVAS_HEIGHT - PLAYER_RADIUS) this.y = CANVAS_HEIGHT - PLAYER_RADIUS;

    // Carry object position updates (placed right in front of the player)
    if (this.heldObject) {
      const offsetDistance = 25;
      this.heldObject.x = this.x + Math.cos(this.facingAngle) * offsetDistance;
      this.heldObject.y = this.y + Math.sin(this.facingAngle) * offsetDistance;
    }

    // Trail particles tracking (only when moving fast)
    if (Math.abs(this.vx) > 0.5 || Math.abs(this.vy) > 0.5) {
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > 8) this.trail.shift();
    } else {
      if (this.trail.length > 0) this.trail.shift();
    }

    // Process cooldowns
    if (this.attackCooldown > 0) this.attackCooldown--;
    if (this.strikeTime > 0) this.strikeTime--;
    if (this.spinCooldown > 0) {
      this.spinCooldown--;
      // Keep UI cooldown bar updated
      const pct = (this.spinCooldown / (8 * 60)) * 100;
      cdSpinBar.style.width = `${100 - pct}%`;
    }
    if (this.isSpinning) {
      this.spinAnimTime--;
      if (this.spinAnimTime <= 0) {
        this.isSpinning = false;
      }
    }

    // Update carried object string display
    if (this.heldObject) {
      heldObjectText.innerText = `HOLDING: ${this.heldObject.type}`;
      heldObjectText.style.color = varColor('neon-orange');
    } else {
      heldObjectText.innerText = 'EMPTY HANDS';
      heldObjectText.style.color = '#ccd6f6';
    }
  }

  punch() {
    if (this.attackCooldown > 0 || this.isSpinning) return;
    
    // Check stamina (cost: 12)
    const punchCost = 12;
    const hasStamina = this.stamina >= punchCost;
    
    if (hasStamina) {
      this.stamina -= punchCost;
      this.attackCooldown = 20; // 20 frames cooldown (~0.33s)
    } else {
      // Out of stamina: slow down attack and halve damage
      this.attackCooldown = 42; // ~0.7s cooldown
      floatingTexts.push(new FloatingText(this.x, this.y - 30, 'EXHAUSTED', '#ff0055'));
    }
    
    this.strikeTime = 8; // Punch arc drawn for 8 frames
    audio.playPunch();

    // Damage area check (frontal arc of 100 degrees, radius 75px)
    const punchReach = 85;
    const minAngle = this.facingAngle - 1.0; // ~57 degrees
    const maxAngle = this.facingAngle + 1.0;

    let hitRegistered = false;
    const damage = hasStamina ? 34 : 17; // half damage if exhausted

    enemies.forEach((enemy) => {
      if (enemy.state === 'GRAPPLING') {
        // Can always hit enemies that are grappling onto you
        enemy.takeDamage(damage);
        hitRegistered = true;
      } else {
        const dist = getDistance(this.x, this.y, enemy.x, enemy.y);
        if (dist <= punchReach + KID_RADIUS) {
          const angleToEnemy = Math.atan2(enemy.y - this.y, enemy.x - this.x);
          // Angle wrapping check
          let angleDiff = angleToEnemy - this.facingAngle;
          while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
          while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;

          if (Math.abs(angleDiff) <= 1.0) {
            // Register Hit!
            const knockbackPower = hasStamina ? 6.5 : 3.0; // weaker knockback if exhausted
            enemy.takeDamage(damage, Math.cos(angleToEnemy) * knockbackPower, Math.sin(angleToEnemy) * knockbackPower);
            hitRegistered = true;
          }
        }
      }
    });

    if (hitRegistered) {
      triggerScreenShake(3);
    }
  }

  spinKick() {
    if (this.spinCooldown > 0) return;
    
    this.spinCooldown = 8 * 60; // 8 seconds at 60fps
    this.isSpinning = true;
    this.spinAnimTime = 18; // animation duration
    
    audio.playSpinKick();
    triggerScreenShake(8);

    // Shockwave radial area (160px radius, deals 50 damage and knocks back)
    const kickRadius = 160;
    enemies.forEach((enemy) => {
      const dist = getDistance(this.x, this.y, enemy.x, enemy.y);
      if (dist <= kickRadius + KID_RADIUS || enemy.state === 'GRAPPLING') {
        // High push vector outward
        const angle = Math.atan2(enemy.y - this.y, enemy.x - this.x);
        const pushPower = 18.0; // Giant knockback
        
        enemy.takeDamage(50, Math.cos(angle) * pushPower, Math.sin(angle) * pushPower);
        if (enemy.state === 'GRAPPLING') {
          enemy.state = 'CHASING';
        }
      }
    });

    // Throw back any slide objects nearby too
    objects.forEach((obj) => {
      const dist = getDistance(this.x, this.y, obj.x, obj.y);
      if (dist <= kickRadius) {
        const angle = Math.atan2(obj.y - this.y, obj.x - this.x);
        obj.state = 'THROWN';
        obj.vx = Math.cos(angle) * 14.0;
        obj.vy = Math.sin(angle) * 14.0;
      }
    });
  }

  interactObject() {
    // E / F pressed
    if (this.heldObject) {
      // Throw the object!
      audio.playThrow();
      const throwForce = 16.0;
      
      const obj = this.heldObject;
      obj.state = 'THROWN';
      obj.vx = Math.cos(this.facingAngle) * throwForce;
      obj.vy = Math.sin(this.facingAngle) * throwForce;
      
      this.heldObject = null;
    } else {
      // Find closest static object within pick-up reach (60px from boundaries)
      let closest = null;
      let closestDist = 70;

      objects.forEach((obj) => {
        if (obj.state === 'STATIC' || obj.state === 'SLIDING') {
          const dist = getDistance(this.x, this.y, obj.x, obj.y);
          if (dist < closestDist) {
            closestDist = dist;
            closest = obj;
          }
        }
      });

      if (closest) {
        audio.playPickUp();
        closest.state = 'HELD';
        this.heldObject = closest;
      }
    }
  }

  draw(c) {
    // Draw running trail
    c.save();
    this.trail.forEach((pos, index) => {
      c.beginPath();
      c.arc(pos.x, pos.y, PLAYER_RADIUS - 3, 0, Math.PI * 2);
      c.fillStyle = `rgba(0, 243, 255, ${0.05 * (index / this.trail.length)})`;
      c.fill();
    });
    c.restore();

    c.save();
    c.translate(this.x, this.y);

    // Glowing aura base
    c.shadowColor = varColor('neon-blue');
    c.shadowBlur = this.isSpinning ? 30 : 12;

    // Body base outline
    c.fillStyle = this.isSpinning ? 'rgba(0, 243, 255, 0.3)' : 'rgba(2, 6, 12, 0.9)';
    c.strokeStyle = varColor('neon-blue');
    c.lineWidth = 3;
    c.beginPath();
    c.arc(0, 0, PLAYER_RADIUS, 0, Math.PI * 2);
    c.fill();
    c.stroke();

    // Dynamic player eye detailing
    c.save();
    c.rotate(this.facingAngle);
    
    // Draw neon goggles
    c.fillStyle = '#fff';
    c.shadowColor = varColor('neon-blue');
    c.shadowBlur = 8;
    c.fillRect(8, -14, 6, 8);
    c.fillRect(8, 6, 6, 8);
    c.strokeStyle = varColor('neon-blue');
    c.strokeRect(8, -14, 6, 8);
    c.strokeRect(8, 6, 6, 8);
    c.restore();

    // Draw visual punch arc if striking
    if (this.strikeTime > 0) {
      c.save();
      c.rotate(this.facingAngle);
      c.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      c.shadowColor = '#fff';
      c.shadowBlur = 10;
      c.lineWidth = 4;
      c.beginPath();
      // Draw arc indicating punch direction
      c.arc(0, 0, 52, -1.0, 1.0);
      c.stroke();
      c.restore();
    }

    // Draw spin kick shockwave if spinning
    if (this.isSpinning) {
      c.save();
      c.strokeStyle = 'rgba(0, 243, 255, 0.6)';
      c.shadowColor = varColor('neon-blue');
      c.shadowBlur = 20;
      c.lineWidth = 5;
      c.beginPath();
      // Expanding circle
      const scale = (18 - this.spinAnimTime) / 18;
      c.arc(0, 0, 45 + scale * 110, 0, Math.PI * 2);
      c.stroke();
      c.restore();
    }

    // Draw stamina bar beneath the player
    c.fillStyle = 'rgba(0, 0, 0, 0.6)';
    c.fillRect(-20, PLAYER_RADIUS + 8, 40, 4);
    
    // Glowing yellow stamina bar
    c.fillStyle = this.stamina < 12 ? varColor('neon-red') : '#ffd700';
    const staminaWidth = (this.stamina / this.maxStamina) * 40;
    c.fillRect(-20, PLAYER_RADIUS + 8, Math.max(0, staminaWidth), 4);

    c.restore();

    // Render picked up object physically in front of player
    if (this.heldObject) {
      c.save();
      c.translate(this.heldObject.x, this.heldObject.y);
      c.rotate(this.facingAngle);
      
      c.fillStyle = 'rgba(18, 25, 38, 0.95)';
      c.strokeStyle = varColor('neon-orange');
      c.lineWidth = 2.5;
      
      c.beginPath();
      c.roundRect(-this.heldObject.width/2, -this.heldObject.height/2, this.heldObject.width, this.heldObject.height, 4);
      c.fill();
      c.stroke();

      // Render carried glow
      c.shadowBlur = 8;
      c.shadowColor = varColor('neon-orange');
      c.restore();
    }
  }
}

// ==========================================
// 👶 KINDERGARTENER AI CLASS
// ==========================================
class Kindergartener {
  constructor(x, y, speed, hp) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.baseSpeed = speed + randRange(-0.3, 0.3); // Slight speed variance
    this.hp = hp;
    this.maxHp = hp;
    
    this.state = 'CHASING'; // CHASING, GRAPPLING
    
    // Offset details when grappling onto player (makes dog-pile visual look messy and realistic)
    this.grabAngle = 0;
    this.grabOffsetDist = randRange(15, 25);
    this.grabRotation = randRange(-1.5, 1.5);
    
    this.angryPulse = randRange(0, Math.PI * 2);
  }

  update() {
    this.angryPulse += 0.08;

    if (this.state === 'CHASING') {
      // Simple chasing pathfinding towards the player
      const angle = Math.atan2(player.y - this.y, player.x - this.x);
      
      // Basic movement vector
      this.vx = Math.cos(angle) * this.baseSpeed;
      this.vy = Math.sin(angle) * this.baseSpeed;

      // Desks/Chairs physical avoidance
      objects.forEach((obj) => {
        if (obj.state === 'STATIC') {
          // Circle vs AABB bounding box collision avoidance push
          const boxLeft = obj.x - obj.width/2;
          const boxRight = obj.x + obj.width/2;
          const boxTop = obj.y - obj.height/2;
          const boxBottom = obj.y + obj.height/2;

          // Closest point on box to circle
          const closestX = Math.max(boxLeft, Math.min(this.x, boxRight));
          const closestY = Math.max(boxTop, Math.min(this.y, boxBottom));

          const dist = getDistance(this.x, this.y, closestX, closestY);
          if (dist < KID_RADIUS + 4) {
            // Push away from obstacle
            const pushAngle = Math.atan2(this.y - closestY, this.x - closestX);
            this.vx += Math.cos(pushAngle) * 1.5;
            this.vy += Math.sin(pushAngle) * 1.5;
          }
        }
      });

      // Update positions
      this.x += this.vx;
      this.y += this.vy;

      // Handle transition to grappling if colliding with player
      const distToPlayer = getDistance(this.x, this.y, player.x, player.y);
      if (distToPlayer <= PLAYER_RADIUS + KID_RADIUS - 6) {
        this.state = 'GRAPPLING';
        this.grabAngle = Math.atan2(this.y - player.y, this.x - player.x);
        
        // Push floating warning alert
        audio.playHit();
      }
    } else if (this.state === 'GRAPPLING') {
      // Lock position onto player's circle bounding shell with random offset
      this.x = player.x + Math.cos(this.grabAngle) * this.grabOffsetDist;
      this.y = player.y + Math.sin(this.grabAngle) * this.grabOffsetDist;
      
      // Slowly damage or bite player (cosmetic, but triggers alert beep)
      if (Math.random() < 0.003) {
        audio.playAlert();
      }
    }

    // Keep within walls
    if (this.x < KID_RADIUS) this.x = KID_RADIUS;
    if (this.x > CANVAS_WIDTH - KID_RADIUS) this.x = CANVAS_WIDTH - KID_RADIUS;
    if (this.y < KID_RADIUS) this.y = KID_RADIUS;
    if (this.y > CANVAS_HEIGHT - KID_RADIUS) this.y = CANVAS_HEIGHT - KID_RADIUS;
  }

  takeDamage(amount, knockX = 0, knockY = 0) {
    this.hp -= amount;
    
    // Spawn red blood/spark particles
    spawnSparks(this.x, this.y, varColor('neon-red'), 12);
    
    // Generate text pop-up
    floatingTexts.push(new FloatingText(this.x, this.y, `-${amount}`, '#ff3366'));

    // Apply knockback and detach if grappling
    if (this.state === 'GRAPPLING') {
      this.state = 'CHASING';
      // Detached push back
      this.x += Math.cos(this.grabAngle) * 20;
      this.y += Math.sin(this.grabAngle) * 20;
    }

    this.x += knockX;
    this.y += knockY;

    if (this.hp <= 0) {
      this.die();
    }
  }

  die() {
    kos++;
    audio.playKO();
    triggerScreenShake(5);
    
    // Giant spark explosion
    spawnSparks(this.x, this.y, varColor('neon-orange'), 20);
    spawnSparks(this.x, this.y, '#ffffff', 8);

    floatingTexts.push(new FloatingText(this.x, this.y, 'KO!', varColor('neon-green'), true));
    
    // Remove from array
    enemies = enemies.filter(e => e !== this);
  }

  draw(c) {
    c.save();
    c.translate(this.x, this.y);

    // Glowing red outlines for aggression
    const glowScale = Math.sin(this.angryPulse) * 4 + 6;
    c.shadowColor = varColor('neon-red');
    c.shadowBlur = this.state === 'GRAPPLING' ? 14 : glowScale;

    // Body fill (small glowing red spherical shape)
    c.fillStyle = this.state === 'GRAPPLING' ? 'rgba(255, 0, 85, 0.45)' : 'rgba(120, 10, 20, 0.95)';
    c.strokeStyle = varColor('neon-red');
    c.lineWidth = 2.5;

    c.beginPath();
    c.arc(0, 0, KID_RADIUS, 0, Math.PI * 2);
    c.fill();
    c.stroke();

    // Angry eyes
    c.fillStyle = '#ffffff';
    c.beginPath();
    c.arc(-6, -3, 3, 0, Math.PI * 2);
    c.arc(6, -3, 3, 0, Math.PI * 2);
    c.fill();

    // Glowing red Pupils
    c.fillStyle = '#ff0000';
    c.beginPath();
    c.arc(-6, -3, 1, 0, Math.PI * 2);
    c.arc(6, -3, 1, 0, Math.PI * 2);
    c.fill();

    // Angry brows
    c.strokeStyle = '#000';
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(-11, -8);
    c.lineTo(-3, -5);
    c.moveTo(11, -8);
    c.lineTo(3, -5);
    c.stroke();

    // Health Bar underneath if damaged
    if (this.hp < this.maxHp) {
      c.fillStyle = 'rgba(0, 0, 0, 0.6)';
      c.fillRect(-18, -26, 36, 4);
      c.fillStyle = varColor('neon-green');
      const hpWidth = (this.hp / this.maxHp) * 36;
      c.fillRect(-18, -26, Math.max(0, hpWidth), 4);
    }

    c.restore();
  }
}

// Get the count of enemies currently grappling the player
function getGrapplingCount() {
  let count = 0;
  enemies.forEach((enemy) => {
    if (enemy.state === 'GRAPPLING') count++;
  });
  return count;
}

// Spawn sparks / dynamic visual particle spray
function spawnSparks(x, y, color, count) {
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(x, y, color));
  }
}

// Trigger viewport camera shake
function triggerScreenShake(power) {
  cameraShake.intensity = Math.max(cameraShake.intensity, power);
}

// ==========================================
// 🚀 WAVE & DIFFICULTY MANAGEMENTS
// ==========================================
function spawnWave() {
  const config = DIFFICULTY_CONFIGS[selectedDifficulty];
  const hpBase = 100 * config.hpMultiplier;
  
  // Wave difficulty scaling
  const speedScale = config.spawnSpeed + (wave * 0.1);
  const hpScale = (hpBase + (wave - 1) * 12) * (1.0 + (wave - 1) * 0.04);
 
  // Dynamic opponent count: add +1 kindergartener for every 2 waves survived
  const spawnCount = config.spawnCount + Math.floor((wave - 1) / 2);

  for (let i = 0; i < spawnCount; i++) {
    // Pick door randomly
    const door = SPAWN_DOORS[Math.floor(Math.random() * SPAWN_DOORS.length)];
    
    // Position inside the door
    let spawnX = door.x + door.w / 2;
    let spawnY = door.y + door.h / 2;
    
    if (door.align === 'top') {
      spawnY += 20; // nudge slightly forward
    } else {
      spawnY -= 20;
    }

    enemies.push(new Kindergartener(spawnX, spawnY, speedScale, hpScale));
    spawnSparks(spawnX, spawnY, varColor('neon-red'), 12);
  }

  floatingTexts.push(new FloatingText(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 80, `SWARM RELEASE! WAVE ${wave}`, varColor('neon-red'), true));
  triggerScreenShake(10);
  audio.playAlert();
  
  // Speed up bgm beats
  audio.setTempoForWave(wave);
}

function initClassroomObjects() {
  objects = [];
  const config = DIFFICULTY_CONFIGS[selectedDifficulty];
  
  if (config.objectCount === 0) return; // Empty classroom!

  // Scatter desks and chairs around the grid
  // Grid layout avoids overlapping desks and walls
  const rows = 4;
  const cols = 4;
  const spacingX = CANVAS_WIDTH / (cols + 1);
  const spacingY = CANVAS_HEIGHT / (rows + 1);

  let placedCount = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (placedCount >= config.objectCount) break;

      // Add variance
      const ox = (c + 1) * spacingX + randRange(-30, 30);
      const oy = (r + 1) * spacingY + randRange(-30, 30);

      // Do not place too close to center (player spawns there)
      if (getDistance(ox, oy, CANVAS_WIDTH/2, CANVAS_HEIGHT/2) < 130) continue;

      // Toggle Desk/Chair
      const type = Math.random() > 0.4 ? 'DESK' : 'CHAIR';
      objects.push(new ClassroomObject(ox, oy, type));
      placedCount++;
    }
  }
}

// ==========================================
// 🕹️ KEYBOARD INPUT LISTENERS
// ==========================================
window.addEventListener('keydown', (e) => {
  if (gameState !== 'PLAYING') return;

  const key = e.key;
  if (key === ' ' || key === 'Spacebar') {
    e.preventDefault();
    if (!keys.Space) {
      player.punch();
      keys.Space = true;
    }
  }
  
  if (key === 'Shift') {
    e.preventDefault();
    if (!keys.Shift) {
      player.spinKick();
      keys.Shift = true;
    }
  }

  if (key.toLowerCase() === 'e' || key.toLowerCase() === 'f') {
    if (!keys.e && !keys.f) {
      player.interactObject();
      keys.e = true;
      keys.f = true;
    }
  }

  if (e.key in keys) {
    keys[e.key] = true;
  }
  if (e.key.toLowerCase() === 'w') keys.w = true;
  if (e.key.toLowerCase() === 'a') keys.a = true;
  if (e.key.toLowerCase() === 's') keys.s = true;
  if (e.key.toLowerCase() === 'd') keys.d = true;
});

window.addEventListener('keyup', (e) => {
  if (e.key in keys) {
    keys[e.key] = false;
  }
  if (e.key === ' ' || e.key === 'Spacebar') keys.Space = false;
  if (e.key === 'Shift') keys.Shift = false;
  if (e.key.toLowerCase() === 'e') keys.e = false;
  if (e.key.toLowerCase() === 'f') keys.f = false;
  if (e.key.toLowerCase() === 'w') keys.w = false;
  if (e.key.toLowerCase() === 'a') keys.a = false;
  if (e.key.toLowerCase() === 's') keys.s = false;
  if (e.key.toLowerCase() === 'd') keys.d = false;
});

// ==========================================
// 🔄 PHYSICS COLLISION SYSTEMS
// ==========================================
function handleCollisions() {
  const config = DIFFICULTY_CONFIGS[selectedDifficulty];

  // 1. Static Object vs Player Collision
  objects.forEach((obj) => {
    if (obj.state === 'STATIC') {
      const boxLeft = obj.x - obj.width/2;
      const boxRight = obj.x + obj.width/2;
      const boxTop = obj.y - obj.height/2;
      const boxBottom = obj.y + obj.height/2;

      // Closest point on box to circle
      const closestX = Math.max(boxLeft, Math.min(player.x, boxRight));
      const closestY = Math.max(boxTop, Math.min(player.y, boxBottom));

      const dist = getDistance(player.x, player.y, closestX, closestY);
      if (dist < PLAYER_RADIUS) {
        // Simple slide push-back physics response
        const pushAngle = Math.atan2(player.y - closestY, player.x - closestX);
        const overlap = PLAYER_RADIUS - dist;
        player.x += Math.cos(pushAngle) * overlap;
        player.y += Math.sin(pushAngle) * overlap;
      }
    }
  });

  // 2. Thrown Object vs Enemy Collision
  objects.forEach((obj) => {
    if (obj.state === 'THROWN') {
      enemies.forEach((enemy) => {
        if (enemy.state !== 'GRAPPLING') {
          // AABB vs Circle
          const boxLeft = obj.x - obj.width/2;
          const boxRight = obj.x + obj.width/2;
          const boxTop = obj.y - obj.height/2;
          const boxBottom = obj.y + obj.height/2;

          const closestX = Math.max(boxLeft, Math.min(enemy.x, boxRight));
          const closestY = Math.max(boxTop, Math.min(enemy.y, boxBottom));

          const dist = getDistance(enemy.x, enemy.y, closestX, closestY);
          if (dist < KID_RADIUS) {
            // Hit Enemy!
            const hitAngle = Math.atan2(enemy.y - obj.y, enemy.x - obj.x);
            enemy.takeDamage(obj.throwDamage, Math.cos(hitAngle) * 12.0, Math.sin(hitAngle) * 12.0);
            
            // Reduce durability on hits
            const broke = obj.takeDamage();
            if (broke) {
              // Delete object
              objects = objects.filter(o => o !== obj);
            } else {
              // Stop object velocity and slide
              obj.state = 'SLIDING';
              obj.vx = Math.cos(hitAngle) * 4.0;
              obj.vy = Math.sin(hitAngle) * 4.0;
            }
          }
        }
      });
    }
  });

  // 3. Enemy vs Enemy Circle Pushback (avoids swarms clipping directly inside one another)
  for (let i = 0; i < enemies.length; i++) {
    for (let j = i + 1; j < enemies.length; j++) {
      const e1 = enemies[i];
      const e2 = enemies[j];
      
      // Do not push overlapping grappling enemies (as they lock to player position)
      if (e1.state === 'GRAPPLING' && e2.state === 'GRAPPLING') continue;

      const dist = getDistance(e1.x, e1.y, e2.x, e2.y);
      const minDist = KID_RADIUS * 2 - 2;

      if (dist < minDist) {
        const overlap = minDist - dist;
        const pushAngle = Math.atan2(e2.y - e1.y, e2.x - e1.x);

        // Push away from each other slightly
        if (e1.state !== 'GRAPPLING') {
          e1.x -= Math.cos(pushAngle) * (overlap * 0.5);
          e1.y -= Math.sin(pushAngle) * (overlap * 0.5);
        }
        if (e2.state !== 'GRAPPLING') {
          e2.x += Math.cos(pushAngle) * (overlap * 0.5);
          e2.y += Math.sin(pushAngle) * (overlap * 0.5);
        }
      }
    }
  }
}

// ==========================================
// 🎨 CORE CANVAS RENDERING SYSTEM
// ==========================================
function drawClassroomGrid() {
  // Tile background
  ctx.fillStyle = '#06080b';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Classroom Grid lines (40x25 feet grid)
  ctx.strokeStyle = 'rgba(0, 243, 255, 0.035)';
  ctx.lineWidth = 1;
  const gridSize = 25; // 25 pixels = 1 foot
  
  ctx.beginPath();
  for (let x = 0; x < CANVAS_WIDTH; x += gridSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, CANVAS_HEIGHT);
  }
  for (let y = 0; y < CANVAS_HEIGHT; y += gridSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(CANVAS_WIDTH, y);
  }
  ctx.stroke();

  // Classroom outer perimeter walls (glowing neon boundaries)
  ctx.shadowColor = 'rgba(0, 243, 255, 0.2)';
  ctx.shadowBlur = 12;
  ctx.strokeStyle = 'rgba(0, 243, 255, 0.4)';
  ctx.lineWidth = 4;
  ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  
  // Highlight doors
  SPAWN_DOORS.forEach((door) => {
    ctx.fillStyle = 'rgba(255, 0, 85, 0.25)';
    ctx.fillRect(door.x, door.y, door.w, door.h);
    
    ctx.shadowColor = 'rgba(255, 0, 85, 0.8)';
    ctx.shadowBlur = 8;
    ctx.fillStyle = varColor('neon-red');
    ctx.fillRect(door.x, door.y, door.w, 4); // glow highlight
  });
  ctx.shadowBlur = 0;
}

// Screen shake calculation
function applyCameraEffects() {
  if (cameraShake.intensity > 0.1) {
    cameraShake.x = randRange(-cameraShake.intensity, cameraShake.intensity);
    cameraShake.y = randRange(-cameraShake.intensity, cameraShake.intensity);
    cameraShake.intensity *= cameraShake.decay;
  } else {
    cameraShake.x = 0;
    cameraShake.y = 0;
    cameraShake.intensity = 0;
  }
}

// ==========================================
// 🔁 THE PRIMARY MAIN LOOP
// ==========================================
function updateGame(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const dt = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  if (gameState !== 'PLAYING') return;

  const config = DIFFICULTY_CONFIGS[selectedDifficulty];

  // Apply screen shake vectors
  applyCameraEffects();

  // 1. Time ticks
  gameTime += dt;
  waveTimer -= dt;

  // Render timer stats
  const mins = Math.floor(gameTime / 60);
  const secs = Math.floor(gameTime % 60);
  document.getElementById('hud-survival-time').innerText = 
    `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  if (waveTimer <= 0) {
    wave++;
    // Wave spawn rate acceleration (decreases by 0.5s per wave down to a minimum of 8s)
    waveTimer = Math.max(8.0, config.waveInterval - (wave - 1) * 0.5);
    spawnWave();
  }
  document.getElementById('hud-timer').innerText = `${waveTimer.toFixed(1)}s`;
  document.getElementById('hud-wave').innerText = wave.toString().padStart(2, '0');
  document.getElementById('hud-kos').innerText = kos;

  // 2. Spawn entities updates
  player.update(config, dt);
  
  enemies.forEach(e => e.update());
  objects.forEach(o => o.update());
  
  particles.forEach(p => p.update());
  particles = particles.filter(p => p.alpha > 0);

  floatingTexts.forEach(f => f.update());
  floatingTexts = floatingTexts.filter(f => f.alpha > 0);

  // 3. Process physics collisions
  handleCollisions();

  // 4. Pin Mechanics Check
  const grapplingCount = getGrapplingCount();
  document.getElementById('hud-grappling').innerText = grapplingCount;

  if (grapplingCount >= 3) {
    // Pinned! Increment timer
    pinSeconds += dt;
    
    // UI Warnings
    pinnedAlert.classList.add('active');
    pinnedCountdown.innerText = `${Math.max(0, 15.0 - pinSeconds).toFixed(2)}s`;
    
    const pct = (pinSeconds / 15.0) * 100;
    alertProgressFill.style.width = `${Math.max(0, 100 - pct)}%`;

    if (pinSeconds >= 15.0) {
      endGame();
    }
  } else {
    // Decelerate pinning timer if broke free
    if (pinSeconds > 0) {
      pinSeconds = Math.max(0, pinSeconds - dt * 2.5); // Clears faster than it gains
    } else {
      pinnedAlert.classList.remove('active');
    }
  }

  // 5. Draw updates
  ctx.save();
  ctx.translate(cameraShake.x, cameraShake.y);

  drawClassroomGrid();
  
  objects.forEach(o => o.draw(ctx));
  player.draw(ctx);
  enemies.forEach(e => e.draw(ctx));
  particles.forEach(p => p.draw(ctx));
  floatingTexts.forEach(f => f.draw(ctx));

  ctx.restore();

  // Schedule next frame
  requestAnimationFrame(updateGame);
}

let lastTime = 0;

// ==========================================
// 🏁 START & END GAME CONTROLLERS
// ==========================================
function startGame() {
  audio.init();
  
  // Set difficulty config values
  const config = DIFFICULTY_CONFIGS[selectedDifficulty];

  // Initialize Entities
  player = new Player(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
  enemies = [];
  particles = [];
  floatingTexts = [];
  
  initClassroomObjects();

  // Reset stats
  gameTime = 0;
  wave = 1;
  waveTimer = config.waveInterval;
  kos = 0;
  pinSeconds = 0.0;
  lastTime = 0;
  audio.setTempoForWave(wave);

  // Spawns first wave
  spawnWave();

  // UI state updates
  startScreen.classList.remove('active');
  gameOverScreen.classList.remove('active');
  pinnedAlert.classList.remove('active');
  gameState = 'PLAYING';

  requestAnimationFrame(updateGame);
}

function endGame() {
  gameState = 'GAME_OVER';
  audio.playGameOver();

  // Render final score values
  document.getElementById('result-diff').innerText = selectedDifficulty.toUpperCase();
  document.getElementById('result-waves').innerText = (wave - 1).toString();
  document.getElementById('result-kos').innerText = kos.toString();
  
  const mins = Math.floor(gameTime / 60);
  const secs = Math.floor(gameTime % 60);
  document.getElementById('result-time').innerText = 
    `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  // Swap Screen overlays
  gameOverScreen.classList.add('active');
  pinnedAlert.classList.remove('active');
}

// Difficulty buttons controller
document.querySelectorAll('.diff-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
    
    // Fetch target button
    const target = e.currentTarget;
    target.classList.add('active');
    selectedDifficulty = target.getAttribute('data-diff');
  });
});

// Click handlers for Start/Restart
document.getElementById('btn-start').addEventListener('click', startGame);
document.getElementById('btn-restart').addEventListener('click', startGame);

// Sound Mute button
btnSoundToggle.addEventListener('click', () => {
  const isMuted = audio.toggleMute();
  btnSoundToggle.innerText = isMuted ? 'SOUND: OFF' : 'SOUND: ON';
  if (isMuted) {
    btnSoundToggle.classList.add('muted');
  } else {
    btnSoundToggle.classList.remove('muted');
  }
});
