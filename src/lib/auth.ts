import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  // Comentamos el adaptador para usar solo JWT con credentials
  // adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user || !user.password) {
            logger.auth('Failed login attempt - user not found or no password', undefined, { 
              email: credentials.email 
            });
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            logger.auth('Failed login attempt - invalid password', user.id, { 
              email: credentials.email 
            });
            return null
          }

          logger.auth('Successful login', user.id, { 
            email: user.email,
            role: user.role 
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            phone: user.phone || undefined,
            company: user.company || undefined,
          }
        } catch (error) {
          logger.error('Error in authorize', error, { 
            email: credentials.email 
          });
          return null
        }
      }
    }),
    // Comentamos estos providers hasta que tengamos las credenciales
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
    // GitHubProvider({
    //   clientId: process.env.GITHUB_CLIENT_ID!,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    // })
  ],
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        // Al iniciar sesión, agregar información del usuario al token
        token.userId = user.id
        token.role = user.role
        token.phone = user.phone
        token.company = user.company
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.userId as string
        session.user.role = token.role as string
        session.user.phone = token.phone as string
        session.user.company = token.company as string
      }
      return session
    }
  },
  debug: process.env.NODE_ENV === 'development',
}
