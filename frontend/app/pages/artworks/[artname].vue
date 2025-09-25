<template>
  <div class="flex flex-col justify-center items-center px-30 space-y-8 py-8">
    <NuxtLink
      class="self-start flex items-center px-6 py-3  hover:text-white hover:bg-red-600 duration-200 rounded-3xl gap-2"
      to="/artworks">
      <Icon name="material-symbols:arrow-left-alt-rounded" />
      <p>กลับไปหน้าผลงานศิลปะ</p>
    </NuxtLink>
    <div class="grid grid-cols-2 gap-10">
      <div id="image-section" class="flex flex-col gap-8">
        <img :src="artworkDetails?.picture" alt="Artwork Image" class="w-full h-auto rounded-lg shadow-md" />
        <div class="border rounded-xl p-4 gap-2 flex flex-col">
          <h1 class="text-xl text-red-600 font-extrabold">เกี่ยวกับศิลปิน</h1>
          <p class="text-xl font-bold">{{ artworkDetails?.user.username.th }}</p>
          <!-- <p>{{ artworkDetails?.user?.description }}</p> -->
        </div>
      </div>
      <div class="flex flex-col w-full gap-4">
        <div class="flex justify-between">
          <span class="inline-flex items-center text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
            {{ artworkDetails?.type }}
          </span>
          <span class="text-red-600 font-extrabold text-3xl">฿{{ (artworkDetails?.price) }}</span>
        </div>
        <div>
          <h1 class="text-3xl font-extrabold text-red-600">{{ artworkDetails?.artname }}</h1>
          <p class="text-gray-600">โดย {{ artworkDetails?.user.username.th }}</p>
        </div>
        <div class="border rounded-2xl p-4 flex flex-col gap-2">
          <h1 class="text-xl text-red-600 font-extrabold">รายละเอียดทางเทคนิค</h1>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="font-semibold">ขนาด: </p>
              <p class="text-gray-600">{{ artworkDetails?.size }}</p>
            </div>
            <div>
              <p class="font-semibold">เทคนิค:</p>
              <p class="text-gray-600">{{ artworkDetails?.technique }}</p>
            </div>
            <div>
              <p class="font-semibold">การนำเสนอ:</p>
              <p class="text-gray-600">{{ artworkDetails?.presentation }}</p>
            </div>
            <div>
              <p class="font-semibold">ประเภท:</p>
              <p class="text-gray-600">{{ artworkDetails?.type }}</p>
            </div>
          </div>
        </div>
        <div class="border rounded-2xl p-4 flex flex-col gap-2">
          <h1 class="text-xl text-red-600 font-extrabold">แนวคิดผลงาน</h1>
          <p class="text-gray-600">{{ artworkDetails?.concept }}</p>
        </div>
        
        <button class="px-6 py-3 rounded-xl inline-block text-center mt-2"
          :class="artworkDetails?.status === 'sold' ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-rose-500 text-white hover:bg-rose-600'"
          :disabled="artworkDetails?.status === 'sold'">
          <span v-if="artworkDetails?.status === 'sold'">จองแล้ว</span>
          <span v-else="artworkDetails?.status === 'available'">จองผลงานชิ้นนี้</span>
        </button>
      </div>
    </div>
    <section class="flex flex-col w-full justify-center gap-4 ">
      <h1 class="flex justify-center text-4xl font-extrabold text-red-600"> ผลงานที่เกี่ยวข้อง </h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 ">
        <NuxtLink v-for="art in artworks" :key="art._id" :to="`/artworks/${art.artname}`">
          <ArtworkCard :art="art" />
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const artworks = ref<Arts[]>([])

const { artname } = useRoute().params
const { artworkDetails } = useFetchArtworksDetail<ArtDetail>(artname as string)

watch(
  () => artworkDetails.value?.user.username.th,
  async (usernameTh) => {
    if (usernameTh) {
      const data = await $fetch<Arts[]>(`${config.public.apiUrl}/arts/user/${usernameTh}`)
      artworks.value = data ?? []
    }
  },
  { immediate: true }
)
</script>