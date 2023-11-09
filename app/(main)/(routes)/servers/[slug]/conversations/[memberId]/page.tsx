import { ChatHeader } from '@/components/chat/chat-header'
import { getConversation } from '@/lib/conversation'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

interface MemberIdPageProps {
    params: {
        memberId: string
        slug: string
    }
}
export default async function Page({ params }: MemberIdPageProps) {
    const profile = await currentProfile()
    if (!profile) return redirectToSignIn()
    const currentMember = await db.member.findFirst({
        where: {
            serverId: params.slug,
            profileId: profile.id,
        },
        include: {
            profile: true,
        },
    })
    if (!currentMember) return redirect('/')
    const conversation = await getConversation(
        currentMember.id,
        params.memberId
    )
    if (!conversation) return redirect(`/servers/${params.slug}`)
    const { memberOne, memberTwo } = conversation
    const otherMember = memberOne.id === profile.id ? memberTwo : memberOne
    console.log(params)
    return (
        <div className="bg-white dark:bg-[#313338] h-full w-full flex flex-col">
            <ChatHeader
                imageUrl={otherMember.profile.imageUrl}
                name={otherMember.profile.name}
                serverId={params.slug}
                type="conversation"
            />
        </div>
    )
}
