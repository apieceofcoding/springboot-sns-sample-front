"use client"

import { ArrowLeft, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ProfileHeader() {
  return (
    <>
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">사용자</h1>
            <div className="text-sm text-muted-foreground">125 트윗</div>
          </div>
        </div>
      </div>

      <div>
        <div className="h-48 bg-gradient-to-r from-primary/20 to-primary/40" />
        <div className="px-4">
          <div className="flex justify-between items-start -mt-16 mb-4">
            <div className="w-32 h-32 rounded-full border-4 border-background bg-muted" />
            <Button variant="outline" className="mt-20 rounded-full font-bold bg-transparent">
              프로필 수정
            </Button>
          </div>

          <div className="mb-4">
            <h2 className="text-2xl font-bold">사용자</h2>
            <div className="text-muted-foreground">@username</div>
          </div>

          <div className="mb-4 text-foreground">디자인과 개발을 사랑하는 크리에이터 ✨ 일상과 생각을 공유합니다</div>

          <div className="flex flex-wrap gap-4 mb-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              서울, 대한민국
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              2024년 1월 가입
            </div>
          </div>

          <div className="flex gap-6 mb-4 text-sm">
            <div>
              <span className="font-bold text-foreground">234</span>
              <span className="text-muted-foreground ml-1">팔로잉</span>
            </div>
            <div>
              <span className="font-bold text-foreground">1,234</span>
              <span className="text-muted-foreground ml-1">팔로워</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="tweets" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent h-auto p-0">
            <TabsTrigger
              value="tweets"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent flex-1"
            >
              트윗
            </TabsTrigger>
            <TabsTrigger
              value="replies"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent flex-1"
            >
              답글
            </TabsTrigger>
            <TabsTrigger
              value="media"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent flex-1"
            >
              미디어
            </TabsTrigger>
            <TabsTrigger
              value="likes"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent flex-1"
            >
              마음에 들어요
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </>
  )
}
