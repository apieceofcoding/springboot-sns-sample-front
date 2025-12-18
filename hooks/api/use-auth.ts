'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { authApi } from '@/lib/api/auth'
import { usersApi } from '@/lib/api/users'
import { useAuthContext } from '@/lib/auth/provider'
import type { UserSignupRequest } from '@/lib/types'

export function useAuth() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user, isLoading, isAuthenticated } = useAuthContext()

  const loginMutation = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      authApi.login(username, password),
    onSuccess: async () => {
      // 로그인 성공 후 사용자 정보 갱신
      await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
      toast.success('로그인 성공!')
      router.push('/')
    },
    onError: (error) => {
      toast.error('로그인 실패: 아이디나 비밀번호를 확인해주세요.')
      console.error('Login error:', error)
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // 모든 쿼리 캐시 삭제
      queryClient.clear()
      toast.success('로그아웃되었습니다.')
      router.push('/login')
    },
    onError: (error) => {
      toast.error('로그아웃 실패')
      console.error('Logout error:', error)
    },
  })

  const signupMutation = useMutation({
    mutationFn: (data: UserSignupRequest) => usersApi.signup(data),
    onSuccess: () => {
      toast.success('회원가입 성공! 로그인해주세요.')
      router.push('/login')
    },
    onError: (error) => {
      toast.error('회원가입 실패: 이미 존재하는 사용자명이거나 오류가 발생했습니다.')
      console.error('Signup error:', error)
    },
  })

  return {
    user,
    isLoading,
    isAuthenticated,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    signup: signupMutation.mutate,
    isLoginPending: loginMutation.isPending,
    isLogoutPending: logoutMutation.isPending,
    isSignupPending: signupMutation.isPending,
  }
}
