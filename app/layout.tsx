import './globals.css'
import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
const openSans = Open_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Team chat application',
    description: 'Team chat application',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={openSans.className}>{children}</body>
            </html>
        </ClerkProvider>
    )
}
