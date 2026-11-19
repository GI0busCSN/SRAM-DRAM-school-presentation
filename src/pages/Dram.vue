<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const TICK_MS = 100
const THRESHOLD = 50
const AUTO_REFRESH_MS = 1000

/** Creates 8 capacitor cells. Each one leaks at its own slightly random speed. */
function makeCells() {
  return Array.from({ length: 8 }, () => ({
    charge: 0,
    leak: 0.9 + Math.random() * 1.1,
  }))
}

const cells = ref(makeCells())
const letter = ref('A')
const savedLetter = ref('A')
const autoRefresh = ref(false)
const refreshCount = ref(0)
const message = ref('Store a letter, then watch the capacitors drain.')

/** Bit a cell currently reads as: charged above the threshold means 1. */
function readBit(cell) {
  return cell.charge >= THRESHOLD ? 1 : 0
}

const bitsNow = computed(() => cells.value.map(readBit))
const byteNow = computed(() => parseInt(bitsNow.value.join(''), 2))
const savedByte = computed(() => savedLetter.value.charCodeAt(0))
const intact = computed(() => byteNow.value === savedByte.value)

/** Shows a byte as a character, or as hex if it is not printable. */
function asChar(byte) {
  if (byte >= 33 && byte <= 126) {
    return String.fromCharCode(byte)
  }
  return '0x' + byte.toString(16).padStart(2, '0').toUpperCase()
}

function store() {
  const clean = letter.value.trim().toUpperCase().slice(0, 1) || 'A'
  letter.value = clean
  savedLetter.value = clean
  const bits = clean.charCodeAt(0).toString(2).padStart(8, '0')
  cells.value = makeCells().map((cell, i) => ({ ...cell, charge: bits[i] === '1' ? 100 : 0 }))
  message.value = `Stored "${clean}" as ${bits}. The 1s are charged capacitors. Now they start leaking...`
}

/** Reads every cell and writes the value back at full strength, exactly like a real DRAM refresh. */
function refresh() {
  cells.value = cells.value.map((cell) => ({ ...cell, charge: readBit(cell) ? 100 : 0 }))
  refreshCount.value += 1
}

let tickTimer = null
let refreshTimer = null

function tick() {
  cells.value = cells.value.map((cell) => ({ ...cell, charge: Math.max(0, cell.charge - cell.leak) }))
}

onMounted(() => {
  store()
  tickTimer = setInterval(tick, TICK_MS)
  refreshTimer = setInterval(() => {
    if (autoRefresh.value) {
      refresh()
    }
  }, AUTO_REFRESH_MS)
})

onUnmounted(() => {
  clearInterval(tickTimer)
  clearInterval(refreshTimer)
})
</script>

