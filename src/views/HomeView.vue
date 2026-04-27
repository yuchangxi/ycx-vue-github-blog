<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'

import { blogPosts } from '@/data/blog-posts'
import type { BlogFilter } from '@/types/blog'

const categoryOptions: BlogFilter[] = ['全部', '前端', '后端', '其他']
const searchKeyword = ref('')
const activeCategory = ref<BlogFilter>('全部')
// 当前已渲染的文章数量；首页初次只展示首批数据，后续通过无限滚动逐步增加。
const visibleCount = ref(3)
// 每次触底后新增加载的文章数量。
const batchSize = 3
// 列表底部的哨兵元素，交给 IntersectionObserver 监听是否进入视口。
const sentinel = ref<HTMLElement | null>(null)

const sortedPosts = [...blogPosts].sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
})

const hasActiveSearch = computed(() => searchKeyword.value.trim().length > 0)
const hasActiveCategoryFilter = computed(() => activeCategory.value !== '全部')
const hasActiveFilter = computed(() => hasActiveSearch.value || hasActiveCategoryFilter.value)

const filteredPosts = computed(() => {
    const keyword = searchKeyword.value.trim().toLowerCase()

    return sortedPosts.filter((post) => {
        const matchesCategory = activeCategory.value === '全部' || post.category === activeCategory.value
        const searchableText = [post.title, post.summary, post.tags.join(' ')].join(' ').toLowerCase()
        const matchesKeyword = !keyword || searchableText.includes(keyword)

        return matchesCategory && matchesKeyword
    })
})

// 只截取当前应展示的文章数量，形成“看起来像分页加载”的可视列表。
const visiblePosts = computed(() => filteredPosts.value.slice(0, visibleCount.value))
// 是否还有未展示的文章；没有更多数据时就停止继续追加。
const hasMore = computed(() => visibleCount.value < filteredPosts.value.length)

// 每当触发到底部加载时，按 batchSize 向后多展示一批文章。
const loadMore = () => {
    if (!hasMore.value) return
    visibleCount.value = Math.min(visibleCount.value + batchSize, filteredPosts.value.length)
}

const resetFilters = () => {
    searchKeyword.value = ''
    activeCategory.value = '全部'
    visibleCount.value = batchSize
}

// 搜索词或分类变化时，重置展示数量，避免沿用旧的滚动进度导致筛选结果显示异常。
watch([searchKeyword, activeCategory], () => {
    visibleCount.value = batchSize
})

// 当筛选结果重新出现数据时，确保至少恢复一批展示内容。
watch(
    filteredPosts,
    (posts) => {
        if (posts.length > 0 && visibleCount.value === 0) {
            visibleCount.value = batchSize
        }
    },
    { immediate: true },
)

let observer: IntersectionObserver | null = null

// 无限滚动核心：
// 1. 监听列表底部 sentinel 元素；
// 2. 当它进入视口（或接近视口）时，触发 loadMore；
// 3. loadMore 只增加 visibleCount，不请求后端，因此这是纯前端静态数据的“渐进渲染”。
onMounted(() => {
    observer = new IntersectionObserver(
        (entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
                loadMore()
            }
        },
        {
            // 提前 160px 预加载，滚动体验更顺滑，避免用户真正触底后才看到新增内容。
            rootMargin: '160px 0px',
        },
    )

    if (sentinel.value) {
        observer.observe(sentinel.value)
    }
})

// 页面卸载时断开观察器，避免内存泄漏。
onBeforeUnmount(() => {
    observer?.disconnect()
})
</script>

<template>
    <section class="hero-section">
        <p class="hero-section__eyebrow">Frontend Blog Framework</p>
        <h1 class="hero-section__title">面向 GitHub Pages 的简约博客</h1>
        <p class="hero-section__description">
            首页提供历史文章浏览、实时搜索与无限滚动；详情页专注阅读体验；本地开发环境保留富文本创作能力。
        </p>
    </section>

    <section class="toolbar-card">
        <div class="toolbar-card__meta">
            <strong>{{ filteredPosts.length }}</strong>
            <span>{{ hasActiveFilter ? '篇筛选结果' : '篇可浏览文章' }}</span>
        </div>
        <div class="toolbar-card__filters">
            <div class="category-filter">
                <span class="category-filter__label">标签</span>
                <div class="category-filter__list">
                    <button
                        v-for="category in categoryOptions"
                        :key="category"
                        class="category-filter__item"
                        :class="{ 'category-filter__item--active': activeCategory === category }"
                        type="button"
                        @click="activeCategory = category"
                    >
                        {{ category }}
                    </button>
                </div>
            </div>
            <div class="toolbar-card__actions">
                <label class="search-box">
                    <span class="search-box__label">搜索</span>
                    <input v-model="searchKeyword" class="search-box__input" type="text" placeholder="按标题、摘要或标签检索文章" />
                </label>
                <button v-if="hasActiveFilter" class="toolbar-card__reset" type="button" @click="resetFilters">
                    清空筛选
                </button>
            </div>
        </div>
    </section>

    <section class="posts-section">
        <article v-for="post in visiblePosts" :key="post.id" class="post-card">
            <div class="post-card__meta">
                <span>{{ post.publishedAt }}</span>
                <span>{{ post.readingTime }}</span>
                <span>{{ post.category }}</span>
            </div>
            <RouterLink class="post-card__title" :to="`/post/${post.id}`">
                {{ post.title }}
            </RouterLink>
            <p class="post-card__summary">{{ post.summary }}</p>
            <div class="post-card__tags">
                <span v-for="tag in post.tags" :key="tag" class="post-card__tag"># {{ tag }}</span>
            </div>
        </article>

        <div v-if="!filteredPosts.length" class="empty-state">
            <p class="empty-state__title">未找到匹配文章</p>
            <p class="empty-state__description">可以尝试切换标签、缩短关键词，或者直接浏览全部历史文章。</p>
            <button class="empty-state__reset" type="button" @click="resetFilters">返回全部文章</button>
        </div>

        <div ref="sentinel" class="load-status">
            <template v-if="filteredPosts.length">
                <p v-if="hasMore">继续向下滚动，自动加载更多文章…</p>
                <p v-else>{{ hasActiveFilter ? '筛选结果已全部展示' : '已经加载完全部文章' }}</p>
            </template>
        </div>
    </section>
