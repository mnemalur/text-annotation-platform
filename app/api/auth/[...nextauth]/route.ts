import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // This is a temporary mock user for development
        if (credentials?.username === 'admin' && credentials?.password === 'admin') {
          return {
            id: '1',
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'admin'
          }
        }
        if (credentials?.username === 'user' && credentials?.password === 'user') {
          return {
            id: '2',
            name: 'Regular User',
            email: 'user@example.com',
            role: 'user'
          }
        }
        return null
      }
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/login',
  },
})

export { handler as GET, handler as POST } 