<template>
    <div class="flex flex-col justify-center items-center py-8 px-10 w-full ">
        <UCard class="w-full border-2 border-gray-200 shadow-md" variant="solid">
            <template #header>
                <div class="flex flex-col">
                    <h1 class="text-2xl font-bold">อัปโหลดผลงานศิลปะ</h1>
                    <h1>เพิ่มผลงานศิลปะของคุณเพื่อแสดงในโปรไฟล์ของคุณ</h1>
                </div>
            </template>
            <UForm :schema="schema" :state="state" @submit="onSubmit">
                <div class="grid grid-cols-2 gap-10">
                    <div>
                        <h1 class="text-lg font-medium">Basic Information</h1>
                        <USeparator class="my-4" />
                        <div class="grid grid-cols-2 gap-4 mt-4">
                            <UFormField label="Art ID" :ui="{ label: 'text-black' }">
                                <UInput
v-model="state.artId"
                                    :placeholder="artworkDetails?.artId || 'Enter unique art ID'" color="error"
                                    class="w-full" :ui="{ base: 'text-black bg-gray-100' }" />
                            </UFormField>
                            <UFormField label="Art Name" :ui="{ label: 'text-black' }">
                                <UInput
v-model="state.artname"
                                    :placeholder="artworkDetails?.artname || 'Enter artwork name'" color="error"
                                    class="w-full" :ui="{ base: 'text-black bg-gray-100' }" />
                            </UFormField>
                            <UFormField label="Size" :ui="{ label: 'text-black' }">
                                <UInput
v-model="state.size" :placeholder="artworkDetails?.size || 'e.g.., 40x60 cm'"
                                    color="error" class="w-full" :ui="{ base: 'text-black bg-gray-100' }" />
                            </UFormField>
                            <UFormField label="Price (THB)" :ui="{ label: 'text-black' }">
                                <UInput
v-model="state.price"
                                    :placeholder="artworkDetails?.price !== undefined ? String(artworkDetails.price) : '0'"
                                    color="error" class="w-full" :ui="{ base: 'text-black bg-gray-100' }" />
                            </UFormField>
                        </div>
                        <UFormField label="Technique" class="my-4" :ui="{ label: 'text-black' }">
                            <UInput
v-model="state.technique" :placeholder="artworkDetails?.technique || 'ระบุเทคนิค'"
                                color="error" class="w-full" :ui="{ base: 'text-black bg-gray-100' }" />
                        </UFormField>
                        <h1 class="text-lg font-medium">Details</h1>
                        <USeparator class="my-4" />
                        <UFormField label="Concept" :ui="{ label: 'text-black' }">
                            <UTextarea
v-model="state.concept"
                                :placeholder="artworkDetails?.concept || 'ระบุแนวคิดผลงาน'" color="error" class="w-full"
                                :ui="{ base: 'text-black bg-gray-100' }" />
                        </UFormField>
                        <div class="grid grid-cols-2 gap-4 mt-4">
                            <UFormField label="Type" :ui="{ label: 'text-black' }">
                                <UInput
v-model="state.type" :placeholder="artworkDetails?.type || 'ระบุประเภทผลงาน'"
                                    color="error" class="w-full" :ui="{ base: 'text-black bg-gray-100' }" />
                            </UFormField>
                            <UFormField label="Presentation" :ui="{ label: 'text-black' }">
                                <UInput
v-model="state.presentation"
                                    :placeholder="artworkDetails?.presentation || 'ระบุการนำเสนอ'" color="error"
                                    class="w-full" :ui="{ base: 'text-black bg-gray-100' }" />
                            </UFormField>
                            <UFormField label="Ratio" :ui="{ label: 'text-black' }">
                                <UInput
v-model="state.ratio" :placeholder="artworkDetails?.ratio || 'ระบุอัตราส่วน'"
                                    color="error" class="w-full" :ui="{ base: 'text-black bg-gray-100' }" />
                            </UFormField>
                            <UFormField label="Storage Location" :ui="{ label: 'text-black' }">
                                <UInput
v-model="state.artAddress"
                                    :placeholder="artworkDetails?.artAddress || 'ระบุที่เก็บผลงาน'" color="error"
                                    class="w-full" :ui="{ base: 'text-black bg-gray-100' }" />
                            </UFormField>
                        </div>

                    </div>
                    <div>
                        <h1 class="text-lg font-medium">Preview</h1>
                        <USeparator class="my-4" />
                        <NuxtImg
