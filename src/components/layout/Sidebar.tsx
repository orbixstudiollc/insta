'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import {
  LayoutDashboard,
  Image as ImageIcon,
  FolderKanban,
  Heart,
  Users,
  UserPlus,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Palette,
} from 'lucide-react'
import { useState } from 'react'

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
}

const mainNavItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    name: 'My Shots',
    href: '/dashboard/shots',
    icon: <ImageIcon className="w-5 h-5" />,
  },
  {
    name: 'Projects',
    href: '/dashboard/projects',
    icon: <FolderKanban className="w-5 h-5" />,
  },
  {
    name: 'Buckets',
    href: '/dashboard/buckets',
    icon: <Palette className="w-5 h-5" />,
  },
  {
    name: 'Likes',
    href: '/dashboard/likes',
    icon: <Heart className="w-5 h-5" />,
  },
  {
    name: 'Followers',
    href: '/dashboard/followers',
    icon: <Users className="w-5 h-5" />,
  },
  {
    name: 'Following',
    href: '/dashboard/following',
    icon: <UserPlus className="w-5 h-5" />,
  },
]

const secondaryNavItems: NavItem[] = [
  {
    name: 'Profile',
    href: '/dashboard/profile',
    icon: <User className="w-5 h-5" />,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: <Settings className="w-5 h-5" />,
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [collapsed, setCollapsed] = useState(false)

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl dribbble-gradient flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm7.369 5.897a10.217 10.217 0 012.406 6.334c-.352-.072-3.873-.792-7.418-.344-.08-.18-.155-.362-.235-.544a20.633 20.633 0 00-.593-1.256c3.903-1.595 5.676-3.884 5.84-4.19zm-1.158-1.336c-.144.273-1.737 2.447-5.486 3.863a50.813 50.813 0 00-3.727-5.835 10.253 10.253 0 016.324.577 10.2 10.2 0 012.889 1.395zM8.285 2.323a77.31 77.31 0 013.699 5.774c-4.669 1.242-8.784 1.223-9.23 1.214a10.26 10.26 0 015.531-6.988zM1.775 12.017v-.309c.434.01 5.256.097 10.262-1.416.288.559.559 1.127.811 1.695l-.369.104c-5.27 1.7-8.073 6.345-8.23 6.612a10.218 10.218 0 01-2.474-6.686zm3.892 7.766c.101-.166 2.163-4.287 7.815-6.254.025-.008.049-.014.074-.022a50.869 50.869 0 012.147 7.624 10.249 10.249 0 01-10.036-1.348zm11.781.542a52.25 52.25 0 00-2.002-7.19c3.313-.529 6.218.34 6.582.453a10.247 10.247 0 01-4.58 6.737z" />
              </svg>
            </div>
            {!collapsed && (
              <span className="font-bold text-lg text-gray-900">
                Dribbble Manager
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-dribbble-pink text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title={collapsed ? item.name : undefined}
              >
                {item.icon}
                {!collapsed && <span className="font-medium">{item.name}</span>}
              </Link>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-gray-200 space-y-1">
            {secondaryNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-dribbble-pink text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title={collapsed ? item.name : undefined}
              >
                {item.icon}
                {!collapsed && <span className="font-medium">{item.name}</span>}
              </Link>
            ))}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200">
          {session?.user && (
            <div className={`flex items-center gap-3 mb-3 ${collapsed ? 'justify-center' : ''}`}>
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  width={40}
                  height={40}
                  className="rounded-full flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
              )}
              {!collapsed && (
                <div className="overflow-hidden">
                  <p className="font-medium text-gray-900 truncate">
                    {session.user.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    @{session.user.login}
                  </p>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors ${
              collapsed ? 'justify-center' : ''
            }`}
            title={collapsed ? 'Sign Out' : undefined}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="font-medium">Sign Out</span>}
          </button>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>
    </aside>
  )
}
