<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ImagePlus, BadgeDollarSign, Ruler, Type, BookText, MapPin, Tags } from 'lucide-vue-next'
import ArtworkPreviewCard from '@/components/ArtworkCard/ArtworkPreviewCard.vue'
import useArtwork from '@/composables/useArtwork.js'

const { createArtworkAdmin } = useArtwork()
const router = useRouter()

const predefinedTypesTh = ref(['จิตกรรม', 'ประติมากรรม', 'สื่อผสม', 'การวาดเส้น', 'ศิลปะดิจิทัล', 'ศิลปะการติดตั้ง'])
const predefinedTypesEn = ref(['Painting', 'Sculpture', 'Mixed Media', 'Drawing', 'Digital Art', 'Installation Art'])
const predefinedPresentationTh = ref(['แขวนติดผนัง', 'จัดวางบนแท่นประติมากรรม', 'ศิลปะจัดวาง', 'สื่อวิดีทัศน์', 'ศิลปะสื่อแสดง', 'ขาตั้งผลงาน', 'แปรผันตามสถานที่'])
const predefinedPresentationEn = ref(['Hanging on Wall', 'Placed on Pedestal', 'Installation Art', 'Video Media', 'Performance Art', 'Easel Display', 'Site-Specific'])

const selectedTypeTh = ref('')
const selectedTypeEn = ref('')
const selectedPresentationTh = ref('')
const selectedPresentationEn = ref('')

//เมื่อเลือกจาก dropdown ให้ sync ค่าไปยัง typeTh
watch(selectedTypeTh, (newVal) => {
    if (newVal !== 'custom') {
        typeTh.value = newVal
    } else {
        typeTh.value = ''
    }
})
watch(selectedTypeEn, (newVal) => {
    if (newVal !== 'custom') {
        typeEn.value = newVal
    } else {
        typeEn.value = ''
    }
})
watch(selectedPresentationTh, (newVal) => {
    if (newVal !== 'custom') {
        presentationTh.value = newVal
    } else {
        presentationTh.value = ''
    }
})
watch(selectedPresentationEn, (newVal) => {
    if (newVal !== 'custom') {
        presentationEn.value = newVal
    } else {
        presentationEn.value = ''
    }
})

// Form state
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
const owner = ref('')

// Users for owner selection
const users = ref([])
const loadingUsers = ref(false)

async function fetchUsers() {
    loadingUsers.value = true
    try {
        const res = await fetch('http://localhost:8080/api/admin/user', { credentials: 'include' })
        if (!res.ok) throw new Error('ไม่สามารถดึงรายชื่อผู้ใช้ได้')
        const data = await res.json()
        users.value = data || []
    } catch (err) {
        console.error('Fetch users error:', err)
        users.value = []
    } finally {
        loadingUsers.value = false
    }
}

onMounted(() => {
    fetchUsers()
})

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
const canSubmit = computed(() => !!artId.value && !!artnameTh.value && !!price.value && !!photoFile.value && !!owner.value)

const artPreview = computed(() => ({
    photo: photoPreview.value || '/placeholder-art.png',
    artname: { th: artnameTh.value || 'ชื่อผลงาน', en: artnameEn.value || 'Artwork Title' },
    price: price.value || '0',
    saleStatus: saleStatus.value,
    size: size.value || '-',
    ratio: ratio.value || '-',
    technique: { th: techniqueTh.value || '-', en: techniqueEn.value || '-' },
    type: { th: typeTh.value || 'ประเภท', en: typeEn.value || 'Type' },
    presentation: { th: presentationTh.value || '-', en: presentationEn.value || '-' },
    owner: (() => {
        const found = users.value.find(u => u._id === owner.value)
        const name = (found && (found.username?.th || found.username?.en || found.email || found.name)) || 'Admin'
        return { username: { th: name, en: name } }
    })()
}))

function resetForm() {
    artId.value = ''
    artnameTh.value = ''
    artnameEn.value = ''
    owner.value = ''
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
    router.push('/admin/artworks')
}

