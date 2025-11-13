<script setup>
import { RouterLink, useRouter, useRoute } from 'vue-router';
import { Settings, Palette, User, ShoppingCart, Newspaper } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { computed } from 'vue'

const router = useRouter();
const route = useRoute()
const auth = useAuthStore()
const user = computed(() => auth.user)

const items = [
    { name: 'Dashboard', link: '/admin/dashboard', icon: Settings },
    { name: 'Artworks', link: '/admin/artworks', icon: Palette },
    { name: 'Users', link: '/admin/users', icon: User },
    { name: 'Orders', link: '/admin/orders', icon: ShoppingCart },
    { name: 'News', link: '/admin/news', icon: Newspaper }
];

function goHomepage() {
    router.push('/');
}

</script>

<template>
    <aside class="w-64 bg-gray-800 text-white min-h-screen p-4">
        <!-- <div class="mb-6">
            <div class="text-sm text-gray-300">ผู้ใช้งาน</div>
            <div class="mt-2 font-medium text-white truncate">{{ user.username.th || user.username.en }}</div>
        </div> -->

        <nav>
            <ul>
                <li v-for="item in items" :key="item.name" class="mb-2">
                    <RouterLink :to="item.link" class="flex items-center gap-3 py-2 px-3 rounded hover:bg-gray-700 transition-colors" :class="route.path === item.link ? 'bg-gray-900' : ''">
                        <component :is="item.icon" class="w-5 h-5 text-gray-300" />
                        <span class="text-sm">{{ item.name }}</span>
                    </RouterLink>
                </li>
            </ul>

            <div class="mt-4">
                <button @click="goHomepage" class="w-full flex items-center gap-3 py-2 px-3 rounded hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 2a1 1 0 00-.707.293l-7 7A1 1 0 003 11h1v6a1 1 0 001 1h4v-5h2v5h4a1 1 0 001-1v-6h1a1 1 0 00.707-1.707l-7-7A1 1 0 0010 2z" />
                    </svg>
                    <span class="text-sm">Go to Homepage</span>
                </button>
            </div>
        </nav>
    </aside>
</template>