<template>
    <UDashboardNavbar title="Users" icon="lucide:users" :ui="{ title: 'text-black' }">
        <template #right>
            <UButton icon="lucide:plus" color="primary" variant="solid" label="New User" :ui="{ base: 'text-white' }"
                @click="showCreateModal = true" />
        </template>
    </UDashboardNavbar>

    <div class="grid grid-rows gap-6 p-6 ">
        <UInput v-model="searchQuery" icon="material-symbols:search" size="xl" variant="outline" placeholder="Search"
            class="w-full max-w-xs" highlight
            :ui="{ base: 'bg-white text-black rounded-xl ring ring-inset ring-gray-300 focus-visible:ring-2 focus-visible:ring-red-500 transition duration-200' }" />

        <UTable ref="table" v-model:pagination="pagination" :data="filteredUsers || []" :columns="columns"
            :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
            class="flex-1 [&_thead_th]:text-black [&_tbody_td]:text-black">
            <template #actions-cell="{ row }">
                <UDropdownMenu :items="getDropdownActions(row.original)">
                    <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" aria-label="Actions"
                        :ui="{ base: 'text-black' }" />
                </UDropdownMenu>
            </template>
        </UTable>

        <div class="flex justify-end border-t border-default pt-4">
            <UPagination :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
                :items-per-page="table?.tableApi?.getState().pagination.pageSize" :total="filteredUsers.length"
                @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)" />
        </div>
    </div>

    <!-- Create Modal -->
    <div v-if="showCreateModal" class="absolute inset-0 bg-black/40 flex justify-center items-center z-50 p-12">
        <UCard class="bg-white text-black w-full max-w-lg rounded-2xl shadow-xl relative max-h-screen overflow-y-auto">
            <UButton icon="i-lucide-x" variant="ghost" color="neutral" class="absolute top-3 right-3"
                @click="closeCreateModal" />

            <div class="p-6 flex flex-col gap-6">
                <h2 class="text-xl font-semibold text-center">เพิ่มผู้ใช้</h2>
                <form class="grid grid-cols-1 gap-4" @submit.prevent="saveUser">
                    <div class="flex flex-col space-y-4">
                        <!-- Username (TH) -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-semibold text-gray-700">ชื่อผู้ใช้ (ไทย)
                                <label class="text-error">*</label>
                            </label>
                            <UInput v-model="userData.username.th" variant="outline" required
                                :ui="{ base: 'bg-white text-black' }" />
                        </div>

                        <!-- Username (EN) -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-semibold text-gray-700">ชื่อผู้ใช้ (อังกฤษ)
                                <label class="text-error">*</label>
                            </label>
                            <UInput v-model="userData.username.en" variant="outline" required
                                :ui="{ base: 'bg-white text-black' }" />
                        </div>

                        <!-- Password -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-semibold text-gray-700">รหัสผ่าน
                                <label class="text-error">*</label>
                            </label>
                            <UInput v-model="userData.password" type="password" variant="outline" required
                                :ui="{ base: 'bg-white text-black' }" />
                        </div>

                        <!-- Email (Personal) -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-semibold text-gray-700">อีเมล (ส่วนตัว)
                                <label class="text-error">*</label>
                            </label>
                            <UInput v-model="userData.email.personal" type="email" variant="outline" required
                                :ui="{ base: 'bg-white text-black' }" />
                        </div>

                        <!-- Email (University) -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-semibold text-gray-700">อีเมล (มหาวิทยาลัย)
                                <label class="text-error">*</label>
                            </label>
                            <UInput v-model="userData.email.university" type="email" variant="outline" required
                                :ui="{ base: 'bg-white text-black' }" />
                        </div>

                        <!-- Student ID -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-semibold text-gray-700">รหัสนักศึกษา
                                <label class="text-error">*</label>
                            </label>
                            <UInput v-model="userData.studentId" variant="outline" required
                                :ui="{ base: 'bg-white text-black' }" />
                        </div>

                        <!-- Phone Number -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-semibold text-gray-700">เบอร์โทรศัพท์
                                <label class="text-error">*</label>
                            </label>
                            <UInput v-model="userData.tel" variant="outline" required
                                :ui="{ base: 'bg-white text-black' }" />
                        </div>

                        <!-- Photo -->
                        <div class="flex flex-col space-y-2">
                            <label class="text-sm font-semibold text-gray-700">รูปโปรไฟล์
                                <label class="text-error">*</label>
                            </label>
                            <UInput type="file" accept="image/*" :required="!isEditing"
                                :ui="{ base: 'bg-white text-black' }" @change="onFileChange" />
                        </div>
                    </div>

                    <div class="flex justify-end gap-2 mt-4">
                        <UButton label="Cancel" color="neutral" variant="soft" @click="closeCreateModal" />
                        <UButton label="Create" color="primary" type="submit" :loading="isCreating" />
                    </div>
                </form>
            </div>
        </UCard>
    </div>

    <!-- View Modal -->
    <div v-if="showViewModal" class="absolute inset-0 bg-black/40 flex justify-center items-center z-50 p-12">
        <UCard
            class="bg-white text-black w-full max-w-lg rounded-2xl shadow-xl relative overflow-hidden max-h-screen overflow-y-auto">
            <UButton icon="i-lucide-x" variant="ghost" color="neutral" class="absolute top-3 right-3 z-10"
                @click="showViewModal = false" />

            <div class="flex flex-col gap-6 p-6">
                <img :src="selectedUser?.photo ? encodeURI(selectedUser?.photo) : ''" alt="User Image"
                    class="w-full object-cover border border-gray-200 rounded-xl" />
                <div class="grid grid-cols-1 gap-4">
                    <div class="border border-gray-300 rounded-lg p-3">
                        <p class="text-sm text-gray-500 font-medium">Name</p>
                        <p class="text-base font-semibold">{{ selectedUser?.username?.th ?? "" }}</p>
                    </div>

                    <div class="border border-gray-300 rounded-lg p-3">
                        <p class="text-sm text-gray-500 font-medium">Artist</p>
                        <p class="text-base font-semibold">{{ selectedUser?.email.personal }}</p>
                    </div>

                    <div class="border border-gray-300 rounded-lg p-3">
                        <p class="text-sm text-gray-500 font-medium">Price</p>
                        <p class="text-base font-semibold">{{ selectedUser?.tel }}</p>
                    </div>

                    <div class="border border-gray-300 rounded-lg p-3">
                        <p class="text-sm text-gray-500 font-medium">Status</p>
                        <p class="text-base font-semibold">{{ selectedUser?.role }}</p>
                    </div>
                </div>
            </div>
        </UCard>
    </div>

