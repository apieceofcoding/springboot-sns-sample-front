"use client"

import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { Post } from "@/lib/types"
import { useLikePost, useUnlikePost } from "@/hooks/api/use-likes"
import { useRepost, useUnrepost } from "@/hooks/api/use-reposts"

interface TweetCardProps {
  post: Post
}

export function TweetCard({ post }: TweetCardProps) {
  const likePost = useLikePost()
  const unlikePost = useUnlikePost()
  const repost = useRepost()
  const unrepost = useUnrepost()

  const formattedDate = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
    locale: ko,
  })

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (post.isLikedByMe) {
      unlikePost.mutate({ postId: post.id, likeId: post.likeIdByMe! })
    } else {
      likePost.mutate(post.id)
    }
  }

  const handleRepost = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (post.isRepostedByMe) {
      unrepost.mutate({ postId: post.id, repostId: post.repostIdByMe! })
    } else {
      repost.mutate(post.id)
    }
  }

  return (
    <article className="flex gap-3 p-4 border-b border-border hover:bg-accent/30 transition-colors cursor-pointer">
      <div className="w-12 h-12 rounded-full bg-muted flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-bold truncate">{post.username}</span>
            <span className="text-muted-foreground truncate">
              @{post.username} · {formattedDate}
            </span>
          </div>
          <Button size="icon" variant="ghost" className="flex-shrink-0 -mr-2">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>

        <p className="mb-3 leading-relaxed">{post.content}</p>

        <div className="flex items-center justify-between max-w-md">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary hover:bg-primary/10 -ml-2"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            <span className="text-sm">{post.replyCount}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "text-muted-foreground hover:text-green-500 hover:bg-green-500/10",
              post.isRepostedByMe && "text-green-500"
            )}
            onClick={handleRepost}
            disabled={repost.isPending || unrepost.isPending}
          >
            <Repeat2 className="w-5 h-5 mr-2" />
            <span className="text-sm">{post.repostCount}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "text-muted-foreground hover:text-red-500 hover:bg-red-500/10",
              post.isLikedByMe && "text-red-500"
            )}
            onClick={handleLike}
            disabled={likePost.isPending || unlikePost.isPending}
          >
            <Heart className={cn("w-5 h-5 mr-2", post.isLikedByMe && "fill-current")} />
            <span className="text-sm">{post.likeCount}</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-primary/10">
            <Share className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </article>
  )
}
