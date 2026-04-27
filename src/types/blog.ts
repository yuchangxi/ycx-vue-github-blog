export type BlogCategory = '前端' | '后端' | '其他'
export type BlogFilter = '全部' | BlogCategory

export interface BlogPost {
  id: string
  title: string
  summary: string
  category: BlogCategory
  tags: string[]
  publishedAt: string
  readingTime: string
  cover?: string
  content: string
}