</template>

<script setup lang="ts">
import type { TableColumn, DropdownMenuItem } from '@nuxt/ui';
import { getPaginationRowModel } from '@tanstack/vue-table';
import { ref, h } from 'vue';
import { UUser, UButton } from '#components';

const table = useTemplateRef('table');
const config = useRuntimeConfig()

const showCreateModal = ref(false)
const showViewModal = ref(false)

const isCreating = ref(false)
const isEditing = ref(false)

const editingId = ref<string | null>(null)
const selectedUser = ref<User | null>(null)
const searchQuery = ref('')

definePageMeta({
    layout: 'admin'
})

const userData = reactive({
    username: {
        th: '',
        en: ''
    },
    password: '',
    email: {
        personal: '',
        university: ''
    },
    studentId: '',
    tel: '',
    photo: null as File | null
})

function resetUserData() {
    Object.assign(userData, {
        username: {
            th: '',
            en: ''
        },
        password: '',
        email: {
            personal: '',
            university: ''
        },
        studentId: '',
        tel: '',
        photo: null as File | null
    })
}

const pagination = ref({
    pageIndex: 0,
    pageSize: 5
})

// Fetch
const {
    data: users,
    refresh
} = useFetch<User[]>(`${config.public.apiUrl}/admin/user`, {
    credentials: "include",
    transform: (data) => data.filter((user: User) => user.role !== 'admin')
});

