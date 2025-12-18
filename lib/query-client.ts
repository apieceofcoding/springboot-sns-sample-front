import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/lib/types'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1분
      gcTime: 1000 * 60 * 5, // 5분 (구 cacheTime)
      retry: (failureCount, error) => {
        // 401 에러는 재시도하지 않음 (인증 문제)
        if (error instanceof ApiError && error.status === 401) {
          return false
        }
        // 404, 400 등 클라이언트 에러는 재시도하지 않음
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          return false
        }
        // 최대 2번까지 재시도
        return failureCount < 2
      },
      refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 리페칭 비활성화
    },
    mutations: {
      retry: false, // Mutation은 재시도하지 않음
    },
  },
})
