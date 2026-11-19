<script setup>
/** Landing page: hook, TL;DR of both RAM types, and a floating-bits background. */
const bits = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  value: Math.random() > 0.5 ? '1' : '0',
  left: Math.random() * 100,
  delay: Math.random() * -12,
  duration: 8 + Math.random() * 8,
}))
</script>

<template>
  <section class="hero">
    <div class="bits" aria-hidden="true">
      <span
        v-for="b in bits"
        :key="b.id"
        class="bit mono"
        :style="{ left: b.left + '%', animationDelay: b.delay + 's', animationDuration: b.duration + 's' }"
      >
        {{ b.value }}
      </span>
    </div>
    <div class="wrap hero-inner">
      <span class="tag">computer science, but chill</span>
      <h1>RAM, but make it <span class="highlight">make sense</span>.</h1>
      <p class="lead">
        Your PC has two kinds of short-term memory: <b class="s">SRAM</b> and <b class="d">DRAM</b>.
        One is a speed demon, one is a storage gremlin. By the end you will know exactly who is who.
        No cap.
      </p>
      <div class="btn-row">
        <a href="#/basics" class="btn primary">Start learning &rarr;</a>
        <a href="#/quiz" class="btn">Skip to the quiz</a>
      </div>
    </div>
  </section>

  <section class="wrap section">
    <h2>The 10-second TL;DR</h2>
    <div class="grid-2">
      <div class="card tldr s-card">
        <span class="tag sram">Static RAM</span>
        <h3>SRAM = the sprinter</h3>
        <ul>
          <li>Built from <b>6 transistors</b> per bit</li>
          <li>Holds data as long as power is on. No refreshing.</li>
          <li>Super fast, super pricey, takes lots of space</li>
          <li>Lives in your CPU as <b>cache</b></li>
        </ul>
        <a href="#/sram" class="btn sram">Play with SRAM</a>
      </div>
      <div class="card tldr d-card">
        <span class="tag dram">Dynamic RAM</span>
        <h3>DRAM = the leaky bucket</h3>
        <ul>
          <li>Built from <b>1 transistor + 1 capacitor</b> per bit</li>
          <li>The capacitor leaks, so it needs a <b>refresh</b> all the time</li>
          <li>Slower, but cheap and tiny, so you get gigabytes of it</li>
          <li>Lives on your <b>RAM sticks</b> (DDR4, DDR5)</li>
        </ul>
        <a href="#/dram" class="btn dram">Play with DRAM</a>
      </div>
    </div>
  </section>

  <section class="wrap section">
    <h2>Your route</h2>
    <div class="route">
      <a href="#/basics" class="step card"><span class="num mono">01</span>What even is RAM?</a>
      <a href="#/sram" class="step card"><span class="num mono">02</span>SRAM simulator</a>
      <a href="#/dram" class="step card"><span class="num mono">03</span>DRAM mini-game</a>
      <a href="#/versus" class="step card"><span class="num mono">04</span>The big showdown</a>
      <a href="#/quiz" class="step card"><span class="num mono">05</span>Quiz: prove it</a>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  border-bottom: 2px solid var(--line);
  padding: 80px 0 64px;
}

.hero-inner {
  position: relative;
}

.lead {
  font-size: 1.25rem;
  max-width: 640px;
}

.s {
  color: var(--sram);
}

.d {
  color: var(--dram);
}

.bits {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bit {
  position: absolute;
  bottom: -40px;
  font-size: 1.6rem;
  font-weight: 700;
  color: #e3e3ea;
  animation: rise linear infinite;
}

@keyframes rise {
  to {
    transform: translateY(-700px) rotate(20deg);
  }
}

.tldr ul {
  padding-left: 20px;
  margin: 0 0 20px;
}

.s-card {
  background: var(--sram-soft);
}

.d-card {
  background: var(--dram-soft);
}

.route {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 16px;
}

.step {
  text-decoration: none;
  font-weight: 700;
  padding: 18px;
  transition: transform 0.15s;
}

.step:hover {
  transform: rotate(-2deg) scale(1.03);
  background: var(--yellow);
}

.num {
  display: block;
  font-size: 1.8rem;
  color: var(--muted);
}
</style>
