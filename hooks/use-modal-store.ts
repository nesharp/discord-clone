import { Server } from '@prisma/client'
import { on } from 'events'
import { create } from 'zustand'

export type modalType = 'createServer' | 'invite'
interface ModalStore {
    type: modalType | null
    isOpen: boolean
    data: ModalData
    onOpen: (type: modalType, data?: ModalData) => void
    onClose: () => void
}
interface ModalData {
    server?: Server
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    isOpen: false,
    data: {},
    onOpen: (type, data = {}) => set({ type, isOpen: true }),
    onClose: () => set({ isOpen: false, type: null }),
}))
