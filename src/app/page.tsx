'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Image as ImageIcon,
  FolderKanban,
  Users,
  Heart,
  ArrowRight,
  Shield,
  Zap,
  BarChart3,
} from 'lucide-react'

export default function HomePage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dribbble-pink"></div>
      </div>
    )
  }

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl dribbble-gradient flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm7.369 5.897a10.217 10.217 0 012.406 6.334c-.352-.072-3.873-.792-7.418-.344-.08-.18-.155-.362-.235-.544a20.633 20.633 0 00-.593-1.256c3.903-1.595 5.676-3.884 5.84-4.19zm-1.158-1.336c-.144.273-1.737 2.447-5.486 3.863a50.813 50.813 0 00-3.727-5.835 10.253 10.253 0 016.324.577 10.2 10.2 0 012.889 1.395zM8.285 2.323a77.31 77.31 0 013.699 5.774c-4.669 1.242-8.784 1.223-9.23 1.214a10.26 10.26 0 015.531-6.988zM1.775 12.017v-.309c.434.01 5.256.097 10.262-1.416.288.559.559 1.127.811 1.695l-.369.104c-5.27 1.7-8.073 6.345-8.23 6.612a10.218 10.218 0 01-2.474-6.686zm3.892 7.766c.101-.166 2.163-4.287 7.815-6.254.025-.008.049-.014.074-.022a50.869 50.869 0 012.147 7.624 10.249 10.249 0 01-10.036-1.348zm11.781.542a52.25 52.25 0 00-2.002-7.19c3.313-.529 6.218.34 6.582.453a10.247 10.247 0 01-4.58 6.737z" />
                </svg>
              </div>
              <span className="font-bold text-xl text-white">
                Dribbble Manager
              </span>
            </div>

            <Link
              href="/auth/signin"
              className="px-4 py-2 bg-dribbble-pink text-white rounded-lg hover:bg-dribbble-pink-dark transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-dribbble-pink/10 rounded-full text-dribbble-pink mb-6">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">
              Manage your Dribbble portfolio
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Your Complete{' '}
            <span className="text-dribbble-pink">Dribbble</span>{' '}
            Dashboard
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Access all your Dribbble data in one place. View shots, manage
            projects, track followers, and analyze your portfolio performance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/signin"
              className="flex items-center gap-2 px-8 py-4 bg-dribbble-pink text-white font-semibold rounded-xl hover:bg-dribbble-pink-dark transition-colors"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="https://dribbble.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
            >
              Learn About Dribbble
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Access and manage all aspects of your Dribbble account from a
              single, beautiful dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700 hover:border-dribbble-pink/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center mb-4">
                <ImageIcon className="w-6 h-6 text-dribbble-pink" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Shots Management
              </h3>
              <p className="text-gray-400 text-sm">
                View, organize, and manage all your design shots in one place
                with grid and list views.
              </p>
            </div>

            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700 hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                <FolderKanban className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Projects & Buckets
              </h3>
              <p className="text-gray-400 text-sm">
                Organize your work into projects and save inspiration in
                buckets.
              </p>
            </div>

            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700 hover:border-green-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Network Insights
              </h3>
              <p className="text-gray-400 text-sm">
                Track your followers and the designers you follow, all in a
                clean interface.
              </p>
            </div>

            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700 hover:border-purple-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Analytics Overview
              </h3>
              <p className="text-gray-400 text-sm">
                See your portfolio stats at a glance including views, likes,
                and engagement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Note */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-6">
            <Shield className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Secure OAuth Authentication
          </h2>
          <p className="text-gray-400 mb-8">
            We use Dribbble&apos;s official OAuth to securely connect to your
            account. Your credentials are never stored on our servers. You can
            revoke access at any time from your Dribbble settings.
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-dribbble-pink text-white font-semibold rounded-xl hover:bg-dribbble-pink-dark transition-colors"
          >
            Connect Your Account
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg dribbble-gradient flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0z" />
              </svg>
            </div>
            <span className="text-sm text-gray-400">
              Dribbble Manager - Portfolio Dashboard
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a
              href="https://dribbble.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Dribbble
            </a>
            <a
              href="https://developer.dribbble.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              API Docs
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
