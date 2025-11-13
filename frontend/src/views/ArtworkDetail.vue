<script setup>
import { RouterLink, useRoute } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import { ArrowLeft, Calendar } from 'lucide-vue-next';
import { formatDate } from '@/utils/formatData.js';
import { formatPrice } from '@/utils/formatPrice.js';
import useArtwork from '@/composables/useArtwork';
import ArtworksCard from '@/components/ArtworkCard/ArtworkCard.vue';

const router = useRoute();
const artwork = ref(null);
const artworksBySameOwner = ref([]);
const { fetchArtworksById, fetchArtworksByOwner } = useArtwork();

const loadArtworks = async () => {
    try {
        artwork.value = await fetchArtworksById(router.params.id);

        if (artwork.value?.owner?._id) {
            const data = await fetchArtworksByOwner(artwork.value.owner._id);
            artworksBySameOwner.value = data.filter(a => a.approvalStatus === 'approved' && a._id !== artwork.value._id);
        }
    } catch (error) {
        console.error('Error fetching artwork data:', error);
    }
};

onMounted(loadArtworks);

watch(() => router.params.id, (newId, oldId) => {
    if (newId !== oldId) {
        loadArtworks();
    }
});

</script>

<template>
    <RouterLink to="/artwork" class="flex gap-3 hover:bg-red-500 hover:text-white p-3 rounded-2xl transition ">
        <ArrowLeft />
        กลับไปหน้าผลงานศิลปะ
    </RouterLink>
    <main class="w-full grid grid-cols-2 gap-8 my-5">
        <div class="flex flex-col gap-8">
            <img :src="artwork?.photo" alt="Artwork Image" class="w-full h-auto rounded-lg shadow-lg" />
            <div class="border rounded-xl p-4 gap-2">
                <h1 class="text-xl text-red-600 font-extrabold">เกี่ยวกับศิลปิน</h1>
                <p class="text-xl font-bold">{{ artwork?.owner?.username?.th }}</p>
            </div>
        </div>
        <div class="space-y-8">
            <header class="flex flex-col gap-1">
                <div class="flex justify-between items-center">
                    <span class="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{{
                        artwork?.type.th }}</span>
                    <h1 class="text-red-600 font-extrabold text-3xl">฿ {{ formatPrice(artwork?.price) }}</h1>
                </div>
                <div>
                    <h1 class="text-3xl font-extrabold text-red-600">{{ artwork?.artname.th }}</h1>
                    <p class="text-gray-600 text-2xl">โดย {{ artwork?.owner?.username?.th }}</p>
                </div>
                <div class="flex">
                    <span class="flex items-center gap-2 text-gray-600">
                        <Calendar size="20" /> {{ formatDate(artwork?.createdAt) }}
                    </span>
                    <!-- <span>ยอดวิว: {{ artwork?.views }}</span> -->
                </div>
            </header>
            <div class="border rounded-xl p-4 ">
                <h1 class="text-red-600 text-xl font-bold">แนวคิดผลงาน</h1>
                <p class="text-gray-600">{{ artwork?.concept.th }}</p>
            </div>
            <div class="border rounded-xl p-4 space-y-4">
                <h1 class="text-red-600 text-xl font-bold">รายละเอียดทางเทคนิค</h1>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <p class="font-semibold">ขนาด: </p>
                        <p class="text-gray-600">{{ artwork?.size }}</p>
                    </div>
                    <div>
                        <p class="font-semibold">เทคนิค:</p>
                        <p class="text-gray-600">{{ artwork?.technique.th }}</p>
                    </div>
                    <div>
                        <p class="font-semibold">การนำเสนอ:</p>
                        <p class="text-gray-600">{{ artwork?.presentation.th }}</p>
                    </div>
                    <div>
                        <p class="font-semibold">ประเภท:</p>
                        <p class="text-gray-600">{{ artwork?.type.th }}</p>
                    </div>
                </div>
            </div>
            <button class="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition">
                เพิ่มลงในตะกร้าสินค้า
            </button>
        </div>
    </main>
    <footer class="w-full space-y-4">
        <h1 class="text-center text-4xl font-extrabold text-red-600"> ผลงานที่เกี่ยวข้อง </h1>
        <div class="grid grid-cols-3 gap-4">
            <RouterLink v-for="art in artworksBySameOwner" :key="art._id"
                :to="{ name: 'artworkDetail', params: { id: art._id } }">
                <ArtworksCard :art="art" :isInCart="false" />
            </RouterLink>
        </div>
    </footer>
</template>