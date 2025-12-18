'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { likesApi } from '@/lib/api/likes'
import type { Post } from '@/lib/types'

export function useLikes() {
  return useQuery({
    queryKey: ['likes'],
    queryFn: () => likesApi.getAll(),
  })
}

export function useLikePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: number) => likesApi.create({ postId }),
    // Optimistic update
    onMutate: async (postId) => {
      // 진행 중인 리페치 취소
      await queryClient.cancelQueries({ queryKey: ['posts'] })
      await queryClient.cancelQueries({ queryKey: ['timeline'] })

      // 이전 데이터 백업
      const previousPosts = queryClient.getQueryData(['posts'])
      const previousTimeline = queryClient.getQueryData(['timeline'])

      // 즉시 UI 업데이트 (좋아요 +1)
      const updatePost = (post: Post) => {
        if (post.id === postId) {
          return {
            ...post,
            likeCount: post.likeCount + 1,
            isLikedByMe: true,
          }
        }
        return post
      }

      queryClient.setQueryData(['posts'], (old: Post[] | undefined) =>
        old?.map(updatePost)
      )
      queryClient.setQueryData(['timeline'], (old: Post[] | undefined) =>
        old?.map(updatePost)
      )

      return { previousPosts, previousTimeline }
    },
    onError: (error, postId, context) => {
      // 에러 시 롤백
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts)
      }
      if (context?.previousTimeline) {
        queryClient.setQueryData(['timeline'], context.previousTimeline)
      }
      toast.error('좋아요 실패')
      console.error('Like post error:', error)
    },
    onSettled: () => {
      // 최종적으로 서버 데이터로 갱신
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['timeline'] })
      queryClient.invalidateQueries({ queryKey: ['profile', 'likes'] })
    },
  })
}

export function useUnlikePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (likeId: number) => likesApi.delete(likeId),
    // Optimistic update
    onMutate: async ({ postId }: { postId: number; likeId: number }) => {
      // 진행 중인 리페치 취소
      await queryClient.cancelQueries({ queryKey: ['posts'] })
      await queryClient.cancelQueries({ queryKey: ['timeline'] })

      // 이전 데이터 백업
      const previousPosts = queryClient.getQueryData(['posts'])
      const previousTimeline = queryClient.getQueryData(['timeline'])

      // 즉시 UI 업데이트 (좋아요 -1)
      const updatePost = (post: Post) => {
        if (post.id === postId) {
          return {
            ...post,
            likeCount: Math.max(0, post.likeCount - 1),
            isLikedByMe: false,
          }
        }
        return post
      }

      queryClient.setQueryData(['posts'], (old: Post[] | undefined) =>
        old?.map(updatePost)
      )
      queryClient.setQueryData(['timeline'], (old: Post[] | undefined) =>
        old?.map(updatePost)
      )

      return { previousPosts, previousTimeline }
    },
    onError: (error, variables, context) => {
      // 에러 시 롤백
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts)
      }
      if (context?.previousTimeline) {
        queryClient.setQueryData(['timeline'], context.previousTimeline)
      }
      toast.error('좋아요 취소 실패')
      console.error('Unlike post error:', error)
    },
    onSettled: () => {
      // 최종적으로 서버 데이터로 갱신
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['timeline'] })
      queryClient.invalidateQueries({ queryKey: ['profile', 'likes'] })
    },
  })
}
