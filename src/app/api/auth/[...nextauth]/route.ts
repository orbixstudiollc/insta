import NextAuth, { AuthOptions } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      login?: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    login?: string
  }
}

export const authOptions: AuthOptions = {
  providers: [
    {
      id: 'dribbble',
      name: 'Dribbble',
      type: 'oauth',
      authorization: {
        url: 'https://dribbble.com/oauth/authorize',
        params: {
          scope: 'public upload comment write',
        },
      },
      token: 'https://dribbble.com/oauth/token',
      userinfo: 'https://api.dribbble.com/v2/user',
      clientId: process.env.DRIBBBLE_CLIENT_ID,
      clientSecret: process.env.DRIBBBLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name,
          email: profile.email || null,
          image: profile.avatar_url,
          login: profile.login,
        }
      },
    },
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
      }
      if (profile) {
        token.login = (profile as { login?: string }).login
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      if (session.user) {
        session.user.login = token.login
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
