'use client'
import { ServerWithMembersWithProfiles } from '@/types'
import { MemberRole, Server } from '@prisma/client'
import {
    DropdownMenu,
    DropdownMenuSeparator,
    DropdownMenuSubContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    ChevronDown,
    LogOut,
    LucidePlus,
    PlusCircle,
    Settings,
    Trash,
    UserPlus,
    Users,
} from 'lucide-react'
import {
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { useModal } from '@/hooks/use-modal-store'
interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles
    role?: MemberRole
}
export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
    const { onOpen } = useModal()
    const isAdmin = role === MemberRole.ADMIN
    const isModerator = isAdmin || role === MemberRole.MODERATOR
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none" asChild>
                    <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
                        {server.name}
                        <ChevronDown className="h-5 w-5 ml-auto" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 text-xl font-medium text-black dark:text-neutral-400 space-y-[2px] ">
                    {/* checking if moderator and getting the access to moderator panel */}
                    {isModerator && (
                        <DropdownMenuItem
                            onClick={() => {
                                onOpen('invite', { server })
                            }}
                            className="focus:outline-none text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer flex items-center"
                        >
                            Invite People
                            <UserPlus className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    )}
                    {/* checking if admin and getting access to admin panel */}
                    {isAdmin && (
                        <DropdownMenuItem
                            onClick={() => {
                                onOpen('editServer', { server })
                            }}
                            className="3:outline-none px-3 py-2 text-sm cursor-pointer flex items-center"
                        >
                            Server settings
                            <Settings className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    )}
                    {/* just for member */}
                    {isAdmin && (
                        <DropdownMenuItem
                            onClick={() => {
                                onOpen('members', { server })
                            }}
                            className="focus:outline-none px-3 py-2 text-sm cursor-pointer flex items-center"
                        >
                            Manage members
                            <Users className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    )}
                    {isModerator && (
                        <DropdownMenuItem
                            onClick={() => {
                                onOpen('createChannel', { server })
                            }}
                            className="focus:outline-none px-3 py-2 text-sm cursor-pointer flex items-center"
                        >
                            Create Channel
                            <PlusCircle className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    )}
                    {isModerator && <DropdownMenuSeparator />}
                    {isAdmin && (
                        <DropdownMenuItem
                            onClick={() => {
                                onOpen('deleteServer', { server })
                            }}
                            className=" text-rose-500 focus:outline-none px-3 py-2 text-sm cursor-pointer flex items-center"
                        >
                            Delete server
                            <Trash className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    )}
                    {!isAdmin && (
                        <DropdownMenuItem
                            onClick={() => {
                                onOpen('leaveServer', { server })
                            }}
                            className=" text-rose-500 focus:outline-none px-3 py-2 text-sm cursor-pointer flex items-center"
                        >
                            Leave server
                            <LogOut className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
