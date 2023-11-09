import { profile } from 'console'
import { db } from './db'

export const getConversation = async (
    memberOneId: string,
    memberTwoId: string
) => {
    let conversation =
        (await findConversation(memberOneId, memberTwoId)) ||
        (await createNewConversation(memberOneId, memberTwoId))
    return conversation
}

const findConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        return db.conversation.findFirst({
            where: {
                AND: [
                    {
                        memberOneId,
                    },
                    {
                        memberTwoId,
                    },
                ],
            },
            include: {
                memberOne: {
                    include: {
                        profile: true,
                    },
                },
                memberTwo: {
                    include: {
                        profile: true,
                    },
                },
            },
        })
    } catch {
        return null
    }
}

const createNewConversation = async (
    memberOneId: string,
    memberTwoId: string
) => {
    try {
        return db.conversation.create({
            data: {
                memberOneId,
                memberTwoId,
            },
            include: {
                memberOne: {
                    include: {
                        profile: true,
                    },
                },
                memberTwo: {
                    include: {
                        profile: true,
                    },
                },
            },
        })
    } catch (error) {
        return null
    }
}
