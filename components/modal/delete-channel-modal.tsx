'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import qs from 'query-string'
import React, { useState } from 'react'
import { useModal } from '@/hooks/use-modal-store'

import axios from 'axios'
import { Button } from '../ui/button'
import { useParams, useRouter } from 'next/navigation'

export const DeleteChannelModal = () => {
    const { isOpen, onClose, type, data } = useModal()
    const router = useRouter()
    const { channel } = data
    const isModalOpen = isOpen && type === 'deleteChannel'
    const [isLoading, setIsLoading] = useState(false)

    const onClick = async () => {
        try {
            setIsLoading(true)
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: channel?.serverId,
                },
            })
            await axios.delete(url)
            onClose()
            router.refresh()
            router.replace(`/servers/${channel?.serverId}}`)
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
                            Delete channel
                        </DialogTitle>
                        <DialogDescription className="px-6">
                            <div>
                                <p className="text-center text-zinc-500">
                                    Are you sure you want to do this?
                                    <br />
                                    Channel{' '}
                                    <span className="font-semibold text-indigo-500">
                                        #{channel?.name}{' '}
                                    </span>
                                    will be deleted and you will lose all data.
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
