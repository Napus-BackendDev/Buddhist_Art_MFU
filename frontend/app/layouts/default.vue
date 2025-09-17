<template>
    <div>
        <header class="top-0 w-full">
            <Navbar />
        </header>
        <main class="w-full flex flex-col justify-center ">
            <slot />
        </main>
        <footer class="bottom-0 w-full">
            <Footer />
        </footer>
    </div>
</template>