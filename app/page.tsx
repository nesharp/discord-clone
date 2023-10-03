import Image from 'next/image'
import { Button } from '@/components/ui/button'
export default function Home() {
    return (
        <div className="p-2">
            <p>Hello</p>
            <Button variant="destructive">Click me</Button>
        </div>
    )
}
