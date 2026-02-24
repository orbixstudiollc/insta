'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import {
  MapPin,
  Link as LinkIcon,
  Twitter,
  Calendar,
  Image as ImageIcon,
  FolderKanban,
  Users,
  Heart,
  ExternalLink,
  Shield,
} from 'lucide-react'
import Header from '@/components/layout/Header'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { DribbbleUser } from '@/types/dribbble'
import { format } from 'date-fns'

export default function ProfilePage() {
  const { data: session } = useSession()
  const [user, setUser] = useState<DribbbleUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/dribbble/user')
        if (!res.ok) throw new Error('Failed to fetch user')
        const data = await res.json()
        setUser(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (session?.accessToken) {
      fetchUser()
    }
  }, [session])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error || 'User not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header title="Profile" subtitle="View and manage your Dribbble profile" />

      <div className="p-6">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          {/* Cover/Banner */}
          <div className="h-32 dribbble-gradient"></div>

          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="relative -mt-16 mb-4">
              <Image
                src={user.avatar_url}
                alt={user.name}
                width={128}
                height={128}
                className="rounded-full border-4 border-white shadow-lg"
              />
              {user.pro && (
                <span className="absolute bottom-2 right-2 px-2 py-1 bg-dribbble-pink text-white text-xs font-medium rounded-full">
                  PRO
                </span>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-500">@{user.login}</p>

                {user.bio && (
                  <p className="mt-3 text-gray-600 max-w-2xl">{user.bio}</p>
                )}

                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
                  {user.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {user.location}
                    </span>
                  )}
                  {user.links?.web && (
                    <a
                      href={user.links.web}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-dribbble-pink transition-colors"
                    >
                      <LinkIcon className="w-4 h-4" />
                      Website
                    </a>
                  )}
                  {user.links?.twitter && (
                    <a
                      href={`https://twitter.com/${user.links.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-dribbble-pink transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                      @{user.links.twitter}
                    </a>
                  )}
                  {user.created_at && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {format(new Date(user.created_at), 'MMMM yyyy')}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-dribbble-pink text-white rounded-lg hover:bg-dribbble-pink-dark transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on Dribbble
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-pink-50 text-dribbble-pink mb-3">
              <ImageIcon className="w-6 h-6" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {(user.shots_count ?? 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Shots</p>
          </div>

          <div className="bg-white rounded-xl p-5 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 mb-3">
              <FolderKanban className="w-6 h-6" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {(user.projects_count ?? 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Projects</p>
          </div>

          <div className="bg-white rounded-xl p-5 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 text-green-600 mb-3">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {(user.followers_count ?? 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Followers</p>
          </div>

          <div className="bg-white rounded-xl p-5 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-50 text-purple-600 mb-3">
              <Heart className="w-6 h-6" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {(user.likes_received_count ?? 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Likes Received</p>
          </div>
        </div>

        {/* Account Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Account Details
            </h2>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="text-gray-500">Account Type</dt>
                <dd className="font-medium text-gray-900">
                  {user.pro ? (
                    <span className="flex items-center gap-1 text-dribbble-pink">
                      <Shield className="w-4 h-4" />
                      Pro Account
                    </span>
                  ) : (
                    'Free Account'
                  )}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">User Type</dt>
                <dd className="font-medium text-gray-900 capitalize">
                  {user.type}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Can Upload Shots</dt>
                <dd className="font-medium text-gray-900">
                  {user.can_upload_shot ? (
                    <span className="text-green-600">Yes</span>
                  ) : (
                    <span className="text-red-500">No</span>
                  )}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">User ID</dt>
                <dd className="font-medium text-gray-900">{user.id}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Activity Summary
            </h2>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="text-gray-500">Following</dt>
                <dd className="font-medium text-gray-900">
                  {(user.followings_count ?? 0).toLocaleString()} designers
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Shots Liked</dt>
                <dd className="font-medium text-gray-900">
                  {(user.likes_count ?? 0).toLocaleString()} shots
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Member Since</dt>
                <dd className="font-medium text-gray-900">
                  {user.created_at ? format(new Date(user.created_at), 'MMM d, yyyy') : 'N/A'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
