<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { Mail, Phone, GraduationCap, User, Palette, SearchX, Edit2, X, Upload, Loader } from 'lucide-vue-next'
import Artcard from '@/components/ArtworkCard/ArtworkCard.vue'

const auth = useAuthStore()
const user = computed(() => auth.user)
const approvedArts = computed(() => user.value?.arts?.filter(art => art.approvalStatus === 'approved') || [])
const totalArts = computed(() => user.value?.arts?.length || 0)
const pendingArts = computed(() => user.value?.arts?.filter(art => art.approvalStatus === 'pending').length || 0)

// Modal state
const showEditModal = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Form data
const formData = ref({
    usernameTh: '',
    usernameEn: '',
    tel: '',
    emailPersonal: '',
    emailUniversity: '',
    photo: null
})

// Preview image
const previewPhoto = ref('')

const handleEdit = () => {
    // Populate form with current user data
    formData.value = {
        usernameTh: user.value?.username?.th || '',
        usernameEn: user.value?.username?.en || '',
        tel: user.value?.tel || '',
        emailPersonal: user.value?.email?.personal || '',
        emailUniversity: user.value?.email?.university || '',
        photo: null
    }
    previewPhoto.value = user.value?.photo || ''
    errorMessage.value = ''
    successMessage.value = ''
    showEditModal.value = true
}

const handleCloseModal = () => {
    showEditModal.value = false
    formData.value = {
        usernameTh: '',
        usernameEn: '',
        tel: '',
        emailPersonal: '',
        emailUniversity: '',
        photo: null
    }
    previewPhoto.value = ''
    errorMessage.value = ''
    successMessage.value = ''
}

const handlePhotoChange = (event) => {
    const file = event.target.files[0]
    if (file) {
        if (!file.type.startsWith('image/')) {
            errorMessage.value = 'กรุณาเลือกไฟล์รูปภาพเท่านั้น'
            return
        }
        if (file.size > 2 * 1024 * 1024) { // 2MB
            errorMessage.value = 'ขนาดไฟล์ต้องไม่เกิน 2MB'
            return
        }
        formData.value.photo = file
        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => {
            previewPhoto.value = e.target.result
        }
        reader.readAsDataURL(file)
        errorMessage.value = ''
    }
}

const handleSubmit = async () => {
    try {
        isLoading.value = true
        errorMessage.value = ''
        successMessage.value = ''

        // Validate
        if (!formData.value.usernameTh || !formData.value.usernameEn) {
            errorMessage.value = 'กรุณากรอกชื่อผู้ใช้ (ไทยและอังกฤษ)'
            isLoading.value = false
            return
        }

        if (!formData.value.tel) {
            errorMessage.value = 'กรุณากรอกเบอร์โทรศัพท์'
            isLoading.value = false
            return
        }

        // Create FormData for file upload
        const data = new FormData()
        data.append('username[th]', formData.value.usernameTh)
        data.append('username[en]', formData.value.usernameEn)
        data.append('tel', formData.value.tel)
        data.append('email[personal]', formData.value.emailPersonal)
        data.append('email[university]', formData.value.emailUniversity)

        if (formData.value.photo) {
            data.append('photo', formData.value.photo)
        }

        console.log(data)

        // Call API
        const response = await fetch('http://localhost:8080/api/user/data', {
            method: 'PATCH',
            body: data,
            credentials: 'include'
        })

        if (response.status === 200) {
            successMessage.value = 'อัปเดตข้อมูลสำเร็จ!'
            // Refresh user data
            await auth.fetchUser()

            // Close modal after 1.5 seconds
            setTimeout(() => {
                handleCloseModal()
            }, 1500)
        }
    } catch (error) {
        console.error('Error updating profile:', error)
        errorMessage.value = error.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล'
    } finally {
        isLoading.value = false
    }
}

const handleImageLoad = () => {
    isLoading.value = false
}
</script>

