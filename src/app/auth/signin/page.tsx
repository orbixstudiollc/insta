'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SignInContent() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const error = searchParams.get('error')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full dribbble-gradient mb-4">
              <svg
                className="w-8 h-8 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm7.369 5.897a10.217 10.217 0 012.406 6.334c-.352-.072-3.873-.792-7.418-.344-.08-.18-.155-.362-.235-.544a20.633 20.633 0 00-.593-1.256c3.903-1.595 5.676-3.884 5.84-4.19zm-1.158-1.336c-.144.273-1.737 2.447-5.486 3.863a50.813 50.813 0 00-3.727-5.835 10.253 10.253 0 016.324.577 10.2 10.2 0 012.889 1.395zM8.285 2.323a77.31 77.31 0 013.699 5.774c-4.669 1.242-8.784 1.223-9.23 1.214a10.26 10.26 0 015.531-6.988zM1.775 12.017v-.309c.434.01 5.256.097 10.262-1.416.288.559.559 1.127.811 1.695l-.369.104c-5.27 1.7-8.073 6.345-8.23 6.612a10.218 10.218 0 01-2.474-6.686zm3.892 7.766c.101-.166 2.163-4.287 7.815-6.254.025-.008.049-.014.074-.022a50.869 50.869 0 012.147 7.624 10.249 10.249 0 01-10.036-1.348zm11.781.542a52.25 52.25 0 00-2.002-7.19c3.313-.529 6.218.34 6.582.453a10.247 10.247 0 01-4.58 6.737z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Dribbble Manager
            </h1>
            <p className="text-gray-500 mt-2">
              Sign in to manage your Dribbble portfolio
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">
                {error === 'OAuthSignin' && 'Error starting authentication'}
                {error === 'OAuthCallback' && 'Error during authentication'}
                {error === 'OAuthCreateAccount' && 'Error creating account'}
                {error === 'Callback' && 'Authentication callback error'}
                {error === 'Default' && 'An error occurred'}
              </p>
            </div>
          )}

          <button
            onClick={() => signIn('dribbble', { callbackUrl })}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-dribbble-pink hover:bg-dribbble-pink-dark text-white font-semibold rounded-xl transition-colors duration-200"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm7.369 5.897a10.217 10.217 0 012.406 6.334c-.352-.072-3.873-.792-7.418-.344-.08-.18-.155-.362-.235-.544a20.633 20.633 0 00-.593-1.256c3.903-1.595 5.676-3.884 5.84-4.19zm-1.158-1.336c-.144.273-1.737 2.447-5.486 3.863a50.813 50.813 0 00-3.727-5.835 10.253 10.253 0 016.324.577 10.2 10.2 0 012.889 1.395zM8.285 2.323a77.31 77.31 0 013.699 5.774c-4.669 1.242-8.784 1.223-9.23 1.214a10.26 10.26 0 015.531-6.988zM1.775 12.017v-.309c.434.01 5.256.097 10.262-1.416.288.559.559 1.127.811 1.695l-.369.104c-5.27 1.7-8.073 6.345-8.23 6.612a10.218 10.218 0 01-2.474-6.686zm3.892 7.766c.101-.166 2.163-4.287 7.815-6.254.025-.008.049-.014.074-.022a50.869 50.869 0 012.147 7.624 10.249 10.249 0 01-10.036-1.348zm11.781.542a52.25 52.25 0 00-2.002-7.19c3.313-.529 6.218.34 6.582.453a10.247 10.247 0 01-4.58 6.737z" />
            </svg>
            Continue with Dribbble
          </button>

          <p className="mt-6 text-center text-sm text-gray-500">
            By signing in, you agree to allow this app to access your Dribbble
            account data.
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don&apos;t have a Dribbble account?{' '}
          <a
            href="https://dribbble.com/signup"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dribbble-pink hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dribbble-pink"></div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  )
}
