'use client'
import { UploadDropzone } from '@/lib/uploadthing'
// import '@uploadthing/react/styles.css'
import { FileIcon, X } from 'lucide-react'
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
    if (value && fileType === 'pdf') {
        return (
            <div className="flex relative items-center  p-2 mt-2 rounded-md bg-background/10 ">
                <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-300 mr-2" />
                <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                >
                    {value}
                </a>
                <button
                    onClick={() => onChange('')}
                    className="bg-rose-400 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
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
