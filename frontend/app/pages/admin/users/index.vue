<template>
    <UDashboardNavbar title="Users" icon="i-lucide-users" :ui="{ title: 'text-black' }" />
    <div class="grid grid-rows gap-6 px-10 py-8">
        <UCard :ui="{ root: 'bg-gray-50' }">
            <h2 class="text-lg font-medium">Total Users</h2>
            <p class="text-2xl font-bold">512</p>
        </UCard>
        <UCard :ui="{ root: 'bg-gray-50' }">
            <h1 class="text-2xl font-medium">User List</h1>

            <!-- Loading State -->
            <div v-if="isLoading" class="flex justify-center items-center py-8">
                <USpinner size="lg" />
                <span class="ml-2">กำลังโหลดข้อมูลผู้ใช้...</span>
            </div>


            <UTable v-else :data="users || []" :columns="columns" class="flex-1">
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
                    <UDropdownMenu :items="getDropdownActions(row.original)">
                        <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost"
                            aria-label="Actions" />
                    </UDropdownMenu>
                </template>
            </UTable>

        </UCard>
    </div>
</template>

<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from '@nuxt/ui'
import { useClipboard } from '@vueuse/core'
const config = useRuntimeConfig()
definePageMeta({
    layout: 'admin'
})
interface User {
    _id: string;
    photo: string;
    username: Localization;
    studentId: string;
    email: Email;
    role: string;
    createdAt: string;
}


const { data: users, pending: isLoading, error, refresh: fetchUser } = useFetch<User[]>(`${config.public.apiUrl}/admin/user`, { credentials: "include" });

console.log(users)
console.log(users.value)

function refreshUserList() {
    fetchUser()
}

const toast = useToast()
const { copy } = useClipboard()

const columns: TableColumn<User>[] = [
    {
        header: 'Username',
        cell: ({ row }) => {
            const username = row.original.username
            return `${username.th} (${username.en})`
        }
    },
    {
        accessorKey: 'studentId',
        header: 'Student ID'
    },
    {
        accessorKey: 'email.university',
        header: 'Email'
    },
    {
        accessorKey: 'role',
        header: 'Role'
    },
    {
        accessorKey: 'createdAt',
        header: 'Created At'
    },
    {
        id: 'action'
    }
]

function getDropdownActions(user: User): DropdownMenuItem[][] {
    return [
        [
            {
                label: 'Copy user Id',
                icon: 'i-lucide-copy',
                onSelect: () => {
                    copy(user.studentId.toString())

                    toast.add({
                        title: 'User Student ID copied to clipboard!',
                        color: 'success',
                        icon: 'i-lucide-circle-check'
                    })
                }
            }
        ],
        [
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