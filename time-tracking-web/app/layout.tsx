import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import '@/styles/globals.css';
import Footer from '@/components/footer/Footer';
import Navbar from '@/components/navbar/Navbar';
import { auth } from '@/auth';
import { ToastContainer } from 'react-toastify';
const font = Poppins({ subsets: ['latin'], weight: ['400'] });
import { GoogleAnalytics } from '@next/third-parties/google';
import { SessionProvider } from 'next-auth/react';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: 'Time Tracker App',
  description: 'Time Tracker App',
  icons: '../assets/favicon.ico',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang='en'>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS!} />
        <body className={font.className}>
          {children}
          <ToastContainer autoClose={5000} pauseOnHover={false} theme='dark' />
        </body>
      </html>
    </SessionProvider>
  );
}
