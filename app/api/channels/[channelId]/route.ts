import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { MemberRole } from '@prisma/client'
import { NextResponse } from 'next/server'

export const DELETE = async (
    req: Request,
    { params }: { params: { channelId: string } }
) => {
    try {
        const profile = await currentProfile()
        if (!profile) return new NextResponse('Unauthorized', { status: 401 })
        const { searchParams } = new URL(req.url)
        const serverId = searchParams.get('serverId')
        if (!serverId) return new NextResponse('Bad request', { status: 400 })
        if (!params.channelId)
            return new NextResponse('Bad request', { status: 400 })
        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] },
                    },
                },
            },
            data: {
                channels: {
                    delete: {
                        id: params.channelId,
                        name: { not: 'general' },
                    },
                },
            },
        })
        return NextResponse.json(server)
    } catch (error) {
        console.log(error)
        return new NextResponse('Internal server error', { status: 500 })
    }
}
export const PATCH = async (
    req: Request,
    { params }: { params: { channelId: string } }
) => {
    try {
        const profile = await currentProfile()
        if (!profile) return new NextResponse('Unauthorized', { status: 401 })
        const { searchParams } = new URL(req.url)
        const serverId = searchParams.get('serverId')
        if (!serverId) return new NextResponse('Bad request', { status: 400 })
        if (!params.channelId)
            return new NextResponse('Bad request', { status: 400 })
        const { name, type } = await req.json()
        if (name === 'general')
            return new NextResponse('Name can`t be "general"', { status: 400 })
        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] },
                    },
                },
            },
            data: {
                channels: {
                    update: {
                        where: {
                            id: params.channelId,
                            NOT: { name: 'general' },
                        },
                        data: {
                            name,
                            type,
                        },
                    },
                },
            },
        })
        return NextResponse.json({ ok: true })
    } catch (error) {
        console.log(error)
        return new NextResponse('Internal server error', { status: 500 })
    }
}
