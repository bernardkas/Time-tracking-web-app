import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import prisma from './db/db';
import authConfig from './auth.config';
import { getAccountByUserId, getUserById } from './data/user';
import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/auth/sign-in',
    error: '/auth/error',
  },
  events: {
    async linkAccount({ user }) {
      console.log('user in link');
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: { emailVerified: new Date(), isOAuth: true },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'credentials') {
        return true;
      }

      const existingUser = await getUserById(user.id);

      if (!existingUser?.emailVerified) {
        return false;
      }

      return true;
    },
    async session({ token, session, trigger }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (token.subscriptionType && session.user) {
        session.user.subscriptionType = token.subscriptionType as UserRole;
      }

      if (session.user) {
        session.user.name = token.name as UserRole;
        session.user.email = token.email as UserRole;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.profileCompleted = token.profileCompleted as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser?.id);
      token.isOAuth = existingUser.isOAuth || !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.subscriptionType = existingUser.subscriptionType;
      token.profileCompleted = existingUser.profileCompleted;

      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  ...authConfig,
});
