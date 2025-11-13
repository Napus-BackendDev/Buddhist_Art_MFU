<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Upload, Image as ImageIcon, User as UserIcon } from 'lucide-vue-next'
import useUser from '@/composables/useUser'

const { createUserAdmin } = useUser()
const router = useRouter()

const usernameTh = ref('')
const usernameEn = ref('')
const password = ref('')
const emailPersonal = ref('')
const emailUniversity = ref('')
const studentId = ref('')
const tel = ref('')
const role = ref('user')

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
const canSubmit = computed(() => !!usernameTh.value && !!password.value && !!emailPersonal.value)

const userPreview = computed(() => ({
	username: { th: usernameTh.value || 'ชื่อผู้ใช้', en: usernameEn.value || 'Username' },
	studentId: studentId.value || '-',
	email: { personal: emailPersonal.value || '-', university: emailUniversity.value || '-' },
	photo: photoPreview.value || ''
}))

function resetForm() {
	usernameTh.value = ''
	usernameEn.value = ''
	password.value = ''
	emailPersonal.value = ''
	emailUniversity.value = ''
	studentId.value = ''
	tel.value = ''
	role.value = 'user'
	photoFile.value = null
	photoPreview.value = ''
}

function cancelCreate() {
	router.push('/admin/users')
}

async function submitNewUser() {
	if (!canSubmit.value) {
		alert('กรุณากรอก ชื่อผู้ใช้ รหัสผ่าน และอีเมล')
		return
	}

	try {
		isSubmitting.value = true
        const formdata = new FormData()

        formdata.append('username[th]', usernameTh.value)
        formdata.append('username[en]', usernameEn.value)
        formdata.append('password', password.value)
        formdata.append('email[personal]', emailPersonal.value)
        formdata.append('email[university]', emailUniversity.value)
        formdata.append('studentId', studentId.value)
        formdata.append('tel', tel.value)
        
        if (photoFile.value) {
            formdata.append('photo', photoFile.value)
        }

		await createUserAdmin(formdata)
		router.push('/admin/users')
	} catch (err) {
		console.error('Create user error:', err)
	} finally {
		isSubmitting.value = false
	}
}
</script>

<template>
	<div class="w-full p-6 space-y-6">
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- Form -->
			<div class="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md border border-gray-100">
				<form @submit.prevent="submitNewUser" class="space-y-6">
					<!-- Basic info -->
					<div class="bg-white rounded-xl shadow p-5 border border-gray-100">
						<div class="flex items-center gap-2 mb-4">
							<UserIcon class="w-5 h-5 text-red-600" />
							<h2 class="font-semibold">ข้อมูลผู้ใช้</h2>
						</div>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label class="block text-sm font-semibold mb-1">ชื่อผู้ใช้ (TH)<span class="text-red-500"> *</span></label>
								<input v-model="usernameTh" type="text" placeholder="ชื่อภาษาไทย"
									class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent" />
							</div>
							<div>
								<label class="block text-sm font-semibold mb-1">ชื่อผู้ใช้ (EN)</label>
								<input v-model="usernameEn" type="text" placeholder="English username"
									class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent" />
							</div>
							<div>
								<label class="block text-sm font-semibold mb-1">รหัสผ่าน<span class="text-red-500"> *</span></label>
								<input v-model="password" type="password" placeholder="รหัสผ่าน"
									class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent" />
							</div>
						</div>
					</div>

					<!-- Contact & IDs -->
					<div class="bg-white rounded-xl shadow p-5 border border-gray-100">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label class="block text-sm font-semibold mb-1">อีเมล (ส่วนตัว)<span class="text-red-500"> *</span></label>
								<input v-model="emailPersonal" type="email" placeholder="your@mail.com"
									class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent" />
							</div>
							<div>
								<label class="block text-sm font-semibold mb-1">อีเมล (มหาวิทยาลัย)</label>
								<input v-model="emailUniversity" type="email" placeholder="student@uni.edu"
									class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent" />
							</div>
							<div>
								<label class="block text-sm font-semibold mb-1">รหัสนักเรียน</label>
								<input v-model="studentId" type="text" placeholder="เช่น 6512345678"
									class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent" />
							</div>
							<div>
								<label class="block text-sm font-semibold mb-1">เบอร์ติดต่อ</label>
								<input v-model="tel" type="text" placeholder="0812345678"
									class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-transparent" />
							</div>
						</div>
					</div>

					<!-- Avatar upload -->
					<div class="bg-white rounded-xl shadow p-5 border border-gray-100">
						<div class="flex items-center gap-2 mb-4">
							<ImageIcon class="w-5 h-5 text-red-600" />
							<h2 class="font-semibold">รูปโปรไฟล์</h2>
						</div>
						<div class="flex items-center gap-4">
							<div class= "w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center bg-gray-50">
								<img v-if="photoPreview" :src="photoPreview" alt="Preview" class="w-full h-full object-cover" />
								<UserIcon v-else :size="48" class="text-gray-400" />
							</div>
							<label class="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer transition-colors">
								<Upload :size="18" />
								<span>อัปโหลดรูปโปรไฟล์</span>
								<input type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
							</label>
						</div>
						<p class="text-xs text-gray-500 mt-2">รองรับ JPG/PNG ขนาดไม่เกิน 2MB</p>
					</div>

					<!-- Actions -->
					<div class="flex gap-3 justify-end pt-2">
						<button type="button" @click="cancelCreate" class="px-4 py-2 rounded-lg border hover:bg-gray-50">ยกเลิก</button>
						<button type="button" @click="resetForm" class="px-4 py-2 rounded-lg border hover:bg-gray-50">ล้างข้อมูล</button>
						<button type="submit" :disabled="!canSubmit || isSubmitting" class="px-5 py-2 rounded-lg text-white"
							:class="isSubmitting || !canSubmit ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'">
							{{ isSubmitting ? 'กำลังบันทึก...' : 'สร้างผู้ใช้' }}
						</button>
					</div>
				</form>
			</div>

			<!-- Preview -->
			<aside class="lg:col-span-1">
				<div class="bg-white rounded-xl shadow p-5 border border-gray-100 sticky top-6">
					<h2 class="font-semibold mb-4">ตัวอย่างโปรไฟล์</h2>
					<div class="flex items-center gap-4">
						<div class="w-24 h-24 rounded-lg overflow-hidden bg-gray-50">
							<img v-if="userPreview.photo" :src="userPreview.photo" alt="avatar" class="w-full h-full object-cover" />
							<UserIcon v-else :size="48" class="text-gray-400" />
						</div>
						<div>
							<p class="font-semibold">{{ userPreview.username.th }}</p>
							<p class="text-sm text-gray-500">{{ userPreview.email.personal }}</p>
							<p class="text-xs text-gray-400 mt-1">{{ userPreview.role }}</p>
						</div>
					</div>
				</div>
			</aside>
		</div>
	</div>
</template>