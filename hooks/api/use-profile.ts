'use client'

import { useQuery } from '@tanstack/react-query'
import { profileApi } from '@/lib/api/profile'

export function useMyPosts() {
  return useQuery({
    queryKey: ['profile', 'posts'],
    queryFn: () => profileApi.getMyPosts(),
  })
}

export function useMyReplies() {
  return useQuery({
    queryKey: ['profile', 'replies'],
    queryFn: () => profileApi.getMyReplies(),
  })
}

export function useMyLikes() {
  return useQuery({
    queryKey: ['profile', 'likes'],
    queryFn: () => profileApi.getMyLikes(),
  })
}
