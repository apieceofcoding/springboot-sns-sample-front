"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Play } from "lucide-react"
import { mediaApi } from "@/lib/api/media"
import { cn } from "@/lib/utils"
import type { Post } from "@/lib/types"
import type { MediaType } from "@/lib/types"

interface MediaGridItem {
  postId: number
  mediaId: number
  url: string | null
  mediaType: MediaType | null
  loading: boolean
  error: boolean
}

interface ProfileMediaGridProps {
  posts: Post[]
  className?: string
}

export function ProfileMediaGrid({ posts, className }: ProfileMediaGridProps) {
  const router = useRouter()
  const [mediaItems, setMediaItems] = useState<MediaGridItem[]>([])

  useEffect(() => {
    if (posts.length === 0) {
      setMediaItems([])
      return
    }

    // 모든 게시글에서 첫 번째 미디어만 추출 (그리드에서는 첫 번째 미디어만 표시)
    const initialItems: MediaGridItem[] = posts
      .filter(post => post.mediaIds && post.mediaIds.length > 0)
      .map(post => ({
        postId: post.id,
        mediaId: post.mediaIds[0],
        url: null,
        mediaType: null,
        loading: true,
        error: false,
      }))

    setMediaItems(initialItems)

    // 각 미디어의 정보와 presigned URL 가져오기
    initialItems.forEach(async (item) => {
      try {
        const response = await mediaApi.getPresignedUrl(item.mediaId)

        setMediaItems(prev => prev.map(prevItem =>
          prevItem.mediaId === item.mediaId
            ? {
                ...prevItem,
                url: response.presignedUrl,
                mediaType: response.media.mediaType,
                loading: false
              }
            : prevItem
        ))
      } catch (error) {
        console.error(`Failed to fetch media ${item.mediaId}:`, error)
        setMediaItems(prev => prev.map(prevItem =>
          prevItem.mediaId === item.mediaId
            ? { ...prevItem, loading: false, error: true }
            : prevItem
        ))
      }
    })
  }, [posts])

  const handleClick = (postId: number) => {
    router.push(`/post/${postId}`)
  }

  if (mediaItems.length === 0) {
    return null
  }

  return (
    <div className={cn("grid grid-cols-3 gap-0.5", className)}>
      {mediaItems.map((item) => (
        <div
          key={item.mediaId}
          className="relative aspect-square bg-muted cursor-pointer overflow-hidden group"
          onClick={() => handleClick(item.postId)}
        >
          {item.loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : item.error ? (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">
              오류
            </div>
          ) : item.url ? (
            <>
              {item.mediaType === 'VIDEO' || item.mediaType === 'GIF' ? (
                <>
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    preload="metadata"
                  />
                  {/* 비디오/GIF 아이콘 표시 */}
                  <div className="absolute top-2 right-2 bg-black/60 rounded px-1.5 py-0.5 flex items-center gap-1">
                    {item.mediaType === 'GIF' ? (
                      <span className="text-white text-xs font-bold">GIF</span>
                    ) : (
                      <Play className="w-3 h-3 text-white fill-white" />
                    )}
                  </div>
                </>
              ) : (
                <img
                  src={item.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )}
              {/* 호버 오버레이 */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </>
          ) : null}
        </div>
      ))}
    </div>
  )
}
