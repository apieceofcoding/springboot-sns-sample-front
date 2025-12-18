"use client"

import { TweetCard } from "./tweet-card"
import { useMyPosts } from "@/hooks/api/use-profile"
import { Loader2 } from "lucide-react"

export function ProfileFeed() {
  const { data: posts, isLoading, error } = useMyPosts()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        <p>게시물을 불러올 수 없습니다.</p>
      </div>
    )
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        <p>아직 작성한 게시물이 없습니다.</p>
      </div>
    )
  }

  return (
    <div>
      {posts.map((post) => (
        <TweetCard key={post.id} post={post} />
      ))}
    </div>
  )
}