<template>
  <section class="wrap page-hero">
    <span class="tag dram">Step 03 &middot; Dynamic RAM</span>
    <h1>DRAM: the leaky bucket</h1>
    <p>
      A DRAM cell is just <b>1 transistor + 1 capacitor</b>. The capacitor is a tiny bucket for electric charge.
      Full bucket = <b>1</b>. Empty bucket = <b>0</b>. The transistor is the tap that lets you fill or check it.
    </p>
  </section>

  <section class="wrap section">
    <div class="grid-2">
      <div class="card">
        <h3>The plot twist</h3>
        <p>
          The bucket has a hole. The capacitor <span class="highlight">leaks charge</span> all the time. Wait too long
          and your 1 slowly becomes a 0. Your data just... ghosts you.
        </p>
      </div>
      <div class="card">
        <h3>The fix: refresh</h3>
        <p>
          The memory controller constantly reads every cell and writes it back at full charge. Real DRAM refreshes
          every row at least every <b>64 milliseconds</b>. That never-ending upkeep is why it is called
          <b>dynamic</b>.
        </p>
      </div>
    </div>
  </section>

  <section class="wrap section">
    <h2>Mini-game: keep your letter alive</h2>
    <p class="muted">
      You are the memory controller now. Every letter is 8 bits. Hit refresh before any 1 drops below the 50% line.
      (Real leaking takes milliseconds. Here it is slowed down so humans can play.)
    </p>

    <div class="card game">
      <div class="controls">
        <label class="store">
          <span>Letter to store</span>
          <input v-model="letter" maxlength="1" class="mono" @keyup.enter="store" />
        </label>
        <button class="btn dram" @click="store">Store it</button>
        <button class="btn primary" @click="refresh">Refresh!</button>
        <button class="btn" :class="{ on: autoRefresh }" @click="autoRefresh = !autoRefresh">
          Auto-refresh: {{ autoRefresh ? 'ON' : 'OFF' }}
        </button>
      </div>

      <div class="caps">
        <div v-for="(cell, i) in cells" :key="i" class="cap">
          <div class="tank">
            <div class="line"></div>
            <div class="water" :class="{ low: cell.charge > 0 && cell.charge < THRESHOLD }" :style="{ height: cell.charge + '%' }"></div>
          </div>
          <span class="mono pct">{{ Math.round(cell.charge) }}%</span>
          <b class="mono bitv">{{ bitsNow[i] }}</b>
        </div>
      </div>

      <div class="result">
        <div>
          <small class="muted">You saved</small>
          <b class="mono big">{{ savedLetter }}</b>
        </div>
        <div>
          <small class="muted">Memory now reads</small>
          <b class="mono big" :style="{ color: intact ? 'var(--good)' : 'var(--bad)' }">{{ asChar(byteNow) }}</b>
        </div>
        <div>
          <small class="muted">Status</small>
          <b class="big" :style="{ color: intact ? 'var(--good)' : 'var(--bad)' }">
            {{ intact ? 'Intact' : 'Corrupted' }}
          </b>
        </div>
        <div>
          <small class="muted">Refreshes</small>
          <b class="mono big">{{ refreshCount }}</b>
        </div>
      </div>

      <p class="msg">{{ intact ? message : 'Oof. A bit flipped and your letter is cooked. Store it again and refresh faster.' }}</p>
    </div>

    <div class="callout dram">
      Turn on <b>auto-refresh</b> and relax. That is exactly what your PC does billions of times a day, so you never
      notice. The catch: while a row is being refreshed, it cannot be used. That costs time and energy.
    </div>
  </section>

  <section class="wrap section">
    <h2>So why is DRAM everywhere?</h2>
    <div class="grid-2">
      <div class="card">
        <h3>It is tiny</h3>
        <p>1 transistor + 1 capacitor per bit. You can cram billions of cells onto one chip.</p>
      </div>
      <div class="card">
        <h3>It is cheap</h3>
        <p>Small cells = cheap bits. That is why 16 or 32 GB of RAM is normal and affordable.</p>
      </div>
      <div class="card">
        <h3>Where it lives</h3>
        <p>
          Your RAM sticks (<b>DDR4, DDR5</b>), graphics card memory (<b>GDDR</b>), and phones (<b>LPDDR</b>).
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.controls {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 12px;
  margin-bottom: 24px;
}

.store {
  display: flex;
  flex-direction: column;
  font-weight: 700;
  font-size: 0.85rem;
}

.store input {
  width: 70px;
  font-size: 1.5rem;
  text-align: center;
  border: 2px solid var(--line);
  border-radius: 10px;
  padding: 4px;
  text-transform: uppercase;
}

.caps {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 10px;
}

.cap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.tank {
  position: relative;
  width: 100%;
  max-width: 64px;
  height: 140px;
  border: 2px solid var(--line);
  border-top: none;
  border-radius: 0 0 12px 12px;
  overflow: hidden;
  background: #fff;
}

.line {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 50%;
  border-top: 2px dashed var(--muted);
  z-index: 2;
}

.water {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--dram);
  transition: height 0.1s linear;
}

.water.low {
  background: var(--muted);
}

.pct {
  font-size: 0.75rem;
  color: var(--muted);
}

.bitv {
  font-size: 1.4rem;
}

.result {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  margin-top: 24px;
}

.result div {
  display: flex;
  flex-direction: column;
}

.big {
  font-size: 1.6rem;
}

.msg {
  margin: 16px 0 0;
  background: var(--soft);
  padding: 12px;
  border-radius: 10px;
}

@media (max-width: 520px) {
  .caps {
    gap: 4px;
  }

  .tank {
    height: 100px;
  }
}
</style>
