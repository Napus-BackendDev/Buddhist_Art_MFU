<template>
    <UDashboardSidebar collapsible resizable :ui="{ footer: 'border-t border-default' }">

        <template #default="{ collapsed }">
            <UNavigationMenu :collapsed="collapsed" :items="items[0]" orientation="vertical" />
            <UNavigationMenu :collapsed="collapsed" :items="items[1]" orientation="vertical" class="mt-auto" />
        </template>

        <template #footer="{ collapsed }">
            <UButton :avatar="{
                src: 'https://github.com/benjamincanac.png'
            }" :label="collapsed ? undefined : 'Benjamin'" color="neutral" variant="ghost" class="w-full"
                :block="collapsed" />
        </template>
    </UDashboardSidebar>
</template>



<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[][] = [[{
    label: 'Dashboard',
    icon: 'i-lucide-house',
    to: '/admin/dashboard',
}, {
    label: 'Artworks',
    icon: 'i-lucide-brush',
    to: '/admin/artworks'
}, {
    label: 'Users',
    to: '/admin/users',
    icon: 'i-lucide-users'
}, {
    label: 'News',
    icon: 'i-lucide-newspaper',
    to: '/admin/news'
}], [{
    label: 'Feedback',
    icon: 'i-lucide-message-circle',
    to: 'https://github.com/nuxt-ui-templates/dashboard',
    target: '_blank'
}, {
    label: 'Help & Support',
    icon: 'i-lucide-info',
    to: 'https://github.com/nuxt/ui',
    target: '_blank'
}]]
</script>