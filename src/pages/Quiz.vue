<script setup>
import { computed, ref } from 'vue'

/** Quiz questions. "correct" is the index of the right option. */
const questions = [
  {
    q: 'What does RAM stand for?',
    options: ['Really Awesome Memory', 'Random Access Memory', 'Read And Modify', 'Rapid Array Module'],
    correct: 1,
    why: 'Random Access Memory: any address can be reached directly in the same time.',
  },
  {
    q: 'How many transistors does a classic SRAM cell use per bit?',
    options: ['1', '2', '4', '6'],
    correct: 3,
    why: 'Six: four for the two cross-coupled inverters, two as access doors.',
  },
  {
    q: 'What does a DRAM cell store its bit in?',
    options: ['A capacitor', 'A magnet', 'Two inverters', 'A tiny SSD'],
    correct: 0,
    why: 'A capacitor. Charged = 1, empty = 0. One transistor controls access.',
  },
  {
    q: 'Why does DRAM need to be refreshed?',
    options: [
      'To clear viruses',
      'Because the capacitors slowly leak their charge',
      'To make it run cooler',
      'It does not need refresh',
    ],
    correct: 1,
    why: 'Capacitors leak. Without refresh, 1s fade into 0s and data is lost.',
  },
  {
    q: 'Which one is faster?',
    options: ['SRAM', 'DRAM', 'They are exactly the same', 'Depends on the RGB'],
    correct: 0,
    why: 'SRAM. No capacitor to charge or sense, so it answers in about a nanosecond.',
  },
  {
    q: 'Where is SRAM mostly used?',
    options: ['RAM sticks', 'USB drives', 'CPU cache', 'Hard drives'],
    correct: 2,
    why: 'CPU cache (L1, L2, L3), where speed matters the most.',
  },
  {
    q: 'Why are RAM sticks made of DRAM and not SRAM?',
    options: [
      'DRAM is faster',
      'DRAM is cheaper and much denser',
      'SRAM loses data without power but DRAM does not',
      'DRAM looks cooler',
    ],
    correct: 1,
    why: '1 transistor + 1 capacitor is tiny and cheap, so you can have gigabytes of it.',
  },
  {
    q: 'What happens to data in SRAM and DRAM when the power goes off?',
    options: ['Only DRAM loses it', 'Only SRAM loses it', 'Both lose it', 'Both keep it'],
    correct: 2,
    why: 'Both are volatile. No power, no data.',
  },
]

const current = ref(0)
const chosen = ref(null)
const score = ref(0)
const done = ref(false)

const question = computed(() => questions[current.value])
const progress = computed(() => (current.value / questions.length) * 100)

/** Ranks the final score with a matching vibe. */
const rank = computed(() => {
  const ratio = score.value / questions.length
  if (ratio === 1) {
    return { title: 'Memory GOAT', text: 'Perfect score. You could teach this class.' }
  }
  if (ratio >= 0.75) {
    return { title: 'Cache Certified', text: 'Fast and accurate, just like SRAM.' }
  }
  if (ratio >= 0.5) {
    return { title: 'Needs a Refresh', text: 'Like DRAM, some bits leaked. Run it back.' }
  }
  return { title: 'Data Lost', text: 'Power cycled your brain? Revisit the pages and try again.' }
})

function choose(i) {
  if (chosen.value !== null) {
    return
  }
  chosen.value = i
  if (i === question.value.correct) {
    score.value += 1
  }
}

function nextQuestion() {
  if (current.value + 1 >= questions.length) {
    done.value = true
    return
  }
  current.value += 1
  chosen.value = null
}

function restart() {
  current.value = 0
  chosen.value = null
  score.value = 0
  done.value = false
}

/** CSS class for an option after the user has answered. */
function optionClass(i) {
  if (chosen.value === null) {
    return ''
  }
  if (i === question.value.correct) {
    return 'right'
  }
  return i === chosen.value ? 'wrong' : 'dim'
}
</script>

<template>
  <section class="wrap page-hero">
    <span class="tag">Step 05</span>
    <h1>Quiz: prove it</h1>
    <p>Eight questions. No googling. We are watching (we are not).</p>
  </section>

  <section class="wrap section">
    <div v-if="!done" class="card quiz">
      <div class="bar"><div class="fill" :style="{ width: progress + '%' }"></div></div>
      <p class="muted mono">Question {{ current + 1 }} / {{ questions.length }} &middot; Score {{ score }}</p>
      <h2>{{ question.q }}</h2>
      <div class="options">
        <button
          v-for="(opt, i) in question.options"
          :key="opt"
          class="option"
          :class="optionClass(i)"
          @click="choose(i)"
        >
          <span class="letter mono">{{ 'ABCD'[i] }}</span>
          {{ opt }}
        </button>
      </div>
      <div v-if="chosen !== null" class="feedback">
        <b :style="{ color: chosen === question.correct ? 'var(--good)' : 'var(--bad)' }">
          {{ chosen === question.correct ? 'Correct!' : 'Not quite.' }}
        </b>
        {{ question.why }}
        <div class="btn-row">
          <button class="btn primary" @click="nextQuestion">
            {{ current + 1 >= questions.length ? 'See results' : 'Next question' }} &rarr;
          </button>
        </div>
      </div>
    </div>

    <div v-else class="card result">
      <span class="tag">Your rank</span>
      <h1>{{ rank.title }}</h1>
      <p class="score mono">{{ score }} / {{ questions.length }}</p>
      <p>{{ rank.text }}</p>
      <div class="btn-row center">
        <button class="btn primary" @click="restart">Try again</button>
        <a href="#/" class="btn">Back to start</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.quiz {
  max-width: 720px;
  margin: 0 auto;
}

.bar {
  height: 10px;
  border: 2px solid var(--line);
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 12px;
}

.fill {
  height: 100%;
  background: var(--yellow);
  transition: width 0.3s;
}

.options {
  display: grid;
  gap: 10px;
}

.option {
  font: inherit;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 2px solid var(--line);
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  transition: transform 0.1s, background 0.2s;
}

.option:hover {
  transform: translateX(4px);
  background: var(--soft);
}

.letter {
  font-weight: 700;
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border: 2px solid var(--line);
  border-radius: 8px;
  flex-shrink: 0;
}

.option.right {
  background: #d1fadf;
  border-color: var(--good);
}

.option.wrong {
  background: #fee4e2;
  border-color: var(--bad);
  animation: shake 0.3s;
}

.option.dim {
  opacity: 0.45;
}

@keyframes shake {
  25% {
    transform: translateX(-6px);
  }
  75% {
    transform: translateX(6px);
  }
}

.feedback {
  margin-top: 16px;
  padding: 14px;
  background: var(--soft);
  border-radius: 12px;
}

.result {
  max-width: 560px;
  margin: 0 auto;
  text-align: center;
}

.score {
  font-size: 3rem;
  font-weight: 700;
  margin: 0;
}

.center {
  justify-content: center;
}
</style>
