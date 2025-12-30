"use client"

import { useState, useEffect } from "react"
import { mediaApi } from "@/lib/api/media"
import { cn } from "@/lib/utils"
import { VideoPlayer } from "./video-player"
import { ImageLightbox } from "./image-lightbox"
import type { MediaType } from "@/lib/types"

interface MediaGalleryProps {
  mediaIds: number[]
  className?: string
}

interface MediaItem {
  id: number
  url: string | null
  mediaType: MediaType | null
  loading: boolean
  error: boolean
}

export function MediaGallery({ mediaIds, className }: MediaGalleryProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    if (mediaIds.length === 0) return

    // 초기 상태 설정
    setMediaItems(mediaIds.map(id => ({
      id,
      url: null,
      mediaType: null,
      loading: true,
      error: false
    })))

    // 각 미디어의 정보와 presigned URL 가져오기
    mediaIds.forEach(async (id) => {
      try {
        const response = await mediaApi.getPresignedUrl(id)

        setMediaItems(prev => prev.map(item =>
          item.id === id
            ? {
                ...item,
                url: response.presignedUrl,
                mediaType: response.media.mediaType,
                loading: false
              }
            : item
        ))
      } catch (error) {
        console.error(`Failed to fetch media ${id}:`, error)
        setMediaItems(prev => prev.map(item =>
          item.id === id
            ? { ...item, loading: false, error: true }
            : item
        ))
      }
    })
  }, [mediaIds])

  if (mediaIds.length === 0) return null

  // 비디오가 하나만 있는 경우 특별 처리
  const hasOnlyOneVideo = mediaItems.length === 1 && mediaItems[0]?.mediaType === 'VIDEO'

  const getGridClassName = () => {
    if (hasOnlyOneVideo) return "grid-cols-1"
    switch (mediaIds.length) {
      case 1:
        return "grid-cols-1"
      case 2:
        return "grid-cols-2"
      case 3:
        return "grid-cols-2 grid-rows-2"
      case 4:
        return "grid-cols-2 grid-rows-2"
      default:
        return "grid-cols-2"
    }
  }

  const getItemClassName = (index: number) => {
    if (mediaIds.length === 3 && index === 0) {
      return "row-span-2"
    }
    return ""
  }

  const getAspectRatio = (index: number, mediaType: MediaType | null) => {
    // 비디오는 항상 16:9
    if (mediaType === 'VIDEO') {
      return "aspect-video"
    }
    if (mediaIds.length === 1) {
      return "aspect-video"
    }
    if (mediaIds.length === 3 && index === 0) {
      return "aspect-[9/16]"
    }
    return "aspect-square"
  }

  return (
  <>
    <div
      className={cn(
        "grid gap-0.5 rounded-2xl overflow-hidden border border-border",
        getGridClassName(),
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {mediaItems.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            "relative bg-muted overflow-hidden",
            getItemClassName(index),
            getAspectRatio(index, item.mediaType)
          )}
        >
          {item.loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : item.error ? (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
              미디어를 불러올 수 없습니다
            </div>
          ) : item.url ? (
            item.mediaType === 'VIDEO' || item.mediaType === 'GIF' ? (
              <VideoPlayer
                src={item.url}
                className="w-full h-full"
                autoPlay={item.mediaType === 'GIF'}
                muted={true}
                loop={item.mediaType === 'GIF'}
                isGif={item.mediaType === 'GIF'}
                autoPlayOnView={item.mediaType === 'VIDEO'}
              />
            ) : (
              <img
                src={item.url}
                alt=""
                className="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  // Find the index of this image among all images (excluding videos)
                  const imageItems = mediaItems.filter(m => m.mediaType === 'IMAGE' && m.url)
                  const imageIndex = imageItems.findIndex(m => m.id === item.id)
                  if (imageIndex !== -1) {
                    setLightboxIndex(imageIndex)
                  }
                }}
              />
            )
          ) : null}
        </div>
      ))}
    </div>

    {/* Image Lightbox */}
    {lightboxIndex !== null && (
      <ImageLightbox
        images={mediaItems
          .filter(m => m.mediaType === 'IMAGE' && m.url)
          .map(m => ({ id: m.id, url: m.url! }))}
        initialIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
      />
    )}
  </>
  )
}
