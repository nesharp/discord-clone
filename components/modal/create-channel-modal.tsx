'use client'
import * as z from 'zod'
import qs from 'query-string'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
} from '@/components/ui/form'
import React, { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useModal } from '@/hooks/use-modal-store'
import { ChannelType } from '@prisma/client'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
const formSchema = z.object({
    name: z
        .string()
        .min(2, {
            message: 'Server name must be at least 2 characters long',
        })
        .refine((name) => name !== 'general', {
            message: "Channel name cannot be 'general'",
        }),
    type: z.nativeEnum(ChannelType),
})
export const CreateChannelModal = () => {
    const { isOpen, onClose, onOpen, type, data } = useModal()
    const { channelType } = data
    // router
    const router = useRouter()
    const params = useParams()
    const isModalOpen = isOpen && type === 'createChannel'

    // form layout
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            type: channelType || ChannelType.TEXT,
        },
    })
    useEffect(() => {
        if (channelType) {
            form.setValue('type', channelType)
        } else {
            form.setValue('type', ChannelType.TEXT)
        }
    }, [channelType, form])
    // loading state
    const isLoading = form.formState.isSubmitting
    // submit function
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: '/api/channels',
                query: {
                    serverId: params?.slug || '',
                },
            })
            await axios.post(url, values)
            form.reset()
            router.refresh()
            window.location.reload()
            onClose()
        } catch (err) {
            console.log(err)
        }
    }
    // close modal handler
    const handleClose = () => {
        form.reset()
        onClose()
    }

    return (
        <div>
            <Dialog open={isModalOpen} onOpenChange={handleClose}>
                <DialogContent className="bg-white text-black pt-1  overflow-hidden ">
                    <DialogHeader className="pt-8 px-6">
                        <DialogTitle className="text-center text-lg">
                            Create channel
                        </DialogTitle>
                    </DialogHeader>
                    <FormProvider {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div>
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Channel Name
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        disabled={isLoading}
                                                        placeholder="Enter Channel name"
                                                        className="outline-0 outline-offset-0   bg-gray-200 border-0"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Channel type
                                                </FormLabel>

                                                <Select
                                                    disabled={isLoading}
                                                    onValueChange={(value) => {
                                                        field.onChange(value)
                                                    }}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                                                            <SelectValue placeholder="Select Channel type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {Object.values(
                                                            ChannelType
                                                        ).map((type) => (
                                                            <SelectItem
                                                                key={type}
                                                                value={type}
                                                                className="capitalize"
                                                            >
                                                                {type.toLowerCase()}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <DialogFooter className="flex justify-end pt-4 ">
                                <Button
                                    variant="primary"
                                    className="px-3 text-white"
                                    disabled={isLoading}
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
