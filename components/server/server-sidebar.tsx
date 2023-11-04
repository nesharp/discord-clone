import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirectToSignIn } from '@clerk/nextjs'
import { ChannelType, MemberRole } from '@prisma/client'
import { channel } from 'diagnostics_channel'
import { redirect } from 'next/navigation'
import { ServerHeader } from './server-header'
import { ServerWithMembersWithProfiles } from '@/types'
import { ScrollArea } from '../ui/scroll-area'
import { ServerSearch } from './server-search'
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react'
import { Separator } from '../ui/separator'
import { text } from 'stream/consumers'
import { ServerSection } from './server-section'
import { ServerChannel } from './server-channel'
import { ServerMember } from './server-member'

interface ServerSidebarProps {
    serverId: string
}

const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
}
const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: (
        <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />
    ),
    [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
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
    // filtering Channels
    const textChannels = server?.channels.filter(
        (Channel) => Channel.type === ChannelType.TEXT
    )
    const audioChannels = server?.channels.filter(
        (channel) => channel.type === ChannelType.AUDIO
    )
    const videoChannels = server?.channels.filter((channel) => {
        return channel.type === ChannelType.VIDEO
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
                                data: audioChannels.map((channel) => ({
                                    icon: iconMap[channel.type],
                                    name: channel.name,
                                    id: channel.id,
                                })),
                            },
                            {
                                label: 'Video Channels',
                                type: 'channel',
                                data: videoChannels.map((channel) => ({
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
                <Separator className="bg-zing-200 dark:bg-zinc-700 rounded-md my-2" />
                {!!textChannels?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="channels"
                            channelType={ChannelType.TEXT}
                            role={role}
                            label="Text Channels"
                        />
                        <div className="space-y-[2px]">
                            {textChannels.map((channel) => (
                                <ServerChannel
                                    key={channel.id}
                                    channel={channel}
                                    role={role}
                                    server={server}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {!!audioChannels?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="channels"
                            channelType={ChannelType.AUDIO}
                            role={role}
                            label="Voice Channels"
                        />
                        <div className="space-y-[2px]">
                            {audioChannels.map((channel) => (
                                <ServerChannel
                                    key={channel.id}
                                    channel={channel}
                                    role={role}
                                    server={server}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {!!videoChannels?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="channels"
                            channelType={ChannelType.VIDEO}
                            role={role}
                            label="Video Channels"
                        />
                        <div className="space-y-[2px]">
                            {videoChannels.map((channel) => (
                                <ServerChannel
                                    key={channel.id}
                                    channel={channel}
                                    role={role}
                                    server={server}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {!!members?.length && (
                    <div className="mb-2">
                        <ServerSection
                            sectionType="members"
                            role={role}
                            label="Members"
                            server={server}
                        />
                        <div className="space-y-[2px]">
                            {members.map((member) => (
                                <ServerMember
                                    key={member.id}
                                    member={member}
                                    server={server}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}
