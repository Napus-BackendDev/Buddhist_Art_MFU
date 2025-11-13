<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Upload, Loader, Image as ImageIcon, Type, BookText, MapPin, ImagePlus } from 'lucide-vue-next'
import NewCard from '@/components/NewCard.vue'
import useNews from '@/composables/useNews.js'

const { fetchNewsAdminById , updateNews } = useNews()
const router = useRouter()

// State
const isLoading = ref(false)
const isSubmitting = ref(false)

// Form fields
const titleTh = ref('')
const titleEn = ref('')
const descriptionTh = ref('')
const descriptionEn = ref('')
const place = ref('')
const currentPhotoUrl = ref('')
const createdAt = ref('')

// keep original fetched news for reset
const originalNews = ref(null)

// Image upload
const photoFile = ref(null)
const photoPreview = ref('')

const canSubmit = computed(() => !!titleTh.value && !!titleEn.value)

const handleImageUpload = (e) => {
  const file = e.target.files?.[0]
  if (!file) {
    photoFile.value = null
    photoPreview.value = ''
    return
  }
  if (!file.type.startsWith('image/')) {
    alert('กรุณาเลือกไฟล์รูปภาพ')
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    alert('ขนาดไฟล์ภาพต้องไม่เกิน 2MB')
    return
  }
  photoFile.value = file
  const reader = new FileReader()
  reader.onload = () => (photoPreview.value = String(reader.result || ''))
  reader.readAsDataURL(file)
}

const newsPreview = computed(() => ({
  title: {
    th: titleTh.value,
    en: titleEn.value
  },
  description: {
    th: descriptionTh.value,
    en: descriptionEn.value
  },
  place: place.value,
  photo: photoPreview.value || currentPhotoUrl.value,
  createdAt: createdAt.value || new Date().toISOString()
}))

// Populate form helper
const populateForm = (news) => {
  titleTh.value = news?.title?.th || ''
  titleEn.value = news?.title?.en || ''
  descriptionTh.value = news?.description?.th || ''
  descriptionEn.value = news?.description?.en || ''
  place.value = news?.place || ''
  currentPhotoUrl.value = news?.photo || ''
  createdAt.value = news?.createdAt || ''
  // reset upload state
  photoFile.value = null
  photoPreview.value = ''
}

