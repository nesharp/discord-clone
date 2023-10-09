'use client'

import {
    Tooltip,
    TooltipProvider,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'

interface Props {
    children: React.ReactNode
    label: string
    side?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
}
export const ActionTooltip = ({
    children,
    label,
    side = 'top',
    align = 'center',
}: Props) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={50}>
                <TooltipTrigger>{children}</TooltipTrigger>
                <TooltipContent side={side} align={align}>
                    <p className="font-semibold text-sm ">{label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
