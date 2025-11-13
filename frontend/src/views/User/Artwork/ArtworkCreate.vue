<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ImagePlus, BadgeDollarSign, Ruler, Type, BookText, MapPin, Tags } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import ArtworksPreviewCard from '@/components/ArtworkCard/ArtworkPreviewCard.vue'
import useArtwork from '@/composables/useArtwork'

const { createArtwork } = useArtwork()
const auth = useAuthStore()
const user = computed(() => auth.user)

const router = useRouter()

// Form state (Thai/English for Map fields)
const artId = ref('')
const artnameTh = ref('')
const artnameEn = ref('')
const size = ref('')
const price = ref('')
const techniqueTh = ref('')
const techniqueEn = ref('')
const conceptTh = ref('')
const conceptEn = ref('')
const typeTh = ref('')
const typeEn = ref('')
const presentationTh = ref('')
const presentationEn = ref('')
const ratio = ref('')
const artAddressTh = ref('')
const artAddressEn = ref('')
const saleStatus = ref('available')

// Image upload
const photoFile = ref(null)
const photoPreview = ref('')

const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) {
        photoFile.value = null
        photoPreview.value = ''
        return
    }
    if (file.size > 2 * 1024 * 1024) {
        alert('ขนาดไฟล์ภาพต้องไม่เกิน 2MB')
        photoFile.value = null
        photoPreview.value = ''
        return
    }
    photoFile.value = file
    const reader = new FileReader()
    reader.onload = () => (photoPreview.value = String(reader.result || ''))
    reader.readAsDataURL(file)
}

const isSubmitting = ref(false)
const canSubmit = computed(() => !!artId.value && !!artnameTh.value && !!price.value && !!photoFile.value)

// Art preview object for Artcard
const artPreview = computed(() => ({
    photo: photoPreview.value || '/placeholder-art.png',
    artname: {
        th: artnameTh.value || 'ชื่อผลงาน',
        en: artnameEn.value || 'Artwork Title'
    },
    price: price.value || '0',
    saleStatus: saleStatus.value,
    size: size.value || '-',
    ratio: ratio.value || '-',
    technique: {
        th: techniqueTh.value || '-',
        en: techniqueEn.value || '-'
    },
    type: {
        th: typeTh.value || 'ประเภท',
        en: typeEn.value || 'Type'
    },
    presentation: {
        th: presentationTh.value || '-',
        en: presentationEn.value || '-'
    },
    owner: {
        username: {
            th: user?.username?.th || "เจ้าของผลงาน",
            en: 'Preview'
        }
    }
}))

function resetForm() {
    artId.value = ''
    artnameTh.value = ''
    artnameEn.value = ''
    size.value = ''
    price.value = ''
    techniqueTh.value = ''
    techniqueEn.value = ''
    conceptTh.value = ''
    conceptEn.value = ''
    typeTh.value = ''
    typeEn.value = ''
    presentationTh.value = ''
    presentationEn.value = ''
    ratio.value = ''
    artAddressTh.value = ''
    artAddressEn.value = ''
    saleStatus.value = 'available'
    photoFile.value = null
    photoPreview.value = ''
}

function cancelCreate() {
    router.push('/user/artList')
}

