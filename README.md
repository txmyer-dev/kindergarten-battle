# 🏫 Kindergarten Swarm: 40x25 Classroom Battle

An intense, retro-arcade style cyberpunk survival game inspired by the **Smosh Pit** hypothetical debate: **"How many kindergarteners do you think you could personally take on in a fight before being overpowered?"**

🎥 **Inspiration Video:** [Would you win this battle? (Smosh Pit YouTube Shorts)](https://www.youtube.com/shorts/araVtVXZLXQ)

Try to survive waves of aggressive kindergarteners inside a standardized 40x25 classroom. Keep moving, strike them down, manage your stamina, and shake them off if they dog-pile you!

---

## 🎮 Game Rules & Stipulations

1. **Escalating Swarm Waves:** 
   - A new wave of kindergarteners spawns from the classroom doors at intervals dependent on difficulty:
     - **Easy:** 30 seconds
     - **Medium:** 23 seconds
     - **Hard:** 16 seconds
   - **Timers accelerate:** Wave intervals decrease by **0.5s per wave** (down to a minimum of 8 seconds!).
   - **Densities increase:** Spawns start at **5** (Easy), **6** (Medium), and **7** (Hard) kindergarteners, scaling up by **+1 kindergartener every 2 waves survived**.
2. **The Pin Mechanic:** If **3 or more** kindergarteners latch onto you at the same time, you are pinned. You must break free before the **15-second countdown** hits zero, or it's game over!
3. **The Sandbox (Easy/Medium):** In Easy and Medium modes, you can pick up and throw classroom desks and chairs to barricade or crush enemies.
4. **The Smosh Standard (Hard):** Empty classroom. No furniture. Just your fists and feet against the swarm.
5. **🪫 Stamina System:** Punching costs **12 stamina** (regenerates 25/sec). Mashing Space bar indiscriminately triggers **Exhaustion**, doubling attack cooldowns, halving damage, and reducing knockback power.
6. **🏆 Leaderboard Scoring:** Submit your 3-letter initials to a persistent local storage leaderboard. Scores scale based on:
   - KOs (+100 pts)
   - Waves completed (+500 pts)
   - Time survived (+10 pts/sec)
   - **Difficulty Modifier:** Easy ($0.5\times$), Medium ($1.0\times$), Hard ($2.0\times$ multiplier).

---

## 🕹️ Controls

* **W, A, S, D** or **Arrow Keys** — Move Character
* **Spacebar** — Strike (Punch/Kick)
  * Costs 12 stamina. Deals damage and detaches grappling kindergarteners.
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
