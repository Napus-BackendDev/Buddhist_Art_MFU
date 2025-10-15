<template>
    <div class="flex flex-col justify-center items-center text-cente px-30 space-y-8 py-8">
        <div class="flex flex-col items-center justify-center gap-4">
            <h1 class="text-5xl font-extrabold text-red-600">เกี่ยวกับเรา</h1>
            <h2 class="text-xl text-gray-600 max-w-3xl text-center">Art Gallery
                เป็นแพลตฟอร์มออนไลน์ที่เชื่อมโยงศิลปินและผู้รักศิลปะเข้าด้วยกัน
                เราเชื่อว่าศิลปะมีพลังในการสร้างแรงบันดาลใจและเปลี่ยนแปลงโลก</h2>
        </div>
        <div class="w-full grid grid-cols-1 md:grid-cols-2 p-8 gap-10 bg-gray-50 rounded-2xl">
            <div class="flex flex-col gap-2 justify-center">
                <h1 class="text-4xl text-red-600 font-bold">ที่มาของเรา</h1>
                <p class="text-lg text-gray-600 mt-4 ">Art Gallery ก่อตั้งขึ้นในปี 2024
                    ด้วยวิสัยทัศน์ที่จะสร้างพื้นที่ออนไลน์ที่ศิลปินสามารถแสดง และจำหน่ายผลงานของตนได้อย่างมีศักดิ์ศรี
                    พร้อมทั้งเปิดโอกาสให้ผู้คนได้เข้าถึงงานศิลปะคุณภาพสูง <br >
                    เราเริ่มต้นจากความเชื่อที่ว่าศิลปะไม่ควรจำกัดอยู่เพียงในแกลเลอรี่หรือพิพิธภัณฑ์เท่านั้น
                    แต่ควรเป็นส่วนหนึ่งของชีวิตประจำวันและเข้าถึงได้สำหรับทุกคน<br >
                    วันนี้เรามีศิลปินมากกว่า 200 คน และผลงานศิลปะกว่า 1,000 ชิ้น ครอบคลุมตั้งแต่จิตรกรรม ประติมากรรม
                    ไปจนถึงศิลปะดิจิทัล</p>
            </div>
            <img src="/images/about.jpg" class="rounded-2xl shadow-md w-full h-90 object-cover" >
        </div>
        <div class="flex flex-col items-center justify-center gap-4 ">
            <h1 class="text-5xl font-bold text-red-600"> ค่านิยมของเรา </h1>
            <p class="text-xl text-gray-600"> หลักการที่เราใช้ในการดำเนินงานและให้บริการ</p>
        </div>
        <div class="flex w-full justify-center  gap-10 ">
            <div class="border rounded-2xl p-6  flex flex-col items-center text-center gap-4">
                <div class="w-16 h-16 flex items-center justify-center rounded-full bg-red-500 text-white">
                    <Icon name="carbon:user-multiple" size="36" />
                </div>
                <h1 class="text-2xl font-extrabold text-red-600"> ชุมชนศิลปิน </h1>
                <p class="text-lg text-gray-600 max-w-3xl"> สร้างแพลตฟอร์มที่เชื่อมโยงศิลปินและผู้รักศิลปะเข้าด้วยกัน
                </p>
            </div>
            <div class="border rounded-2xl p-6  flex flex-col items-center text-center gap-4">
                <div class="w-16 h-16 flex items-center justify-center rounded-full bg-red-500 text-white">
                    <Icon name="material-symbols-light:target" size="52" />
                </div>
                <h1 class="text-2xl font-extrabold text-red-600"> คุณภาพเป็นเลิศ </h1>
                <p class="text-lg text-gray-600 max-w-3xl"> คัดสรรเฉพาะผลงานคุณภาพสูงที่ผ่านการตรวจสอบอย่างรอบคอบ </p>
            </div>
            <div class="border rounded-2xl p-6  flex flex-col items-center text-center gap-4">
                <div class="w-16 h-16 flex items-center justify-center rounded-full bg-red-500 text-white">
                    <Icon name="mdi-light:heart" size="42" />
                </div>
                <h1 class="text-2xl font-extrabold text-red-600"> ส่งเสริมศิลปะไทย </h1>
                <p class="text-lg text-gray-600 max-w-3xl"> มุ่งเน้นการสนับสนุนและเผยแพร่ผลงานศิลปินไทยสู่สายตาชาวโลก
                </p>
            </div>
        </div>
        <div class="flex flex-col items-center justify-center gap-4 ">
            <h1 class="text-5xl font-bold text-red-600"> ช่องทางติดต่อ </h1>
            <p class="text-xl text-gray-600"> หากมีคำถามหรือต้องการความช่วยเหลือ สามารถติดต่อเราได้ทุกเวลา </p>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>