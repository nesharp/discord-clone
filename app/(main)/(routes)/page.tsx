import Image from 'next/image'
import { Button } from '@/components/ui/button'
export default function Home() {
    return (
        <div className="p-2 bg-red-200 text-purple-800">
            This is a protected page
        </div>
    )
}
