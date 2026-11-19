<script setup>
import { ref } from 'vue'

/* Race animation durations in seconds. Real gap is about 1 ns vs 50-100 ns, squished so it is watchable. */
const SRAM_RACE_S = 0.6
const DRAM_RACE_S = 3.5

const racing = ref(false)
const raceKey = ref(0)
const finished = ref(false)

function startRace() {
  finished.value = false
  racing.value = true
  raceKey.value += 1
  setTimeout(() => {
    racing.value = false
    finished.value = true
  }, DRAM_RACE_S * 1000)
}

/** Side-by-side stats. "winner" marks which side has the advantage. */
const rows = [
  { label: 'Parts per bit', sram: '6 transistors', dram: '1 transistor + 1 capacitor', winner: 'dram' },
  { label: 'Stores the bit as', sram: 'Two inverters locking each other', dram: 'Charge in a capacitor', winner: null },
  { label: 'Needs refresh?', sram: 'Nope', dram: 'Yes, every 64 ms', winner: 'sram' },
  { label: 'Speed', sram: 'About 1 to 10 ns', dram: 'About 50 to 100 ns', winner: 'sram' },
  { label: 'Price per bit', sram: 'Expensive', dram: 'Cheap', winner: 'dram' },
  { label: 'Density', sram: 'Low (big cells)', dram: 'High (tiny cells)', winner: 'dram' },
  { label: 'Typical size', sram: 'KB to tens of MB', dram: '8 to 64+ GB', winner: 'dram' },
  { label: 'Power when idle', sram: 'Low, no refresh needed', dram: 'Burns energy on refresh', winner: 'sram' },
  { label: 'Volatile?', sram: 'Yes', dram: 'Yes', winner: null },
  { label: 'Found in', sram: 'CPU cache (L1, L2, L3)', dram: 'RAM sticks, GPU VRAM, phones', winner: null },
]

/** Mini-game: guess which RAM type each device part uses. */
const scenarios = ref([
  { text: 'The L1 cache right inside your CPU core', answer: 'sram', picked: null },
  { text: 'The 32 GB DDR5 sticks in a gaming PC', answer: 'dram', picked: null },
  { text: 'The 12 GB of VRAM on a graphics card', answer: 'dram', picked: null },
  { text: 'The L3 cache shared by all CPU cores', answer: 'sram', picked: null },
  { text: 'The 8 GB of memory in your phone', answer: 'dram', picked: null },
])

function pick(scenario, choice) {
  scenario.picked = choice
}
</script>

<template>
  <section class="wrap page-hero">
    <span class="tag">Step 04</span>
    <h1>SRAM <span class="vs">vs</span> DRAM</h1>
    <p>Same job, different builds. Time for the showdown.</p>
  </section>

  <section class="wrap section">
    <h2>Speed race: fetch one value</h2>
    <div class="card race">
      <div class="track">
        <span class="lane-name sram-text">SRAM</span>
        <div class="lane">
          <div
            :key="'s' + raceKey"
            class="runner sram-bg"
            :class="{ go: racing || finished }"
            :style="{ animationDuration: SRAM_RACE_S + 's' }"
          >
            S
          </div>
        </div>
      </div>
      <div class="track">
        <span class="lane-name dram-text">DRAM</span>
        <div class="lane">
          <div
            :key="'d' + raceKey"
            class="runner dram-bg"
            :class="{ go: racing || finished }"
            :style="{ animationDuration: DRAM_RACE_S + 's' }"
          >
            D
          </div>
        </div>
      </div>
      <div class="btn-row">
        <button class="btn primary" :disabled="racing" @click="startRace">
          {{ finished ? 'Race again' : 'Start race' }}
        </button>
      </div>
      <p v-if="finished" class="muted">
        SRAM wins by a mile. In real life the gap is even bigger: SRAM cache answers in around 1 nanosecond, DRAM
        takes around 50 to 100. Slowed way down here so you can actually see it.
      </p>
    </div>
  </section>

  <section class="wrap section">
    <h2>The stat sheet</h2>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th></th>
            <th class="sram-text">SRAM</th>
            <th class="dram-text">DRAM</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.label">
            <th>{{ row.label }}</th>
            <td :class="{ win: row.winner === 'sram' }">{{ row.sram }}</td>
            <td :class="{ win: row.winner === 'dram' }">{{ row.dram }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="muted">Yellow = wins that round.</p>
  </section>

  <section class="wrap section">
    <h2>Why your PC uses both</h2>
    <div class="callout">
      It is a team-up. The CPU keeps the stuff it needs <b>right now</b> in small, fast <b>SRAM</b> cache, and
      everything else in big, cheap <b>DRAM</b>. You get speed where it matters and space where it is needed. Best
      of both worlds, honestly iconic.
    </div>
  </section>

  <section class="wrap section">
    <h2>Guess the RAM</h2>
    <p class="muted">Which type does each one use?</p>
    <div class="scenarios">
      <div v-for="s in scenarios" :key="s.text" class="card scenario">
        <p>{{ s.text }}</p>
        <div class="btn-row">
          <button class="btn sram" :disabled="s.picked !== null" @click="pick(s, 'sram')">SRAM</button>
          <button class="btn dram" :disabled="s.picked !== null" @click="pick(s, 'dram')">DRAM</button>
        </div>
        <b v-if="s.picked" :style="{ color: s.picked === s.answer ? 'var(--good)' : 'var(--bad)' }">
          {{ s.picked === s.answer ? 'Correct, you ate that.' : 'Nope, it is ' + s.answer.toUpperCase() + '.' }}
        </b>
      </div>
    </div>
  </section>
</template>

<style scoped>
.vs {
  font-style: italic;
  color: var(--muted);
}

.sram-text {
  color: var(--sram);
}

.dram-text {
  color: var(--dram);
}

.sram-bg {
  background: var(--sram);
}

.dram-bg {
  background: var(--dram);
}

.track {
  display: grid;
  grid-template-columns: 70px 1fr;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.lane-name {
  font-weight: 700;
}

.lane {
  position: relative;
  height: 52px;
  border: 2px solid var(--line);
  border-radius: 999px;
  background: repeating-linear-gradient(90deg, var(--soft) 0 20px, #fff 20px 40px);
}

.runner {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--line);
  color: #fff;
  font-weight: 700;
  display: grid;
  place-items: center;
}

.runner.go {
  animation-name: run;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

@keyframes run {
  to {
    left: calc(100% - 44px);
  }
}

.table-wrap {
  overflow-x: auto;
  border: 2px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 520px;
}

th,
td {
  text-align: left;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e5ea;
}

thead th {
  font-size: 1.2rem;
  border-bottom: 2px solid var(--line);
}

tbody tr:last-child th,
tbody tr:last-child td {
  border-bottom: none;
}

td.win {
  background: var(--yellow);
  font-weight: 700;
}

.scenarios {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.scenario p {
  font-weight: 700;
}
</style>
