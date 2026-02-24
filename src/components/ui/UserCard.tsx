'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, MapPin, Image as ImageIcon } from 'lucide-react'
import { DribbbleUser } from '@/types/dribbble'

interface UserCardProps {
  user: DribbbleUser
  showStats?: boolean
}

export default function UserCard({ user, showStats = true }: UserCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <Image
          src={user.avatar_url}
          alt={user.name}
          width={56}
          height={56}
          className="rounded-full flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-900 truncate">
                {user.name}
              </h3>
              <p className="text-sm text-gray-500">@{user.login}</p>
            </div>

            <Link
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-dribbble-pink transition-colors flex-shrink-0"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {user.location && (
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {user.location}
            </p>
          )}

          {showStats && (
            <div className="flex items-center gap-4 mt-3 text-sm">
              <span className="flex items-center gap-1 text-gray-600">
                <ImageIcon className="w-4 h-4" />
                {user.shots_count ?? 0} shots
              </span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">
                {(user.followers_count ?? 0).toLocaleString()} followers
              </span>
            </div>
          )}

          {user.pro && (
            <span className="inline-flex items-center mt-2 px-2 py-0.5 rounded-full text-xs font-medium bg-dribbble-pink/10 text-dribbble-pink">
              Pro
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