<template>
    <div class="w-full max-w-7xl py-6 px-4">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-4xl font-extrabold text-gray-800 mb-2">โปรไฟล์ของฉัน</h1>
            <p class="text-gray-600">จัดการข้อมูลส่วนตัวและผลงานศิลปะของคุณ</p>
        </div>

        <!-- Profile Card -->
        <div class="bg-linear-to-br from-red-50 to-white rounded-2xl p-8 shadow-lg border border-red-100 mb-8">
            <div class="flex flex-col md:flex-row items-center md:items-start gap-8">
                <!-- Profile Image -->
                <div class="relative">
                    <div v-if="isLoading" class="w-full h-64 bg-gray-300 animate-pulse"></div>
                    <img v-show="!isLoading" :src="user?.photo || '/default-avatar.png'" alt="Profile Picture"
                        class="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-red-500 shadow-xl" @load="handleImageLoad">
                    <div class="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-white">
                    </div>
                </div>

                <!-- User Info -->
                <div class="flex-1 w-full">
                    <div class="mb-6">
                        <div class="flex gap-5">
                            <h2 class="text-3xl font-extrabold text-red-600 mb-1">{{ user?.username?.th || 'ชื่อผู้ใช้' }}</h2>
                            <button @click.stop="handleEdit"
                                class="bg-red-500 backdrop-blur-sm text-white p-2.5 rounded-xl shadow-lg transition-all hover:scale-110">
                                <Edit2 :size="20" />
                            </button>
                        </div>
                        <p class="text-gray-500 flex items-center gap-2">
                            <User :size="16" />
                            {{ user?.username?.en || 'Username' }}
                        </p>
                    </div>

                    <!-- Info Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Student ID -->
                        <div class="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                            <div class="bg-red-100 p-3 rounded-full">
                                <GraduationCap :size="24" class="text-red-600" />
                            </div>
                            <div>
                                <p class="text-xs text-gray-500 uppercase tracking-wide">รหัสนักศึกษา</p>
                                <p class="font-bold text-lg text-gray-800">{{ user?.studentId || '-' }}</p>
                            </div>
                        </div>

                        <!-- Phone -->
                        <div class="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                            <div class="bg-blue-100 p-3 rounded-full">
                                <Phone :size="24" class="text-blue-600" />
                            </div>
                            <div>
                                <p class="text-xs text-gray-500 uppercase tracking-wide">เบอร์โทรศัพท์</p>
                                <p class="font-bold text-lg text-gray-800">{{ user?.tel || '-' }}</p>
                            </div>
                        </div>

                        <!-- Personal Email -->
                        <div class="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                            <div class="bg-green-100 p-3 rounded-full">
                                <Mail :size="24" class="text-green-600" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-xs text-gray-500 uppercase tracking-wide">อีเมลส่วนตัว</p>
                                <p class="font-bold text-lg text-gray-800 truncate">{{ user?.email?.personal || '-' }}
                                </p>
                            </div>
                        </div>

                        <!-- University Email -->
                        <div class="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                            <div class="bg-purple-100 p-3 rounded-full">
                                <Mail :size="24" class="text-purple-600" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-xs text-gray-500 uppercase tracking-wide">อีเมลมหาวิทยาลัย</p>
                                <p class="font-bold text-lg text-gray-800 truncate">{{ user?.email?.university || '-' }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div class="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm mb-1">ผลงานทั้งหมด</p>
                        <p class="text-3xl font-bold text-gray-800">{{ totalArts }}</p>
                    </div>
                    <div class="bg-red-100 p-4 rounded-full">
                        <Palette :size="28" class="text-red-600" />
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm mb-1">ผลงานที่อนุมัติ</p>
                        <p class="text-3xl font-bold text-green-600">{{ approvedArts.length }}</p>
                    </div>
                    <div class="bg-green-100 p-4 rounded-full">
                        <Palette :size="28" class="text-green-600" />
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm mb-1">รอการอนุมัติ</p>
                        <p class="text-3xl font-bold text-yellow-600">{{ pendingArts }}</p>
                    </div>
                    <div class="bg-yellow-100 p-4 rounded-full">
                        <Palette :size="28" class="text-yellow-600" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Artworks Section -->
        <div class="mb-6">
            <h2 class="text-3xl font-bold text-gray-800 mb-2">ผลงานศิลปะที่ได้รับการอนุมัติ</h2>
            <p class="text-gray-600">ผลงานที่ได้รับการอนุมัติและแสดงในแกลเลอรี่สาธารณะ</p>
        </div>
        <!-- Artworks Grid -->
        <div v-if="approvedArts.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="art in approvedArts" :key="art._id">
                <Artcard :art="art" :showAddToCart="false" />
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 py-16">
            <div class="flex flex-col items-center justify-center">
                <div class="bg-gray-100 p-6 rounded-full mb-4">
                    <SearchX :size="64" class="text-gray-400" />
                </div>
                <h3 class="text-2xl font-bold text-gray-700 mb-2">ยังไม่มีผลงานที่ได้รับการอนุมัติ</h3>
                <p class="text-gray-500 mb-6">ส่งผลงานของคุณเพื่อรอการอนุมัติจากผู้ดูแลระบบ</p>
                <RouterLink to="/user/create/art" class="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-md"> เพิ่มผลงานใหม่
                </RouterLink>
            </div>
        </div>

        <!-- Edit Profile Modal -->
        <Teleport to="body">
            <Transition name="modal">
                <div v-if="showEditModal"
                    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <!-- Modal Header -->
                        <div
                            class="sticky top-0 bg-linear-to-r from-red-600 to-red-500 text-white p-6 rounded-t-2xl flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="bg-white/20 p-2 rounded-lg">
                                    <Edit2 :size="24" />
                                </div>
                                <div>
                                    <h3 class="text-2xl font-bold">แก้ไขข้อมูลโปรไฟล์</h3>
                                    <p class="text-red-100 text-sm">อัปเดตข้อมูลส่วนตัวของคุณ</p>
                                </div>
                            </div>
                            <button @click="handleCloseModal"
                                class="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
                                <X :size="24" />
                            </button>
                        </div>

                        <!-- Modal Body -->
                        <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
                            <!-- Alert Messages -->
                            <div v-if="errorMessage"
                                class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
                                <span class="text-xl">⚠️</span>
                                <span>{{ errorMessage }}</span>
                            </div>

                            <div v-if="successMessage"
                                class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-3">
                                <span class="text-xl">✓</span>
                                <span>{{ successMessage }}</span>
                            </div>

                            <!-- Profile Photo -->
                            <div class="space-y-3">
                                <label class="block text-sm font-semibold text-gray-700">รูปโปรไฟล์</label>
                                <div class="flex items-center gap-6">
                                    <img :src="previewPhoto || '/default-avatar.png'" alt="Preview"
                                        class="w-24 h-24 rounded-full object-cover border-4 border-red-500 shadow-lg">
                                    <div class="flex-1">
                                        <label
                                            class="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg cursor-pointer transition-colors border-2 border-dashed border-gray-300">
                                            <Upload :size="20" />
                                            <span class="font-medium">เลือกรูปภาพใหม่</span>
                                            <input type="file" @change="handlePhotoChange" accept="image/*"
                                                class="hidden">
                                        </label>
                                        <p class="text-xs text-gray-500 mt-2">รองรับไฟล์: JPG, PNG (ไม่เกิน 5MB)</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Username Thai -->
                            <div class="space-y-2">
                                <label class=" text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <User :size="16" class="text-red-600" />
                                    ชื่อผู้ใช้ (ภาษาไทย) <span class="text-red-600">*</span>
                                </label>
                                <input v-model="formData.usernameTh" type="text" required
                                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                                    placeholder="กรอกชื่อภาษาไทย">
                            </div>

                            <!-- Username English -->
                            <div class="space-y-2">
                                <label class=" text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <User :size="16" class="text-red-600" />
                                    ชื่อผู้ใช้ (ภาษาอังกฤษ) <span class="text-red-600">*</span>
                                </label>
                                <input v-model="formData.usernameEn" type="text" required
                                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                                    placeholder="Enter English name">
                            </div>

                            <!-- Phone -->
                            <div class="space-y-2">
                                <label class=" text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Phone :size="16" class="text-red-600" />
                                    เบอร์โทรศัพท์ <span class="text-red-600">*</span>
                                </label>
                                <input v-model="formData.tel" type="tel" required
                                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                                    placeholder="0xx-xxx-xxxx">
                            </div>

                            <!-- Email Personal -->
                            <div class="space-y-2">
                                <label class=" text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Mail :size="16" class="text-red-600" />
                                    อีเมลส่วนตัว
                                </label>
                                <input v-model="formData.emailPersonal" type="email"
                                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                                    placeholder="example@email.com">
                            </div>

                            <!-- Email University -->
                            <div class="space-y-2">
                                <label class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Mail :size="16" class="text-red-600" />
                                    อีเมลมหาวิทยาลัย
                                </label>
                                <input v-model="formData.emailUniversity" type="email"
                                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                                    placeholder="student@university.ac.th">
                            </div>

                            <!-- Action Buttons -->
                            <div class="flex gap-3 pt-4">
                                <button type="button" @click="handleCloseModal"
                                    class="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors">
                                    ยกเลิก
                                </button>
                                <button type="submit" :disabled="isLoading"
                                    class="flex-1 px-6 py-3 bg-linear-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                    <Loader v-if="isLoading" :size="20" class="animate-spin" />
                                    <span>{{ isLoading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง' }}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
    transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
    transform: scale(0.9);
}
</style>