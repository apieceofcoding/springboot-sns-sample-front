export interface User {
  id: number
  username: string
}

export interface UserSignupRequest {
  username: string
  password: string
}

export interface UserResponse {
  id: number
  username: string
}
