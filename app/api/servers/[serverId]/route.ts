import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export const PATCH = async (
    req: Request,
    { params }: { params: { serverId: string } }
) => {
    try {
        console.log(params.serverId)
        const profile = await currentProfile()
        if (!profile) return new NextResponse('Unauthorized', { status: 401 })
        const { name, imageUrl } = await req.json()
        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id,
            },
            data: {
                name,
                imageUrl,
            },
        })
        return NextResponse.json(server)
    } catch (error) {
        console.log(error)
        return new NextResponse('Error to change invite code', { status: 500 })
    }
}
