'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useModal } from '@/hooks/use-modal-store'
import { ScrollArea } from '@/components/ui/scroll-area'
import { UserAvatar } from '../user-avatar'
import qs from 'query-string'
import {
    Check,
    Gavel,
    Loader2,
    MoreVertical,
    Shield,
    ShieldAlert,
    ShieldIcon,
    ShieldQuestion,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { MemberRole } from '@prisma/client'
import axios from 'axios'

export const MembersModal = () => {
    const { isOpen, onClose, onOpen, type, data } = useModal()

    const { server } = data
    const [loadingId, setLoadingId] = React.useState('')
    const router = useRouter()
    const roleIconMap = {
        GUEST: null,
        MODERATOR: <ShieldIcon className="w-4 h-4 ml-2 text-indigo-500" />,
        ADMIN: <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />,
    }
    const onRoleChange = async (memberId: string, role: MemberRole) => {
        try {
            setLoadingId(memberId)
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id,
                    memberId,
                },
            })
            console.log(url)
            const response = await axios.patch(url, { role })
            router.refresh()
            onOpen('members', { server: response.data })
        } catch (err) {
            console.log(err)
        } finally {
            setLoadingId('')
        }
    }
    const onKick = async (memberId: string) => {
        try {
            setLoadingId(memberId)
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id,
                },
            })
            const response = await axios.delete(url)
            router.refresh()
            onOpen('members', { server: response.data })
        } catch (err) {
            console.log(err)
        } finally {
            setLoadingId('')
        }
    }
    // router
    const isModalOpen = isOpen && type === 'members'

    return (
        <div>
            <Dialog open={isModalOpen} onOpenChange={onClose}>
                <DialogContent className="bg-white text-black pt-1  overflow-hidden ">
                    <DialogHeader className="pt-8 px-6">
                        <DialogTitle className="text-center">
                            Manage members
                        </DialogTitle>
                        <DialogDescription className="text-center text-zinc-500 ">
                            {server?.members.length} Memebers
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="mt-8 max-h-[420px] pr-6 ">
                        {server?.members.map((member) => (
                            <div
                                key={member.id}
                                className="flex items-center gap-x-2 mb-6"
                            >
                                <UserAvatar src={member.profile.imageUrl} />
                                <div className="flex flex-col gap-y-1">
                                    <div className="text-xs font-semibold flex items-center">
                                        {member.profile.name}
                                        {roleIconMap[member.role]}
                                    </div>
                                    <p className="text-xs text-zinc-500">
                                        {member.profile.email}
                                    </p>
                                </div>
                                {server.profileId !== member.profile.id &&
                                    loadingId !== member.id && (
                                        <div className="ml-auto">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <MoreVertical className="h-4 w-4 text-zinc-500" />
                                                    <DropdownMenuContent className="side-left">
                                                        <DropdownMenuSub>
                                                            <DropdownMenuSubTrigger className="flex items-center">
                                                                <ShieldQuestion className="h-4 w-4 mr-2" />
                                                                <span>
                                                                    Role
                                                                </span>
                                                            </DropdownMenuSubTrigger>
                                                            <DropdownMenuPortal>
                                                                <DropdownMenuSubContent>
                                                                    <DropdownMenuItem
                                                                        onClick={() => {
                                                                            onRoleChange(
                                                                                member.id,
                                                                                'GUEST'
                                                                            )
                                                                        }}
                                                                    >
                                                                        <Shield className="w-4 h-4 mr-2" />
                                                                        Guest
                                                                        {member.role ===
                                                                            'GUEST' && (
                                                                            <Check className="w-4 h-4 ml-auto" />
                                                                        )}
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() => {
                                                                            onRoleChange(
                                                                                member.id,
                                                                                'MODERATOR'
                                                                            )
                                                                        }}
                                                                    >
                                                                        <Shield className="w-4 h-4 mr-2" />
                                                                        Moderator
                                                                        {member.role ===
                                                                            'MODERATOR' && (
                                                                            <Check className="w-4 h-4 ml-auto" />
                                                                        )}
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuSubContent>
                                                            </DropdownMenuPortal>
                                                        </DropdownMenuSub>
                                                        <DropdownMenuSeparator className="" />
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                onKick(
                                                                    member.id
                                                                )
                                                            }}
                                                        >
                                                            <Gavel className="w-4 h-4 mr-2" />
                                                            Kick
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenuTrigger>
                                            </DropdownMenu>
                                        </div>
                                    )}
                                {loadingId === member.id && (
                                    <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
                                )}
                            </div>
                        ))}
                    </ScrollArea>
                    <div className="p-6"></div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
