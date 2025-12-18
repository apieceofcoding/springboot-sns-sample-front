import { Sidebar } from "@/components/sidebar"
import { ProfileHeader } from "@/components/profile-header"
import { ProfileFeed } from "@/components/profile-feed"

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 border-x border-border">
        <ProfileHeader />
        <ProfileFeed />
      </main>
    </div>
  )
}
