<template>
  
  <UHeader class="bg-gray-50 border-b-0 shadow-md " :ui="{ right: 'flex items-center gap-4' }">
    <template #title>
      <div class="flex">
        <img src="/images/logo.jpg" alt="Logo" class="h-10 w-10 mr-3" >
        <div>
          <span class="font-bold text-red-600 text-lg">Buddhist Art MFU</span>
          <div class="text-sm text-gray-600">มหาวิทยาลัยแม่ฟ้าหลวง</div>
        </div>
      </div>
    </template>

    <UNavigationMenu :items="items" variant="link" color="error" :ui="{ linkLabel: 'text-lg font-medium hover:text-red-500' }" />

    <template #right>
        <UButton
:label="language === 'th' ? 'TH' : 'EN'" icon="lucide:globe" color="error" :ui="{ base: 'text-black bg-gray-100 hover:bg-red-600 hover:text-white duration-300' }"
          @click="toggleLanguage" />
        <template v-if="user">
          <UDropdownMenu
v-if="role === 'admin'" :items="adminItems" class="bg-red-500 hover:bg-red-600 duration-300"
            :content="{ align: 'center', side: 'bottom', sideOffset: 8 }" >
            <UButton :label="user.username?.th" color="neutral" variant="ghost" :avatar="{ src: user.photo }" />
          </UDropdownMenu>
          <UDropdownMenu
v-else-if="role === 'student'" :items="studentItems" class="bg-red-500 hover:bg-red-600 duration-300"
            :content="{ align: 'center', side: 'bottom', sideOffset: 8 }">
            <UButton :label="user.username?.th" color="neutral" variant="ghost" :avatar="{ src: user.photo }" />
          </UDropdownMenu>
        </template>
        <template v-else>
          <UButton label="เข้าสู่ระบบ" to="/login" color="error" :ui="{ base: 'text-white bg-red-500 hover:bg-red-600 duration-300 ' }" />
        </template>
    </template>
  </UHeader>
</template>


<script setup lang="ts">
import type { NavigationMenuItem, DropdownMenuItem  } from '@nuxt/ui'


const router = useRouter()
const config = useRuntimeConfig()
const language = ref('th')
const toggleLanguage = () => { language.value = language.value === 'th' ? 'en' : 'th' }

const { user, role, fetchProfile } = useProfile()
onMounted(async () => { await fetchProfile() })

const logout = async () => {
  await useFetch(`${config.public.apiUrl}/auth/logout`, {
    method: 'POST',
    credentials: 'include'
  });
  user.value = null
  router.push('/login')
}

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'หน้าแรก',
    to: '/'
  },
  {
    label: 'ผลงานศิลปะ',
    to: '/artworks',
  },
  {
    label: 'ข่าวสาร',
    to: '/news',
  },
  {
    label: 'เกี่ยวกับเรา',
    to: '/about',
  },
  {
    label: 'ติดต่อผู้ดูแล',
    to: '/contact'
  }
])

const studentItems: DropdownMenuItem[] = [
  { label: 'จัดการผลงานศิลปะ', to: '/profile', icon: 'lucide:user-round' },
  { label: 'อัพโหลดผลงานศิลปะ', to: '/profile/art', icon: 'lucide:brush' },
  { label: 'ออกจากระบบ', onSelect: logout, icon: 'lucide:log-out' }
]

const adminItems: DropdownMenuItem[] = [
  { label: 'แดชบอร์ดผู้ดูแล', to: '/admin/dashboard', icon: 'ic:round-dashboard' },
  { label: 'จัดการผู้ใช้', to: '/admin/users', icon: 'lucide:user-round' },
  { label: 'จัดการผลงานศิลปะ', to: '/admin/artworks', icon: 'lucide:brush' },
  { label: 'การซื้อขาย', to: '/admin/orders', icon: 'lucide:shopping-cart' },
  { label: 'จัดการข่าวสาร', to: '/admin/news', icon: 'ic:outline-newspaper' },
  { label: 'ออกจากระบบ', onSelect: logout, icon: 'lucide:log-out' }
]

</script>