<template>
  <nav class="flex items-center px-6 py-3 shadow-md">
    <!-- Logo Left -->
    <div class="flex items-center">
      <img src="/logo.jpg" alt="Logo" class="h-10 w-10 mr-3" />
      <div>
        <span class="font-bold text-red-600 text-lg">Buddhist Art MFU</span>
        <div class="text-sm text-gray-600">มหาวิทยาลัยแม่ฟ้าหลวง</div>
      </div>
    </div>

    <!-- Topic Center -->
    <ul class="flex-1 flex justify-center space-x-6">
      <li>
        <NuxtLink href="/">หน้าแรก</NuxtLink>
      </li>
      <li>
        <NuxtLink href="/artworks">ผลงานศิลปะ</NuxtLink>
      </li>
      <li>
        <NuxtLink href="/news">ข่าวสาร</NuxtLink>
      </li>
      <li>
        <NuxtLink href="/about">เกี่ยวกับเรา</NuxtLink>
      </li>
      <li>
        <NuxtLink href="/contact">ติดต่อผู้ดูแล</NuxtLink>
      </li>
    </ul>

    <!-- Language Switcher Right -->
    <div class="flex items-center">
      <button @click="toggleLanguage"
        class="px-2 py-1 border rounded mr-2 flex gap-1 hover:bg-red-200 cursor-pointer items-center justify-center">
        <Icon name="jam:world" size="18" />
        <span>{{ language.toUpperCase() }}</span>
      </button>

      <template v-if="user">
        <div class="relative group">
          <button class="flex items-center gap-2 px-4 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200">
            <Icon name="carbon:user-avatar" size="22" />
            <span>{{ user.username.th }}</span>
            <Icon v-if="user.role === 'admin'" name="carbon:chevron-down" size="18" />
          </button>
          <!-- Dropdown for admin -->
          <div v-if="user.role === 'admin'"
            class="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-auto z-50 transition-opacity">
            <NuxtLink to="/admin" class="block px-4 py-2 hover:bg-gray-100">Admin Dashboard</NuxtLink>
            <NuxtLink to="/profile" class="block px-4 py-2 hover:bg-gray-100">โปรไฟล์</NuxtLink>
            <button @click="logout" class="block w-full text-left px-4 py-2 hover:bg-gray-100">ออกจากระบบ</button>
          </div>
          <!-- Student: direct to profile -->
          <NuxtLink v-else to="/login/profile"
            class="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50 block px-4 py-2 hover:bg-gray-100">
            โปรไฟล์</NuxtLink>
        </div>
      </template>
      <NuxtLink v-else class="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-300 "
        to="/login">
        เข้าสู่ระบบ
      </NuxtLink>
    </div>
  </nav>
</template>


<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProfile } from '../../composables/useProfile'
const config = useRuntimeConfig()

const language = ref('th')
const toggleLanguage = () => { language.value = language.value === 'th' ? 'en' : 'th' }

const { user, role, fetchProfile } = useProfile()
onMounted(async () => { await fetchProfile() })

const router = useRouter()
const logout = async () => {
  await useFetch(`${config.public.apiUrl}/auth/logout`, {
    method: 'POST',
    credentials: 'include'
  });
  user.value = null
  router.push('/login')
}
</script>