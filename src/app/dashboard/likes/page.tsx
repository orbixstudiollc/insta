'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Heart } from 'lucide-react'
import Header from '@/components/layout/Header'
import ShotCard from '@/components/ui/ShotCard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'
import Pagination from '@/components/ui/Pagination'
import { DribbbleLike } from '@/types/dribbble'

export default function LikesPage() {
  const { data: session } = useSession()
  const [likes, setLikes] = useState<DribbbleLike[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const perPage = 12

  const fetchLikes = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(
        `/api/dribbble/likes?page=${page}&per_page=${perPage}`
      )
      if (!res.ok) throw new Error('Failed to fetch likes')
      const data = await res.json()
      setLikes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [page, perPage])

  useEffect(() => {
    if (session?.accessToken) {
      fetchLikes()
    }
  }, [session, fetchLikes])

  return (
    <div>
      <Header
        title="Liked Shots"
        subtitle="Browse shots you've liked on Dribbble"
      />

      <div className="p-6">
        {/* Stats */}
        <div className="mb-6">
          <p className="text-gray-500">
            {likes.length} liked shot{likes.length !== 1 ? 's' : ''} on this page
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
              onClick={fetchLikes}
              className="mt-4 px-4 py-2 bg-dribbble-pink text-white rounded-lg"
            >
              Try Again
            </button>
          </div>
        ) : likes.length === 0 ? (
          <EmptyState
            icon={<Heart className="w-8 h-8" />}
            title="No liked shots"
            description="Explore Dribbble and like shots that inspire you."
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {likes.map((like) => (
              <ShotCard key={like.id} shot={like.shot} showUser />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && likes.length > 0 && (
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
