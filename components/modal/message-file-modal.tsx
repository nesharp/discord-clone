'use client'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/file-upload'
import qs from 'query-string'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogTitle,
} from '@/components/ui/dialog'
import { FormControl, FormField, FormItem } from '@/components/ui/form'
import React from 'react'
import { useRouter } from 'next/navigation'
import { useModal } from '@/hooks/use-modal-store'
import axios from 'axios'
const formSchema = z.object({
    fileUrl: z.string().min(1, { message: 'Attachment URL is required' }).url({
        message: 'Attachment URL must be a valid URL',
    }),
})
export const MessageFileModal = () => {
    const router = useRouter()
    const { isOpen, onClose, type, data } = useModal()
    const { apiUrl, query } = data
    const isModalOpen = isOpen && type === 'messageFile'
    const handleClose = () => {
        form.reset()
        onClose()
    }
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: '',
        },
    })
    const isLoading = form.formState.isSubmitting
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl || '',
                query,
            })
            axios.post(url, { ...values, content: values.fileUrl })
            form.reset()
            handleClose()
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <div>
            <Dialog open={isModalOpen} onOpenChange={handleClose}>
                <DialogContent className="bg-white text-black pt-1  overflow-hidden ">
                    <DialogHeader className="pt-8 px-6">
                        <DialogTitle className="text-center">
                            Add an attachment
                        </DialogTitle>
                        <DialogDescription className="px-6">
                            <div>
                                <p className="text-center">
                                    Send a file as a message
                                </p>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <FormProvider {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div>
                                <div className="">
                                    <FormField
                                        control={form.control}
                                        name="fileUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <FileUpload
                                                        endpoint="messageFile"
                                                        value={field.value}
                                                        onChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <DialogFooter className="flex justify-end pt-4 ">
                                <Button
                                    variant="primary"
                                    className="px-3 text-white"
                                >
                                    Send
                                </Button>
                            </DialogFooter>
                        </form>
                    </FormProvider>
                </DialogContent>
            </Dialog>
        </div>
    )
}
