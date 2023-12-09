'use client'
import { Member, Message, Profile } from '@prisma/client'
import { ChatWelcome } from './chat-walcome'
import { useChatQuery } from '@/hooks/use-chat-query'
import { Loader2, ServerCrash } from 'lucide-react'
import { Fragment } from 'react'
import { ChatItem } from './chat-item'
import { format } from 'date-fns'
import { useChatSocket } from '@/hooks/use-chat-socket'

const DATE_FORMAT = 'd MMM yyyy, HH:mm'

interface ChatMessagesProps {
    name: string
    member: Member
    chatId: string
    apiUrl: string
    socketUrl: string
    socketQuery: Record<string, any>
    paramKey: 'channelId' | 'conversationId'
    paramValue: string
    type: 'channel' | 'conversation'
}
type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile
    }
}
export const ChatMessages = ({
    name,
    member,
    chatId,
    apiUrl,
    socketQuery,
    socketUrl,
    paramKey,
    paramValue,
    type,
}: ChatMessagesProps) => {
    const queryKey = `chat:${chatId}}`
    const addKey = `chat:${chatId}:messages`
    const updateKey = `chat:${chatId}:messages:update`
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
        useChatQuery({
            apiUrl,
            paramKey,
            paramValue,
            queryKey,
        })
    useChatSocket({
        queryKey,
        addKey,
        updateKey,
    })
    if (status === 'loading') {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Loading messages...
                </p>
            </div>
        )
    }
    if (status === 'error') {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <ServerCrash className="h-7 w-7 text-zinc-500 ] my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Something went wrong...
                </p>
            </div>
        )
    }
    console.log(data)
    return (
        <div className="flex-1 flex flex-col py-4 overflow-y-auto">
            <div className="flex-1 flex"></div>
            <ChatWelcome name={name} type={type} />
            <div className="flex flex-col-reverse mt-auto">
                {data?.pages.map((group, i) => (
                    <Fragment key={i}>
                        {group.items.map(
                            (message: MessageWithMemberWithProfile) => (
                                <ChatItem
                                    key={message.id}
                                    currentMember={member}
                                    content={message.content}
                                    deleted={message.deleted}
                                    fileUrl={message.fileUrl}
                                    timestamp={format(
                                        new Date(message.createdAt),
                                        DATE_FORMAT
                                    )}
                                    id={message.id}
                                    isUpdated={
                                        message.updatedAt !== message.createdAt
                                    }
                                    member={message.member}
                                    socketUrl={socketUrl}
                                    socketQuery={socketQuery}
                                />
                            )
                        )}
                    </Fragment>
                ))}
            </div>
        </div>
    )
}
