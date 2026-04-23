import type { BlogPost } from '@/types/blog'

export const posts202603: BlogPost[] = [
  {
    id: 'qiankun主工程-vue3-vite子工程实战',
    title: 'qiankun主工程+vue3 vite子工程实战',
    summary: '文章摘要',
    tags: ['vite', 'qiankun微前端'],
    publishedAt: '2026-03-25',
    readingTime: '5 分钟',
    content:
      '<p>由于qiankun框架在2026年为止，官方文档还未正式支持子工程使用vite构建，只支持webpack构建的umd产物，本文记录使用qiankun+vue3+vite，以及社区插件vite-plugin-qiankun的使用过程。</p><p>一、为什么qiankun默认不能直接使用vite打包的子过程？</p><ul><li><span style="color: rgb(178, 107, 0);">qiankun</span>&nbsp;原生更擅长加载“HTML + script&nbsp;驱动”的子应用，底层依赖&nbsp;<code style="background-color: rgb(60, 60, 60); color: rgb(208, 208, 208);"><a href="about:blank" rel="noopener noreferrer" target="_blank">registerMicroApps()</a></code>&nbsp;注册入口，再通过&nbsp;<code style="background-color: rgb(60, 60, 60); color: rgb(208, 208, 208);">import-html-entry</code>&nbsp;一类机制解析入口 HTML、拉取脚本、执行脚本、拿到导出的生命周期。</li><li> <span style="color: rgb(102, 185, 102);">Vite </span>构建产物天然偏向&nbsp;ESM，开发态更是直接依赖浏览器原生模块系统，和&nbsp;<code style="background-color: rgb(60, 60, 60); color: rgb(208, 208, 208);">qiankun</code>&nbsp;早期那套“把脚本当普通 script 执行后从全局拿生命周期”的思路并不完全一致。</li></ul><p>二、vite-plugin-qiankun做了什么？</p><p><code style="color: rgb(208, 208, 208); background-color: rgb(60, 60, 60);"><a href="about:blank" rel="noopener noreferrer" target="_blank">vite-plugin-qiankun</a></code>&nbsp;做的事情，简单说就是把一个 Vite 子应用“包装”成&nbsp;看起来像 qiankun 能识别和调度的微应用。</p><p><img src="/blog-images/img_1774444807419.jpg"></p><p>三、具体代码<span style="color: rgb(102, 163, 224);">（只做演示，，伪代码）</span></p><p>1.主工程main.ts</p><pre class="ql-syntax" spellcheck="false">import { createApp } from \'vue\'\nimport App from \'./App.vue\'\nimport { registerMicroApps, start } from \'qiankun\'\nconst app = createApp(App)\napp.mount(\'#app\')\n// 注册微应用\nregisterMicroApps([\n&nbsp; {\n&nbsp; &nbsp; name: \'v3-admin-vite\',\n&nbsp; &nbsp; entry: \'/v3-admin-vite/\',\n&nbsp; &nbsp; container: \'#subapp-container\',\n&nbsp; &nbsp; activeRule: \'/v3-admin-vite\',\n&nbsp; }\n])\n// 启动 qiankun\nstart()\n</pre><p>2.子工程</p><ul><li>vite.config.ts中启用插件<a href="about:blank" rel="noopener noreferrer" target="_blank" class="ql-font-monospace">vite-plugin-qiankun</a></li></ul><pre class="ql-syntax" spellcheck="false">&nbsp;plugins: [\n&nbsp; &nbsp; &nbsp; vue(),\n&nbsp; &nbsp; &nbsp; qiankun(\'v3-admin-vite\', {\n&nbsp; &nbsp; &nbsp; &nbsp; useDevMode: true\n        &nbsp;})\n      ]\n</pre><ul><li>main.ts用&nbsp; renderWithQiankun暴露生命周期</li></ul><pre class="ql-syntax" spellcheck="false">import {\n&nbsp; type QiankunProps,\n&nbsp; qiankunWindow,\n&nbsp; renderWithQiankun\n} from "vite-plugin-qiankun/dist/helper"\nfunction initApp() {\n&nbsp; if (!qiankunWindow.__POWERED_BY_QIANKUN__) {\n&nbsp; &nbsp; console.log("%c 独立渲染", "color: red; font-size: 20px;")\n&nbsp; &nbsp; render()\n&nbsp; &nbsp; return\n&nbsp; }\n&nbsp; renderWithQiankun({\n&nbsp; &nbsp; mount(props) {\n&nbsp; &nbsp; &nbsp; console.log("%c qiankun 渲染", "color: red; font-size: 20px;")\n&nbsp; &nbsp; &nbsp; console.log(props)\n&nbsp; &nbsp; &nbsp; render(props)\n&nbsp; &nbsp; },\n&nbsp; &nbsp; bootstrap() {\n&nbsp; &nbsp; &nbsp; console.log("bootstrap")\n&nbsp; &nbsp; },\n&nbsp; &nbsp; unmount(props) {\n&nbsp; &nbsp; &nbsp; console.log("unmount", props)\n&nbsp; &nbsp; },\n&nbsp; &nbsp; update(props) {\n&nbsp; &nbsp; &nbsp; console.log("update", props)\n&nbsp; &nbsp; }\n&nbsp; })\n}\n\n\ninitApp()\n</pre><p>四、其他注意点</p><p>vite的base路径，也就是<span style="color: rgb(106, 153, 85);">公共基础路径，</span>生产环境会根据你的base路径来访问资源</p><ul><li>如果你的子工程只是部署在一套服务器里，那么base写你的服务器部署路径一般就可以了，比如<span style="color: rgb(106, 153, 85);">https://un-pany.github.io/v3-admin-vite/ 域名下就需要填写 /v3-admin-vite/</span></li></ul><p><br></p>',
  },
  {
    id: 'frontend-architecture-notes',
    title: '前端博客架构设计：从静态托管到本地创作',
    summary:
      '围绕 GitHub Pages 的静态部署场景，梳理博客项目的信息架构、内容管理方式与页面职责划分。',
    tags: ['架构设计', '静态站点', 'Vue'],
    publishedAt: '2026-03-01',
    readingTime: '6 分钟',
    content: `
      <h2>为什么选择静态博客</h2>
      <p>对于纯前端博客来说，静态部署的优势在于稳定、成本低、易于发布。配合 GitHub Pages，可以将构建产物直接托管到仓库页面，无需自建服务端。</p>
      <h2>内容组织建议</h2>
      <p>建议将博客内容抽象为统一的数据结构，包括标题、摘要、标签、发布时间、阅读时长以及正文 HTML。首页负责聚合浏览，详情页负责沉浸式阅读。</p>
      <blockquote>在线环境只做展示，本地环境承担创作与预览，是这类项目最实用的边界划分。</blockquote>
      <h2>页面拆分</h2>
      <ul>
        <li>首页：搜索、列表筛选、无限滚动</li>
        <li>详情页：正文展示、文章元信息</li>
        <li>编辑页：仅本地使用的富文本编辑器</li>
      </ul>
    `,
  },
  {
    id: 'design-minimal-blog-ui',
    title: '简约博客 UI 的实现思路',
    summary: '使用克制的配色、清晰的留白和层级分明的排版，建立一个适合长期阅读的博客界面。',
    tags: ['设计', 'UI', '可读性'],
    publishedAt: '2026-03-08',
    readingTime: '4 分钟',
    content: `
      <h2>视觉原则</h2>
      <p>简约并不意味着单调，关键在于减少无效装饰，把注意力还给标题、摘要与正文内容。</p>
      <h2>布局建议</h2>
      <p>首页采用单列内容流，配合卡片边界、柔和阴影和适当留白，让读者更容易聚焦于文章本身。</p>
      <p>详情页应突出正文区域，限制最大宽度并优化标题、段落、引用、列表之间的节奏。</p>
      <h2>交互细节</h2>
      <p>搜索框需要即时反馈；无限滚动应带有加载状态与结束提示，避免用户误以为页面卡住。</p>
    `,
  },
  {
    id: 'build-local-writing-workflow',
    title: '本地写作工作流：让博客创作更顺手',
    summary:
      '通过本地富文本编辑器进行草稿创作，导出 HTML 内容后回填到静态数据源中，兼顾效率与部署简洁度。',
    tags: ['工作流', '编辑器', '工程化'],
    publishedAt: '2026-03-15',
    readingTime: '5 分钟',
    content: `
      <h2>本地创作而非在线保存</h2>
      <p>由于 GitHub Pages 只适合静态托管，最合理的方式是将编辑能力保留在本地开发环境中，而不是尝试在浏览器端直接写入远程内容。</p>
      <h2>推荐流程</h2>
      <ol>
        <li>在本地编辑器中编写文章</li>
        <li>复制生成的 HTML 内容</li>
        <li>写入文章数据文件并提交代码</li>
      </ol>
      <p>这种方式虽然简单，但具备足够强的可维护性，并且与版本管理天然兼容。</p>
    `,
  },
  {
    id: 'search-and-infinite-scroll',
    title: '搜索与无限滚动如何在博客首页协同工作',
    summary:
      '搜索承担快速定位文章的职责，无限滚动承担连续浏览的职责，二者组合可以提升历史文章的可访问性。',
    tags: ['搜索', '无限滚动', '交互体验'],
    publishedAt: '2026-03-20',
    readingTime: '7 分钟',
    content: `
      <h2>搜索的职责</h2>
      <p>标题、摘要与标签都可以作为搜索索引来源。对于中小型博客，前端本地过滤已经足够高效。</p>
      <h2>无限滚动的职责</h2>
      <p>通过分批加载展示数据，可以有效控制初次渲染数量，同时保留“向下探索”的浏览体验。</p>
      <h2>组合策略</h2>
      <p>当搜索词变化时，应该重置已展示数量，从匹配结果的第一页重新开始，以确保交互结果可预测。</p>
    `,
  },
  {
    id: 'github-pages-deployment-guide',
    title: 'Vue 博客部署到 GitHub Pages 的注意事项',
    summary: '从路由模式、基础路径到静态资源引用，梳理部署到 GitHub Pages 时最常见的几个问题。',
    tags: ['GitHub Pages', '部署', 'Vite'],
    publishedAt: '2026-03-22',
    readingTime: '6 分钟',
    content: `
      <h2>基础路径配置</h2>
      <p>如果仓库不是用户主页仓库，则需要在构建配置中设置正确的 <code>base</code>，确保静态资源路径可用。</p>
      <h2>路由兼容性</h2>
      <p>GitHub Pages 不支持服务端回退，因此使用哈希路由比 HTML5 History 路由更稳妥。</p>
      <h2>发布建议</h2>
      <p>保持产物目录纯静态，避免依赖运行时服务；同时可以将部署流程接入 GitHub Actions，自动发布到 Pages。</p>
    `,
  },
  {
    id: 'content-taxonomy-for-frontend-blogs',
    title: '前端博客的内容分类法：标签、专题与归档',
    summary: '当文章数量持续增长时，合理的内容分类法能够显著降低读者查找成本，也利于作者长期维护。',
    tags: ['内容管理', '标签系统', '信息架构'],
    publishedAt: '2026-03-23',
    readingTime: '5 分钟',
    content: `
      <h2>标签用于横向聚合</h2>
      <p>标签适合跨主题的内容关联，例如把 Vue、性能优化、部署经验这类文章用统一维度串联起来。</p>
      <h2>归档用于纵向回顾</h2>
      <p>按月份进行归档，既便于维护数据文件，也方便后续扩展时间线页面或归档页。</p>
      <h2>专题用于深度组织</h2>
      <p>当某一方向内容足够多时，可以额外做成专题，例如“工程化实践”或“组件设计笔记”。</p>
    `,
  },
  {
    id: 'writing-readable-css-notes',
    title: '写出可读性更高的 SCSS：命名、层级与约束',
    summary: 'SCSS 并不只是嵌套语法，更重要的是通过命名与层级控制让样式更容易维护。',
    tags: ['SCSS', 'CSS', '可维护性'],
    publishedAt: '2026-03-24',
    readingTime: '4 分钟',
    content: `
      <h2>先有边界，再写嵌套</h2>
      <p>推荐先建立组件级类名边界，再在局部内部使用嵌套，而不是无限向下延伸选择器。</p>
      <h2>避免样式失控</h2>
      <p>在博客项目中，正文内容和壳层布局应隔离处理，避免编辑器样式污染阅读页样式。</p>
      <h2>统一视觉节奏</h2>
      <p>间距、边框圆角、阴影层级应尽量复用，使整个站点风格更稳定。</p>
    `,
  },
  {
    id: 'progressive-loading-for-article-list',
    title: '文章列表的渐进加载策略',
    summary: '当历史文章较多时，渐进加载可以平衡首屏速度与可浏览深度，是无限滚动实现的核心策略。',
    tags: ['性能', '列表加载', '无限滚动'],
    publishedAt: '2026-03-25',
    readingTime: '6 分钟',
    content: `
      <h2>首屏数量要克制</h2>
      <p>初始渲染不必一次展示全部内容，先展示少量高价值文章即可。</p>
      <h2>滚动触底要有预加载空间</h2>
      <p>通过交叉观察器配合较大的根边距，可以在用户真正触底前提前加载下一批内容。</p>
      <h2>搜索时重新分页</h2>
      <p>一旦搜索条件变化，应重置已显示数量，避免出现旧分页状态影响新结果的问题。</p>
    `,
  },
  {
    id: 'editor-preview-consistency',
    title: '让编辑器预览与最终阅读页保持一致',
    summary: '本地写作体验不应只关注录入效率，还要尽可能接近读者最终看到的排版效果。',
    tags: ['编辑器', '预览', '体验设计'],
    publishedAt: '2026-03-26',
    readingTime: '5 分钟',
    content: `
      <h2>预览不是附属功能</h2>
      <p>如果编辑器预览与阅读页差异过大，作者很难在写作阶段判断最终效果。</p>
      <h2>图片与标题样式要统一</h2>
      <p>正文中的标题、段落、引用与图片都应在编辑页和详情页中保持近似排版规则。</p>
      <h2>复制出的 HTML 要可控</h2>
      <p>保持输出内容简单、稳定，避免引入过度复杂的内联结构，有助于后续维护。</p>
    `,
  },
  {
    id: 'static-blog-image-guidelines',
    title: '静态博客中的图片规范：尺寸、比例与容错',
    summary: '图片往往是最容易破坏版面的内容元素，提前建立宽度与溢出规则可以减少显示问题。',
    tags: ['图片处理', '排版', '静态站点'],
    publishedAt: '2026-03-27',
    readingTime: '5 分钟',
    content: `
      <h2>默认宽度策略</h2>
      <p>正文图片建议统一设置为 <code>max-width: 100%</code> 和自动高度，防止超宽图片撑破容器。</p>
      <h2>必要时限制最大显示宽度</h2>
      <p>在大屏下也可以给图片增加一个温和的最大宽度，并居中显示，使阅读节奏更稳定。</p>
      <h2>兼顾编辑器与阅读页</h2>
      <p>这套规则应同时作用于本地编辑页预览和线上详情页，以减少样式不一致。</p>
    `,
  },
  {
    id: 'frontend-notes-on-search-indexes',
    title: '小型博客如何构建前端搜索索引',
    summary: '当文章规模仍在可控范围内时，基于标题、摘要和标签的前端本地搜索通常已经足够。',
    tags: ['搜索', '前端索引', '实现方案'],
    publishedAt: '2026-03-28',
    readingTime: '4 分钟',
    content: `
      <h2>先从轻量方案开始</h2>
      <p>不必一开始就引入复杂检索服务，简单的字符串匹配足以满足大多数个人博客需求。</p>
      <h2>索引字段如何选择</h2>
      <p>标题决定精确命中，摘要提供上下文，标签补充分类语义，三者结合体验通常较好。</p>
      <h2>何时升级</h2>
      <p>只有当文章数量与搜索需求继续增长时，再考虑引入更强的静态索引或服务端检索。</p>
    `,
  },
  {
    id: 'building-archive-pages-later',
    title: '为什么现在就应该为归档页做数据准备',
    summary: '即使当前没有独立归档页，按月拆分数据源也能为后续扩展提供稳定基础。',
    tags: ['归档', '数据设计', '可扩展性'],
    publishedAt: '2026-03-29',
    readingTime: '5 分钟',
    content: `
      <h2>拆分不是过度设计</h2>
      <p>当文章数逐步增加，单文件维护成本会上升，按月拆分可以让内容边界更加明确。</p>
      <h2>后续扩展更自然</h2>
      <p>未来若增加年度归档、月度汇总、RSS 或 sitemap 生成逻辑，分段数据结构会更加顺手。</p>
      <h2>保持导出层统一</h2>
      <p>业务页面仍然只依赖一个聚合导出，既不增加页面复杂度，也方便未来重构。</p>
    `,
  },
  {
    id: 'how-gzip-and-brotli-work-in-frontend-deployment',
    title: '前端部署中的 gzip 与 br 压缩：构建、Nginx 与验证方法',
    summary:
      '梳理 gzip 与 Brotli 在前端静态资源场景中的作用边界，说明何时由服务器压缩、何时使用预压缩文件，以及 Nginx 应如何配置。',
    tags: ['性能优化', 'gzip', 'Brotli', 'Nginx'],
    publishedAt: '2026-03-30',
    readingTime: '8 分钟',
    content: `
      <h2>为什么前端项目总会提到压缩</h2>
      <p>前端页面最终交付给浏览器的核心资源通常是 HTML、CSS、JavaScript、JSON 和 SVG。这些文本类内容如果直接传输，体积往往偏大，而 gzip 与 br 的目标就是在传输阶段减小体积，降低下载时间。</p>
      <p>需要注意的是，压缩发生在“网络响应”这一层，而不是业务代码层。也就是说，浏览器拿到的依然是同一份资源，只是传输时被压缩了，解压工作由浏览器自动完成。</p>
      <h2>gzip 和 br 的区别</h2>
      <p>gzip 是使用历史更久、兼容性极强的压缩方式，几乎所有服务器和客户端都支持。br 指的是 Brotli，通常对 JavaScript、CSS、HTML 这类文本内容有更高的压缩率，因此现代浏览器往往更偏向使用 <code>br</code>。</p>
      <blockquote>对前端静态资源来说，常见策略不是“二选一”，而是同时提供 gzip 和 br，让浏览器按自身能力协商选择。</blockquote>
      <h2>前端项目需要做什么</h2>
      <p>这里最容易混淆的点是：前端构建工具并不直接决定线上是否启用压缩。真正决定浏览器拿到 <code>Content-Encoding: gzip</code> 还是 <code>Content-Encoding: br</code> 的，是服务器或 CDN。</p>
      <p>前端项目主要做两类事情：</p>
      <ul>
        <li>尽量生成更小的构建产物，例如合理拆包、移除无用代码、压缩资源。</li>
        <li>在构建阶段额外生成 <code>.gz</code> 和 <code>.br</code> 预压缩文件，供支持的服务器直接返回。</li>
      </ul>
      <h2>运行时压缩与预压缩</h2>
      <p>运行时压缩指的是服务器在收到请求后，现场把 <code>index.js</code> 压缩成 gzip 或 br 再返回。这种方式配置简单，但每次请求都会消耗一定 CPU。</p>
      <p>预压缩则是在构建阶段提前生成 <code>index.js.gz</code> 或 <code>index.js.br</code>。当浏览器请求 <code>index.js</code> 时，服务器如果发现对应的预压缩文件存在，就可以直接返回它，从而减少运行时开销。</p>
      <h2>Vite 场景如何生成预压缩文件</h2>
      <p>在 Vue + Vite 项目中，常见做法是使用 <code>vite-plugin-compression</code>。这样构建后除了原始资源外，还会多出对应的 <code>.gz</code> 或 <code>.br</code> 文件。</p>
      <pre><code>import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    vue(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240,
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
    }),
  ],
})</code></pre>
      <p>这段配置的含义很直接：构建时为大于 10KB 的资源额外生成 gzip 与 Brotli 版本，但原始文件仍然保留。</p>
      <h2>Nginx 运行时 gzip 配置</h2>
      <p>如果你的站点部署在自己的 Nginx 服务器上，最简单的方式是先启用运行时 gzip：</p>
      <pre><code>gzip on;
gzip_comp_level 6;
gzip_min_length 1024;
gzip_vary on;
gzip_proxied any;
gzip_types
  text/plain
  text/css
  text/xml
  text/javascript
  application/javascript
  application/json
  application/xml
  application/rss+xml
  image/svg+xml
  text/html;</code></pre>
      <p>这套配置适合大多数基础场景。服务器会根据浏览器发送的 <code>Accept-Encoding</code> 头，决定是否返回 gzip 压缩内容。</p>
      <h2>Nginx 预压缩 gzip 与 br 配置</h2>
      <p>如果你已经在构建阶段生成了 <code>.gz</code> 与 <code>.br</code> 文件，更推荐让 Nginx 直接使用这些文件：</p>
      <pre><code>gzip on;
gzip_static on;
gzip_vary on;
gzip_types text/plain text/css application/javascript application/json image/svg+xml text/html;

brotli on;
brotli_static on;
brotli_comp_level 5;
brotli_min_length 1024;
brotli_types text/plain text/css application/javascript application/json image/svg+xml text/html;</code></pre>
      <p>其中 <code>gzip_static on</code> 表示优先返回同名的 <code>.gz</code> 文件，<code>brotli_static on</code> 则表示优先返回 <code>.br</code> 文件。需要注意，Brotli 往往依赖额外的 Nginx 模块支持，并不是所有环境默认都能直接使用。</p>
      <h2>哪些资源适合压缩</h2>
      <p>适合压缩的通常是文本类资源，例如 HTML、CSS、JavaScript、JSON 和 SVG。像 JPG、PNG、WebP、MP4、ZIP 这类本身已经经过压缩的二进制文件，一般不需要再次启用 gzip 或 br。</p>
      <h2>如何验证是否真的生效</h2>
      <p>验证压缩是否成功，不能只看构建目录中有没有 <code>.gz</code> 或 <code>.br</code> 文件，更关键的是看实际响应头。</p>
      <ol>
        <li>打开浏览器开发者工具，在 Network 面板中查看具体资源请求。</li>
        <li>检查响应头里是否存在 <code>Content-Encoding: gzip</code> 或 <code>Content-Encoding: br</code>。</li>
        <li>也可以使用命令行执行 <code>curl --compressed -I https://your-domain.com/assets/index.js</code> 进行确认。</li>
      </ol>
      <p>只有当响应头明确返回了对应的 <code>Content-Encoding</code>，才能说明线上压缩真正生效。</p>
      <h2>静态托管平台要单独看待</h2>
      <p>像 GitHub Pages 这样的静态托管平台，压缩通常由平台自身的 CDN 负责。即使你的项目没有显式生成 <code>.gz</code> 或 <code>.br</code> 文件，平台也可能自动返回压缩后的响应。因此这类场景下，是否成功主要看平台的实际响应，而不是只看前端构建配置。</p>
      <h2>适合前端项目的实践建议</h2>
      <p>如果只是普通博客或中小型站点，开启 Nginx 运行时 gzip 已经足够。如果是更重视性能的静态站点，推荐构建阶段同时生成 <code>.gz</code> 与 <code>.br</code>，再让 Nginx 通过静态压缩文件直接响应。这样既能保持兼容性，也能让现代浏览器优先获得更小的 Brotli 资源。</p>
    `,
  },
]
