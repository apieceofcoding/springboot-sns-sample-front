"use client"

import { useState } from "react"
import { ImageIcon, Smile, MapPin, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useCreatePost } from "@/hooks/api/use-posts"

export function TweetComposer() {
  const [content, setContent] = useState("")
  const createPost = useCreatePost()

  const handleSubmit = async () => {
    if (!content.trim()) return

    try {
      await createPost.mutateAsync({
        content: content.trim(),
        mediaIds: [],
      })
      // 성공 시 입력 필드 초기화
      setContent("")
    } catch (error) {
      // 에러는 hook에서 처리
      console.error('Failed to create post:', error)
    }
  }

  return (
    <div className="p-4 border-b border-border">
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-full bg-muted flex-shrink-0" />
        <div className="flex-1">
          <Textarea
            placeholder="무슨 일이 일어나고 있나요?"
            className="min-h-[120px] resize-none border-none p-0 text-xl focus-visible:ring-0"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" className="text-primary hover:bg-primary/10">
                <ImageIcon className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-primary hover:bg-primary/10">
                <Smile className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-primary hover:bg-primary/10">
                <MapPin className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-primary hover:bg-primary/10">
                <BarChart3 className="w-5 h-5" />
              </Button>
            </div>
            <Button
              className="rounded-full font-bold px-6"
              onClick={handleSubmit}
              disabled={!content.trim() || createPost.isPending}
            >
              {createPost.isPending ? "작성 중..." : "트윗하기"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
