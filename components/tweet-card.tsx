"use client"

import { useState } from "react"
import { Heart, MessageCircle, Share, MoreHorizontal, Repeat2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { Post } from "@/lib/types"
import { useLikePost, useUnlikePost } from "@/hooks/api/use-likes"
import { RepostMenu } from "./repost-menu"
import { QuoteDialog } from "./quote-dialog"
import { ReplyDialog } from "./reply-dialog"
import { QuotedTweetCard } from "./quoted-tweet-card"
import { MediaGallery } from "./media-gallery"
import { ProfileAvatar } from "./profile-avatar"
import { useRouter } from "next/navigation"

interface TweetCardProps {
  post: Post
  showThread?: boolean
  isThreadChild?: boolean
}

export function TweetCard({ post, showThread = false, isThreadChild = false }: TweetCardProps) {
  const router = useRouter()
  const likePost = useLikePost()
  const unlikePost = useUnlikePost()
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false)
  const [replyDialogOpen, setReplyDialogOpen] = useState(false)

  const formattedDate = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
    locale: ko,
  })

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    const targetPost = post.repostedPost || post
    if (targetPost.isLikedByMe) {
      unlikePost.mutate({ postId: targetPost.id, likeId: targetPost.likeIdByMe! })
    } else {
      likePost.mutate(targetPost.id)
    }
  }

  const handleReplyClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setReplyDialogOpen(true)
  }

  const handleCardClick = () => {
    const targetPost = post.repostedPost || post
    router.push(`/post/${targetPost.id}`)
  }

  // 재게시인 경우 (원본 글이 있음)
  const isRepost = !!post.repostedPost

  // 인용글인 경우 (자신의 코멘트 + 원본 인용)
  const isQuote = !!post.quotedPost

  // 답글인 경우
  const isReply = post.parentId !== null

  // 재게시의 경우 원본 포스트의 정보 사용
  const displayPost = isRepost ? post.repostedPost! : post
  const repostedPostDate = isRepost
    ? formatDistanceToNow(new Date(post.repostedPost!.createdAt), { addSuffix: true, locale: ko })
    : formattedDate

  return (
    <>
      <article
        onClick={handleCardClick}
        className={cn(
          "flex flex-col hover:bg-accent/30 transition-colors cursor-pointer",
          !isThreadChild && "border-b border-border"
        )}
      >
        {/* 재게시 표시 - 누가 재게시했는지 */}
        {isRepost && (
          <div className="flex items-center gap-3 px-4 pt-3 text-muted-foreground text-sm">
            <div className="w-12 flex justify-end">
              <Repeat2 className="w-4 h-4" />
            </div>
            <span className="font-semibold hover:underline">
              {post.repostedBy?.username || post.username}님이 재게시했습니다
            </span>
          </div>
        )}

        {/* 답글 표시 */}
        {isReply && post.parentPost && !showThread && (
          <div className="flex items-center gap-3 px-4 pt-3 text-muted-foreground text-sm">
            <div className="w-12 flex justify-end">
              <MessageCircle className="w-4 h-4" />
            </div>
            <span>
              <span className="text-primary hover:underline">@{post.parentPost.username}</span>
              님에게 보내는 답글
            </span>
          </div>
        )}

        <div className="flex gap-3 p-4">
          {/* 스레드 연결선 */}
          {showThread && (
            <div className="flex flex-col items-center">
              <ProfileAvatar
                mediaId={displayPost.userProfileMediaId}
                username={displayPost.username}
                size="md"
              />
              {isThreadChild && (
                <div className="w-0.5 flex-1 bg-border mt-2" />
              )}
            </div>
          )}

          {!showThread && (
            <ProfileAvatar
              mediaId={displayPost.userProfileMediaId}
              username={displayPost.username}
              size="md"
            />
          )}

          <div className="flex-1 min-w-0">
            {/* 헤더 - 재게시면 원본 작성자, 아니면 현재 작성자 */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1 min-w-0 flex-wrap">
                <span className="font-bold truncate hover:underline">
                  {displayPost.username}
                </span>
                <span className="text-muted-foreground truncate">
                  @{displayPost.username}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground truncate">
                  {repostedPostDate}
                </span>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="flex-shrink-0 -mr-2 rounded-full hover:bg-primary/10 hover:text-primary"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>

            {/* 본문 - 재게시면 원본 내용, 인용글이면 인용자의 코멘트 */}
            {displayPost.content && (
              <p className="mb-3 leading-relaxed whitespace-pre-wrap break-words">
                {displayPost.content}
              </p>
            )}

            {/* 미디어 갤러리 */}
            {displayPost.mediaIds && displayPost.mediaIds.length > 0 && (
              <MediaGallery mediaIds={displayPost.mediaIds} className="mb-3" />
            )}

            {/* 인용된 트윗 카드 - 인용글인 경우에만 표시 */}
            {isQuote && post.quotedPost && (
              <QuotedTweetCard
                post={post.quotedPost}
                onClick={() => router.push(`/post/${post.quotedPost!.id}`)}
              />
            )}

            {/* 액션 버튼들 */}
            <div className="flex items-center justify-between max-w-md mt-3 -ml-2">
              {/* 답글 버튼 */}
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary hover:bg-primary/10 gap-2 rounded-full"
                onClick={handleReplyClick}
              >
                <MessageCircle className="w-[18px] h-[18px]" />
                <span className="text-sm tabular-nums">{displayPost.replyCount || ""}</span>
              </Button>

              {/* 재게시/인용 메뉴 */}
              <div onClick={(e) => e.stopPropagation()}>
                <RepostMenu post={displayPost} onQuoteClick={() => setQuoteDialogOpen(true)} />
              </div>

              {/* 좋아요 버튼 */}
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 gap-2 rounded-full group",
                  displayPost.isLikedByMe && "text-rose-500"
                )}
                onClick={handleLike}
                disabled={likePost.isPending || unlikePost.isPending}
              >
                <Heart
                  className={cn(
                    "w-[18px] h-[18px] transition-transform group-hover:scale-110",
                    displayPost.isLikedByMe && "fill-current"
                  )}
                />
                <span className="text-sm tabular-nums">{displayPost.likeCount || ""}</span>
              </Button>

              {/* 공유 버튼 */}
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Share className="w-[18px] h-[18px]" />
              </Button>
            </div>
          </div>
        </div>
      </article>

      {/* 다이얼로그들 */}
      <QuoteDialog
        post={displayPost}
        open={quoteDialogOpen}
        onOpenChange={setQuoteDialogOpen}
      />
      <ReplyDialog
        post={displayPost}
        open={replyDialogOpen}
        onOpenChange={setReplyDialogOpen}
      />
    </>
  )
}
