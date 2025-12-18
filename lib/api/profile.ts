import { apiClient } from './client'
import type { Post, Reply } from '@/lib/types'

export const profileApi = {
  getMyPosts: () => {
    return apiClient.get<Post[]>('/api/v1/profile/posts')
  },

  getMyReplies: () => {
    return apiClient.get<Reply[]>('/api/v1/profile/replies')
  },

  getMyLikes: () => {
    return apiClient.get<Post[]>('/api/v1/profile/likes')
  },
}
