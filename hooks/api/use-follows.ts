'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { followsApi } from '@/lib/api/follows'

export function useFollowers() {
  return useQuery({
    queryKey: ['follows', 'followers'],
    queryFn: () => followsApi.getFollowers(),
  })
}

export function useFollowees() {
  return useQuery({
    queryKey: ['follows', 'followees'],
    queryFn: () => followsApi.getFollowees(),
  })
}

export function useFollowCounts() {
  return useQuery({
    queryKey: ['follow-counts'],
    queryFn: () => followsApi.getFollowCounts(),
  })
}

export function useFollow() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (followeeId: number) => followsApi.follow({ followeeId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follows', 'followees'] })
      queryClient.invalidateQueries({ queryKey: ['follow-counts'] })
      toast.success('팔로우했습니다!')
    },
    onError: (error) => {
      toast.error('팔로우 실패')
      console.error('Follow error:', error)
    },
  })
}

export function useUnfollow() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (followeeId: number) => followsApi.unfollow({ followeeId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follows', 'followees'] })
      queryClient.invalidateQueries({ queryKey: ['follow-counts'] })
      toast.success('언팔로우했습니다!')
    },
    onError: (error) => {
      toast.error('언팔로우 실패')
      console.error('Unfollow error:', error)
    },
  })
}
