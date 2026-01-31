'use client'

import { useSession } from 'next-auth/react'
import { Bell, Search, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface HeaderProps {
  title: string
  subtitle?: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { data: session } = useSession()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-64 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-dribbble-pink focus:bg-white transition-all"
            />
          </div>

          {/* View on Dribbble */}
          {session?.user?.login && (
            <Link
              href={`https://dribbble.com/${session.user.login}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-dribbble-pink transition-colors"
            >
              <span className="hidden sm:inline">View Profile</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          )}

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-dribbble-pink rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  )
}
