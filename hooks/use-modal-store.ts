import { ServerWithMembersWithProfiles } from '@/types'
import { Member, Server } from '@prisma/client'
import { create } from 'zustand'

export type modalType = 'createServer' | 'invite' | 'editServer' | 'members'
interface ModalStore {
    type: modalType | null
    isOpen: boolean
    data: ModalData
    onOpen: (type: modalType, data?: ModalData) => void
    onClose: () => void
}
interface ModalData {
    server?: ServerWithMembersWithProfiles
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    isOpen: false,
    data: {},
    onOpen: (type, data = {}) => set({ type, isOpen: true, data }),
    onClose: () => set({ isOpen: false, type: null }),
}))
