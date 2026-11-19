<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

/** Stored bit: 0, 1, or null when power was lost and the value is garbage. */
const bit = ref(1)
const powered = ref(true)
const accessOn = ref(false)
const heldFor = ref(0)
const log = ref(['Cell powered up. Holding a 1.'])

const qBar = computed(() => (bit.value === null ? null : 1 - bit.value))

let timer = null
onMounted(() => {
  timer = setInterval(() => {
    if (powered.value && bit.value !== null) {
      heldFor.value += 1
    }
  }, 1000)
})
onUnmounted(() => clearInterval(timer))

/** Adds a line to the activity log, newest first. */
function addLog(text) {
  log.value = [text, ...log.value].slice(0, 6)
}

/** Briefly opens the two access transistors, like a real read or write does. */
function flashAccess() {
  accessOn.value = true
  setTimeout(() => (accessOn.value = false), 350)
}

function write(value) {
  flashAccess()
  bit.value = value
  heldFor.value = 0
  addLog(`WRITE ${value}: the inverters flip and lock in. Took about 1 ns.`)
}

function read() {
  flashAccess()
  addLog(`READ: got ${bit.value}. Value stays intact. About 1 ns.`)
}

function togglePower() {
  if (powered.value) {
    powered.value = false
    bit.value = null
    addLog('POWER OFF: the loop dies. Data is gone.')
    return
  }
  powered.value = true
  bit.value = Math.random() > 0.5 ? 1 : 0
  heldFor.value = 0
  addLog(`POWER ON: the cell wakes up with a random value (${bit.value}). Old data is not coming back.`)
}

/** Shows a bit for display; null means garbage after power loss. */
function show(v) {
  return v === null ? '?' : v
}
</script>

<template>
  <section class="wrap page-hero">
    <span class="tag sram">Step 02 &middot; Static RAM</span>
    <h1>SRAM: the speed demon</h1>
    <p>
      An SRAM cell stores one bit using <b>6 transistors</b>. Four of them form two <b>inverters</b> that hold each
      other in place. Two more act as <b>doors</b> to read or write the value.
    </p>
  </section>

  <section class="wrap section">
    <div class="grid-2">
      <div class="card">
        <h3>Wait, what is an inverter?</h3>
        <p>
          A tiny circuit that flips its input. Put in 1, get 0. Put in 0, get 1. That is literally it.
        </p>
      </div>
      <div class="card">
        <h3>The trick: two inverters in a loop</h3>
        <p>
          Inverter A feeds B, B feeds A. If A outputs 1, B outputs 0, which keeps A at 1. They
          <span class="highlight">lock each other in</span> forever, as long as there is power. Basically a friendship
          bracelet made of electricity.
        </p>
      </div>
    </div>
  </section>

  <section class="wrap section">
    <h2>SRAM cell simulator</h2>
    <p class="muted">Write, read, wait, then pull the power. Watch what happens.</p>

    <div class="card sim" :class="{ off: !powered }">
      <div class="cell">
        <div class="door" :class="{ open: accessOn }">
          <span class="mono">M5</span>
          <small>access door</small>
        </div>

        <div class="loop">
          <div class="inverter">
            <span class="label">Inverter A <small class="mono">M1 + M2</small></span>
            <span class="value mono" :class="'v' + show(bit)">{{ show(bit) }}</span>
          </div>
          <div class="arrows mono" :class="{ spin: powered }">&#8645;</div>
          <div class="inverter">
            <span class="label">Inverter B <small class="mono">M3 + M4</small></span>
            <span class="value mono" :class="'v' + show(qBar)">{{ show(qBar) }}</span>
          </div>
        </div>

        <div class="door" :class="{ open: accessOn }">
          <span class="mono">M6</span>
          <small>access door</small>
        </div>
      </div>

      <div class="stats">
        <div>
          <small class="muted">Stored bit</small>
          <b class="mono big">{{ show(bit) }}</b>
        </div>
        <div>
          <small class="muted">Held without refresh</small>
          <b class="mono big">{{ heldFor }}s</b>
        </div>
        <div>
          <small class="muted">Power</small>
          <b class="mono big" :style="{ color: powered ? 'var(--good)' : 'var(--bad)' }">
            {{ powered ? 'ON' : 'OFF' }}
          </b>
        </div>
      </div>

      <div class="btn-row">
        <button class="btn sram" :disabled="!powered" @click="write(0)">Write 0</button>
        <button class="btn sram" :disabled="!powered" @click="write(1)">Write 1</button>
        <button class="btn" :disabled="!powered" @click="read">Read</button>
        <button class="btn" :class="{ primary: !powered }" @click="togglePower">
          {{ powered ? 'Pull the power' : 'Power on' }}
        </button>
      </div>

      <ul class="log mono">
        <li v-for="(line, i) in log" :key="line + i">{{ line }}</li>
      </ul>
    </div>

    <div class="callout sram">
      Notice the "held without refresh" counter just keeps going up? SRAM does not need any maintenance. That is
      what <b>static</b> means: the data just sits there, chilling, until you change it or kill the power.
    </div>
  </section>

  <section class="wrap section">
    <h2>So why not use SRAM for everything?</h2>
    <div class="grid-2">
      <div class="card">
        <h3>It is chonky</h3>
        <p>6 transistors per bit takes a lot of chip area. 16 GB of SRAM would need a ridiculously huge chip.</p>
      </div>
      <div class="card">
        <h3>It is expensive</h3>
        <p>More area per bit = way more money per bit. That is why your CPU only has a few MB of it.</p>
      </div>
      <div class="card">
        <h3>Where it lives</h3>
        <p>Inside the CPU as <b>L1, L2 and L3 cache</b>. Right next to the cores, where speed matters most.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sim {
  transition: background 0.3s;
}

.sim.off {
  background: var(--soft);
}

.cell {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 16px;
}

.door {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px dashed var(--line);
  border-radius: 12px;
  padding: 10px;
  font-weight: 700;
  transition: background 0.2s;
}

.door small {
  font-weight: 400;
  font-size: 0.75rem;
}

.door.open {
  background: var(--yellow);
  border-style: solid;
}

.loop {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.inverter {
  border: 2px solid var(--sram);
  background: var(--sram-soft);
  border-radius: 14px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 130px;
}

.label {
  font-weight: 700;
  text-align: center;
}

.label small {
  display: block;
  font-weight: 400;
  color: var(--muted);
}

.value {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 1.6rem;
  font-weight: 700;
  border: 2px solid var(--line);
  transition: background 0.25s;
}

.v1 {
  background: var(--sram);
  color: #fff;
}

.v0 {
  background: #fff;
}

.v\? {
  background: var(--soft);
  color: var(--muted);
}

.arrows {
  font-size: 2rem;
  color: var(--sram);
}

.arrows.spin {
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
  50% {
    transform: scale(1.25);
  }
}

.stats {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  margin-top: 24px;
}

.stats div {
  display: flex;
  flex-direction: column;
}

.big {
  font-size: 1.6rem;
}

.log {
  list-style: none;
  padding: 12px;
  margin: 0;
  background: var(--soft);
  border-radius: 10px;
  font-size: 0.85rem;
  min-height: 60px;
}

.log li:first-child {
  font-weight: 700;
}

@media (max-width: 640px) {
  .cell {
    grid-template-columns: 1fr;
  }
}
</style>
