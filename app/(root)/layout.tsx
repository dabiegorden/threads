import { ClerkProvider } from '@clerk/nextjs';
import '../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Bottombar, LeftSidebar, RightSidebar, Topbar } from '@/components/shared';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Cordia',
  description: 'Thread is a full-stack social media app for threaling',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ClerkProvider>
        <Topbar />
          <main className="flex flex-row">
             <LeftSidebar />
               <section className="main-container">
                  <div className="w-full max-w-4xl">
                  {children}
                  </div>
               </section>
             <RightSidebar />
          </main>
        <Bottombar />
      </ClerkProvider>
      </body>
    </html>
  )
}
