import { ServerWithMembersWithProfiles } from '@/types'
import { Channel, ChannelType } from '@prisma/client'
import { create } from 'zustand'

export type modalType =
    | 'createServer'
    | 'invite'
    | 'editServer'
    | 'members'
    | 'createChannel'
    | 'leaveServer'
    | 'deleteServer'
    | 'deleteChannel'
    | 'editChannel'
    | 'messageFile'
interface ModalStore {
    type: modalType | null
    isOpen: boolean
    data: ModalData
    onOpen: (type: modalType, data?: ModalData) => void
    onClose: () => void
}
interface ModalData {
    server?: ServerWithMembersWithProfiles
    channel?: Channel
    channelType?: ChannelType
    apiUrl?: string
    query?: Record<string, any>
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    isOpen: false,
    data: {},
    onOpen: (type, data = {}) => set({ type, isOpen: true, data }),
    onClose: () => set({ isOpen: false, type: null }),
}))
