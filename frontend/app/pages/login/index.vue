<template>
    <div class="flex flex-col min-h-screen justify-center items-center">
        <UForm :schema="schema" :state="state" @submit="onSubmit"
            class="flex flex-col justify-center items-center gap-8 pt-12 pb-16 px-30 rounded-2xl bg-white  shadow-md">
            <div class="flex flex-col items-center justify-center gap-5">
                <div class="w-16 h-16 flex items-center justify-center rounded-full bg-red-500 text-white">
                    <Icon name="mdi:paint-outline" size="42" />
                </div>
                <h1 class="text-4xl font-bold text-center">เข้าสู่ระบบ</h1>
                <h1 class="text-md text-center text-gray-500 px-10">เข้าสู่ระบบเพื่อจัดการผลงานศิลปะของคุณ</h1>
            </div>
            <UFormField label="Username" class="w-full" :ui="{ label: 'text-black' }">
                <UInput icon="mdi:account-outline" variant="subtle" v-model="state.studentId" label="Username"
                    :ui="{ base: 'text-black bg-white' }" placeholder="StudentID..." size="md" color="error"
                    class="w-full" />
            </UFormField>
            <UFormField label="Password" class="w-full" :ui="{ label: 'text-black' }">
                <UInput icon="mdi:lock-outline" variant="subtle" v-model="state.password" type="password"
                    placeholder="Password..." size="md" color="error" class="w-full duration-200"
                    :ui="{ base: 'text-black bg-white' }" />
            </UFormField>
            <div class=" w-full flex items-center justify-between">
                <UCheckbox color="error" label="remember me" :ui="{ label: 'text-black' }" />
                <NuxtLink to="/forgot-password" class="text-red-600 hover:underline">ลืมรหัสผ่าน?</NuxtLink>
            </div>
            <UButton type="submit" color="error" variant="solid" size="lg"
                class="w-full justify-center bg-red-500 text-white hover:bg-red-600 duration-300" label="เข้าสู่ระบบ" />
        </UForm>
    </div>
</template>

<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui';
import { useRouter } from 'vue-router';

const { fetchProfile } = useProfile()
const router = useRouter()
const config = useRuntimeConfig()

const schema = v.object({
    studentId: v.pipe(v.string()),
    password: v.pipe(v.string())
})

type Schema = v.InferOutput<typeof schema>

const state = reactive({
    studentId: '',
    password: ''
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
        await useFetch(`${config.public.apiUrl}/auth/login`, {
            method: 'POST',
            body: {
                studentId: event.data.studentId,
                password: event.data.password,
            },
            credentials: 'include'
        });
        await fetchProfile();
        toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
        router.push('/');
    } catch (error) {
        toast.add({ title: 'Error', description: 'An error occurred while submitting the form.', color: 'error' })
    }
}
</script>
