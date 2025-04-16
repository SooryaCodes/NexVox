import './globals.css'
import 'aos/dist/aos.css';
import type { Metadata, Viewport } from 'next'
import AnimationProvider from '@/components/AnimationProvider'
import SmoothScroll from '@/components/ScrollTriggerSetup'
import { Inter, Orbitron } from 'next/font/google'
import { SoundProvider } from '@/components/SoundProvider'
import FloatingChatbotController from '@/components/FloatingChatbotController'
import { UserProvider } from '@/contexts/UserContext'
import { FriendProvider } from '@/contexts/FriendContext'
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000'
}

export const metadata: Metadata = {
  metadataBase: new URL('https://nexvox.vercel.app'),
  title: {
    template: '%s | NexVox',
    default: 'NexVox - Next Generation Voice Communication Platform'
  },
  description: 'Connect globally with live voice rooms, spatial audio, and immersive communication in a cyberpunk-inspired platform.',
  applicationName: 'NexVox',
  keywords: ['voice chat', 'spatial audio', 'live communication', 'cyberpunk', 'voice rooms', 'immersive audio'],
  authors: [{ name: 'NexVox Team' }],
  creator: 'NexVox',
  publisher: 'NexVox',
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
    googleBot: 'index, follow'
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nexvox.vercel.app',
    siteName: 'NexVox',
    title: 'NexVox - Next Generation Voice Communication Platform',
    description: 'Connect globally with live voice rooms, spatial audio, and immersive communication in a cyberpunk-inspired platform.',
    images: [
      {
        url: '/nexvox_image.png',
        width: 1200,
        height: 630,
        alt: 'NexVox - Voice Communication Platform'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NexVox - Next Generation Voice Communication Platform',
    description: 'Connect globally with live voice rooms, spatial audio, and immersive communication in a cyberpunk-inspired platform.',
    creator: '@nexvox',
    site: '@nexvox',
    images: ['/nexvox_image.png']
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/apple-icon.png', type: 'image/png', sizes: '180x180' }
    ]
  },
  alternates: {
    canonical: 'https://nexvox.vercel.app'
  }
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