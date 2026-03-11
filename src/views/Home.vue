<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import DomainTable from '../components/DomainTable.vue'
import DomainFilters from '../components/DomainFilters.vue'
import DomainSearch from '../components/DomainSearch.vue'
import DomainDetails from '../components/DomainDetails.vue'
import domainsData from '../mock/domains.json'
import { debounce } from '../utils/debounce'

// ---------------------
// Domain interface
// ---------------------
interface Domain {
  domain: string
  registrar: string
  status: 'active' | 'clientHold' | 'pendingTransfer'
  created_at: string
  expires_at: string
  updated_at?: string
  nameservers?: string[]
}

// ---------------------
// Reactive state
// ---------------------
const domains = ref<Domain[]>([])
const filteredDomains = ref<Domain[]>([])

const searchQuery = ref('')
const selectedStatus = ref('')     // "" = All
const selectedRegistrar = ref('')   // "" = All
const selectedDomain = ref<Domain | null>(null)

const sortKey = ref<'domain' | 'expires_at'>('domain')
const sortDirection = ref<'asc' | 'desc'>('asc')

// Pagination
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = computed(() =>
  Math.ceil(filteredDomains.value.length / pageSize.value)
)
const paginatedDomains = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredDomains.value.slice(start, end)
})

const isLoading = ref(true)
const error = ref<string | null>(null)

// ---------------------
// Load data
// ---------------------
onMounted(() => {
  isLoading.value = true
  setTimeout(() => {
    try {
      domains.value = domainsData
      applyFilters()
      isLoading.value = false
    } catch {
      error.value = 'Failed to load domain data.'
      isLoading.value = false
    }
  }, 500)
})

// ---------------------
// Filtering + Sorting
// ---------------------
const applyFilters = () => {
  currentPage.value = 1 // reset page

  let results = domains.value.filter((domain) => {
    const matchesSearch = searchQuery.value
      ? domain.domain.toLowerCase().includes(searchQuery.value.toLowerCase())
      : true
    const matchesStatus = selectedStatus.value
      ? domain.status === selectedStatus.value
      : true
    const matchesRegistrar = selectedRegistrar.value
      ? domain.registrar === selectedRegistrar.value
      : true
    return matchesSearch && matchesStatus && matchesRegistrar
  })

  results.sort((a, b) => {
    const aVal = a[sortKey.value]
    const bVal = b[sortKey.value]
    if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })

  filteredDomains.value = results
}

// ---------------------
// Debounced filter
// ---------------------
const debouncedFilter = debounce(applyFilters, 200)

// ---------------------
// Watch filters + searchQuery
// ---------------------
watch([selectedStatus, selectedRegistrar, searchQuery], debouncedFilter)

// ---------------------
// Sorting
// ---------------------
const handleSort = (key: 'domain' | 'expires_at') => {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }
  applyFilters()
}
</script>

<template>
  <div class="home-container">
    <!-- Loading -->
    <div v-if="isLoading" class="status-message">Loading domains...</div>

    <!-- Error -->
    <div v-else-if="error" class="status-message error">{{ error }}</div>

    <!-- Main Content -->
    <div v-else>
      <h1 class="title">Domain Records Explorer</h1>

      <!-- Search + Filters -->
      <div class="controls">
        <DomainSearch v-model="searchQuery" @input="debouncedFilter" />
        <DomainFilters
          v-model:status="selectedStatus"
          v-model:registrar="selectedRegistrar"
        />
      </div>

      <!-- Empty state -->
      <div v-if="filteredDomains.length === 0" class="status-message">
        No domain records found.
      </div>

      <!-- Table -->
      <DomainTable
        v-else
        :domains="paginatedDomains"
        @select="selectedDomain = $event"
        @sort="handleSort"
      />

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button :disabled="currentPage === 1" @click="currentPage--">
          Previous
        </button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button :disabled="currentPage === totalPages" @click="currentPage++">
          Next
        </button>
      </div>

      <!-- Modal -->
      <DomainDetails
        v-if="selectedDomain"
        :domain="selectedDomain"
        @close="selectedDomain = null"
      />
    </div>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 950px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
}

.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.2rem;
}

.status-message {
  text-align: center;
  font-weight: bold;
  margin: 2rem 0;
  color: #555;
}

.status-message.error {
  color: red;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.pagination button {
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  border: none;
  background-color: #42b883;
  color: white;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination span {
  font-weight: bold;
}

.title {
  margin-bottom: 1rem;
}
</style>