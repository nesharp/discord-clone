import { currentProfilePages } from '@/lib/current-profile-pages'
import { db } from '@/lib/db'
import { NextApiResponseServerIO } from '@/types'
import { MemberRole } from '@prisma/client'
import { NextApiRequest } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIO
) {
    if (req.method !== 'DELETE' && req.method !== 'PATCH') {
        return res.status(405).json({
            error: 'Method not allowed',
        })
    }
    try {
        const profile = await currentProfilePages(req)
        const { messageId, serverId, channelId } = req.query
        const { content } = req.body
        if (!profile) return res.status(401).json({ error: 'Unauthorized' })
        if (!messageId || !serverId || !channelId)
            return res.status(402).json({ error: 'Bad request' })
        const server = await db.server.findFirst({
            where: {
                id: serverId as string,
                members: {
                    some: {
                        profileId: profile.id,
                    },
                },
            },
            include: {
                members: true,
            },
        })
        if (!server) return res.status(404).json({ error: 'Server not found' })
        const channel = await db.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: serverId as string,
            },
        })
        if (!channel)
            return res.status(404).json({ error: 'Channel not found' })
        const member = server.members.find(
            (member) => member.profileId === profile.id
        )
        if (!member) return res.status(401).json({ error: 'Member not found' })

        let message = await db.message.findFirst({
            where: {
                id: messageId as string,
                channelId: channelId as string,
            },
            include: {
                member: {
                    include: {
                        profile: true,
                    },
                },
            },
        })
        if (!message || message.deleted)
            return res.status(404).json({ error: 'Message not found' })
        const isMessageOwner = message.member.profileId === profile.id
        const isAdmin = member.role === MemberRole.ADMIN
        const isModerator = member.role === MemberRole.MODERATOR
        const canModify = isMessageOwner || isAdmin || isModerator
        if (!canModify) return res.status(401).json({ error: 'Unauthorized' })
        if (req.method === 'DELETE') {
            message = await db.message.update({
                where: {
                    id: messageId as string,
                },
                data: {
                    fileUrl: null,
                    content: 'Message deleted',
                    deleted: true,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        },
                    },
                },
            })
        }
        if (req.method === 'PATCH') {
            if (!isMessageOwner) {
                return res.status(401).json({ error: 'Unauthorized' })
            }
            if (!content) {
                return res.status(402).json({ error: 'Bad request' })
            }
            message = await db.message.update({
                where: {
                    id: messageId as string,
                },
                data: {
                    content,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        },
                    },
                },
            })
        }
        const updatedKey = `chat:${channelId}:messages:updated`
        res?.socket?.server?.io?.emit(updatedKey, message)
        return res.status(200).json(message)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}
