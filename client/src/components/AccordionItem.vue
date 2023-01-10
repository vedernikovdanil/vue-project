<template>
  <div class="accordion-item">
    <h2 class="accordion-header" :id="idHeader">
      <button
        type="button"
        class="accordion-button"
        data-bs-toggle="collapse"
        :data-bs-target="`#${idCollapse}`"
        :aria-expanded="expanded"
        :aria-controls="idCollapse"
      >
        {{ name }}
      </button>
    </h2>
    <div :id="idCollapse" class="accordion-collapse collapse overflow-hidden show" :aria-labelledby="idHeader">
      <div class="accordion-body p-0">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  id: { type: String, required: true },
  name: { type: String, required: true },
  expanded: { type: Boolean, default: true },
});
const idHeader = `accordionHeader-${props.id}`;
const idCollapse = `accordionCollapse-${props.id}`;
</script>

<style>
</style>