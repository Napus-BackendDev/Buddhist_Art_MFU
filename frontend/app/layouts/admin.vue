<template>
    <header>
        <Navbar />
    </header>

    <main class="min-h-screen flex">
        <Sidebar />
        <div class="flex-1 w-full">
            <slot />
        </div>
    </main>

</template>