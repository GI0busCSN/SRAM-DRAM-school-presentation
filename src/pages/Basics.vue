<script setup>
import { ref } from 'vue'

/** Levels of the memory hierarchy, fastest and smallest first. */
const levels = [
  {
    name: 'Registers',
    tech: 'Inside the CPU core',
    vibe: 'What you hold in your hands right now',
    speed: 'instant',
    size: 'a few hundred bytes',
    width: 22,
  },
  {
    name: 'Cache (L1 / L2 / L3)',
    tech: 'SRAM',
    vibe: 'Your desk. Stuff you use all the time, right there.',
    speed: 'about 1 to 10 nanoseconds',
    size: 'kilobytes to a few dozen megabytes',
    width: 40,
  },
  {
    name: 'Main memory (RAM sticks)',
    tech: 'DRAM',
    vibe: 'The shelf in your room. Way more space, but you have to walk over.',
    speed: 'about 50 to 100 nanoseconds',
    size: '8 to 64 gigabytes in a normal PC',
    width: 60,
  },
  {
    name: 'SSD / hard drive',
    tech: 'Flash or magnetic disks, not RAM',
    vibe: 'The basement. Huge, but a whole trip every time.',
    speed: 'microseconds to milliseconds',
    size: 'hundreds of gigabytes to terabytes',
    width: 80,
  },
  {
    name: 'Cloud',
    tech: 'Someone else\'s computer',
    vibe: 'Grandma\'s house across town. Everything is there, but good luck.',
    speed: 'milliseconds and up',
    size: 'basically infinite',
    width: 100,
  },
]

const selected = ref(1)

/* Volatility demo: text typed "into RAM" disappears when the plug is pulled. */
const note = ref('')
const powered = ref(true)

function pullPlug() {
  powered.value = false
  note.value = ''
}
</script>

<template>
  <section class="wrap page-hero">
    <span class="tag">Step 01</span>
    <h1>What even is RAM?</h1>
    <p>
      <b>RAM</b> stands for <b>Random Access Memory</b>. It is the short-term memory of your computer: the place
      where your open apps, game, and that 47-tab browser window live while you use them.
    </p>
  </section>

  <section class="wrap section">
    <div class="grid-2">
      <div class="card">
        <h3>"Random access"?</h3>
        <p>
          It means the computer can jump to <b>any</b> memory address directly, in the same amount of time.
          No rewinding like an old cassette tape. Address 5 or address 5 billion, same deal.
        </p>
      </div>
      <div class="card">
        <h3>"Volatile"?</h3>
        <p>
          Both SRAM and DRAM are <span class="highlight">volatile</span>: no power, no data. That is why unsaved
          homework vanishes when the PC crashes. Your files survive because they are on the SSD, not in RAM.
        </p>
      </div>
    </div>
  </section>

  <section class="wrap section">
    <h2>Try it: type something into "RAM"</h2>
    <div class="card volatile" :class="{ dead: !powered }">
      <div class="status mono">
        <span class="led" :class="{ off: !powered }"></span>
        {{ powered ? 'POWER: ON' : 'POWER: OFF' }}
      </div>
      <textarea
        v-model="note"
        :disabled="!powered"
        placeholder="Type your deepest secret here..."
        rows="3"
      ></textarea>
      <div class="btn-row">
        <button v-if="powered" class="btn dram" @click="pullPlug" :disabled="!note">Pull the plug</button>
        <button v-else class="btn primary" @click="powered = true">Power back on</button>
      </div>
      <p v-if="!powered" class="muted">
        Gone. Reduced to atoms. That is volatile memory. RAM only remembers while it has electricity.
      </p>
    </div>
  </section>

  <section class="wrap section">
    <h2>The memory pyramid</h2>
    <p class="muted">Click a level. Higher up = faster but smaller and more expensive.</p>
    <div class="pyramid-layout">
      <div class="pyramid">
        <button
          v-for="(lvl, i) in levels"
          :key="lvl.name"
          class="level"
          :class="{ active: selected === i, sram: lvl.tech === 'SRAM', dram: lvl.tech === 'DRAM' }"
          :style="{ width: lvl.width + '%' }"
          @click="selected = i"
        >
          {{ lvl.name }}
        </button>
      </div>
      <div class="card info">
        <span
          class="tag"
          :class="{ sram: levels[selected].tech === 'SRAM', dram: levels[selected].tech === 'DRAM' }"
        >
          {{ levels[selected].tech }}
        </span>
        <h3>{{ levels[selected].name }}</h3>
        <p>{{ levels[selected].vibe }}</p>
        <p><b>Speed:</b> {{ levels[selected].speed }}</p>
        <p><b>Size:</b> {{ levels[selected].size }}</p>
      </div>
    </div>
    <div class="callout">
      See the two colored levels? <b style="color: var(--sram)">Cache is SRAM</b> and
      <b style="color: var(--dram)">main memory is DRAM</b>. Same job (remember stuff short-term), totally different
      builds. Next pages: how each one actually works.
    </div>
  </section>
</template>

<style scoped>
.volatile {
  transition: background 0.3s;
}

.volatile.dead {
  background: var(--soft);
}

.status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  margin-bottom: 12px;
}

.led {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--good);
  box-shadow: 0 0 8px var(--good);
}

.led.off {
  background: var(--bad);
  box-shadow: none;
}

textarea {
  width: 100%;
  font: inherit;
  border: 2px solid var(--line);
  border-radius: 12px;
  padding: 12px;
  resize: vertical;
}

.pyramid-layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 24px;
  align-items: start;
  margin-top: 16px;
}

.pyramid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.level {
  font: inherit;
  font-weight: 700;
  font-size: 0.9rem;
  min-width: 120px;
  padding: 12px 6px;
  border: 2px solid var(--line);
  border-radius: 10px;
  background: var(--soft);
  cursor: pointer;
  transition: transform 0.1s;
}

.level:hover {
  transform: scale(1.03);
}

.level.sram {
  background: var(--sram-soft);
}

.level.dram {
  background: var(--dram-soft);
}

.level.active {
  background: var(--yellow);
  box-shadow: 3px 3px 0 var(--line);
}

.info {
  min-height: 240px;
}

@media (max-width: 720px) {
  .pyramid-layout {
    grid-template-columns: 1fr;
  }
}
</style>
