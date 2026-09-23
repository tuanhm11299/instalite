import type { CursorPage, FollowStatus, Post, Profile, StoryTrayItem, UserListItem } from '~/types/api'
import { apiRequest } from './client'

const userPath = (username: string) => `/api/users/${encodeURIComponent(username)}`

export const usersApi = {
  search: (term: string) =>
    apiRequest<UserListItem[]>('/api/users/search', { query: { q: term } }),

  suggestions: (limit = 5) =>
    apiRequest<UserListItem[]>('/api/users/suggestions', { query: { limit } }),

  profile: (username: string) =>
    apiRequest<Profile>(userPath(username)),

  posts: (username: string, cursor: string | null) =>
    apiRequest<CursorPage<Post>>(`${userPath(username)}/posts`, { query: { cursor } }),

  stories: (username: string) =>
    apiRequest<StoryTrayItem>(`${userPath(username)}/stories`),

  followers: (username: string, cursor: string | null) =>
    apiRequest<CursorPage<UserListItem>>(`${userPath(username)}/followers`, { query: { cursor, pageSize: 30 } }),

  following: (username: string, cursor: string | null) =>
    apiRequest<CursorPage<UserListItem>>(`${userPath(username)}/following`, { query: { cursor, pageSize: 30 } }),

  follow: (username: string) =>
    apiRequest<FollowStatus>(`${userPath(username)}/follow`, { method: 'POST' }),

  unfollow: (username: string) =>
    apiRequest<FollowStatus>(`${userPath(username)}/follow`, { method: 'DELETE' }),
}
