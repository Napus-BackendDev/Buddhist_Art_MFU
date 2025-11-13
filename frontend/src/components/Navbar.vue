<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { LogIn, LogOut, User, Settings, Palette, ShoppingCart, ChevronDown, Newspaper } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const auth = useAuthStore()

const { user , loadingUser } = storeToRefs(auth)
const { logout } = useAuth()

const showDropdown = ref(false)

// App.vue already calls auth.fetchUser on mount. Avoid redundant fetches here to prevent
// multiple simultaneous requests that can cause transient logout behavior when requests fail.

function navigateToLogin() {
    router.push('/auth/login')
}

// เมนูหลัก
const items = [
    { name: 'หน้าหลัก', path: '/' },
    { name: 'ผลงานศิลปะ', path: '/artwork' },
    { name: 'ข่าวสาร', path: '/new' },
    { name: 'เกี่ยวกับเรา', path: '/about' },
    { name: 'ติดต่อผู้ดูแล', path: '/contact' },
]

const dropdownItems_Public = ref([
    { name: 'โปรไฟล์ของฉัน', path: '/user/profile', icon: 'User' },
    { name: 'ผลงานศิลปะ', path: '/user/artList', icon: 'Palette' },
])

const dropdownItems_Admin = ref([
    { name: 'แดชบอร์ด', path: '/admin/dashboard', adminOnly: true, icon: 'Settings' },
    { name: 'จัดการผลงานศิลปะ', path: '/admin/artworks', adminOnly: true, icon: 'Palette' },
    { name: 'จัดการผู้ใช้', path: '/admin/users', adminOnly: true, icon: 'User' },
    { name: 'จัดการข่าวสาร', path: '/admin/news', adminOnly: true, icon: 'Newspaper' },
    { name: 'จัดการซื้อขาย', path: '/admin/order', adminOnly: true, icon: 'ShoppingCart' },
])

const filteredDropdown = computed(() => {
    if (user.value.role === 'admin') {
        return dropdownItems_Admin.value
    } else {
        return dropdownItems_Public.value
    }
})

async function handleLogout() {
    await logout()
    router.push('/')
}
</script>

<template>
    <!-- Top Bar -->
    <div class="bg-white border-b border-gray-200 shadow-sm">
        <div class="w-full max-w-7xl mx-auto ">
            <div class="flex justify-between items-center py-4">
                <!-- Logo -->
                <RouterLink to="/" class="flex items-center gap-3 group">
                    <div class="relative">
                        <img src="/logo.jpg" alt="Logo"
                            class="w-12 h-12 rounded-lg shadow-md transition-transform group-hover:scale-105" />
                        <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white">
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <span
                            class="font-bold text-lg text-gray-800 group-hover:text-red-600 transition-colors">Buddhist
                            Art MFU</span>
                        <span class="text-xs text-gray-500">มหาวิทยาลัยแม่ฟ้าหลวง</span>
                    </div>
                </RouterLink>

                <!-- Login Button / User Dropdown -->
                <div>

                    <!-- skeleton  -->
                    <div v-if="loadingUser" class="flex items-center gap-2 px-6 py-2.5 text-gray-400">
                        <span class="animate-pulse">กำลังตรวจสอบสถานะ...</span>
                    </div>

                    <!-- Login Button -->
                    <button v-else-if="!user" @click="navigateToLogin"
                        class="flex items-center gap-2 bg-linear-to-r from-red-600 to-red-500 text-white px-6 py-2.5 rounded-lg hover:from-red-700 hover:to-red-600 transition-all shadow-md hover:shadow-lg font-semibold">
                        <LogIn :size="18" />
                        <span>เข้าสู่ระบบ</span>
                    </button>

                    <!-- User Dropdown -->
                    <div v-else class="relative">
                        <button @click="showDropdown = !showDropdown"
                            class="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-xl transition-all border border-gray-200 shadow-sm hover:shadow-md">
                            <!-- User Avatar -->
                            <div class="relative">
                                <img v-if="user.photo" :src="user.photo" alt="User Photo"
                                    class="w-10 h-10 rounded-full object-cover border-2 border-red-400" />
                                <div v-else
                                    class="bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                                    {{ user?.username?.th?.charAt(0) || user?.username?.en?.charAt(0) || 'U' }}
                                </div>
                                <div
                                    class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white">
                                </div>
                            </div>

                            <!-- User Info -->
                            <div class="flex flex-col text-left">
                                <span class="font-semibold text-gray-800 text-sm">
                                    {{ user.username?.th || user.username?.en || 'User' }}
                                </span>
                                <span class="text-xs text-gray-500 capitalize">
                                    {{ user.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้งาน' }}
                                </span>
                            </div>

                            <!-- Dropdown Icon -->
                            <ChevronDown :size="18" class="text-gray-400 transition-transform"
                                :class="{ 'rotate-180': showDropdown }" />
                        </button>

                        <!-- Dropdown Menu -->
                        <Transition enter-active-class="transition ease-out duration-200"
                            enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100"
                            leave-active-class="transition ease-in duration-150"
                            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                            <div v-if="showDropdown"
                                class="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                                <!-- User Info Header -->
                                <div class="bg-linear-to-r from-red-600 to-red-500 px-4 py-3 text-white">
                                    <p class="font-semibold">{{ user.username?.th || user.username?.en }}</p>
                                    <p class="text-xs text-red-100">{{ user.email?.personal || user.email?.university }}
                                    </p>
                                </div>

                                <!-- Menu Items -->
                                <div class="py-2">
                                    <RouterLink v-for="item in filteredDropdown" :key="item.name" :to="item.path"
                                        class="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                        @click="showDropdown = false">
                                        <User v-if="item.icon === 'User'" :size="18" />
                                        <Settings v-else-if="item.icon === 'Settings'" :size="18" />
                                        <Palette v-else-if="item.icon === 'Palette'" :size="18" />
                                        <Newspaper v-else-if="item.icon === 'Newspaper'" :size="18" />
                                        <ShoppingCart v-else-if="item.icon === 'ShoppingCart'" :size="18" />
                                        <span class="font-medium">{{ item.name }}</span>
                                    </RouterLink>
                                </div>

                                <!-- Logout Button -->
                                <div class="border-t border-gray-200">
                                    <button @click="handleLogout"
                                        class="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors font-semibold">
                                        <LogOut :size="18" />
                                        <span>ออกจากระบบ</span>
                                    </button>
                                </div>
                            </div>
                        </Transition>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Navigation Bar -->
    <nav class="flex items-center justify-center bg-linear-to-r from-red-600 to-red-500 shadow-lg">
        <div class="w-full max-w-7xl flex items-center justify-between gap-2 py-3">
            <RouterLink v-for="item in items" :key="item.name" :to="item.path"
                class="text-white hover:bg-white hover:text-red-600 px-6 py-2 rounded-lg transition-all font-medium hover:shadow-md"
                active-class="bg-white !text-red-600 shadow-md">
                {{ item.name }}
            </RouterLink>
        </div>
    </nav>
</template>

<style scoped>
.rotate-30 {
    transform: rotate(30deg);
}
</style>
