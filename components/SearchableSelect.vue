<template>
  <div class="relative" ref="dropdownRef">
    <div class="relative">
      <input type="text" :placeholder="placeholder" v-model="searchQuery" @focus="isOpen = true" @input="filterUsers"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10" />
      <button type="button" @click="toggleDropdown"
        class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>

    <!-- Dropdown List -->
    <div v-if="isOpen"
      class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
      <div @click="selectUser(null)" class="px-3 py-2 cursor-pointer hover:bg-blue-50 text-gray-700"
        :class="{ 'bg-blue-100': modelValue === null }">
        <span class="text-gray-500 italic">{{ placeholder }}</span>
      </div>

      <div v-for="user in filteredUsers" :key="user.id" @click="selectUser(user.id)"
        class="px-3 py-2 cursor-pointer hover:bg-blue-50 flex items-center justify-between"
        :class="{ 'bg-blue-100 text-blue-800 font-medium': modelValue === user.id }">
        <span>{{ user.first_name }} {{ user.last_name }}</span>
        <svg v-if="modelValue === user.id" class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div v-if="filteredUsers.length === 0" class="px-3 py-2 text-gray-500 text-sm italic">
        No users found
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface User {
  id: string  // UUID string
  first_name: string
  last_name: string
}

interface Props {
  modelValue: string | null  // UUID string
  users: User[]
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select user (optional)'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

const dropdownRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const searchQuery = ref('')
const filteredUsers = ref<User[]>([])

// Computed to find the selected user
const selectedUser = computed(() => {
  if (props.modelValue === null || props.modelValue === undefined) return null
  return props.users.find(u => u.id === props.modelValue)
})

// Watch for changes in modelValue or users to update the display
watch([() => props.modelValue, () => props.users], ([newValue, newUsers]) => {
  console.log('SearchableSelect WATCH:', {
    newValue,
    newValueType: typeof newValue,
    usersCount: newUsers.length,
    placeholder: props.placeholder
  })

  if (newValue !== null && newValue !== undefined && newUsers.length > 0) {
    const user = newUsers.find(u => u.id === newValue)
    if (user) {
      searchQuery.value = `${user.first_name} ${user.last_name}`
      console.log('SearchableSelect SET searchQuery:', searchQuery.value)
    } else {
      searchQuery.value = ''
      console.log('SearchableSelect NO USER FOUND for value:', newValue)
    }
  } else {
    searchQuery.value = ''
  }
  filteredUsers.value = newUsers
}, { immediate: true, deep: true })

// Also check on mount
onMounted(() => {
  if (props.modelValue !== null && props.users.length > 0) {
    const user = props.users.find(u => u.id === props.modelValue)
    if (user) {
      searchQuery.value = `${user.first_name} ${user.last_name}`
    }
  }
  filteredUsers.value = props.users
})

const filterUsers = () => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) {
    filteredUsers.value = props.users
  } else {
    filteredUsers.value = props.users.filter(user => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase()
      return fullName.includes(query)
    })
  }
}

const selectUser = (userId: string | null) => {
  emit('update:modelValue', userId)
  isOpen.value = false

  if (userId) {
    const selectedUser = props.users.find(u => u.id === userId)
    if (selectedUser) {
      searchQuery.value = `${selectedUser.first_name} ${selectedUser.last_name}`
    }
  } else {
    searchQuery.value = ''
  }
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    filterUsers()
  }
}

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
      isOpen.value = false
    }
  })
})
</script>