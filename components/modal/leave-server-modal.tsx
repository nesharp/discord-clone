'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import React, { useState } from 'react'
import { useModal } from '@/hooks/use-modal-store'

import axios from 'axios'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

export const LeaveServerModal = () => {
    const { isOpen, onClose, onOpen, type, data } = useModal()
    const router = useRouter()
    const { server } = data
    const isModalOpen = isOpen && type === 'leaveServer'
    const [isLoading, setIsLoading] = useState(false)

    const onClick = async () => {
        try {
            setIsLoading(true)
            await axios.patch(`/api/servers/${server?.id}/leave`)
            router.refresh()
            router.push('/')
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div>
            <Dialog open={isModalOpen} onOpenChange={onClose}>
                <DialogContent className="bg-white text-black  overflow-hidden p-0 pt-1">
                    <DialogHeader className="pt-8 px-6">
                        <DialogTitle className="text-center">
                            Leave server
                        </DialogTitle>
                        <DialogDescription className="px-6">
                            <div>
                                <p className="text-center text-zinc-500">
                                    Are you sure you want to leave{' '}
                                    <span className="font-semibold text-indigo-500">
                                        {server?.name}{' '}
                                    </span>
                                    ?
                                </p>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="bg-gray-100 px-12 py-4 w-full">
                        <div className="flex items-center justify-between w-full">
                            <Button
                                disabled={isLoading}
                                onClick={() => {
                                    onClose()
                                }}
                                variant={'ghost'}
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={isLoading}
                                onClick={() => {
                                    onClick()
                                }}
                                variant={'primary'}
                            >
                                Confirm
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
