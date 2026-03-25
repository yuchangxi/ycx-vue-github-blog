<script setup lang="ts">
import { computed, nextTick, onMounted, ref, shallowRef } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'

type QuillEditorInstance = InstanceType<typeof QuillEditor>

const title = ref('')
const summary = ref('')
const tagsInput = ref('Vue, 博客')
const editorContent = ref('<p>在这里开始撰写正文内容...</p>')
const imagePathInput = ref('/blog-images/example-cover.svg')
const editorRef = shallowRef<QuillEditorInstance | null>(null)
const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '')

const resolvePublicAssetPath = (source: string) => {
    if (!source.startsWith('/')) {
        return source
    }

    return baseUrl ? `${baseUrl}${source}` : source
}

const normalizeImageSource = (source: string) => {
    const trimmedSource = source.trim()

    if (!trimmedSource) {
        return ''
    }

    if (trimmedSource.startsWith('data:')) {
        return trimmedSource
    }

    if (trimmedSource.startsWith('blob:')) {
        return trimmedSource
    }

    if (trimmedSource.startsWith('http://') || trimmedSource.startsWith('https://')) {
        try {
            const currentOrigin = window.location.origin
            const url = new URL(trimmedSource, currentOrigin)

            if (url.origin === currentOrigin) {
                return resolvePublicAssetPath(`${url.pathname}${url.search}${url.hash}`)
            }

            return trimmedSource
        } catch {
            return trimmedSource
        }
    }

    if (trimmedSource.startsWith('/')) {
        return resolvePublicAssetPath(trimmedSource)
    }

    return resolvePublicAssetPath(`/${trimmedSource.replace(/^\.\//, '')}`)
}

const normalizeHtmlContent = (html: string) => {
    return html.replace(/src=("|')([^"']+)(\1)/g, (_match, quote: string, src: string) => {
        const normalizedSource = normalizeImageSource(src)
        return `src=${quote}${normalizedSource}${quote}`
    })
}

const syncEditorContent = () => {
    const quill = editorRef.value?.getQuill()

    if (!quill) {
        return
    }

    editorContent.value = normalizeHtmlContent(quill.root.innerHTML)
}

const normalizedEditorContent = computed(() => normalizeHtmlContent(editorContent.value))

const insertImageByPath = async (customPath?: string) => {
    const normalizedPath = normalizeImageSource(customPath ?? imagePathInput.value)

    if (!normalizedPath) {
        return
    }

    imagePathInput.value = normalizedPath

    const quill = editorRef.value?.getQuill()

    if (!quill) {
        editorContent.value = normalizeHtmlContent(
            `${editorContent.value}<p><img src="${normalizedPath}" alt="" /></p>`,
        )
        return
    }

    const selection = quill.getSelection(true)
    const insertIndex = selection?.index ?? quill.getLength()

    quill.clipboard.dangerouslyPasteHTML(insertIndex, `<p><img src="${normalizedPath}" alt="" /></p>`, 'user')
    quill.setSelection(insertIndex + 1, 0, 'user')

    await nextTick()
    editorContent.value = normalizeHtmlContent(quill.root.innerHTML)
}

const handleToolbarImage = () => {
    const inputPath = window.prompt(
        '请输入图片路径，例如 /blog-images/example-cover.svg。建议先把图片放到 public/blog-images 目录下。',
        imagePathInput.value,
    )

    if (!inputPath) {
        return
    }

    insertImageByPath(inputPath)
}

const initializeToolbarHandler = async () => {
    await nextTick()

    const quill = editorRef.value?.getQuill()
    const toolbar = quill?.getModule('toolbar') as { addHandler?: (name: string, handler: () => void) => void } | undefined

    toolbar?.addHandler?.('image', handleToolbarImage)
}

onMounted(() => {
    initializeToolbarHandler()
})

const generatedPostObject = computed(() => {
    const id = title.value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '')

    const tags = tagsInput.value
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)

    return `{
  id: '${id || 'new-post-id'}',
  title: '${title.value || '文章标题'}',
  summary: '${summary.value || '文章摘要'}',
  tags: ${JSON.stringify(tags)},
  publishedAt: '${new Date().toISOString().slice(0, 10)}',
  readingTime: '5 分钟',
  content: ${JSON.stringify(normalizedEditorContent.value)},
}`
})
</script>

