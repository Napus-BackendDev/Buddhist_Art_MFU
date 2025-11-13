<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Palette, Calendar, TrendingUp } from 'lucide-vue-next'
import useNews from '@/composables/useNews.js'
import Newcard from '@/components/NewCard.vue'

const { fetchNews } = useNews()
const router = useRouter()
const news = ref([])
const arts = ref([
  { photo: '/arts/จิตรกรรม.jpeg', type: 'จิตรกรรม', description: 'งานจิตรกรรมไทยร่วมสมัย' },
  { photo: '/arts/ประติมากรรม.jpg', type: 'ประติมากรรม', description: 'ประติมากรรมพุทธศิลป์' },
  { photo: '/arts/สื่อผสม.jpg', type: 'สื่อผสม', description: 'ศิลปะสื่อผสมร่วมสมัย' },
  { photo: '/arts/วิดีโออาร์ต.png', type: 'วิดีโออาร์ต', description: 'วิดีโออาร์ตและมีเดีย' }
])

const loadNews = async () => {
  const data = await fetchNews()
  news.value = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4)
}

onMounted(loadNews)
</script>


<template>
  <div class="w-full max-w-7xl mx-auto px-4 py-8 space-y-16">

    <!-- Hero Section -->
    <section class="text-center py-12">
      <h1 class="text-5xl font-extrabold text-gray-800 mb-4">
        ศูนย์รวมผลงาน
        <span class="text-red-600">ศิลปะพุทธศิลป์</span>
      </h1>
      <p class="text-xl text-gray-600 mb-8">
        ผลงานสร้างสรรค์ที่เกิดขึ้นจากหลักสูตรระยะสั้น สาขาวิชาพุทธศิลปกรรม มหาวิทยาลัยแม่ฟ้าหลวง
      </p>
      <div class="flex justify-center gap-4">
        <RouterLink to="/artwork"
          class="flex items-center gap-2 bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-xl font-semibold">
          <span>สำรวจผลงาน</span>
          <ArrowRight :size="20" />
        </RouterLink>
        <RouterLink to="/about"
          class="flex items-center gap-2 bg-white text-red-600 border-2 border-red-600 px-8 py-3 rounded-lg hover:bg-red-50 transition-all font-semibold">
          <span>เกี่ยวกับเรา</span>
        </RouterLink>
      </div>
    </section>

    <!-- Art Types Section -->
    <section id="artType" class="w-full">
      <div class="flex items-center justify-between mb-8">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <Palette :size="32" class="text-red-600" />
            <h2 class="text-3xl font-bold text-gray-800">ประเภทงานศิลปะ</h2>
          </div>
          <p class="text-gray-600">สำรวจผลงานศิลปะในหมวดหมู่ต่างๆ</p>
        </div>
        <RouterLink to="/artwork" class="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold group">
          <span>ดูทั้งหมด</span>
          <ArrowRight :size="20" class="group-hover:translate-x-1 transition-transform" />
        </RouterLink>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="(art, index) in arts" :key="index"
          class="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer">
          <!-- Image -->
          <div class="relative h-64 overflow-hidden">
            <img :src="art.photo" :alt="art.type"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <!-- Overlay -->
            <div
              class="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity">
            </div>
          </div>

          <!-- Content -->
          <div class="absolute bottom-0 left-0 right-0 p-5 text-white">
            <h3 class="text-2xl font-bold mb-1">{{ art.type }}</h3>
            <p class="text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {{ art.description }}
            </p>
          </div>

          <!-- Badge -->
          <div
            class="absolute top-4 right-4 bg-white text-red-600 px-3 py-1 rounded-full text-xs font-semibold shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
            ดูเพิ่มเติม
          </div>
        </div>
      </div>
    </section>

    <!-- News Section -->
    <section id="News" class="w-full">
      <div class="flex items-center justify-between mb-8">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <Calendar :size="32" class="text-red-600" />
            <h2 class="text-3xl font-bold text-gray-800">ข่าวสารล่าสุด</h2>
          </div>
          <p class="text-gray-600">อัปเดตข่าวสารและกิจกรรมล่าสุดจากคณะ</p>
        </div>
        <RouterLink to="/new" class="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold group">
          <span>ดูทั้งหมด</span>
          <ArrowRight :size="20" class="group-hover:translate-x-1 transition-transform" />
        </RouterLink>
      </div>

      <!-- News Grid -->
      <div v-if="news.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Newcard v-for="item in news" :key="item._id" :news-item="item" @click="router.push(`/news/${item._id}`)" class="cursor-pointer" />
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-xl shadow-md p-12 text-center">
        <Calendar :size="64" class="mx-auto text-gray-300 mb-4" />
        <h3 class="text-xl font-bold text-gray-700 mb-2">ยังไม่มีข่าวสาร</h3>
        <p class="text-gray-500">กรุณาติดตามข่าวสารอัปเดตในภายหลัง</p>
      </div>
    </section>
  </div>
</template>
