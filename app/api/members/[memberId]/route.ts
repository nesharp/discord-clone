import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export const PATCH = async (
    req: Request,
    {
        params,
    }: {
        params: {
            memberId: string
        }
    }
) => {
    try {
        const profile = await currentProfile()
        if (!profile) return new NextResponse('Unauthorized', { status: 401 })
        const { searchParams } = new URL(req.url)
        const { role } = await req.json()
        const serverId = searchParams.get('serverId')
        const memberId = params.memberId
        if (!serverId)
            return new NextResponse('Invalid serverId', { status: 500 })
        if (!memberId) {
            return new NextResponse('Invalid params', { status: 501 })
        }
        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data: {
                members: {
                    update: {
                        where: {
                            id: memberId,
                            profileId: {
                                not: profile.id,
                            },
                        },
                        data: {
                            role,
                        },
                    },
                },
            },
            include: {
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
        return NextResponse.json(server)
    } catch (error) {
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
export const DELETE = async (
    req: Request,
    {
        params,
    }: {
        params: {
            memberId: string
        }
    }
) => {
    try {
        const profile = await currentProfile()
        if (!profile) return new NextResponse('Unauthorized', { status: 401 })
        const { searchParams } = new URL(req.url)
        const serverId = searchParams.get('serverId')
        if (!serverId)
            return new NextResponse('Invalid serverId', { status: 500 })
        if (!params.memberId)
            return new NextResponse('Member id missing', { status: 501 })
        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data: {
                members: {
                    deleteMany: {
                        id: params.memberId,
                        profileId: {
                            not: profile.id,
                        },
                    },
                },
            },
            include: {
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
        return NextResponse.json(server)
    } catch (error) {
        console.log('[MEMBERS_ID_DELETE]', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