<template>
    <section class="editor-page">
        <header class="editor-page__header">
            <div>
                <p class="editor-page__eyebrow">Local Writing Studio</p>
                <h1 class="editor-page__title">本地富文本编辑器</h1>
                <p class="editor-page__description">
                    该页面仅用于本地开发时写作与预览，不提供在线保存。完成编辑后，可将生成的数据对象复制到
                    <code>src/data/posts/202603.ts</code> 这类按月份拆分的数据文件中。
                </p>
            </div>
            <div class="editor-page__notice">
                推荐将图片放到 <code>public/blog-images</code> 下，并使用 <code>/blog-images/xxx.svg</code>
                这类公共资源路径插入，编辑器会自动补齐当前站点的基础路径，便于本地预览与 GitHub Pages 发布。
            </div>
        </header>

        <section class="editor-grid">
            <div class="editor-panel editor-form">
                <div class="editor-panel__head">
                    <p class="editor-panel__label">编辑区</p>
                    <p class="editor-panel__hint">扩大正文编辑区域，适合长文和图片内容录入。</p>
                </div>

                <label class="editor-field">
                    <span>文章标题</span>
                    <input v-model="title" type="text" placeholder="请输入文章标题" />
                </label>

                <label class="editor-field">
                    <span>文章摘要</span>
                    <textarea v-model="summary" rows="4" placeholder="请输入摘要，用于首页列表展示"></textarea>
                </label>

                <label class="editor-field">
                    <span>标签（英文逗号分隔）</span>
                    <input v-model="tagsInput" type="text" placeholder="Vue, GitHub Pages, 工程化" />
                </label>

                <div class="editor-field editor-field--image-helper">
                    <span>图片路径插入</span>
                    <div class="image-helper">
                        <input v-model="imagePathInput" type="text" placeholder="例如 /blog-images/example-cover.svg" />
                        <button type="button" class="image-helper__button" @click="insertImageByPath()">
                            插入图片
                        </button>
                    </div>
                    <p class="editor-field__tip">
                        工具栏中的图片按钮已改为“输入根路径插图”，不会再写入过长的本地临时地址；若要正常预览，请把图片放在
                        <code>public/blog-images</code> 下。
                    </p>
                </div>

                <div class="editor-field editor-field--richtext">
                    <span>正文内容</span>
                    <div class="editor-richtext-shell">
                        <QuillEditor ref="editorRef" v-model:content="editorContent" toolbar="full" content-type="html"
                            theme="snow" @ready="initializeToolbarHandler" @update:content="syncEditorContent" />
                    </div>
                    <details class="editor-field editor-field--html-fallback">
                        <summary>HTML 源码编辑（兜底）</summary>
                        <textarea v-model="editorContent" rows="12"
                            placeholder="如果富文本区域异常，可直接在这里编辑 HTML 内容，预览与导出会实时同步。"></textarea>
                    </details>
                </div>
            </div>

            <div class="editor-side">
                <div class="editor-panel preview-panel">
                    <div>
                        <p class="preview-panel__label">实时预览</p>
                        <h2 class="preview-panel__title">{{ title || '文章标题预览' }}</h2>
                        <p class="preview-panel__summary">{{ summary || '这里会显示文章摘要。' }}</p>
                        <div class="preview-panel__tags">
                            <span v-for="tag in tagsInput
                                .split(',')
                                .map((item) => item.trim())
                                .filter(Boolean)" :key="tag">
                                # {{ tag }}
                            </span>
                        </div>
                    </div>

                    <div class="preview-panel__content" v-html="normalizedEditorContent"></div>
                </div>

                <div class="editor-panel code-export">
                    <p class="preview-panel__label">可复制的数据对象</p>
                    <pre>{{ generatedPostObject }}</pre>
                </div>
            </div>
        </section>
    </section>
</template>

<style scoped lang="scss">
.editor-page {
    display: grid;
    gap: 24px;

    &__header,
    .editor-panel {
        border: 1px solid rgba(148, 163, 184, 0.18);
        background: rgba(255, 255, 255, 0.9);
        border-radius: 28px;
        box-shadow: 0 18px 60px rgba(15, 23, 42, 0.05);
    }

    &__header {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        padding: 28px;
    }

    &__eyebrow {
        margin: 0 0 8px;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: #64748b;
    }

    &__title {
        margin: 0;
        font-size: clamp(1.9rem, 4vw, 2.8rem);
        color: #0f172a;
    }

    &__description {
        width: min(760px, 100%);
        margin: 14px 0 0;
        line-height: 1.8;
        color: #475569;

        code {
            padding: 2px 6px;
            border-radius: 6px;
            background: #eff6ff;
            color: #1d4ed8;
        }
    }

    &__notice {
        max-width: 320px;
        padding: 16px 18px;
        border-radius: 20px;
        background: #f8fafc;
        color: #475569;
        line-height: 1.8;

        code {
            padding: 2px 6px;
            border-radius: 6px;
            background: #eff6ff;
            color: #1d4ed8;
        }
    }
}

.editor-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.45fr) minmax(360px, 0.75fr);
    gap: 24px;
    align-items: start;
}

.editor-side {
    display: grid;
    gap: 24px;
    position: sticky;
    top: 96px;
}

.editor-panel {
    padding: 24px;

    &__head {
        display: grid;
        gap: 6px;
        padding-bottom: 16px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.18);
    }

    &__label {
        margin: 0;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: #64748b;
    }

    &__hint {
        margin: 0;
        color: #475569;
        line-height: 1.7;
    }
}