async function submitArt() {
    if (!canSubmit.value) {
        alert('กรุณากรอก Art ID, ชื่อผลงาน (TH), ราคา และเลือกรูปภาพ')
        return
    }

    try {
        isSubmitting.value = true
        const form = new FormData()
        // Simple fields
        form.append('artId', artId.value)
        form.append('size', size.value)
        form.append('price', String(price.value))
        form.append('ratio', ratio.value)
        form.append('saleStatus', saleStatus.value)
        // Map fields via bracket notation so backend builds Map objects
        if (artnameTh.value) form.append('artname[th]', artnameTh.value)
        if (artnameEn.value) form.append('artname[en]', artnameEn.value)
        if (techniqueTh.value) form.append('technique[th]', techniqueTh.value)
        if (techniqueEn.value) form.append('technique[en]', techniqueEn.value)
        if (conceptTh.value) form.append('concept[th]', conceptTh.value)
        if (conceptEn.value) form.append('concept[en]', conceptEn.value)
        if (typeTh.value) form.append('type[th]', typeTh.value)
        if (typeEn.value) form.append('type[en]', typeEn.value)
        if (presentationTh.value) form.append('presentation[th]', presentationTh.value)
        if (presentationEn.value) form.append('presentation[en]', presentationEn.value)
        if (artAddressTh.value) form.append('artAddress[th]', artAddressTh.value)
        if (artAddressEn.value) form.append('artAddress[en]', artAddressEn.value)
        // File - field name MUST be 'photo' (per backend upload middleware)
        if (photoFile.value) form.append('photo', photoFile.value)

        await createArtwork(form)
        await auth.fetchUser()
        setTimeout(() => router.push('/user/artList'), 500)
    } catch (err) {
        console.error('Submit art error:', err)
        alert('บันทึกไม่สำเร็จ: ' + (err?.message || 'Unknown error'))
    } finally {
        isSubmitting.value = false
    }
}
</script>


