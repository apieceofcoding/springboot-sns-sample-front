import { apiClient } from './client'
import type { User, UserSignupRequest, UserResponse } from '@/lib/types'

export const usersApi = {
  signup: (data: UserSignupRequest) => {
    return apiClient.post<UserResponse>('/api/v1/users/signup', data)
  },

  getMe: () => {
    return apiClient.get<User>('/api/v1/users/me')
  },
}
