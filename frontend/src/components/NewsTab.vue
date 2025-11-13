<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Image } from 'lucide-vue-next'
import useNews from '@/composables/useNews'

const { fetchNews } = useNews()
const news = ref([])
const currentIndex = ref(0)
let timer = null
const slideInterval = ref(5000)

const currentSlide = computed(() => news.value[currentIndex.value] || {})
const currentImage = computed(() => currentSlide.value.photo || currentSlide.value.image || '')

const startTimer = () => {
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    if (news.value.length) {
      currentIndex.value = (currentIndex.value + 1) % news.value.length
    }
  }, slideInterval.value)
}

const goToSlide = (index) => {
  currentIndex.value = index
  startTimer()
}


const loadData = async () => {
  try {
    const data = await fetchNews()
    news.value = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3)
    currentIndex.value = 0
    startTimer()
  } catch (error) {
    console.error('Error fetching news:', error)
    news.value = []
  }
}

onMounted(() => {
  loadData()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.7s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>


<template>
  <div class="w-full">
    <div v-if="!news.length" class="w-full h-[420px] bg-gray-100 flex flex-col items-center justify-center space-y-3 text-xl font-medium text-gray-500">
      <div class="bg-white p-3 rounded-full">
        <Image class="w-12 h-12 text-gray-400 " />
      </div>
      <h1>No news available.</h1>
    </div>
    <div v-else class="space-y-4">
      <!-- Slides -->
      <div class="w-full h-[420px] md:h-[520px] relative overflow-hidden">
        <transition name="fade" mode="out-in">
          <img :key="currentIndex" :src="currentImage" :alt="currentSlide.title?.en || 'News Banner'"
            class="w-full h-[520px] object-cover " />
        </transition>
      </div>

      <!-- Dots / Pagination -->
      <div class="w-full justify-center items-center bottom-6 flex gap-3">
        <button v-for="(s, idx) in news" :key="s._id || s.id || idx" @click="goToSlide(idx)"
          :class="['w-5 h-5 rounded-full border transition-colors duration-300', currentIndex === idx ? 'bg-red-600 border-transparent' : 'bg-white border-gray-300']"
          aria-label="Go to slide" />
      </div>
    </div>
  </div>
</template>