:src="artworkDetails?.picture" alt="Artwork Image"
                            class="w-full h-50 object-cover rounded-lg mb-4" />
                        <h1 class="text-lg font-medium">UploadNewImage</h1>
                        <USeparator class="my-4" />
                        <UFileUpload
v-model="state.picture" label="อัปโหลดรูปภาพผลงานศิลปะ"
                            placeholder="คลิกหรือวางไฟล์ที่นี่เพื่ออัปโหลด"
                            description="SVG, PNG, JPG or GIF (max. 2MB)" icon="i-lucide-image"
                            :ui="{ base: 'py-12 bg-white border-2 hover:border-red-600 hover:bg-white ', label: 'text-black' }">
                            <template #actions="{ open }">
                                <UButton
label="Select images" icon="i-lucide-upload" color="neutral"
                                    variant="outline" />
                            </template>
                        </UFileUpload>
                    </div>

                </div>

                <USeparator class="my-6" />
                <div class="flex justify-end space-x-4">
                    <UButton
icon="mdi:trash-outline" label="Delete Arts" color="error"
                        :ui="{ base: 'text-black bg-gray-200 hover:bg-red-600 hover:text-white duration-200' }"
                        @click="handleDelete" />
                    <UButton
to="/profile/art" icon="mdi:window-close" label="Cancel" color="error"
                        :ui="{ base: 'text-black bg-gray-200 hover:bg-red-600 hover:text-white duration-200' }" />
                    <UButton
type="submit" icon="mdi-light:content-save" label="Update Artwork" color="error"
                        :ui="{ base: 'text-white bg-red-500 hover:bg-red-400 duration-200' }" />
                </div>
            </UForm>
        </UCard>
    </div>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui';

const config = useRuntimeConfig()
const { artId } = useRoute().params

const { data: artworkDetails, pending: isLoading, error, refresh: fetchArtworkDetails } = useFetch<ArtDetail>(`${config.public.apiUrl}/profile/art/${artId}`, {
    method: 'GET',
    headers: { "Content-Type": "application/json" },
    credentials: 'include',
});


const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const MIN_DIMENSIONS = { width: 200, height: 200 }
const MAX_DIMENSIONS = { width: 4096, height: 4096 }
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']


const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

const schema = z.object({
    artId: z.string(),
    artname: z.string(),
    size: z.string(),
    technique: z.string(),
    price: z.string(),
    concept: z.string(),
    type: z.string(),
    presentation: z.string(),
    artAddress: z.string(),
    ratio: z.string(),
    picture: z
        .instanceof(File, {
            message: 'Please select an image file.'
        })
})

type schema = z.output<typeof schema>

const state = reactive<Partial<schema>>({
    artId: '',
    artname: '',
    size: '',
    technique: '',
    price: undefined,
    concept: '',
    type: '',
    presentation: '',
    artAddress: '',
    ratio: '',
    picture: undefined
})

function handleDelete() {
    try {
        const res = $fetch(`${config.public.apiUrl}/profile/art/${artId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
        console.log('Delete response:', res)
        navigateTo('/profile/art')
    } catch (error) {
        console.error('Catch error:', error)
    }
}


async function onSubmit(event: FormSubmitEvent<schema>) {
    try {
        const formData = new FormData()

        formData.append('artId', event.data.artId)
        formData.append('artname', event.data.artname)
        formData.append('size', event.data.size)
        formData.append('technique', event.data.technique)
        formData.append('price', event.data.price)
        formData.append('concept', event.data.concept)
        formData.append('type', event.data.type)
        formData.append('presentation', event.data.presentation)
        formData.append('artAddress', event.data.artAddress)
        formData.append('ratio', event.data.ratio)

        if (event.data.picture instanceof File) {
            formData.append('picture', event.data.picture)
        }

        const res = await $fetch(`${config.public.apiUrl}/profile/art/${artId}`, {
            method: 'PATCH',
            body: formData,
            credentials: 'include',
        })

        navigateTo('/profile/art')
    } catch (error) {
        console.error('Catch error:', error)
    }

}
</script>