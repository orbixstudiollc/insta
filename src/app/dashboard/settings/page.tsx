'use client'

import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import {
  User,
  Shield,
  Bell,
  Palette,
  ExternalLink,
  LogOut,
  AlertTriangle,
} from 'lucide-react'
import Header from '@/components/layout/Header'

export default function SettingsPage() {
  const { data: session } = useSession()

  return (
    <div>
      <Header
        title="Settings"
        subtitle="Manage your account and preferences"
      />

      <div className="p-6 max-w-3xl">
        {/* Account Section */}
        <div className="bg-white rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-gray-400" />
            Account
          </h2>

          {session?.user && (
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  width={56}
                  height={56}
                  className="rounded-full"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900">{session.user.name}</p>
                <p className="text-sm text-gray-500">@{session.user.login}</p>
              </div>
              <a
                href={`https://dribbble.com/${session.user.login}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-dribbble-pink transition-colors"
              >
                View Profile
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>

        {/* Connected Account */}
        <div className="bg-white rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-400" />
            Connected Account
          </h2>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg dribbble-gradient flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm7.369 5.897a10.217 10.217 0 012.406 6.334c-.352-.072-3.873-.792-7.418-.344-.08-.18-.155-.362-.235-.544a20.633 20.633 0 00-.593-1.256c3.903-1.595 5.676-3.884 5.84-4.19zm-1.158-1.336c-.144.273-1.737 2.447-5.486 3.863a50.813 50.813 0 00-3.727-5.835 10.253 10.253 0 016.324.577 10.2 10.2 0 012.889 1.395zM8.285 2.323a77.31 77.31 0 013.699 5.774c-4.669 1.242-8.784 1.223-9.23 1.214a10.26 10.26 0 015.531-6.988zM1.775 12.017v-.309c.434.01 5.256.097 10.262-1.416.288.559.559 1.127.811 1.695l-.369.104c-5.27 1.7-8.073 6.345-8.23 6.612a10.218 10.218 0 01-2.474-6.686zm3.892 7.766c.101-.166 2.163-4.287 7.815-6.254.025-.008.049-.014.074-.022a50.869 50.869 0 012.147 7.624 10.249 10.249 0 01-10.036-1.348zm11.781.542a52.25 52.25 0 00-2.002-7.19c3.313-.529 6.218.34 6.582.453a10.247 10.247 0 01-4.58 6.737z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Dribbble</p>
                <p className="text-sm text-green-600">Connected</p>
              </div>
            </div>
            <a
              href="https://dribbble.com/account"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-dribbble-pink transition-colors"
            >
              Manage on Dribbble
            </a>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              API Permissions
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>- Access your public profile information</li>
              <li>- View your shots, projects, and buckets</li>
              <li>- See who you follow and your followers</li>
              <li>- View shots you&apos;ve liked</li>
            </ul>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-gray-400" />
            Preferences
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Theme</p>
                <p className="text-sm text-gray-500">
                  Choose your preferred color scheme
                </p>
              </div>
              <select className="px-3 py-2 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-dribbble-pink">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Default View</p>
                <p className="text-sm text-gray-500">
                  Choose default shots display mode
                </p>
              </div>
              <select className="px-3 py-2 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-dribbble-pink">
                <option value="grid">Grid</option>
                <option value="list">List</option>
              </select>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl p-6 border border-red-200">
          <h2 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Sign Out</p>
              <p className="text-sm text-gray-500">
                Sign out of your Dribbble account
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
