<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { displayValue } from '../utils/display'

interface Domain {
  domain: string
  registrar: string
  status: 'active' | 'clientHold' | 'pendingTransfer'
  created_at: string
  expires_at: string
  updated_at?: string
  nameservers?: string[]
}

const props = defineProps<{ domains: Domain[] }>()
const emit = defineEmits<{
  (e: 'select', domain: Domain): void
  (e: 'sort', key: 'domain' | 'expires_at'): void
}>()
</script>

<template>
  <table class="domain-table">
    <thead>
      <tr>
        <th @click="emit('sort','domain')">Domain</th>
        <th>Registrar</th>
        <th>Status</th>
        <th>Created At</th>
        <th @click="emit('sort','expires_at')">Expires At</th>
        <th>Updated At</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="domain in props.domains"
        :key="domain.domain"
        @click="emit('select', domain)"
      >
        <td>{{ domain.domain }}</td>
        <td>{{ domain.registrar }}</td>
        <td :class="['status', domain.status]">{{ domain.status }}</td>
        <td>{{ displayValue(domain.created_at, 'Unknown') }}</td>
        <td>{{ displayValue(domain.expires_at, 'Unknown') }}</td>
        <td>{{ displayValue(domain.updated_at, 'Unknown') }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.domain-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th {
  text-align: left;
  padding: 0.75rem;
  background: #f4f4f4;
  font-weight: 600;
  cursor: pointer;
}

td {
  padding: 0.75rem;
  border-bottom: 1px solid #e5e5e5;
}

tr:hover {
  background: #fafafa;
}

.status {
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status.active {
  color: #1a7f4b;
}

.status.clientHold {
  color: #c62828;
}

.status.pendingTransfer {
  color: #b26a00;
}
</style>