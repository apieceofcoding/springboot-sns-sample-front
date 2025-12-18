"use client"

import { useState, useEffect } from "react"
import { mediaApi } from "@/lib/api/media"
import { cn } from "@/lib/utils"

interface ProfileAvatarProps {
  mediaId: number | null | undefined
  username?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeClasses = {
  sm: "w-5 h-5",
  md: "w-12 h-12",
  lg: "w-32 h-32"
}

export function ProfileAvatar({ mediaId, username, size = "md", className }: ProfileAvatarProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!mediaId) {
      setImageUrl(null)
      return
    }

    setLoading(true)
    setError(false)

    mediaApi.getPresignedUrl(mediaId)
      .then(response => {
        setImageUrl(response.presignedUrl)
      })
      .catch(err => {
        console.error('Failed to fetch profile image:', err)
        setError(true)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [mediaId])

  const initials = username ? username.charAt(0).toUpperCase() : '?'

  return (
    <div
      className={cn(
        "rounded-full bg-muted flex-shrink-0 overflow-hidden flex items-center justify-center",
        sizeClasses[size],
        className
      )}
    >
      {loading ? (
        <div className="w-full h-full bg-muted animate-pulse" />
      ) : imageUrl && !error ? (
        <img
          src={imageUrl}
          alt={username || 'Profile'}
          className="w-full h-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <span className={cn(
          "text-muted-foreground font-medium",
          size === "sm" && "text-xs",
          size === "md" && "text-lg",
          size === "lg" && "text-4xl"
        )}>
          {initials}
        </span>
      )}
    </div>
  )
}
