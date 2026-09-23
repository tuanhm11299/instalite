import type { CursorPage, LikeStatus, Post, PostComment, SaveStatus, UserListItem } from '~/types/api'
import { apiRequest } from './client'

export const postsApi = {
  // ---- Lists ----
  feed: (cursor: string | null) =>
    apiRequest<CursorPage<Post>>('/api/posts/feed', { query: { cursor, pageSize: 8 } }),

  explore: (cursor: string | null) =>
    apiRequest<CursorPage<Post>>('/api/posts/explore', { query: { cursor, pageSize: 24 } }),

  saved: (cursor: string | null) =>
    apiRequest<CursorPage<Post>>('/api/posts/saved', { query: { cursor, pageSize: 24 } }),

  // ---- A single post ----
  create: (caption: string, images: File[]) => {
    const form = new FormData()
    form.append('caption', caption)
    images.forEach(image => form.append('images', image))
    return apiRequest<Post>('/api/posts', { method: 'POST', body: form })
  },

  get: (postId: string) =>
    apiRequest<Post>(`/api/posts/${postId}`),

  editCaption: (postId: string, caption: string) =>
    apiRequest<Post>(`/api/posts/${postId}`, { method: 'PATCH', body: { caption } }),

  remove: (postId: string) =>
    apiRequest<void>(`/api/posts/${postId}`, { method: 'DELETE' }),

  // ---- Likes ----
  like: (postId: string) =>
    apiRequest<LikeStatus>(`/api/posts/${postId}/like`, { method: 'POST' }),

  unlike: (postId: string) =>
    apiRequest<LikeStatus>(`/api/posts/${postId}/like`, { method: 'DELETE' }),

  likes: (postId: string) =>
    apiRequest<UserListItem[]>(`/api/posts/${postId}/likes`),

  // ---- Saves ----
  save: (postId: string) =>
    apiRequest<SaveStatus>(`/api/posts/${postId}/save`, { method: 'POST' }),

  unsave: (postId: string) =>
    apiRequest<SaveStatus>(`/api/posts/${postId}/save`, { method: 'DELETE' }),

  // ---- Comments ----
  comments: (postId: string, cursor: string | null) =>
    apiRequest<CursorPage<PostComment>>(`/api/posts/${postId}/comments`, { query: { cursor, pageSize: 20 } }),

  addComment: (postId: string, text: string) =>
    apiRequest<PostComment>(`/api/posts/${postId}/comments`, { method: 'POST', body: { text } }),

  deleteComment: (commentId: string) =>
    apiRequest<void>(`/api/comments/${commentId}`, { method: 'DELETE' }),
}
