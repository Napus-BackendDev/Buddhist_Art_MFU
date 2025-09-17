<template>
    <div class="w-full flex flex-col min-h-screen justify-center items-center">
        <div
            class="flex flex-col justify-center items-center gap-8 pt-12 pb-16 px-30 rounded-2xl bg-gray-100 shadow-md">
            <div class="flex flex-col items-center justify-center gap-5">
                <div class="w-16 h-16 flex items-center justify-center rounded-full bg-red-500 text-white">
                    <Icon name="mdi:paint-outline" size="42" />
                </div>
                <h1 class="text-4xl font-bold text-center">เข้าสู่ระบบ</h1>
                <h1 class="text-xl text-center">เข้าสู่ระบบเพื่อจัดการผลงานศิลปะของคุณ</h1>
            </div>
            <input type="text" placeholder="Username" class="border p-2 rounded w-full" v-model="formdata.username" />
            <input type="password" placeholder="Password" class="border p-2 rounded w-full "
                v-model="formdata.password" />
            <div class="flex justify-between w-full ">
                <label class="flex items-center gap-2">
                    <input type="checkbox" class="form-checkbox h-4 w-4 text-red-600" v-model="formdata.rememberMe" />
                    <span class="text-gray-700">จดจำฉัน</span>
                </label>
                <NuxtLink to="/forgot-password" class="text-red-600 hover:underline">ลืมรหัสผ่าน?</NuxtLink>
            </div>
            <button
                class="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-300"
                @click="submitForm">เข้าสู่ระบบ
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useProfile } from '~/composables/useProfile'
const { fetchProfile } = useProfile()
const router = useRouter()
const config = useRuntimeConfig()

const formdata = ref({
    username: '',
    password: '',
    rememberMe: false
});

const submitForm = async () => {
    await useFetch(`${config.public.apiUrl}/auth/login`, {
        method: 'POST',
        body: {
            studentId: formdata.value.username,
            password: formdata.value.password,
        },
        credentials: 'include'
    });
    await fetchProfile();
    router.push('/');
};

</script>
