import { apiClient } from './client'
import type { Post } from '@/lib/types'

export const timelineApi = {
  getTimeline: (limit = 50) => {
    return apiClient.get<Post[]>(`/api/v1/timelines?limit=${limit}`)
  },
}
