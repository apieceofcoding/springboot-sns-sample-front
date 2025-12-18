'use client'

import { useQuery } from '@tanstack/react-query'
import { timelineApi } from '@/lib/api/timeline'

export function useTimeline(limit = 50) {
  return useQuery({
    queryKey: ['timeline', limit],
    queryFn: () => timelineApi.getTimeline(limit),
  })
}
