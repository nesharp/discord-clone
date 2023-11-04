'use client'
import { useEffect, useState } from 'react'
import { CreateServerModal } from '@/components/modal/create-server-modal'
import { InviteModal } from '@/components/modal/invite-modal'
import { EditServerModal } from '@/components/modal/edit-server-modal'
import { MembersModal } from '../modal/members-modal'
import { CreateChannelModal } from '../modal/create-channel-modal'
import { LeaveServerModal } from '../modal/leave-server-modal'
import { Delete } from 'lucide-react'
import { DeleteServerModal } from '../modal/delete-server-modal'
import { DeleteChannelModal } from '../modal/delete-channel-modal'
import { EditChannelModal } from '../modal/edit-channel-modal'

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)
    useEffect(() => {
        setIsMounted(true)
    }, [])
    if (!isMounted) return null

    return (
        <>
            <CreateServerModal />
            <InviteModal />
            <EditServerModal />
            <MembersModal />
            <CreateChannelModal />
            <LeaveServerModal />
            <DeleteServerModal />
            <DeleteChannelModal />
            <EditChannelModal />
        </>
    )
}
