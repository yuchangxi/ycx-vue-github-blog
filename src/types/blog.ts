export interface BlogPost {
  id: string
  title: string
  summary: string
  tags: string[]
  publishedAt: string
  readingTime: string
  cover?: string
  content: string
}
