<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { blogPosts } from '@/data/blog-posts'

const route = useRoute()

const post = computed(() => {
    return blogPosts.find((item) => item.id === route.params.id)
})
</script>

<template>
    <article v-if="post" class="post-detail">
        <header class="post-detail__header">
            <RouterLink class="post-detail__back" to="/">← 返回首页</RouterLink>
            <p class="post-detail__meta">{{ post.publishedAt }} · {{ post.readingTime }}</p>
            <h1 class="post-detail__title">{{ post.title }}</h1>
            <p class="post-detail__summary">{{ post.summary }}</p>
            <div class="post-detail__tags">
                <span v-for="tag in post.tags" :key="tag" class="post-detail__tag"># {{ tag }}</span>
            </div>
        </header>

        <section class="post-detail__content" v-html="post.content"></section>
    </article>

    <section v-else class="post-empty">
        <p class="post-empty__title">文章不存在</p>
        <p class="post-empty__description">当前链接未找到对应内容，可能文章已被移除或链接有误。</p>
        <RouterLink class="post-empty__back" to="/">返回首页继续浏览</RouterLink>
    </section>
</template>

<style scoped lang="scss">
.post-detail,
.post-empty {
    width: min(860px, 100%);
    margin: 0 auto;
    padding: 28px;
    border-radius: 28px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    background: rgba(255, 255, 255, 0.88);
    box-shadow: 0 18px 60px rgba(15, 23, 42, 0.06);
}

.post-detail {
    &__header {
        padding-bottom: 28px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.18);
    }

    &__back {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: #334155;
        font-size: 0.94rem;

        &:hover {
            color: #2563eb;
        }
    }

    &__meta {
        margin: 24px 0 0;
        color: #64748b;
        font-size: 0.9rem;
    }

    &__title {
        margin: 10px 0 0;
        font-size: clamp(2rem, 4vw, 3.3rem);
        line-height: 1.15;
        color: #0f172a;
    }

    &__summary {
        margin: 18px 0 0;
        color: #475569;
        font-size: 1.05rem;
        line-height: 1.8;
    }

    &__tags {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 18px;
    }

    &__tag {
        padding: 7px 12px;
        border-radius: 999px;
        background: #f8fafc;
        color: #334155;
        font-size: 0.86rem;
    }

    &__content {
        padding-top: 32px;
        color: #1e293b;
        font-size: 1.02rem;
        line-height: 1.9;
        overflow-wrap: anywhere;

        :deep(h2) {
            margin: 32px 0 14px;
            color: #0f172a;
            font-size: 1.55rem;
        }

        :deep(p),
        :deep(ul),
        :deep(ol),
        :deep(blockquote),
        :deep(figure) {
            margin: 16px 0;
        }

        :deep(ul),
        :deep(ol) {
            padding-left: 24px;
        }

        :deep(blockquote) {
            padding: 16px 18px;
            border-left: 4px solid #cbd5e1;
            background: #f8fafc;
            color: #334155;
            border-radius: 0 16px 16px 0;
        }

        :deep(code) {
            padding: 2px 6px;
            border-radius: 6px;
            background: #eff6ff;
            color: #1d4ed8;
        }

        :deep(img) {
            display: block;
            max-width: min(100%, 760px);
            width: auto;
            height: auto;
            margin: 24px auto;
            border-radius: 18px;
        }
    }
}

.post-empty {
    text-align: center;

    &__title {
        margin: 0;
        font-size: 1.3rem;
        font-weight: 700;
        color: #0f172a;
    }

    &__description {
        margin: 12px 0 22px;
        color: #64748b;
        line-height: 1.8;
    }

    &__back {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: #334155;
        font-size: 0.94rem;

        &:hover {
            color: #2563eb;
        }
    }
}
</style>
