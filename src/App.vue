<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import Home from './pages/Home.vue'
import Basics from './pages/Basics.vue'
import Sram from './pages/Sram.vue'
import Dram from './pages/Dram.vue'
import Versus from './pages/Versus.vue'
import Quiz from './pages/Quiz.vue'

/** Ordered list of pages. The order drives the nav and the "next up" button. */
const pages = [
  { path: '/', label: 'Home', component: Home },
  { path: '/basics', label: 'RAM 101', component: Basics },
  { path: '/sram', label: 'SRAM', component: Sram },
  { path: '/dram', label: 'DRAM', component: Dram },
  { path: '/versus', label: 'SRAM vs DRAM', component: Versus },
  { path: '/quiz', label: 'Quiz', component: Quiz },
]

/** Reads the route from the URL hash, e.g. "#/sram" becomes "/sram". */
function readPath() {
  return window.location.hash.slice(1) || '/'
}

const path = ref(readPath())
const menuOpen = ref(false)

function onHashChange() {
  path.value = readPath()
  menuOpen.value = false
  window.scrollTo(0, 0)
}

onMounted(() => window.addEventListener('hashchange', onHashChange))
onUnmounted(() => window.removeEventListener('hashchange', onHashChange))

const index = computed(() => {
  const found = pages.findIndex((p) => p.path === path.value)
  return found === -1 ? 0 : found
})
const current = computed(() => pages[index.value])
const next = computed(() => pages[index.value + 1])
</script>

<template>
  <header class="nav">
    <div class="wrap nav-inner">
      <a href="#/" class="logo">
        <span class="chip">RAM</span>
        <span>explained</span>
      </a>
      <button class="burger" @click="menuOpen = !menuOpen" aria-label="Menu">
        {{ menuOpen ? 'close' : 'menu' }}
      </button>
      <nav :class="{ open: menuOpen }">
        <a
          v-for="p in pages"
          :key="p.path"
          :href="'#' + p.path"
          :class="{ active: p.path === current.path }"
        >
          {{ p.label }}
        </a>
      </nav>
    </div>
  </header>

  <main>
    <component :is="current.component" :key="current.path" />
  </main>

  <section v-if="next" class="wrap next">
    <a :href="'#' + next.path" class="btn primary">Next up: {{ next.label }} &rarr;</a>
  </section>
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 2px solid var(--line);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  height: 64px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  text-decoration: none;
  font-size: 1.15rem;
}

.chip {
  font-family: 'JetBrains Mono', monospace;
  background: var(--ink);
  color: #fff;
  padding: 2px 8px;
  border-radius: 6px;
}

nav {
  display: flex;
  gap: 4px;
}

nav a {
  text-decoration: none;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 999px;
  border: 2px solid transparent;
}

nav a:hover {
  border-color: var(--line);
}

nav a.active {
  background: var(--yellow);
  border-color: var(--line);
  font-weight: 700;
}

.burger {
  display: none;
  font: inherit;
  font-weight: 700;
  border: 2px solid var(--line);
  border-radius: 999px;
  background: var(--bg);
  padding: 4px 14px;
  cursor: pointer;
}

.next {
  padding-top: 8px;
  padding-bottom: 48px;
  text-align: center;
}

.footer {
  border-top: 2px solid var(--soft);
  padding-top: 20px;
  padding-bottom: 32px;
  font-size: 0.9rem;
}

@media (max-width: 820px) {
  .burger {
    display: block;
  }

  nav {
    display: none;
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    flex-direction: column;
    background: var(--bg);
    border-bottom: 2px solid var(--line);
    padding: 12px 16px;
  }

  nav.open {
    display: flex;
  }
}
</style>
