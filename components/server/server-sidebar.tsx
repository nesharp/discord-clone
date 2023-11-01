import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirectToSignIn } from '@clerk/nextjs'
import { ChanelType, MemberRole } from '@prisma/client'
import { channel } from 'diagnostics_channel'
import { redirect } from 'next/navigation'
import { ServerHeader } from './server-header'
import { ServerWithMembersWithProfiles } from '@/types'
import { ScrollArea } from '../ui/scroll-area'
import { ServerSearch } from './server-search'
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react'

interface ServerSidebarProps {
    serverId: string
}

const iconMap = {
    [ChanelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
    [ChanelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
    [ChanelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
}
const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: (
        <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />
    ),
    [MemberRole.ADMIN]: (
        <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />
    ),
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
            channels: {
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
    const textChannels = server?.channels.filter(
        (chanel) => chanel.type === ChanelType.TEXT
    )
    const audioChanels = server?.channels.filter(
        (channel) => channel.type === ChanelType.AUDIO
    )
    const videoChanels = server?.channels.filter((channel) => {
        return channel.type === ChanelType.VIDEO
    })
    const members = server?.members.filter(
        (member) => member.profileId !== profile?.id
    )

    const role = server.members.find(
        (member) => member.profileId === profile?.id
    )?.role
    return (
        <div className="flex flex-col  h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5] border-l-2 border-solid border-gray-200 dark:border-l-0">
            <ServerHeader role={role} server={server} />
            <ScrollArea className="flex-1  px-3">
                <div className="mt-2">
                    <ServerSearch
                        data={[
                            {
                                label: 'Text Channels',
                                type: 'channel',
                                data: textChannels.map((channel) => ({
                                    icon: iconMap[channel.type],
                                    name: channel.name,
                                    id: channel.id,
                                })),
                            },
                            {
                                label: 'Voice Channels',
                                type: 'channel',
                                data: audioChanels.map((channel) => ({
                                    icon: iconMap[channel.type],
                                    name: channel.name,
                                    id: channel.id,
                                })),
                            },
                            {
                                label: 'Video Channels',
                                type: 'channel',
                                data: videoChanels.map((channel) => ({
                                    icon: iconMap[channel.type],
                                    name: channel.name,
                                    id: channel.id,
                                })),
                            },
                            {
                                label: 'Members',
                                type: 'member',
                                data: members.map((member) => ({
                                    id: member.id,
                                    icon: roleIconMap[member.role],
                                    name: member.profile.name,
                                })),
                            },
                        ]}
                    />
                </div>
            </ScrollArea>
        </div>
    )
}
