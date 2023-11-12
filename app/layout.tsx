import './globals.css'
import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { cn } from '@/lib/utils'
import * as React from 'react'
import { ModalProvider } from '@/components/providers/modal-provider'
import { SocketProvider } from '@/components/providers/socket-provider'
import { QueryProvider } from '@/components/providers/query-provider'
const openSans = Open_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Discodo',
    description: 'Team chat application',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body
                className={cn(openSans.className, 'bg-white dark:bg-gray-950 ')}
            >
                <ClerkProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem={false}
                        storageKey="discodo-theme"
                    >
                        <QueryProvider>
                            <SocketProvider>
                                <ModalProvider />
                                {children}
                            </SocketProvider>
                        </QueryProvider>
                    </ThemeProvider>
                </ClerkProvider>
            </body>
        </html>
    )
}
