import authConfig from './auth.config';
import NextAuth from 'next-auth';
const { auth } = NextAuth(authConfig);
import { getToken } from 'next-auth/jwt';

import {
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
  authRoutes,
  apiAuthPrefix,
  companyRoutes,
} from '@/routes';
import { NextResponse } from 'next/server';
// @ts-ignore in the future to fix type error
export default auth(async req => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  // This way dynamic
  // const dynamicRoute = [`/test/${nextUrl.pathname}`];

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isCompanyRoute = companyRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return null;
  }
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  // In here you can change if you want isPublicRoute to make
  // all public or to make all private !isPublicRoute whatever you write in isPublicRoute
  // it goind to be private not public

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;

    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/auth/sign-in?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  if (isCompanyRoute && token?.role !== 'COMPANY') {
    return NextResponse.redirect(new URL('/dashboard', nextUrl));
  }

  return null;
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
