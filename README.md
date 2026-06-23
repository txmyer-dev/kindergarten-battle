# 🏫 Kindergarten Swarm: 40x25 Classroom Battle

An intense, retro-arcade style cyberpunk survival game inspired by the **Smosh Pit** hypothetical debate: **"How many kindergarteners do you think you could personally take on in a fight before being overpowered?"**

Try to survive waves of aggressive kindergarteners inside a standardized 40x25 classroom. Keep moving, strike them down, and shake them off if they try to dog-pile you!

---

## 🎮 Game Rules & Stipulations

1. **The Waves:** A new wave of **5 aggressive kindergarteners** spawns from the classroom doors every **30 seconds**.
2. **The Pin Mechanic:** If **3 or more** kindergarteners latch onto you at the same time, you are pinned to the floor. You must break free before the **15-second countdown** hits zero, or it's game over!
3. **The Sandbox (Easy/Medium):** In Easy and Medium modes, you can pick up and throw classroom desks and chairs to barricade or crush enemies.
4. **The Smosh Standard (Hard):** Empty classroom. No furniture. Just your fists and feet against the swarm.

---

## 🕹️ Controls

* **W, A, S, D** or **Arrow Keys** — Move Character
* **Spacebar** — Strike (Punch/Kick)
  * Deals damage and detaches grappling kindergarteners.
* **E or F** — Interact (Grab / Throw furniture)
  * Pick up a desk/chair, then press E/F again to throw it in the direction you are facing.
* **Shift** — Spin Kick (Special Ability)
  * Instantly clears all grappling enemies with high knockback and damage (8s cooldown).

---

## 🛠️ Tech Stack & Key Features

* **HTML5 Canvas:** 60 FPS physics, vector graphics, and collision response calculations (AABB vs Circle).
* **Cyberpunk Aesthetics:** Neon glows, dynamic particle systems (wood splinters, KO sparks), floating combat damage numbers, and retro fonts.
* **Procedural Sound Engine:** Generated entirely via the **Web Audio API**—synthesizing retro punches, hit impacts, laser sweeps, warning alarms, and a looping synth arpeggio BGM that **speeds up as you survive longer**!
* **Zero External Dependencies:** Built with pure Vanilla JS and compiled with Vite.

---

## 🚀 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/txmyer-dev/kindergarten-battle.git
   cd kindergarten-battle
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open the local link (usually `http://localhost:3000` or `http://localhost:3002`) in your browser and start the simulation!
