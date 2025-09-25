<template>
    <div class="flex flex-col items-center justify-center px-30 space-y-8 py-8">
        <section id="profile" class="bg-gray-100 w-full rounded-2xl p-8 flex flex-col md:flex-row gap-6">
            <div class="flex items-center gap-6 ">
                <img :src="user?.photo" alt="Profile Picture"class="w-40 h-40 rounded-full object-cover border-4 border-red-500-opacity-50" />
                <div class="flex flex-col gap-2">
                    <h1 class="text-3xl font-extrabold text-red-600">{{ user?.username?.th || 'ชื่อผู้ใช้' }}</h1>
                    <p class="text-gray-600">รหัสนักศึกษา <br /> {{ user?.studentId || 'xxxxxx' }}</p>
                    <p class="text-gray-600">อีเมล: {{ user?.email.personal || 'example@example.com' }}</p>
                </div>

            </div>
        </section>
        <div class="flex flex-col items-center gap-2">
            <h1>ผลงานศิลปะของฉัน</h1>
            <p>คอลเลกชันผลงานศิลปะที่ฉันภูมิใจ</p>
        </div>
        <section>

        </section>
    </div>
</template>

<script setup lang="ts">
import { useProfile } from '@/composables/useProfile';

const { user } = useProfile();

</script>