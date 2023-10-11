'use client'

import { Plus } from 'lucide-react'
import { ActionTooltip } from '@/components/ui/action-tooltip'
import { useModal } from '@/hooks/use-modal-store'
import React from 'react'
export const NavigationAction = () => {
    const [isMounted, setIsMounted] = React.useState(false)
    React.useEffect(() => {
        setIsMounted(true)
    }, [])
    const { onOpen } = useModal()
    if (!isMounted) return null
    return (
        <div>
            <ActionTooltip label="Add a server" side="right" align="center">
                <button
                    className="group flex items-center"
                    onClick={() => onOpen('createServer')}
                >
                    <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px]  group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
                        <Plus
                            className="group-hover:text-white transition text-emerald-500 "
                            size={35}
                        />
                    </div>
                </button>
            </ActionTooltip>
        </div>
    )
}
