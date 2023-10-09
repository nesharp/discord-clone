import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
export const POST = async (req: Request) => {
    try {
        const { name, imageUrl } = await req.json()
        const profile = await currentProfile()
        if (!profile) return new NextResponse('Unauthorized', { status: 401 })
        const server = await db.server.create({
            data: {
                profileId:profile.id,
                name,
                imageUrl,
                inviteCode: uuidv4(),
                
            },
        })
    } catch (e) {
        console.log('[ERROR] POST /api/servers', e)
        return new NextResponse('Internal error', { status: 500 })
    }
}
