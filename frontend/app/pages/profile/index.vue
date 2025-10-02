<template>
    <div class="flex flex-col items-center justify-center px-30 space-y-8 py-8">
        <section id="profile" class="bg-gray-100 w-full rounded-2xl p-8 flex flex-col md:flex-row gap-6">
            <div class="flex items-center gap-6 ">
                <img :src="user?.photo" alt="Profile Picture"
                    class="w-40 h-40 rounded-full object-cover border-4 border-red-500-opacity-50" />
                <div class="flex flex-col gap-2">
                    <h1 class="text-3xl font-extrabold text-red-600">{{ user?.username?.th || 'ชื่อผู้ใช้' }}</h1>
                    <div class="grid grid-cols-1 md:grid-cols-2">
                        <div class="flex items-center gap-2">
                            <Icon name="material-symbols:school-outline-rounded" size="32" />
                            <div class="flex flex-col">
                                <p class="text-gray-600">รหัสนักศึกษา</p>
                                <p class="font-bold text-lg">{{ user?.studentId || 'xxxxxx' }}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <Icon name="mdi-light:phone" size="32" />
                            <div class="flex flex-col">
                                <p class="text-gray-600">เบอร์โทรศัพท์</p>
                                <p class="font-bold text-lg">{{ user?.tel || 'xxxxxx' }}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <Icon name="material-symbols:mail-outline-rounded" size="32" />
                            <div class="flex flex-col">
                                <p class="text-gray-600">อีเมลส่วนตัว</p>
                                <p class="font-bold text-lg">{{ user?.email.personal || 'xxxxxx' }}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <Icon name="material-symbols:mail-outline-rounded" size="32" />
                            <div class="flex flex-col">
                                <p class="text-gray-600">อีเมลมหาวิทยาลัย</p>
                                <p class="font-bold text-lg">{{ user?.email.university || 'xxxxxx' }}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
        <div class="flex flex-col gap-2">
            <h1 class="text-3xl font-extrabold text-red-600">ผลงานศิลปะของฉัน</h1>
            <p>คอลเลกชันผลงานศิลปะที่ฉันภูมิใจ</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 iteams-stretch gap-8 w-full">
            <NuxtLink v-for="art in artworksByUser" :key="art._id" :to="`/artworks/${art.artname}`">
                <ArtworkCard :art="art" :button-sell="false" :editor="false" />
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">

const { user } = useProfile();
const { artworksByUser, isLoading, error, fetchArtworksByUser } = useFetchArtworksByUser(user.value?.username.th || '');
</script>