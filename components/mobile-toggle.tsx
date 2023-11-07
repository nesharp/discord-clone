import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Button } from './ui/button'
import { NavigationSidebar } from './navigation/navigation-sldebar'
import { ServerSidebar } from './server/server-sidebar'

export const MobileToggle = ({ serverId }: { serverId: string }) => {
    return (
        <Sheet>
            <SheetTrigger>
                <div className="md:hidden">
                    <Menu />
                </div>
            </SheetTrigger>
            <SheetContent side={'left'} className="p-0 flex gap-0">
                <div className="w-[72px] ">
                    <NavigationSidebar />
                </div>
                <div className='w-full pt-12 dark:bg-[#2b2d31] bg-[#f2f3f5]'>
                    <ServerSidebar serverId={serverId} />
                </div>
            </SheetContent>
        </Sheet>
    )
}
