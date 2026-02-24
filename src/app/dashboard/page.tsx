'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import {
  Image as ImageIcon,
  FolderKanban,
  Heart,
  Users,
  Eye,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'
import Header from '@/components/layout/Header'
import StatCard from '@/components/ui/StatCard'
import ShotCard from '@/components/ui/ShotCard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { DribbbleUser, DribbbleShot } from '@/types/dribbble'

export default function DashboardPage() {
  const { data: session } = useSession()
  const [user, setUser] = useState<DribbbleUser | null>(null)
  const [recentShots, setRecentShots] = useState<DribbbleShot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch user and shots independently so one failure doesn't break the other
        const [userResult, shotsResult] = await Promise.allSettled([
          fetch('/api/dribbble/user').then(r => r.ok ? r.json() : null),
          fetch('/api/dribbble/shots?per_page=6').then(r => r.ok ? r.json() : []),
        ])

        if (userResult.status === 'fulfilled' && userResult.value) {
          setUser(userResult.value)
        }
        if (shotsResult.status === 'fulfilled' && Array.isArray(shotsResult.value)) {
          setRecentShots(shotsResult.value)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (session?.accessToken) {
      fetchData()
    }
  }, [session])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to load data
          </h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-dribbble-pink text-white rounded-lg hover:bg-dribbble-pink-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'Designer'}!`}
        subtitle="Here's an overview of your Dribbble portfolio"
      />

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Shots"
            value={user?.shots_count || 0}
            icon={<ImageIcon className="w-6 h-6" />}
            color="pink"
          />
          <StatCard
            title="Projects"
            value={user?.projects_count || 0}
            icon={<FolderKanban className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="Followers"
            value={user?.followers_count || 0}
            icon={<Users className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            title="Likes Received"
            value={user?.likes_received_count || 0}
            icon={<Heart className="w-6 h-6" />}
            color="purple"
          />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Following"
            value={user?.followings_count || 0}
            icon={<Users className="w-6 h-6" />}
            color="orange"
          />
          <StatCard
            title="Total Likes Given"
            value={user?.likes_count || 0}
            icon={<Heart className="w-6 h-6" />}
            color="pink"
          />
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Account Type</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {user?.pro ? 'Pro' : 'Free'}
                </p>
                {user?.can_upload_shot && (
                  <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    Can upload shots
                  </p>
                )}
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-dribbble-pink to-dribbble-pink-dark text-white">
                <Eye className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Shots */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Shots</h2>
            <Link
              href="/dashboard/shots"
              className="flex items-center gap-1 text-dribbble-pink hover:text-dribbble-pink-dark transition-colors"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recentShots.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentShots.map((shot) => (
                <ShotCard key={shot.id} shot={shot} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                <ImageIcon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No shots yet
              </h3>
              <p className="text-gray-500 mb-4">
                Start uploading your designs to Dribbble
              </p>
              <a
                href="https://dribbble.com/shots/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-dribbble-pink text-white rounded-lg hover:bg-dribbble-pink-dark transition-colors"
              >
                Upload your first shot
              </a>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/dashboard/shots"
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-dribbble-pink/30 hover:shadow-md transition-all group"
          >
            <div className="p-2 bg-pink-50 rounded-lg group-hover:bg-dribbble-pink/10 transition-colors">
              <ImageIcon className="w-5 h-5 text-dribbble-pink" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Manage Shots</p>
              <p className="text-sm text-gray-500">View and manage your shots</p>
            </div>
          </Link>

          <Link
            href="/dashboard/projects"
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <FolderKanban className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Projects</p>
              <p className="text-sm text-gray-500">Organize your work</p>
            </div>
          </Link>

          <Link
            href="/dashboard/followers"
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-green-300 hover:shadow-md transition-all group"
          >
            <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Followers</p>
              <p className="text-sm text-gray-500">See who follows you</p>
            </div>
          </Link>

          <Link
            href="/dashboard/likes"
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-300 hover:shadow-md transition-all group"
          >
            <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
              <Heart className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Likes</p>
              <p className="text-sm text-gray-500">Shots you&apos;ve liked</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
