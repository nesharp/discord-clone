'use client'
import { cn } from '@/lib/utils'
import { Channel, ChannelType, MemberRole } from '@prisma/client'
import { Edit, Hash, Lock, Mic, Trash, Video } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { ActionTooltip } from '../ui/action-tooltip'
import { modalType, useModal } from '@/hooks/use-modal-store'
import { ServerWithMembersWithProfiles } from '@/types'
interface ServerChannelProps {
    channel: Channel
    server: ServerWithMembersWithProfiles
    role?: MemberRole
}
const iconMap = {
    [ChannelType.TEXT]: Hash,
    [ChannelType.AUDIO]: Mic,
    [ChannelType.VIDEO]: Video,
}
export const ServerChannel = ({
    channel,
    server,
    role,
}: ServerChannelProps) => {
    const params = useParams()
    const router = useRouter()
    const Icon = iconMap[channel.type]
    const { onOpen } = useModal()
    const onClick = () => {
        router.push(`/servers/${params?.slug}/channels/${channel.id}`)
    }
    const onAction = (e: React.MouseEvent, action: modalType) => {
        e.stopPropagation()
        onOpen(action, { server, channel })
    }
    return (
        <div
            onClick={() => {
                onClick()
            }}
            className={cn(
                'flex group p-2 rounded-md items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1 cursor-pointer',
                params?.channelId === channel.id &&
                    'bg-zinc-700/20 dark:bg-zinc-700'
            )}
        >
            <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
            <p
                className={cn(
                    'line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-500 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
                    params?.channelId === channel.id &&
                        'text-primary dark:text-zinc-200 dark:group-hover:text-white'
                )}
            >
                {channel.name}
            </p>
            {channel.name !== 'general' && role !== MemberRole.GUEST && (
                <div className="ml-auto flex items-center gap-x-2">
                    <ActionTooltip label="Edit">
                        <Edit
                            onClick={(e) => onAction(e, 'editChannel')}
                            className="h-4 w-4 hidden group-hover:block text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                        />
                    </ActionTooltip>
                    <ActionTooltip label="Delete">
                        <Trash
                            onClick={(e) => onAction(e, 'deleteChannel')}
                            className="h-4 w-4 hidden group-hover:block text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                        />
                    </ActionTooltip>
                </div>
            )}
            {channel.name === 'general' && (
                <Lock className="h-4 w-4  ml-auto text-zinc-500 dark:text-zinc-400 " />
            )}
        </div>
    )
}
