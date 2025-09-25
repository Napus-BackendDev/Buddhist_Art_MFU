<template>
  <section id="Introduction" class=" py-8 pb-16 w-full">
    <div class="flex flex-col items-center gap-4">
      <h1 class="text-4xl md:text-6xl leading-tight font-extrabold text-red-600">
        ค้นพบผลงานศิลปะ<br class="hidden md:block" />ที่ไม่เหมือนใคร
      </h1>
      <p class="max-w-3xl text-gray-600 text-base md:text-lg">
        แพลตฟอร์มซื้อขายผลงานศิลปะออนไลน์ที่รวบรวมผลงานจากศิลปินมากความสามารถ
        สามารถ พบกับคอลเลกชันที่หลากหลายและเป็นเอกลักษณ์
      </p>
    </div>

    <div class="mt-8 flex justify-center">
      <div class="w-full max-w-3xl flex items-stretch shadow-sm">
        <div class="relative flex-1">
          <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">🔎</span>
          <input type="text" placeholder="ค้นหาผลงานศิลปะ, ศิลปิน, หรือหมวดหมู่..."
            class="w-full border rounded-l-xl pl-10 pr-4 py-3 focus:outline-none" />
        </div>
        <button class="px-6 py-3 bg-rose-500 text-white rounded-r-xl hover:bg-rose-600">ค้นหา</button>
      </div>
    </div>

    <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-10">
      <div v-for="type in ArtTypes" :key="type.name"
        class="bg-green rounded-2xl shadow-sm border px-6 py-6 flex items-center gap-4 justify-start text-left">
        <div
          class="w-14 h-14 rounded-full flex items-center justify-center text-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
          {{ type.icon }}
        </div>
        <div>
          <div class="text-rose-600 font-semibold">{{ type.label }}</div>
          <div class="text-gray-500 text-sm">{{ type.en }}</div>
        </div>
      </div>
    </div>
  </section>

  <section id="ArtGallery" class="mt-8">
    <div class="text-center mb-8">
      <h2 class="text-3xl md:text-4xl font-extrabold text-red-600">ผลงานศิลปะเด่น</h2>
      <h3 class="text-gray-600 mt-2">คัดสรรผลงานคุณภาพสูงจากศิลปินชั้นนำ</h3>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 px-10">
      <NuxtLink v-for="art in artworks" :key="art._id" :to="`/artworks/${art.artname}`">
        <ArtworkCard :art="art" />
      </NuxtLink>
    </div>
  </section>

  <footer class="flex items-center justify-center my-7">
    <NuxtLink to="/artworks"
      class=" px-6 py-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 inline-block text-center">
      ดูผลงานทั้งหมด
    </NuxtLink>
  </footer>
</template>

<script setup lang="ts">

const { artworks, isLoading, error, fetchArtworks } = await useFetchArtworks<Arts[]>();


const uniqueTypes = computed(() => { return [...new Set(artworks.value?.map(art => art.type) ?? [])] })

const ArtTypes = [
  { name: 'painting', label: 'จิตรกรรม', en: 'Painting', icon: '🖌️' },
  { name: 'sculpture', label: 'ประติมากรรม', en: 'Sculpture', icon: '🗿' },
  { name: 'photography', label: 'การถ่ายภาพ', en: 'Photography', icon: '📷' },
  { name: 'digital', label: 'ศิลปะดิจิทัล', en: 'Digital Art', icon: '🖼️' },
]
</script>