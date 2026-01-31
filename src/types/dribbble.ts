export interface DribbbleUser {
  id: number
  name: string
  login: string
  html_url: string
  avatar_url: string
  bio: string
  location: string
  links: {
    web: string
    twitter: string
  }
  can_upload_shot: boolean
  pro: boolean
  followers_count: number
  followings_count: number
  likes_count: number
  likes_received_count: number
  shots_count: number
  projects_count: number
  created_at: string
  type: string
}

export interface DribbbleShot {
  id: number
  title: string
  description: string
  width: number
  height: number
  images: {
    hidpi: string | null
    normal: string
    one_x: string
    two_x: string | null
    four_x: string | null
    teaser: string
  }
  published_at: string
  updated_at: string
  html_url: string
  animated: boolean
  tags: string[]
  views_count: number
  likes_count: number
  comments_count: number
  attachments_count: number
  rebounds_count: number
  buckets_count: number
  low_profile: boolean
  user: DribbbleUser
}

export interface DribbbleProject {
  id: number
  name: string
  description: string
  shots_count: number
  created_at: string
  updated_at: string
  user: DribbbleUser
}

export interface DribbbleLike {
  id: number
  created_at: string
  shot: DribbbleShot
}

export interface DribbbleFollower {
  id: number
  created_at: string
  follower: DribbbleUser
}

export interface DribbbleFollowing {
  id: number
  created_at: string
  followee: DribbbleUser
}

export interface DribbbleComment {
  id: number
  body: string
  likes_count: number
  likes_url: string
  created_at: string
  updated_at: string
  user: DribbbleUser
}

export interface DribbbleAttachment {
  id: number
  url: string
  thumbnail_url: string
  size: number
  content_type: string
  created_at: string
}

export interface DribbbleBucket {
  id: number
  name: string
  description: string
  shots_count: number
  created_at: string
  updated_at: string
  user: DribbbleUser
}

export interface PaginationParams {
  page?: number
  per_page?: number
}

export interface ApiResponse<T> {
  data: T
  error?: string
}
