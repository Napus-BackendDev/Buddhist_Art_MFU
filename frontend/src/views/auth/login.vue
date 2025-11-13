<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const email = ref('admin@mfu.ac.th')
const password = ref('admin123')
const setError = ref(null)
const isLoading = ref(false)
const rememberMe = ref(false)
const showPassword = ref(false)

const submitForm = async () => {
    isLoading.value = true
    setError.value = null
    try {
        await login(email.value, password.value)
        router.push('/')
    } catch (error) {
        setError.value = error.message
    } finally {
        isLoading.value = false
    }
}


const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value
}
</script>

<template>
    <div
        class="w-full min-h-screen flex items-center justify-center bg-[url('/Login-Backgroup.jpg')] bg-cover bg-center relative overflow-hidden">
        <div class="relative z-10 w-full max-w-md px-4">
            <!-- Login Card -->
            <div class="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <!-- Header with gradient -->
                <div class="bg-linear-to-r from-red-600 to-red-500 p-8 text-center">
                    <div class="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                        <LogIn :size="40" class="text-red-600" />
                    </div>
                    <h1 class="text-3xl font-extrabold text-white mb-2">ยินดีต้อนรับ</h1>
                    <p class="text-red-100">เข้าสู่ระบบเพื่อจัดการผลงานศิลปะของคุณ</p>
                </div>

                <!-- Form -->
                <form @submit.prevent="submitForm" class="p-8 space-y-6">
                    <!-- Email Input -->
                    <div>
                        <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
                            อีเมล
                        </label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail :size="20" class="text-gray-400" />
                            </div>
                            <input v-model="email" type="email" id="email" required
                                class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
                                placeholder="example@mfu.ac.th" />
                        </div>
                    </div>

                    <!-- Password Input -->
                    <div class=" flex flex-col">
                        <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
                            รหัสผ่าน  
                        </label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock :size="20" class="text-gray-400" />
                            </div>
                            <input v-model="password" :type="showPassword ? 'text' : 'password'" id="password" required
                                class="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
                                placeholder="••••••••" />
                            <button type="button" @click="togglePasswordVisibility"
                                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors">
                                <Eye v-if="!showPassword" :size="20" />
                                <EyeOff v-else :size="20" />
                            </button>
                        </div>
                    </div>

                    <!-- Remember me & Forgot password -->
                    <div class="flex items-center justify-between text-sm">
                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input v-model="rememberMe" type="checkbox"
                                class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer" />
                            <span class="text-gray-700">จดจำฉันไว้</span>
                        </label>
                        <a href="#" class="text-red-600 hover:text-red-700 font-semibold transition-colors">
                            ลืมรหัสผ่าน?
                        </a>
                    </div>

                    <div v-if="setError" class="text-red-500 text-sm mb-2">{{ setError }}</div>

                    <!-- Login Button -->
                    <button type="submit" :disabled="isLoading"
                        class="w-full bg-linear-to-r from-red-600 to-red-500 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:from-red-700 hover:to-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        <span v-if="!isLoading">เข้าสู่ระบบ</span>
                        <span v-else>กำลังเข้าสู่ระบบ...</span>
                        <LogIn v-if="!isLoading" :size="20" />
                    </button>
                </form>
            </div>

            <!-- Footer -->
            <p class="text-center text-black bg-white rounded-2xl py-2 text-sm mt-8">
                © 2025 Art Gallery. All rights reserved.
            </p>
        </div>
    </div>
</template>