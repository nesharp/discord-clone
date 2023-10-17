'use client'
import { UploadDropzone } from '@/lib/uploadthing'
// import '@uploadthing/react/styles.css'
import { X } from 'lucide-react'
import Image from 'next/image'
interface FileUploadProps {
    onChange: (url?: string) => void
    value: string
    endpoint: 'messageFile' | 'serverImage'
}
export const FileUpload = ({ endpoint, onChange, value }: FileUploadProps) => {
    const fileType = value?.split('.').pop()
    if (value && fileType !== 'pdf') {
        return (
            <div className="h-20 w-20 relative mx-auto">
                <Image fill src={value} alt="Upload" className="rounded-full" />
                <button
                    onClick={() => onChange('')}
                    className="bg-rose-400 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        )
    }
    return (
        <div>
            <UploadDropzone
                endpoint={endpoint}
                onClientUploadComplete={(res) => onChange(res?.[0].url)}
                onUploadError={(err) => console.log(err)}
            />
        </div>
    )
}
