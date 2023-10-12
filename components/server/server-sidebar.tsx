import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirectToSignIn } from '@clerk/nextjs'
import { ChanelType } from '@prisma/client'
import { channel } from 'diagnostics_channel'
import { redirect } from 'next/navigation'
import { ServerHeader } from './server-header'
import { ServerWithMembersWithProfiles } from '@/types'

interface ServerSidebarProps {
    serverId: string
}
export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
    // getting profile
    const profile = await currentProfile()
    // redirecting if not logged in
    !profile && redirectToSignIn()
    // getting server
    const server = await db.server.findUnique({
        where: {
            id: serverId,
        },
        include: {
            chanels: {
                orderBy: {
                    createdAt: 'asc',
                },
            },
            members: {
                include: {
                    profile: true,
                },
                orderBy: {
                    role: 'asc',
                },
            },
        },
    })
    if (!server) return redirect('/')
    // filtering chanels
    const textChannels = server?.chanels.filter(
        (chanel) => chanel.type === ChanelType.TEXT
    )
    const audioChanels = server?.chanels.filter(
        (channel) => channel.type === ChanelType.AUDIO
    )
    const videoChanels = server?.chanels.filter((channel) => {
        return channel.type === ChanelType.VIDEO
    })
    const members = server?.members.filter(
        (member) => member.profileId !== profile?.id
    )
    // redirecting if server is not found
    // checking my role
    const role = server.members.find(
        (member) => member.profileId === profile?.id
    )?.role
    return (
        <div className="flex flex-col  h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5] border-l-2 border-solid border-gray-200 dark:border-l-0">
            <ServerHeader role={role} server={server} />
        </div>
    )
}
