import { NavigationSidebar } from '@/components/navigation/navigation-sldebar'

const Page = async ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-full">
            <aside className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
                <NavigationSidebar />
            </aside>
            <main className="md:pl-[72px] h-full w-full bg-white dark:bg-[#313338]">{children}</main>
        </div>
    )
}
export default Page