.editor-form {
    display: grid;
    gap: 18px;
}

.editor-field {
    display: grid;
    gap: 8px;

    span {
        color: #334155;
        font-size: 0.92rem;
        font-weight: 600;
    }

    input,
    textarea {
        width: 100%;
        border: 1px solid rgba(148, 163, 184, 0.35);
        border-radius: 16px;
        padding: 14px 16px;
        font-size: 0.95rem;
        color: #0f172a;
        outline: none;
        resize: vertical;
    }

    code {
        padding: 2px 6px;
        border-radius: 6px;
        background: #eff6ff;
        color: #1d4ed8;
    }

    input:focus,
    textarea:focus {
        border-color: #0f172a;
        box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.06);
    }

    &__tip {
        margin: 0;
        color: #64748b;
        line-height: 1.7;
        font-size: 0.88rem;
    }

    &--image-helper {
        padding: 16px;
        border-radius: 20px;
        background: #f8fafc;
    }

    &--richtext {
        .editor-richtext-shell {
            border-radius: 20px;
            overflow: hidden;
            border: 1px solid rgba(148, 163, 184, 0.35);
            background: #fff;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
        }

        :deep(.ql-toolbar.ql-snow),
        :deep(.ql-container.ql-snow) {
            border-color: rgba(148, 163, 184, 0.35);
        }

        :deep(.ql-toolbar.ql-snow) {
            position: sticky;
            top: 0;
            z-index: 2;
            padding: 10px;
            border: none;
            border-bottom: 1px solid rgba(148, 163, 184, 0.25);
            background: #fff;
        }

        :deep(.ql-container.ql-snow) {
            min-height: 760px;
            border: none;
            font-size: 1rem;
            background: #fff;
        }

        :deep(.ql-editor) {
            min-height: 720px;
            padding: 24px 28px;
            line-height: 1.9;
            font-size: 1rem;

            img {
                display: block;
                max-width: min(100%, 860px);
                width: auto;
                height: auto;
                margin: 20px auto;
                border-radius: 16px;
            }
        }

    }

    &--html-fallback {
        margin-top: 16px;
        padding: 16px;
        border: 1px dashed rgba(148, 163, 184, 0.4);
        border-radius: 16px;
        background: #f8fafc;

        summary {
            cursor: pointer;
            font-weight: 600;
            color: #334155;
        }

        textarea {
            min-height: 240px;
            margin-top: 14px;
            font-family: Consolas, 'Courier New', monospace;
            line-height: 1.7;
        }
    }
}

.image-helper {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 12px;
    align-items: center;

    &__button {
        border: none;
        border-radius: 14px;
        padding: 12px 18px;
        background: #0f172a;
        color: #fff;
        cursor: pointer;
        font-size: 0.92rem;

        &:hover {
            background: #1e293b;
        }
    }
}

.preview-panel {
    display: grid;
    gap: 22px;
    align-content: start;

    &__label {
        margin: 0 0 8px;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: #64748b;
    }

    &__title {
        margin: 0;
        font-size: 2rem;
        line-height: 1.2;
        color: #0f172a;
    }

    &__summary {
        margin: 14px 0 0;
        color: #475569;
        line-height: 1.8;
    }

    &__tags {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 16px;

        span {
            padding: 7px 12px;
            border-radius: 999px;
            background: #f8fafc;
            color: #334155;
            font-size: 0.86rem;
        }
    }

    &__content {
        padding-top: 8px;
        border-top: 1px solid rgba(148, 163, 184, 0.18);
        color: #1e293b;
        line-height: 1.9;
        overflow-wrap: anywhere;

        :deep(h1),
        :deep(h2),
        :deep(h3) {
            color: #0f172a;
        }

        :deep(img) {
            display: block;
            max-width: min(100%, 560px);
            width: auto;
            height: auto;
            margin: 20px auto;
            border-radius: 16px;
        }
    }
}

.code-export {
    pre {
        margin: 0;
        padding: 18px;
        overflow: auto;
        border-radius: 18px;
        background: #0f172a;
        color: #e2e8f0;
        font-size: 0.86rem;
        line-height: 1.7;
    }
}

@media (max-width: 1180px) {
    .editor-grid {
        grid-template-columns: 1fr;
    }

    .editor-side {
        position: static;
    }

    .editor-field {
        &--richtext {
            :deep(.ql-container.ql-snow) {
                min-height: 620px;
            }

            :deep(.ql-editor) {
                min-height: 580px;
            }
        }
    }
}

@media (max-width: 960px) {
    .editor-page {
        &__header {
            flex-direction: column;
        }

        &__notice {
            max-width: none;
        }
    }
}

@media (max-width: 720px) {
    .image-helper {
        grid-template-columns: 1fr;
    }
}
</style>
