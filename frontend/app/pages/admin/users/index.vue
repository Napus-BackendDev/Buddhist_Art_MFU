<template>
    <UDashboardNavbar title="Users" icon="lucide:users" :ui="{ title: 'text-black' }">
        <template #right>
            <UButton icon="lucide:plus" color="primary" variant="solid" label="New User" :ui="{ base: 'text-white' }" />
        </template>
    </UDashboardNavbar>
    <div class="grid grid-rows gap-6 p-6 ">
        <UInput icon="material-symbols:search" size="xl" variant="outline" placeholder="Fillter" class="w-full max-w-xs"
            highlight
            :ui="{ base: 'bg-white text-black rounded-xl ring ring-inset ring-gray-300 focus-visible:ring-2 focus-visible:ring-red-500 transition duration-200' }" />

        <UTable ref="table" v-model:pagination="pagination" :data="users || []" :columns="columns" :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }" class="flex-1">
            <template #name-cell="{ row }">
                <div class="flex items-center gap-3">
                    <UAvatar :src="row.original.photo" size="lg" />
                    <div class="flex flex-col">
                        <p class="font-medium text-highlighted">
                            {{ row.original.username.th }}
                        </p>
                        <p>
                            {{ row.original.username.en }}
                        </p>
                    </div>
                </div>
            </template>
            <template #action-cell="{ row }">
                <UDropdownMenu :items="getDropdownActions()">
                    <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" aria-label="Actions" :ui="{base: 'text-black'}"/>
                </UDropdownMenu>
            </template>
        </UTable>

        <div class="flex justify-end border-t border-default pt-4">
            <UPagination :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
                :items-per-page="table?.tableApi?.getState().pagination.pageSize"
                :total="table?.tableApi?.getFilteredRowModel().rows.length"
                @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from '@nuxt/ui'
import { getPaginationRowModel } from '@tanstack/vue-table'

const table = useTemplateRef('table')
const config = useRuntimeConfig()
definePageMeta({
    layout: 'admin'
})

const pagination = ref({
    pageIndex: 0,
    pageSize: 5
})

function encodeImageUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    urlObj.pathname = urlObj.pathname
      .split('/')
      .map(segment => encodeURIComponent(segment))
      .join('/');
    return urlObj.toString();
  } catch (error) {
    console.warn('Invalid URL:', url);
    return url;
  }
}


interface User {
    _id: string;
    photo: string;
    username: Localization;
    studentId: string;
    email: Email;
    role: string;
    createdAt: string;
}


const { data: users, pending: isLoading, error, refresh: fetchUser } = useFetch<User[]>(`${config.public.apiUrl}/admin/user`, { credentials: "include" , transform: (data) => data.filter((user: User) => user.role !== 'admin')});

console.log(users)
console.log(users.value)

function refreshUserList() {
    fetchUser()
}


const columns: TableColumn<User>[] = [
    {
        header: 'ID'
    },
    {
        header: 'Name',
        cell: ({ row }) => {
            const { username, studentId, photo } = row.original
            return h('div', { class: 'flex items-center gap-3' }, [
                h('UAvatar', { src: encodeImageUrl(row.original.photo), size: 'lg' }),
                h('div', undefined, [
                    h('p', { class: 'font-medium text-highlighted text-black' }, username.th),
                    h('p', undefined, studentId)
                ])
            ])
        }
    },
    {
        accessorKey: 'email.personal',
        header: 'Email'
    },
    {
        accessorKey: 'tel',
        header: 'Phone'
    },
    {
        accessorKey: 'role',
        header: 'Role'
    },
    {
        id: 'action'
    }
]

function getDropdownActions(): DropdownMenuItem[] {
    return [
        [
            {
                label: 'View',
                icon: 'lucide:eye',
            },
            {
                label: 'Edit',
                icon: 'i-lucide-edit'
            },
            {
                label: 'Delete',
                icon: 'i-lucide-trash',
                color: 'error'
            }
        ]
    ]
}
</script>