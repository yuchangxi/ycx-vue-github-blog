<script setup lang="ts">
import { RouterView, RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const isDev = import.meta.env.DEV
</script>

<template>
  <div class="app-shell">
    <header class="site-header">
      <div class="site-header__inner">
        <RouterLink class="site-title" to="/">Vue GitHub Blog</RouterLink>
        <nav class="site-nav">
          <RouterLink class="site-nav__link" to="/">首页</RouterLink>
          <RouterLink v-if="isDev" class="site-nav__link" to="/editor">
            本地编辑
          </RouterLink>
          <span class="site-nav__hint">
            {{ route.name === 'editor' ? '仅本地可用的创作入口' : '简约静态博客 / GitHub Pages' }}
          </span>
        </nav>
      </div>
    </header>

    <main class="site-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped lang="scss">
:global(*) {
  box-sizing: border-box;
}

:global(body) {
  margin: 0;
  font-family:
    Inter, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', system-ui, -apple-system,
    BlinkMacSystemFont, sans-serif;
  color: #111827;
  background: radial-gradient(circle at top,
      rgba(255, 255, 255, 0.95),
      rgba(244, 247, 251, 0.9) 40%,
      #eef2f7 100%);
}

:global(a) {
  color: inherit;
  text-decoration: none;
}

:global(#app) {
  min-height: 100vh;
}

.app-shell {
  min-height: 100vh;
  background-color: #C7EDCC;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(14px);
  background: rgba(255, 255, 255, 0.75);
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);

  &__inner {
    width: min(1100px, calc(100vw - 32px));
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 18px 0;
  }
}

.site-title {
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.site-nav {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: flex-end;

  &__link {
    color: #334155;
    font-size: 0.95rem;

    &:hover {
      color: #111827;
    }
  }

  &__hint {
    font-size: 0.85rem;
    color: #64748b;
  }
}

.site-main {
  width: min(1100px, calc(100vw - 32px));
  margin: 0 auto;
  padding: 40px 0 72px;
}

@media (max-width: 720px) {
  .site-header {
    &__inner {
      align-items: flex-start;
      flex-direction: column;
    }
  }

  .site-nav {
    justify-content: flex-start;
  }

  .site-main {
    padding-top: 28px;
  }
}
</style>
