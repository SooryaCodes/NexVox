import './globals.css'
import 'aos/dist/aos.css';
import type { Metadata } from 'next'
import { usePathname } from 'next/navigation'
import AnimationProvider from '@/components/AnimationProvider'
import SmoothScroll from '@/components/ScrollTriggerSetup'
import { Inter, Orbitron } from 'next/font/google'
import { SoundProvider } from '@/components/SoundProvider'
import FloatingChatbotController from '@/components/FloatingChatbotController'
import { UserProvider } from '@/contexts/UserContext'
import { FriendProvider } from '@/contexts/FriendContext'
import Header from '@/components/Header'
import AOSInit from '@/components/AOSInit'

// Initialize the fonts
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter'
})

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-orbitron'
})

export const metadata: Metadata = {
  title: 'NexVox - Next Generation Voice Communication Platform',
  description: 'Connect globally with live voice rooms, spatial audio, and immersive communication.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable}`}>
      <body className="bg-black min-h-screen">
        <SoundProvider>
          <UserProvider>
            <FriendProvider>
              <SmoothScroll />
              <AOSInit />
              
              <div className="flex flex-col min-h-screen">
                <AnimationProvider>
                  <main className="flex-grow">
                    {children}
                  </main>
                  <FloatingChatbotController />
                </AnimationProvider>
              </div>
            </FriendProvider>
          </UserProvider>
        </SoundProvider>
      </body>
    </html>
  )
}