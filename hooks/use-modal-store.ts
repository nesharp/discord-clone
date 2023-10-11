import { on } from 'events'
import { create } from 'zustand'

export type modalType = 'createServer'
//  | 'editServer' | 'createChanel'
interface ModalStore {
    type: modalType | null
    isOpen: boolean
    onOpen: (type: modalType) => void
    onClose: () => void
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    isOpen: false,
    onOpen: (type) => set({ type, isOpen: true }),
    onClose: () => set({ isOpen: false, type: null }),
}))
