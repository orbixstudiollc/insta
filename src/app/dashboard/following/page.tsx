'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { UserPlus } from 'lucide-react'
import Header from '@/components/layout/Header'
import UserCard from '@/components/ui/UserCard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'
import Pagination from '@/components/ui/Pagination'
import { DribbbleFollowing } from '@/types/dribbble'

export default function FollowingPage() {
  const { data: session } = useSession()
  const [following, setFollowing] = useState<DribbbleFollowing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const perPage = 12

  const fetchFollowing = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(
        `/api/dribbble/following?page=${page}&per_page=${perPage}`
      )
      if (!res.ok) throw new Error('Failed to fetch following')
      const data = await res.json()
      setFollowing(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [page, perPage])

  useEffect(() => {
    if (session?.accessToken) {
      fetchFollowing()
    }
  }, [session, fetchFollowing])

  return (
    <div>
      <Header
        title="Following"
        subtitle="Designers you follow on Dribbble"
      />

      <div className="p-6">
        {/* Stats */}
        <div className="mb-6">
          <p className="text-gray-500">
            Showing {following.length} designer{following.length !== 1 ? 's' : ''} you follow
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
              onClick={fetchFollowing}
              className="mt-4 px-4 py-2 bg-dribbble-pink text-white rounded-lg"
            >
              Try Again
            </button>
          </div>
        ) : following.length === 0 ? (
          <EmptyState
            icon={<UserPlus className="w-8 h-8" />}
            title="Not following anyone"
            description="Discover and follow designers whose work inspires you."
            action={
              <a
                href="https://dribbble.com/designers"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-dribbble-pink text-white rounded-lg hover:bg-dribbble-pink-dark transition-colors"
              >
                Discover Designers
              </a>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {following.map((item) => (
              <UserCard key={item.id} user={item.followee} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && following.length > 0 && (
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