<template>
    <div class="max-w-7xl mx-auto w-full py-6">
        <h1 class="text-3xl font-extrabold text-red-600 mb-2">สร้างผลงานศิลปะใหม่</h1>
        <p class="text-gray-600 mb-6">กรุณากรอกข้อมูลผลงานศิลปะของคุณด้านล่าง</p>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Form column -->
            <form @submit.prevent="submitArt" class="lg:col-span-2 space-y-6">
                <!-- Basic card -->
                <div class="bg-white rounded-xl shadow p-5 border border-gray-100">
                    <div class="flex items-center gap-2 mb-4">
                        <Tags class="w-5 h-5 text-red-600" />
                        <h2 class="font-semibold">ข้อมูลพื้นฐาน</h2>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-semibold mb-1">Art ID<span class="text-red-500">
                                    *</span></label>
                            <input v-model="artId" type="text"
                                class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="เช่น 6631503016-001" required />
                            <p class="text-xs text-gray-500 mt-1">รูปแบบแนะนำ: รหัสนักศึกษา-ลำดับผลงาน</p>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold mb-1">ราคา (บาท)<span class="text-red-500">
                                    *</span></label>
                            <div class="relative">
                                <input v-model="price" type="number" min="0"
                                    class="w-full border rounded-lg p-2 pr-10 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="เช่น 2500" required />
                                <BadgeDollarSign class="w-4 h-4 absolute right-3 top-3 text-gray-400" />
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold mb-1">สถานะการขาย</label>
                            <select v-model="saleStatus"
                                class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent">
                                <option value="available">พร้อมขาย</option>
                                <option value="sold">ขายแล้ว</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Names card -->
                <div class="bg-white rounded-xl shadow p-5 border border-gray-100">
                    <div class="flex items-center gap-2 mb-4">
                        <Type class="w-5 h-5 text-red-600" />
                        <h2 class="font-semibold">ชื่อผลงาน</h2>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-semibold mb-1">ชื่อผลงาน (TH)<span class="text-red-500">
                                    *</span></label>
                            <input v-model="artnameTh" type="text"
                                class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="ชื่อภาษาไทย" required />
                        </div>
                        <div>
                            <label class="block text-sm font-semibold mb-1">ชื่อผลงาน (EN)</label>
                            <input v-model="artnameEn" type="text"
                                class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="English title" />
                        </div>
                    </div>
                </div>

                <!-- Image card -->
                <div class="bg-white rounded-xl shadow p-5 border border-gray-100">
                    <div class="flex items-center gap-2 mb-4">
                        <ImagePlus class="w-5 h-5 text-red-600" />
                        <h2 class="font-semibold">ภาพผลงาน</h2>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                        <div>
                            <label class="block text-sm font-semibold mb-1">อัพโหลดภาพ<span class="text-red-500">
                                    *</span></label>
                            <input type="file" accept="image/*" @change="handleImageUpload"
                                class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required />
                            <p class="text-xs text-gray-500 mt-1">รองรับ .jpg .png .gif ขนาดไม่เกิน 2MB</p>
                        </div>
                    </div>
                </div>

                <!-- Details card -->
                <div class="bg-white rounded-xl shadow p-5 border border-gray-100">
                    <div class="flex items-center gap-2 mb-4">
                        <Ruler class="w-5 h-5 text-red-600" />
                        <h2 class="font-semibold">รายละเอียดผลงาน</h2>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-semibold mb-1">ขนาดผลงาน</label>
                            <input v-model="size" type="text"
                                class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="เช่น 30x40 cm" />
                        </div>
                        <div>
                            <label class="block text-sm font-semibold mb-1">อัตราส่วน (ratio)</label>
                            <input v-model="ratio" type="text"
                                class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="เช่น 3:4" />
                        </div>
                    </div>
                </div>

                <!-- Map fields card -->
                <div class="bg-white rounded-xl shadow p-5 border border-gray-100">
                    <div class="flex items-center gap-2 mb-4">
                        <BookText class="w-5 h-5 text-red-600" />
                        <h2 class="font-semibold">ข้อมูลเพิ่มเติม</h2>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-semibold mb-1">เทคนิค (TH)</label>
                            <input v-model="techniqueTh" type="text"
                                class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                        </div>
                        <div>
                            <label class="block text-sm font-semibold mb-1">เทคนิค (EN)</label>
                            <input v-model="techniqueEn" type="text"
                                class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                        </div>

                        <div>
                            <label class="block text-sm font-semibold mb-1">แนวคิด (TH)</label>
                            <textarea v-model="conceptTh"
                                class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                rows="3"></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold mb-1">แนวคิด (EN)</label>
                            <textarea v-model="conceptEn"
                                class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                rows="3"></textarea>
                        </div>

                        <div>
                            <label class="block text-sm font-semibold mb-1">ประเภท (TH)</label>
                            <input v-model="typeTh" type="text"
                                class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                        </div>
                        <div>
                            <label class="block text-sm font-semibold mb-1">ประเภท (EN)</label>
                            <input v-model="typeEn" type="text"
                                class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                        </div>

                        <div>
                            <label class="block text-sm font-semibold mb-1">การนำเสนอ (TH)</label>
                            <input v-model="presentationTh" type="text"
                                class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                        </div>
                        <div>
                            <label class="block text-sm font-semibold mb-1">การนำเสนอ (EN)</label>
                            <input v-model="presentationEn" type="text"
                                class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                        </div>

                        <div>
                            <label class="block text-sm font-semibold mb-1">สถานที่จัดแสดง (TH)</label>
                            <input v-model="artAddressTh" type="text"
                                class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                        </div>
                        <div>
                            <label class="block text-sm font-semibold mb-1">สถานที่จัดแสดง (EN)</label>
                            <input v-model="artAddressEn" type="text"
                                class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                        </div>
                    </div>
                </div>

                <div class="flex gap-3 justify-end pt-2">
                    <button type="button" @click="cancelCreate"
                        class="px-4 py-2 rounded-lg border hover:bg-gray-50">ยกเลิก</button>
                    <button type="button" @click="resetForm"
                        class="px-4 py-2 rounded-lg border hover:bg-gray-50">ล้างข้อมูล</button>
                    <button type="submit" :disabled="isSubmitting || !canSubmit" class="px-5 py-2 rounded-lg text-white"
                        :class="isSubmitting || !canSubmit ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'">
                        {{ isSubmitting ? 'กำลังบันทึก...' : 'บันทึกผลงาน' }}
                    </button>
                </div>
            </form>

            <!-- Preview column -->
            <aside class="lg:col-span-1">
                <div class="bg-white rounded-xl shadow p-5 border border-gray-100 sticky top-6">
                    <h2 class="font-semibold mb-4">ตัวอย่างแสดงผล</h2>
                    <ArtworksPreviewCard :art="artPreview" />
                </div>
            </aside>
        </div>
    </div>
</template>
