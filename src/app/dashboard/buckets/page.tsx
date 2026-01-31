'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Palette, Plus, Image as ImageIcon } from 'lucide-react'
import Header from '@/components/layout/Header'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'
import Pagination from '@/components/ui/Pagination'
import { DribbbleBucket } from '@/types/dribbble'
import { formatDistanceToNow } from 'date-fns'

export default function BucketsPage() {
  const { data: session } = useSession()
  const [buckets, setBuckets] = useState<DribbbleBucket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const perPage = 12

  const fetchBuckets = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(
        `/api/dribbble/buckets?page=${page}&per_page=${perPage}`
      )
      if (!res.ok) throw new Error('Failed to fetch buckets')
      const data = await res.json()
      setBuckets(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [page, perPage])

  useEffect(() => {
    if (session?.accessToken) {
      fetchBuckets()
    }
  }, [session, fetchBuckets])

  return (
    <div>
      <Header
        title="Buckets"
        subtitle="Collections of shots you've saved"
      />

      <div className="p-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500">
            {buckets.length} bucket{buckets.length !== 1 ? 's' : ''}
          </p>

          <a
            href="https://dribbble.com/buckets/new"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-dribbble-pink text-white rounded-lg hover:bg-dribbble-pink-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Bucket
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
              onClick={fetchBuckets}
              className="mt-4 px-4 py-2 bg-dribbble-pink text-white rounded-lg"
            >
              Try Again
            </button>
          </div>
        ) : buckets.length === 0 ? (
          <EmptyState
            icon={<Palette className="w-8 h-8" />}
            title="No buckets yet"
            description="Create buckets to save and organize shots you like."
            action={
              <a
                href="https://dribbble.com/buckets/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-dribbble-pink text-white rounded-lg hover:bg-dribbble-pink-dark transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Bucket
              </a>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {buckets.map((bucket) => (
              <div
                key={bucket.id}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-dribbble-pink/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <Palette className="w-6 h-6 text-purple-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {bucket.name}
                    </h3>

                    {bucket.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {bucket.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <ImageIcon className="w-4 h-4" />
                        {bucket.shots_count} shots
                      </span>
                      <span className="text-gray-300">|</span>
                      <span>
                        Updated{' '}
                        {formatDistanceToNow(new Date(bucket.updated_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && buckets.length > 0 && (
          <div className="mt-8">
            <Pagination
              currentPage={page}
              totalPages={5}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  )
}
