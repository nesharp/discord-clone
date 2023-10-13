'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useModal } from '@/hooks/use-modal-store'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Check, Copy, RefreshCw } from 'lucide-react'
import { link } from 'fs'
import { useOrigin } from '@/hooks/useOrigin'
import axios from 'axios'

export const InviteModal = () => {
    const { isOpen, onClose, onOpen, type, data } = useModal()
    const { server } = data
    const origin = useOrigin()
    // router
    const router = useRouter()

    const isModalOpen = isOpen && type === 'invite'
    const inviteUrl = `${origin}/invite/server/${server?.inviteCode}`
    const [copied, setCopied] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl)
        setTimeout(() => {
            setCopied(true)
        }, 50)
        setTimeout(() => {
            setCopied(false)
        }, 1000)
    }
    const onNew = async () => {
        try {
            setIsLoading(true)
            const response = await axios.patch(
                `/api/servers/${server?.id}/invite-codes`
            )
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div>
            <Dialog open={isModalOpen} onOpenChange={onClose}>
                <DialogContent className="bg-white text-black pt-1  overflow-hidden ">
                    <DialogHeader className="pt-8 px-6">
                        <DialogTitle className="text-center">
                            Invite Friends
                        </DialogTitle>
                        <DialogDescription className="px-6">
                            <div>
                                <p className="text-center">
                                    You can invite your friends to join your
                                    server
                                </p>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-6">
                        <Label className="uppercase text-xs font-bold text-zink-500 dark:text-secondary/80">
                            Server invite link
                        </Label>
                        <div className="flex items-center mt-2 gap-x-2">
                            <Input
                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 focus:outline-none"
                                value={inviteUrl}
                            />
                            <Button size="icon" onClick={() => onCopy()}>
                                {copied ? (
                                    <Check />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        <Button
                            variant={'link'}
                            size={'sm'}
                            className="text-xs text-zinc-500 mt-4"
                        >
                            Generate a new link
                            <RefreshCw className="h-4 w-4 ml-2" />
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