async function submitArt() {
    if (!canSubmit.value) {
        alert('กรุณากรอก Art ID, ชื่อผลงาน (TH), ราคา และเลือกรูปภาพ')
        return
    }

    try {
        isSubmitting.value = true
        const form = new FormData()
        form.append('artId', artId.value)
        form.append('owner', owner.value)
        form.append('size', size.value)
        form.append('price', String(price.value))
        form.append('ratio', ratio.value)
        form.append('saleStatus', saleStatus.value)
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
        if (photoFile.value) form.append('photo', photoFile.value)

        await createArtworkAdmin(form)
        router.push('/admin/artworks')
    } catch (err) {
        console.error('Submit art error:', err)
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
    <div class=" w-full p-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Form column -->
            <form @submit.prevent="submitArt" class="lg:col-span-2 space-y-6">
                <!-- Basic card -->
                <div class="bg-white rounded-xl shadow p-5 border border-gray-100">
                    <div class="flex items-center gap-2 mb-4">
                        <Tags class="w-5 h-5 text-red-600" />
                        <h2 class="font-semibold">ข้อมูลพื้นฐาน</h2>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label class="block text-sm font-semibold mb-1">Art ID<span class="text-red-500">
                                    *</span></label>
                            <input v-model="artId" type="text"
                                class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="เช่น 6631503016-001" required />
                            <p class="text-xs text-gray-500 mt-1">รูปแบบแนะนำ: รหัสนักศึกษา-ลำดับผลงาน</p>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold mb-1">เจ้าของผลงาน<span class="text-red-500">
                                    *</span></label>
                            <div class="relative">
                                <select v-model="owner"
                                    class="w-full border rounded-lg p-2 pr-10 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    required>
                                    <option value="" disabled>-- เลือกผู้ใช้ในระบบ --</option>
                                    <option v-if="loadingUsers" disabled>กำลังโหลด...</option>
                                    <option v-for="u in users" :key="u._id" :value="u._id">
                                        {{ (u.username && (u.username.th || u.username.en)) || u.email || u.name ||
                                            u._id }}
                                    </option>
                                </select>
                            </div>
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
                            <div class="flex gap-2">
                                <select v-model="selectedTypeTh"
                                    class="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent">
                                    <option value="" disabled>-- เลือกประเภท --</option>
                                    <option v-for="t in predefinedTypesTh" :key="t" :value="t">{{ t }}</option>
                                    <option value="custom">อื่นๆ (พิมพ์เอง)</option>
                                </select>
                                <input v-if="selectedTypeTh === 'custom'" v-model="typeTh" type="text"
                                    placeholder="พิมพ์ประเภทอื่น..."
                                    class="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                            </div>
                            <p class="text-xs text-gray-500 mt-1">สามารถเลือกจากรายการหรือเลือก "อื่นๆ" เพื่อพิมพ์เอง
                            </p>
                        </div>

                        <div>
                            <label class="block text-sm font-semibold mb-1">ประเภท (EN)</label>
                            <div class="flex gap-2">
                                <select v-model="selectedTypeEn"
                                    class="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent">
                                    <option value="" disabled>-- Select type --</option>
                                    <option v-for="t in predefinedTypesEn" :key="t" :value="t">{{ t }}</option>
                                    <option value="custom">Other (custom)</option>
                                </select>
                                <input v-if="selectedTypeEn === 'custom'" v-model="typeEn" type="text"
                                    placeholder="Type (custom)..."
                                    class="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-semibold mb-1">การนำเสนอ (TH)</label>
                            <div class="flex gap-2">
                                <select v-model="selectedPresentationTh"
                                    class="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent">
                                    <option value="" disabled>-- Select type --</option>
                                    <option v-for="t in predefinedPresentationTh" :key="t" :value="t">{{ t }}</option>
                                    <option value="custom">Other (custom)</option>
                                </select>
                                <input v-if="selectedPresentationTh === 'custom'" v-model="presentationTh" type="text"
                                    placeholder="Type (custom)..."
                                    class="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold mb-1">การนำเสนอ (EN)</label>
                            <div class="flex gap-2">
                                <select v-model="selectedPresentationEn"
                                    class="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent">
                                    <option value="" disabled>-- Select type --</option>
                                    <option v-for="t in predefinedPresentationEn" :key="t" :value="t">{{ t }}</option>
                                    <option value="custom">Other (custom)</option>
                                </select>
                                <input v-if="selectedPresentationEn === 'custom'" v-model="presentationEn" type="text"
                                    placeholder="Type (custom)..."
                                    class="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                            </div>
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
                        :class="isSubmitting || !canSubmit ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'">{{
                            isSubmitting ? 'กำลังบันทึก...' : 'บันทึกผลงาน' }}</button>
                </div>
            </form>

            <!-- Preview column -->
            <aside class="lg:col-span-1">
                <div class="bg-white rounded-xl shadow p-5 border border-gray-100 sticky top-6">
                    <h2 class="font-semibold mb-4">ตัวอย่างแสดงผล</h2>
                    <ArtworkPreviewCard :art="artPreview" />
                </div>
            </aside>
        </div>
    </div>
</template>