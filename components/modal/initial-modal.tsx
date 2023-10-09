'use client'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormProvider, useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { FileUpload } from '@/components/file-upload'
import axios from 'axios'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form'
import React from 'react'
import { useRouter } from 'next/navigation'
const formSchema = z.object({
    name: z.string().min(2, {
        message: 'Server name must be at least 2 characters long',
    }),
    imageUrl: z.string().min(1, { message: 'Image URL is required' }).url({
        message: 'Image URL must be a valid URL',
    }),
})
export const InitialModal = () => {
    const router = useRouter()
    const [isMounted, setIsMounted] = React.useState(false)
    React.useEffect(() => {
        setIsMounted(true)
    }, [])
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            imageUrl: '',
        },
    })
    const isLoading = form.formState.isSubmitting
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post('/api/servers', values)
            form.reset()
            router.refresh()
            window.location.reload()
        } catch (err) {
            console.log(err)
        }
    }
    if (!isMounted) return null
    return (
        <div>
            <Dialog open>
                <DialogContent className="bg-white text-black pt-1  overflow-hidden ">
                    <DialogHeader className="pt-8 px-6">
                        <DialogTitle className="text-center">
                            Customize your server
                        </DialogTitle>
                        <DialogDescription className="px-6">
                            <div>
                                <p className="text-center">
                                    You can change your server name and icon
                                    later.
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
                                        name="imageUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <FileUpload
                                                        endpoint="serverImage"
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
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Server Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isLoading}
                                                    placeholder="Enter server name"
                                                    className="outline-0 outline-offset-0   bg-white border-2 border-gray-300 border-solid "
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                ></FormField>
                                {/* <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Server Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isLoading}
                                                    placeholder="Enter name"
                                                    className="outline-0 outline-offset-0   bg-white border-2 border-gray-300 border-solid"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                ></FormField> */}
                            </div>
                            <DialogFooter className="flex justify-end pt-4 ">
                                <Button
                                    variant="primary"
                                    className="px-3 text-white"
                                >
                                    Create
                                </Button>
                            </DialogFooter>
                        </form>
                    </FormProvider>
                </DialogContent>
            </Dialog>
        </div>
    )
}
