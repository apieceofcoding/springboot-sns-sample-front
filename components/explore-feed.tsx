"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TweetCard } from "./tweet-card"

const trendingTweets = [
  {
    id: "1",
    author: {
      name: "테크뉴스",
      username: "technews",
      avatar: "/tech-avatar.png",
    },
    content: "최신 AI 기술이 우리의 일상을 어떻게 변화시키고 있는지 알아보세요. 혁신적인 변화가 시작되었습니다.",
    timestamp: "1시간 전",
    likes: 234,
    retweets: 89,
    replies: 45,
  },
  {
    id: "2",
    author: {
      name: "트렌드코리아",
      username: "trendkorea",
      avatar: "/trend-avatar.jpg",
    },
    content: "2025년 가장 핫한 트렌드 TOP 10을 소개합니다! 🔥",
    timestamp: "3시간 전",
    likes: 456,
    retweets: 123,
    replies: 67,
  },
]

export function ExploreFeed() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input placeholder="검색" className="pl-12 bg-muted border-none rounded-full" />
        </div>
      </div>

      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent h-auto p-0">
          <TabsTrigger
            value="trending"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4"
          >
            트렌딩
          </TabsTrigger>
          <TabsTrigger
            value="latest"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4"
          >
            최신
          </TabsTrigger>
          <TabsTrigger
            value="media"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4"
          >
            미디어
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="mt-0">
          {trendingTweets.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))}
        </TabsContent>

        <TabsContent value="latest" className="mt-0">
          <div className="p-8 text-center text-muted-foreground">최신 트윗을 불러오는 중...</div>
        </TabsContent>

        <TabsContent value="media" className="mt-0">
          <div className="p-8 text-center text-muted-foreground">미디어 콘텐츠를 불러오는 중...</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