</template>

<style scoped lang="scss">
.hero-section {
    padding: 20px 0 32px;

    &__eyebrow {
        margin: 0 0 10px;
        color: #475569;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
    }

    &__title {
        margin: 0;
        font-size: clamp(2rem, 5vw, 3.8rem);
        line-height: 1.05;
        color: #0f172a;
    }

    &__description {
        width: min(760px, 100%);
        margin: 18px 0 0;
        color: #475569;
        font-size: 1.02rem;
        line-height: 1.8;
    }
}

.toolbar-card,
.post-card,
.empty-state,
.load-status {
    border: 1px solid rgba(148, 163, 184, 0.18);
    background: rgba(255, 255, 255, 0.82);
    border-radius: 24px;
    box-shadow: 0 18px 60px rgba(15, 23, 42, 0.05);
}

.toolbar-card {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    padding: 20px 22px;
    margin-bottom: 24px;

    &__meta {
        display: flex;
        align-items: baseline;
        gap: 10px;
        color: #475569;

        strong {
            font-size: 1.8rem;
            color: #0f172a;
        }
    }

    &__filters {
        display: flex;
        flex-direction: column;
        gap: 16px;
        width: min(620px, 100%);
    }

    &__actions {
        display: flex;
        align-items: flex-end;
        gap: 12px;
        width: 100%;
    }

    &__reset {
        border: none;
        border-radius: 16px;
        padding: 14px 18px;
        background: #0f172a;
        color: #fff;
        white-space: nowrap;
        cursor: pointer;

        &:hover {
            background: #1e293b;
        }
    }
}

.category-filter {
    display: flex;
    flex-direction: column;
    gap: 10px;

    &__label {
        font-size: 0.85rem;
        color: #64748b;
    }

    &__list {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    &__item {
        border: 1px solid rgba(148, 163, 184, 0.35);
        border-radius: 999px;
        padding: 10px 16px;
        background: #fff;
        color: #334155;
        font-size: 0.9rem;
        line-height: 1;
        cursor: pointer;
        transition:
            color 0.2s ease,
            border-color 0.2s ease,
            background-color 0.2s ease,
            box-shadow 0.2s ease;

        &:hover {
            border-color: #94a3b8;
            color: #0f172a;
        }

        &--active {
            border-color: #0f172a;
            background: #0f172a;
            color: #fff;
            box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
        }
    }
}

.search-box {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;

    &__label {
        font-size: 0.85rem;
        color: #64748b;
    }

    &__input {
        width: 100%;
        border: 1px solid rgba(148, 163, 184, 0.35);
        border-radius: 16px;
        padding: 14px 16px;
        font-size: 0.95rem;
        color: #0f172a;
        background: #fff;
        outline: none;

        &:focus {
            border-color: #0f172a;
            box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.06);
        }
    }
}

.posts-section {
    display: grid;
    gap: 18px;
}

.post-card {
    padding: 24px;
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 22px 70px rgba(15, 23, 42, 0.08);
    }

    &__meta {
        display: flex;
        gap: 14px;
        flex-wrap: wrap;
        font-size: 0.88rem;
        color: #64748b;
    }

    &__title {
        display: inline-block;
        margin-top: 10px;
        font-size: clamp(1.35rem, 3vw, 1.8rem);
        font-weight: 700;
        line-height: 1.3;
        color: #0f172a;

        &:hover {
            color: #2563eb;
        }
    }

    &__summary {
        margin: 14px 0 0;
        font-size: 1rem;
        line-height: 1.8;
        color: #475569;
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
}

.empty-state,
.load-status {
    padding: 28px 24px;
    text-align: center;
    color: #64748b;
}

.empty-state {
    &__title {
        margin: 0;
        color: #0f172a;
        font-size: 1.1rem;
        font-weight: 700;
    }

    &__description {
        margin: 10px 0 0;
    }

    &__reset {
        margin-top: 16px;
        border: none;
        border-radius: 14px;
        padding: 12px 18px;
        background: #0f172a;
        color: #fff;
        cursor: pointer;

        &:hover {
            background: #1e293b;
        }
    }
}

.load-status {
    font-size: 0.94rem;
}

@media (max-width: 720px) {
    .toolbar-card {
        flex-direction: column;
        align-items: stretch;

        &__filters,
        &__actions {
            width: 100%;
        }

        &__actions {
            flex-direction: column;
            align-items: stretch;
        }
    }
}
</style>
