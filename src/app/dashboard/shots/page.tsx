'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Image as ImageIcon, Plus, Grid, List, ExternalLink } from 'lucide-react'
import Header from '@/components/layout/Header'
import ShotCard from '@/components/ui/ShotCard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'
import Pagination from '@/components/ui/Pagination'
import { DribbbleShot } from '@/types/dribbble'

type ViewMode = 'grid' | 'list'

export default function ShotsPage() {
  const { data: session } = useSession()
  const [shots, setShots] = useState<DribbbleShot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const perPage = 12

  const fetchShots = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(
        `/api/dribbble/shots?page=${page}&per_page=${perPage}`
      )
      if (!res.ok) throw new Error('Failed to fetch shots')
      const data = await res.json()
      setShots(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [page, perPage])

  useEffect(() => {
    if (session?.accessToken) {
      fetchShots()
    }
  }, [session, fetchShots])

  return (
    <div>
      <Header
        title="My Shots"
        subtitle="Manage and view all your Dribbble shots"
      />

      <div className="p-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-dribbble-pink text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-dribbble-pink text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          <a
            href="https://dribbble.com/shots/new"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-dribbble-pink text-white rounded-lg hover:bg-dribbble-pink-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Shot
          </a>
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
              onClick={fetchShots}
              className="mt-4 px-4 py-2 bg-dribbble-pink text-white rounded-lg"
            >
              Try Again
            </button>
          </div>
        ) : shots.length === 0 ? (
          <EmptyState
            icon={<ImageIcon className="w-8 h-8" />}
            title="No shots yet"
            description="Start showcasing your work by uploading your first shot to Dribbble."
            action={
              <a
                href="https://dribbble.com/shots/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-dribbble-pink text-white rounded-lg hover:bg-dribbble-pink-dark transition-colors"
              >
                <Plus className="w-4 h-4" />
                Upload Shot
              </a>
            }
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {shots.map((shot) => (
              <ShotCard key={shot.id} shot={shot} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {shots.map((shot) => {
              const shotData = shot as any
              const likesCount = shotData.likes_count ?? shotData.likes ?? 0
              const viewsCount = shotData.views_count ?? shotData.views ?? 0
              const commentsCount = shotData.comments_count ?? shotData.comments ?? 0
              const imageUrl = shot.images?.teaser || shot.images?.normal || shotData.image_url || ''

              return (
                <div
                  key={shot.id}
                  className="bg-white rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="w-24 h-18 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={imageUrl}
                      alt={shot.title || 'Shot'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {shot.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span>{likesCount.toLocaleString()} likes</span>
                      <span>{viewsCount.toLocaleString()} views</span>
                      <span>{commentsCount} comments</span>
                    </div>
                    {shot.tags && shot.tags.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {shot.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600"
                          >
                            {tag}
                          </span>
                        ))}
                        {shot.tags.length > 3 && (
                          <span className="text-xs text-gray-400">
                            +{shot.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <Link
                    href={shot.html_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-dribbble-pink transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </Link>
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && shots.length > 0 && (
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
