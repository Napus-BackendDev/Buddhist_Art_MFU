<script setup>
import { useCartStore } from '@/stores/cartStore'
import { useRouter, RouterLink } from 'vue-router'
import { computed, ref } from 'vue'
import { ShoppingCart, Trash2, ArrowLeft, Loader } from 'lucide-vue-next'
import useOrder from '@/composables/useOrder'

const router = useRouter()
const { submitOrder } = useOrder()
const cartStore = useCartStore()
const buyer = ref({ username: '', email: '', idCard: '', address: '', tel: '' })

const isSubmitting = ref(false)

const checkout = async () => {
    if (cartStore.totalItems === 0) {
        alert('กรุณาเลือกผลงานก่อน')
        return
    }

    const data = {
        username: buyer.value.username,
        email: buyer.value.email,
        tel: buyer.value.tel,
        address: buyer.value.address,
        orderArt: cartStore.items.map(item => item._id)
    }

    try {
        isSubmitting.value = true
        await submitOrder(data)
        alert('สั่งซื้อเรียบร้อย!')
        cartStore.clearCart()
        router.push('/artwork')
    } catch (err) {
        console.error('Checkout error:', err)
        alert('เกิดข้อผิดพลาดในการสั่งซื้อ กรุณาลองอีกครั้ง')
    } finally {
        isSubmitting.value = false
    }
}

const removeFromCart = (item) => {
    cartStore.removeFromCart(item._id)
}

const totalPrice = computed(() => {
    return cartStore.items.reduce((sum, item) => sum + (Number(item.price) || 0), 0)
})

</script>

<template>
    <!-- Header -->
    <RouterLink to="/artwork" class="flex gap-3 hover:bg-red-500 hover:text-white p-3 rounded-2xl transition ">
        <ArrowLeft />
        ตะกร้าสินค้า
    </RouterLink>
    
    <main class="w-full py-8 px-4">
        <div v-if="cartStore.items.length === 0" class="text-center py-16">
            <ShoppingCart size="64" class="text-gray-300 mx-auto mb-4" />
            <h3 class="text-xl font-semibold text-gray-500 mb-2">ตะกร้าว่างเปล่า</h3>
            <p class="text-gray-400 mb-6">ยังไม่มีสินค้าในตะกร้า กรุณาเลือกผลงานศิลปะ</p>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- รายการสินค้า -->
            <div class="lg:col-span-2 space-y-4">
                <div v-for="item in cartStore.items" :key="item._id" class="bg-white rounded-lg shadow p-4 flex gap-4">
                    <img :src="item.photo || '/placeholder-art.png'" :alt="item.artname?.th || item.artname?.en"
                        class="w-24 h-24 object-cover rounded" />

                    <div class="flex-1">
                        <h3 class="font-bold text-lg">{{ item.artname?.th || item.artname?.en || 'Untitled' }}</h3>
                        <p class="text-gray-600 text-sm">โดย {{ item.owner?.username?.th || item.owner?.username?.en ||
                            'Unknown' }}</p>
                        <p class="text-red-600 font-bold mt-2">฿{{ Number(item.price).toLocaleString('th-TH') }}</p>
                    </div>

                    <button @click="removeFromCart(item)" class="text-red-500 hover:text-red-700 transition self-start">
                        <Trash2 size="20" />
                    </button>
                </div>
            </div>

            <!-- ฟอร์มสั่งซื้อ -->
            <div class="lg:col-span-1">
                <div class="bg-white rounded-lg shadow p-6 sticky top-4">
                    <h2 class="text-2xl font-bold mb-4">สรุปคำสั่งซื้อ</h2>

                    <div class="border-b pb-4 mb-4">
                        <div class="flex justify-between mb-2">
                            <span class="text-gray-600">จำนวนสินค้า</span>
                            <span class="font-semibold">{{ cartStore.items.length }} ชิ้น</span>
                        </div>
                        <div class="flex justify-between text-lg font-bold">
                            <span>ยอดรวม</span>
                            <span class="text-red-600">฿{{ totalPrice.toLocaleString('th-TH') }}</span>
                        </div>
                    </div>

                    <form @submit.prevent="checkout" class="space-y-4">
                        <div>
                            <label class="block text-sm font-semibold mb-2">ชื่อผู้ซื้อ</label>
                            <input type="text" v-model="buyer.username" placeholder="กรอกชื่อ-นามสกุล"
                                class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required />
                        </div>

                        <div>
                            <label class="block text-sm font-semibold mb-2">อีเมล</label>
                            <input type="email" v-model="buyer.email" placeholder="กรอกอีเมล"
                                class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required />
                        </div>

                        <div>
                            <label class="block text-sm font-semibold mb-2">เบอร์โทรศัพท์</label>
                            <input type="tel" v-model="buyer.tel" placeholder="0XX-XXX-XXXX"
                                class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required />
                        </div>

                        <div>
                            <label class="block text-sm font-semibold mb-2">ที่อยู่จัดส่ง</label>
                            <textarea v-model="buyer.address" placeholder="กรอกที่อยู่จัดส่ง"
                                class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                rows="3" required></textarea>
                        </div>

                        <button type="submit"
                            :disabled="isSubmitting"
                            class="w-full py-3 rounded-lg font-semibold transition flex items-center justify-center"
                            :class="isSubmitting ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'">
                            <Loader v-if="isSubmitting" class="animate-spin mr-2" />
                            <span>{{ isSubmitting ? 'กำลังส่งคำสั่งซื้อ...' : 'ยืนยันการสั่งซื้อ' }}</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </main>
</template>