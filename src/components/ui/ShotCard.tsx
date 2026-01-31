'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, Eye, MessageCircle, ExternalLink } from 'lucide-react'
import { DribbbleShot } from '@/types/dribbble'
import { formatDistanceToNow } from 'date-fns'

interface ShotCardProps {
  shot: DribbbleShot
  showUser?: boolean
}

export default function ShotCard({ shot, showUser = false }: ShotCardProps) {
  return (
    <div className="shot-card group">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={shot.images.normal}
          alt={shot.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold truncate">{shot.title}</h3>
          </div>
        </div>

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link
            href={shot.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-gray-700" />
          </Link>
        </div>

        {/* Animated badge */}
        {shot.animated && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-white/90 rounded-full text-xs font-medium text-gray-700">
            GIF
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between">
          {showUser && shot.user ? (
            <div className="flex items-center gap-2 min-w-0">
              <Image
                src={shot.user.avatar_url}
                alt={shot.user.name}
                width={24}
                height={24}
                className="rounded-full flex-shrink-0"
              />
              <span className="text-sm text-gray-600 truncate">
                {shot.user.name}
              </span>
            </div>
          ) : (
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(shot.published_at), {
                addSuffix: true,
              })}
            </span>
          )}

          <div className="flex items-center gap-3 text-sm text-gray-500 flex-shrink-0">
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {shot.likes_count.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {shot.views_count.toLocaleString()}
            </span>
            {shot.comments_count > 0 && (
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {shot.comments_count}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
