import { ServerSidebar } from '@/components/server/server-sidebar'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'
const Layout = async ({
    children,
    params,
}: {
    children: ReactNode
    params: {
        slug: string
    }
}) => {
    // auth redirect
    const profile = await currentProfile()
    if (!profile) return redirectToSignIn()
    // server logic
    const server = await db.server.findUnique({
        where: {
            id: params.slug,
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    })
    if (!server) return redirect('/')
    return (
        <div className="h-full w-full flex">
            <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0 ">
                <ServerSidebar serverId={server.id} />
            </div>
            <main className="h-full w-full md:pl-60 bg-white dark:bg-[#313338]">{children}</main>
        </div>
    )
}
export default Layout
