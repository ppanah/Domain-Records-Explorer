<script setup lang="ts">
import { defineProps, defineEmits, onMounted, onUnmounted } from 'vue';
import { displayValue} from '../utils/display';
import { formatDate } from '../utils/date';

interface Domain {
  domain: string;
  registrar: string;
  status: 'active' | 'clientHold' | 'pendingTransfer';
  created_at: string;
  expires_at: string;
  updated_at?: string;
  nameservers?: string[];
}

const props = defineProps<{ domain: Domain }>();
const emit = defineEmits(['close']);

// Add Escape Key to Close Modal
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    emit('close');
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape);
});
</script>

<template>
<div class="overlay" @click="emit('close')">
  <div class="modal" @click.stop>
    <h3>{{ props.domain.domain }}</h3>
    <p>Registrar: {{ props.domain.registrar }}</p>
    <p>Status: {{ props.domain.status }}</p>
    <p>Created: {{ formatDate(props.domain.created_at) }}</p>
    <p>Expires: {{ formatDate(props.domain.expires_at) }}</p>
    <p>Updated: {{ displayValue(formatDate(props.domain.updated_at), 'Unknown') }}</p>
    <p>Nameservers:</p>

<ul v-if="props.domain.nameservers?.length">
  <li v-for="ns in props.domain.nameservers" :key="ns">
    {{ displayValue(ns) }}
  </li>
</ul>

<p v-else>N/A</p>

<button @click="emit('close')">Close</button>
  </div>
</div>
 
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 8vh;
}
.modal {
  position: fixed;
  top: 25%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 1.8rem 2rem;
  width: 420px;
  max-width: 90%;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  border-radius: 8px;
  z-index: 100;
}


.modal h3 {
  margin-top: 0;
}

.modal p {
  margin: 0.4rem 0;
}

.modal ul {
   list-style: none;
  padding-left: 0;
  margin: 0.4rem 0;
}

.modal li {
  background: #f4f4f4;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  margin: 3px 4px 3px 0;
  font-size: 0.9rem;
}

button {
  margin-top: 1.5rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  background-color: #42b883;
  color: white;
  cursor: pointer;
}
button:hover {
  background-color: #36976f;
}
</style>