// Create & Update
async function saveUser() {
    isCreating.value = true
    try {
        const form = new FormData()
        Object.entries(userData).forEach(([key, value]) => {
            if (value !== null) {
                if (key === 'username') {
                    form.append(`${key}[th]`, (value as { th: string }).th);
                    form.append(`${key}[en]`, (value as { en: string }).en);
                } else if (key === 'email') {
                    form.append(`${key}[personal]`, (value as { personal: string }).personal);
                    form.append(`${key}[university]`, (value as { university: string }).university);
                } else {
                    form.append(key, value as string | Blob);
                }
            }
        })

        if (isEditing.value && editingId.value) {
            // Update
            await $fetch(`${config.public.apiUrl}/admin/user/${editingId.value}`, {
                method: "PATCH",
                body: form,
                credentials: "include",
            })
        } else {
            // Create
            await $fetch(`${config.public.apiUrl}/admin/user/register`, {
                method: "POST",
                body: form,
                credentials: "include",
            })
        }

        await refresh()
        closeCreateModal()
    } catch (err) {
        console.error("Save user failed:", err)
    } finally {
        isCreating.value = false
    }
}

// Delete
async function deleteUser(id: string) {
    try {
        await $fetch(`${config.public.apiUrl}/admin/user/${id}`, {
            method: "DELETE",
            credentials: "include",
        })
        await refresh()
    } catch (err) {
        console.error("Delete user failed:", err)
    }
}

const filteredUsers = computed(() => {
    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return users.value || []

    return (users.value || []).filter((user) => {
        const name = user.username?.th?.toLowerCase() || ''
        const id = user.studentId?.toLowerCase() || ''
        const email = user.email?.personal?.toLowerCase() || ''
        const tel = user.tel?.toLowerCase() || ''
        const role = user.role?.toLowerCase() || ''

        return [name, id, email, tel, role].some((field) => field.includes(q))
    })
})

function onFileChange(e: Event) {
    const target = e.target as HTMLInputElement
    if (target.files && target.files[0]) {
        userData.photo = target.files[0]
    }
}

function onView(user: User) {
    selectedUser.value = user
    showViewModal.value = true
}

function closeCreateModal() {
    showCreateModal.value = false
    isEditing.value = false
    editingId.value = null
    resetUserData();
}

async function onEdit(user: User) {
    isEditing.value = true
    editingId.value = user._id
    showCreateModal.value = true

    Object.assign(userData, {
        username: {
            th: user.username.th,
            en: user.username.en,
        },
        password: user.password,
        email: {
            personal: user.email.personal,
            university: user.email.university
        },
        studentId: user.studentId,
        tel: user.tel,
        photo: null as File | null
    })
}

const columns: TableColumn<User>[] = [
    {
        header: 'ID',
        cell: ({ row }) => {
            const globalIndex = pagination.value.pageIndex * pagination.value.pageSize + row.index + 1
            return h('p', {}, globalIndex)
        }
    },
    {
        header: 'Name',
        cell: ({ row }) => {
            const { username, studentId, photo } = row.original;
            return (
                h(UUser,
                    {
                        name: username.th,
                        description: studentId,
                        avatar: { src: encodeURI(photo) },
                        ui: {
                            name: 'text-normal text-black',
                            description: 'text-sm text-gray-500',
                        }
                    }
                )
            )
        }
    },
    {
        header: 'Email',
        accessorKey: 'email.personal',
    },
    {
        header: 'Phone',
        accessorKey: 'tel',
    },
    {
        header: 'Role',
        accessorKey: 'role',
    },
    {
        header: 'Actions',
        id: 'actions',
    }
]

function getDropdownActions(user: User): DropdownMenuItem[] {
    return [
        [
            {
                label: 'View',
                icon: 'lucide:eye',
                onClick: () => onView(user),
            },
            {
                label: 'Edit',
                icon: 'i-lucide-edit',
                onClick: () => onEdit(user),
            },
            {
                label: 'Delete',
                icon: 'i-lucide-trash',
                color: 'error',
                onClick: () => deleteUser(user._id),
            }
        ]
    ]
}

</script>