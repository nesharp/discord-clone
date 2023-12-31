import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirectToSignIn } from '@clerk/nextjs'
import { NextPage } from 'next'
import { redirect } from 'next/navigation'

interface Props {
    params: {
        inviteCode: string
    }
}
async function Page({ params }: Props) {
    const inviteCode = await params.inviteCode
    const profile = await currentProfile()
    if (!profile) return redirectToSignIn()
    if (!inviteCode) return redirect('/')

    const existingServer = await db.server
        .findFirst({
            where: {
                inviteCode,
                members: {
                    some: {
                        profileId: profile.id,
                    },
                },
            },
        })
        .catch(() => null)
    if (existingServer) return redirect(`/servers/${existingServer.id}`)

    const server = await db.server.update({
        where: {
            inviteCode,
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id,
                    },
                ],
            },
        },
    })
    if (server) return redirect(`/servers/${server.id}`)

    return <div>{inviteCode}</div>
}
export default Page
