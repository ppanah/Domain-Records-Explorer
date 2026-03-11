<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, nextTick } from 'vue'

const props = defineProps({
  status: { type: String, default: '' },
  registrar: { type: String, default: '' }
})

const emit = defineEmits(['update:status', 'update:registrar', 'change'])

const statusValue = ref(props.status)
const registrarValue = ref(props.registrar)

// Watch statusValue and emit updates
watch(statusValue, async (val) => {
  emit('update:status', val || '') // Always emit string
  await nextTick()
  emit('change')
})

// Watch registrarValue and emit updates
watch(registrarValue, async (val) => {
  emit('update:registrar', val || '') // Always emit string
  await nextTick()
  emit('change')
})
</script>

<template>
  <div class="filters">
    <select v-model="statusValue">
      <option value="">All Status</option>
      <option value="active">Active</option>
      <option value="clientHold">Client Hold</option>
      <option value="pendingTransfer">Pending Transfer</option>
    </select>

    <select v-model="registrarValue">
      <option value="">All Registrars</option>
      <option value="GoDaddy">GoDaddy</option>
      <option value="Namecheap">Namecheap</option>
    </select>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
select {
  padding: 0.4rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>