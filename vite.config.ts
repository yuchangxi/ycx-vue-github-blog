import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// GitHub Pages 部署时会以仓库名作为站点根路径。
const repositoryName = 'ycx-vue-github-blog'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 读取当前模式下的环境变量，用于区分本地开发和 GitHub Pages 构建。
  const env = loadEnv(mode, process.cwd(), '')
  const isGithubPagesBuild = env.VITE_GITHUB_PAGES === 'true'

  return {
    // 部署到 GitHub Pages 时需要设置正确的基础路径，本地开发仍使用根路径。
    base: isGithubPagesBuild ? `/${repositoryName}/` : '/',
    server: {
      // 是否监听所有地址
      host: true,
      // 端口号
      port: 5173,
      // 端口被占用时，是否直接退出
      strictPort: false,
      // 是否自动打开浏览器
      open: true,
    },
    // 注册 Vue、JSX 和 Vue DevTools 插件。
    plugins: [vue(), vueJsx(), vueDevTools()],
    resolve: {
      alias: {
        // 将 @ 指向 src 目录，方便在项目中使用绝对路径导入。
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
