<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: String
});
const emit = defineEmits(['update:modelValue', 'input']);

const inputValue = ref(props.modelValue || '');

watch(inputValue, val => {
  emit('update:modelValue', val);
  emit('input', val);
});
</script>

<template>
  <input
    type="text"
    placeholder="Search domain..."
    v-model="inputValue"
    class="search-input"
  />
</template>

<style scoped>
.search-input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>