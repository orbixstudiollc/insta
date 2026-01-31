import {
  DribbbleUser,
  DribbbleShot,
  DribbbleProject,
  DribbbleLike,
  DribbbleFollower,
  DribbbleFollowing,
  DribbbleComment,
  DribbbleAttachment,
  DribbbleBucket,
  PaginationParams,
} from '@/types/dribbble'

const DRIBBBLE_API_BASE = 'https://api.dribbble.com/v2'

class DribbbleAPI {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${DRIBBBLE_API_BASE}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `API Error: ${response.status}`)
    }

    return response.json()
  }

  private buildQueryString(params: PaginationParams): string {
    const query = new URLSearchParams()
    if (params.page) query.set('page', params.page.toString())
    if (params.per_page) query.set('per_page', params.per_page.toString())
    return query.toString() ? `?${query.toString()}` : ''
  }

  // User endpoints
  async getAuthenticatedUser(): Promise<DribbbleUser> {
    return this.request<DribbbleUser>('/user')
  }

  async getUser(userId: number | string): Promise<DribbbleUser> {
    return this.request<DribbbleUser>(`/users/${userId}`)
  }

  // Shots endpoints
  async getUserShots(params: PaginationParams = {}): Promise<DribbbleShot[]> {
    const query = this.buildQueryString(params)
    return this.request<DribbbleShot[]>(`/user/shots${query}`)
  }

  async getShot(shotId: number): Promise<DribbbleShot> {
    return this.request<DribbbleShot>(`/shots/${shotId}`)
  }

  async createShot(data: {
    title: string
    image: string
    description?: string
    tags?: string[]
    low_profile?: boolean
  }): Promise<DribbbleShot> {
    return this.request<DribbbleShot>('/shots', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateShot(
    shotId: number,
    data: {
      title?: string
      description?: string
      tags?: string[]
      low_profile?: boolean
    }
  ): Promise<DribbbleShot> {
    return this.request<DribbbleShot>(`/shots/${shotId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteShot(shotId: number): Promise<void> {
    await this.request(`/shots/${shotId}`, { method: 'DELETE' })
  }

  // Popular/Recent shots
  async getPopularShots(params: PaginationParams = {}): Promise<DribbbleShot[]> {
    const query = this.buildQueryString(params)
    return this.request<DribbbleShot[]>(`/popular_shots${query}`)
  }

  // Projects endpoints
  async getUserProjects(params: PaginationParams = {}): Promise<DribbbleProject[]> {
    const query = this.buildQueryString(params)
    return this.request<DribbbleProject[]>(`/user/projects${query}`)
  }

  async getProject(projectId: number): Promise<DribbbleProject> {
    return this.request<DribbbleProject>(`/projects/${projectId}`)
  }

  async getProjectShots(
    projectId: number,
    params: PaginationParams = {}
  ): Promise<DribbbleShot[]> {
    const query = this.buildQueryString(params)
    return this.request<DribbbleShot[]>(`/projects/${projectId}/shots${query}`)
  }

  async createProject(data: {
    name: string
    description?: string
  }): Promise<DribbbleProject> {
    return this.request<DribbbleProject>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateProject(
    projectId: number,
    data: {
      name?: string
      description?: string
    }
  ): Promise<DribbbleProject> {
    return this.request<DribbbleProject>(`/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteProject(projectId: number): Promise<void> {
    await this.request(`/projects/${projectId}`, { method: 'DELETE' })
  }

  // Likes endpoints
  async getUserLikes(params: PaginationParams = {}): Promise<DribbbleLike[]> {
    const query = this.buildQueryString(params)
    return this.request<DribbbleLike[]>(`/user/likes${query}`)
  }

  async likeShot(shotId: number): Promise<DribbbleLike> {
    return this.request<DribbbleLike>(`/shots/${shotId}/like`, {
      method: 'POST',
    })
  }

  async unlikeShot(shotId: number): Promise<void> {
    await this.request(`/shots/${shotId}/like`, { method: 'DELETE' })
  }

  async checkShotLike(shotId: number): Promise<DribbbleLike> {
    return this.request<DribbbleLike>(`/shots/${shotId}/like`)
  }

  // Followers/Following endpoints
  async getUserFollowers(params: PaginationParams = {}): Promise<DribbbleFollower[]> {
    const query = this.buildQueryString(params)
    return this.request<DribbbleFollower[]>(`/user/followers${query}`)
  }

  async getUserFollowing(params: PaginationParams = {}): Promise<DribbbleFollowing[]> {
    const query = this.buildQueryString(params)
    return this.request<DribbbleFollowing[]>(`/user/following${query}`)
  }

  async followUser(userId: number): Promise<void> {
    await this.request(`/users/${userId}/follow`, { method: 'PUT' })
  }

  async unfollowUser(userId: number): Promise<void> {
    await this.request(`/users/${userId}/follow`, { method: 'DELETE' })
  }

  async checkFollowing(userId: number): Promise<boolean> {
    try {
      await this.request(`/user/following/${userId}`)
      return true
    } catch {
      return false
    }
  }

  // Comments endpoints
  async getShotComments(
    shotId: number,
    params: PaginationParams = {}
  ): Promise<DribbbleComment[]> {
    const query = this.buildQueryString(params)
    return this.request<DribbbleComment[]>(`/shots/${shotId}/comments${query}`)
  }

  async createComment(shotId: number, body: string): Promise<DribbbleComment> {
    return this.request<DribbbleComment>(`/shots/${shotId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ body }),
    })
  }

  async updateComment(
    shotId: number,
    commentId: number,
    body: string
  ): Promise<DribbbleComment> {
    return this.request<DribbbleComment>(
      `/shots/${shotId}/comments/${commentId}`,
      {
        method: 'PUT',
        body: JSON.stringify({ body }),
      }
    )
  }

  async deleteComment(shotId: number, commentId: number): Promise<void> {
    await this.request(`/shots/${shotId}/comments/${commentId}`, {
      method: 'DELETE',
    })
  }

  // Attachments endpoints
  async getShotAttachments(shotId: number): Promise<DribbbleAttachment[]> {
    return this.request<DribbbleAttachment[]>(`/shots/${shotId}/attachments`)
  }

  async createAttachment(
    shotId: number,
    file: string
  ): Promise<DribbbleAttachment> {
    return this.request<DribbbleAttachment>(`/shots/${shotId}/attachments`, {
      method: 'POST',
      body: JSON.stringify({ file }),
    })
  }

  async deleteAttachment(shotId: number, attachmentId: number): Promise<void> {
    await this.request(`/shots/${shotId}/attachments/${attachmentId}`, {
      method: 'DELETE',
    })
  }

  // Buckets endpoints
  async getUserBuckets(params: PaginationParams = {}): Promise<DribbbleBucket[]> {
    const query = this.buildQueryString(params)
    return this.request<DribbbleBucket[]>(`/user/buckets${query}`)
  }

  async getBucket(bucketId: number): Promise<DribbbleBucket> {
    return this.request<DribbbleBucket>(`/buckets/${bucketId}`)
  }

  async createBucket(data: {
    name: string
    description?: string
  }): Promise<DribbbleBucket> {
    return this.request<DribbbleBucket>('/buckets', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateBucket(
    bucketId: number,
    data: {
      name?: string
      description?: string
    }
  ): Promise<DribbbleBucket> {
    return this.request<DribbbleBucket>(`/buckets/${bucketId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteBucket(bucketId: number): Promise<void> {
    await this.request(`/buckets/${bucketId}`, { method: 'DELETE' })
  }

  async getBucketShots(
    bucketId: number,
    params: PaginationParams = {}
  ): Promise<DribbbleShot[]> {
    const query = this.buildQueryString(params)
    return this.request<DribbbleShot[]>(`/buckets/${bucketId}/shots${query}`)
  }

  async addShotToBucket(bucketId: number, shotId: number): Promise<void> {
    await this.request(`/buckets/${bucketId}/shots`, {
      method: 'PUT',
      body: JSON.stringify({ shot_id: shotId }),
    })
  }

  async removeShotFromBucket(bucketId: number, shotId: number): Promise<void> {
    await this.request(`/buckets/${bucketId}/shots`, {
      method: 'DELETE',
      body: JSON.stringify({ shot_id: shotId }),
    })
  }
}

export function createDribbbleClient(accessToken: string): DribbbleAPI {
  return new DribbbleAPI(accessToken)
}

export default DribbbleAPI
