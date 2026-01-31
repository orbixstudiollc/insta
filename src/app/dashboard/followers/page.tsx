'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Users } from 'lucide-react'
import Header from '@/components/layout/Header'
import UserCard from '@/components/ui/UserCard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'
import Pagination from '@/components/ui/Pagination'
import { DribbbleFollower } from '@/types/dribbble'

export default function FollowersPage() {
  const { data: session } = useSession()
  const [followers, setFollowers] = useState<DribbbleFollower[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const perPage = 12

  const fetchFollowers = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(
        `/api/dribbble/followers?page=${page}&per_page=${perPage}`
      )
      if (!res.ok) throw new Error('Failed to fetch followers')
      const data = await res.json()
      setFollowers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [page, perPage])

  useEffect(() => {
    if (session?.accessToken) {
      fetchFollowers()
    }
  }, [session, fetchFollowers])

  return (
    <div>
      <Header
        title="Followers"
        subtitle="People who follow you on Dribbble"
      />

      <div className="p-6">
        {/* Stats */}
        <div className="mb-6">
          <p className="text-gray-500">
            Showing {followers.length} follower{followers.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <button
              onClick={fetchFollowers}
              className="mt-4 px-4 py-2 bg-dribbble-pink text-white rounded-lg"
            >
              Try Again
            </button>
          </div>
        ) : followers.length === 0 ? (
          <EmptyState
            icon={<Users className="w-8 h-8" />}
            title="No followers yet"
            description="Share your work and engage with the community to gain followers."
            action={
              <a
                href="https://dribbble.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-dribbble-pink text-white rounded-lg hover:bg-dribbble-pink-dark transition-colors"
              >
                Explore Dribbble
              </a>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {followers.map((follower) => (
              <UserCard key={follower.id} user={follower.follower} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && followers.length > 0 && (
          <div className="mt-8">
            <Pagination
              currentPage={page}
              totalPages={10}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  )
}