// Load existing news
const fetchNewsDetail = async () => {
  try {
    isLoading.value = true
    const news = await fetchNewsAdminById(router.params.id)
    originalNews.value = news
    populateForm(news)
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

function resetForm() {
  if (originalNews.value) {
    populateForm(originalNews.value)
  } else {
    // fallback clear
    titleTh.value = ''
    titleEn.value = ''
    descriptionTh.value = ''
    descriptionEn.value = ''
    place.value = ''
    currentPhotoUrl.value = ''
    createdAt.value = ''
    photoFile.value = null
    photoPreview.value = ''
  }
}

function cancelEdit() {
  router.push('/admin/news')
}

const submitEdit = async () => {
  if (!canSubmit.value) {
    alert('กรุณากรอกหัวข้อทั้งภาษาไทยและภาษาอังกฤษ')
    return
  }
  try {
    isSubmitting.value = true
    const formData = new FormData()
    formData.append('title[th]', titleTh.value)
    formData.append('title[en]', titleEn.value)
    formData.append('description[th]', descriptionTh.value)
    formData.append('description[en]', descriptionEn.value)
    formData.append('place', place.value)
    if (photoFile.value) formData.append('photo', photoFile.value)

    await updateNews(router.params.id, formData)
    router.push('/admin/news')
  } catch (e) {
    console.error(e)
    alert('เกิดข้อผิดพลาดในการแก้ไขข่าว')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(fetchNewsDetail)
</script>

<template>
  <div class=" w-full p-6 space-y-6">

    <div v-if="isLoading" class="bg-white rounded-2xl p-10 text-center shadow-md border border-gray-100">
      กำลังโหลดข้อมูล...
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Form -->
      <div class="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md border border-gray-100">
        <form @submit.prevent="submitEdit" class="space-y-6">
          <!-- Card: ข้อมูลข่าว -->
          <div class="bg-white rounded-xl shadow p-5 border border-gray-100">
            <div class="flex items-center gap-2 mb-4">
              <Type class="w-5 h-5 text-red-600" />
              <h2 class="font-semibold">ข้อมูลข่าว</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold mb-1">หัวข้อข่าว (TH)<span class="text-red-500">
                    *</span></label>
                <input v-model="titleTh" type="text"
                  class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="เช่น ประกาศรับสมัคร..." />
                <p class="text-xs text-gray-500 mt-1">{{ titleTh.length }} ตัวอักษร</p>
              </div>
              <div>
                <label class="block text-sm font-semibold mb-1">หัวข้อข่าว (EN)<span class="text-red-500">
                    *</span></label>
                <input v-model="titleEn" type="text"
                  class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g. Announcement..." />
                <p class="text-xs text-gray-500 mt-1">{{ titleEn.length }} characters</p>
              </div>
            </div>
          </div>

          <!-- Card: ภาพข่าว -->
          <div class="bg-white rounded-xl shadow p-5 border border-gray-100">
            <div class="flex items-center gap-2 mb-4">
              <ImagePlus class="w-5 h-5 text-red-600" />
              <h2 class="font-semibold">ภาพข่าว</h2>
            </div>
            <div class="flex items-center gap-4">
              <div
                class="w-32 h-20 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center bg-gray-50">
                <img v-if="photoPreview || currentPhotoUrl" :src="photoPreview || currentPhotoUrl" alt="Preview"
                  class="w-full h-full object-cover" />
                <ImageIcon v-else :size="28" class="text-gray-400" />
              </div>
              <label
                class="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer transition-colors">
                <Upload :size="18" />
                <span>เปลี่ยนรูปภาพ</span>
                <input type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
              </label>
            </div>
            <p class="text-xs text-gray-500 mt-2">รองรับ JPG/PNG ขนาดไม่เกิน 2MB</p>
          </div>

          <!-- Card: รายละเอียดข่าว -->
          <div class="bg-white rounded-xl shadow p-5 border border-gray-100">
            <div class="flex items-center gap-2 mb-4">
              <BookText class="w-5 h-5 text-red-600" />
              <h2 class="font-semibold">รายละเอียดข่าว</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold mb-1">รายละเอียด (TH)</label>
                <textarea v-model="descriptionTh" rows="5"
                  class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-y"
                  placeholder="รายละเอียดข่าว..."></textarea>
                <p class="text-xs text-gray-500 mt-1">{{ descriptionTh.length }} ตัวอักษร</p>
              </div>
              <div>
                <label class="block text-sm font-semibold mb-1">รายละเอียด (EN)</label>
                <textarea v-model="descriptionEn" rows="5"
                  class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-y"
                  placeholder="News details..."></textarea>
                <p class="text-xs text-gray-500 mt-1">{{ descriptionEn.length }} characters</p>
              </div>
            </div>
          </div>

          <!-- Card: ข้อมูลเพิ่มเติม -->
          <div class="bg-white rounded-xl shadow p-5 border border-gray-100">
            <div class="flex items-center gap-2 mb-4">
              <MapPin class="w-5 h-5 text-red-600" />
              <h2 class="font-semibold">ข้อมูลเพิ่มเติม</h2>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">สถานที่ / แหล่งที่มา</label>
              <input v-model="place" type="text"
                class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="เช่น อาคารกิจการนักศึกษา" />
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 justify-end pt-2">
            <button type="button" @click="cancelEdit"
              class="px-4 py-2 rounded-lg border hover:bg-gray-50">ยกเลิก</button>
            <button type="button" @click="resetForm"
              class="px-4 py-2 rounded-lg border hover:bg-gray-50">ยกข้อมูล</button>
            <button type="submit" :disabled="!canSubmit || isSubmitting" class="px-5 py-2 rounded-lg text-white"
              :class="isSubmitting || !canSubmit ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'">
              <Loader v-if="isSubmitting" :size="16" class="animate-spin" />
              <span class="ml-2">{{ isSubmitting ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง' }}</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Live Preview -->
      <aside class="lg:col-span-1">
        <div class="bg-white rounded-xl shadow p-5 border border-gray-100 sticky top-6">
          <h2 class="font-semibold mb-4">ตัวอย่างแสดงผล</h2>
          <NewCard :news-item="newsPreview" />
        </div>
      </aside>
    </div>
  </div>
</template>