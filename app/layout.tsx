import './globals.css'
import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { cn } from '@/lib/utils'
import * as React from 'react'
import { ModeToggle } from '@/components/mode-toggle'
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
                        <header className="h-20 w-full bg-red-300">
                            <ModeToggle />
                        </header>
                        {children}
                    </ThemeProvider>
                </ClerkProvider>
            </body>
        </html>
    )
}
