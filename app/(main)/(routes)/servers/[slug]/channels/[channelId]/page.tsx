import { ChatHeader } from '@/components/chat/chat-header'
import { ChatInput } from '@/components/chat/chat-input'
import { ChatMessages } from '@/components/chat/chat-messages'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirectToSignIn } from '@clerk/nextjs'
import { Channel } from 'diagnostics_channel'
import { redirect } from 'next/navigation'

interface ChannelIdPageProps {
    params: {
        channelId: string
        slug: string
    }
}
export default async function Page({ params }: ChannelIdPageProps) {
    const profile = await currentProfile()
    if (!profile) return redirectToSignIn()
    const channel = await db.channel.findUnique({
        where: {
            id: params.channelId,
        },
    })
    const member = await db.member.findFirst({
        where: {
            serverId: params.slug,
            profileId: profile.id,
        },
    })
    if (!channel || !member) return redirect('/')
    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-screen w-full">
            <ChatHeader
                name={channel.name}
                serverId={channel.serverId}
                type="channel"
            />
            <ChatMessages
                name={channel.name}
                chatId={channel.id}
                member={member}
                type="channel"
                apiUrl="/api/messages"
                socketQuery={{
                    channelId: channel.id,
                    serverId: channel.serverId,
                }}
                socketUrl="/api/socket/messages"
                paramKey="channelId"
                paramValue={channel.id}
            />
            <ChatInput
                name={channel.name}
                apiUrl="/api/socket/messages"
                type="channel"
                query={{
                    channelId: channel.id,
                    serverId: channel.serverId,
                }}
            />
        </div>
    )
}
