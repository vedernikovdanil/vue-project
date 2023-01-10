<template>
  <nav>
    <ul class="pagination pagination-lg justify-content-center">
      <li class="page-item" :class="{ disabled: page === 1 }">
        <a class="page-link" href="javascript:void(0);" aria-label="First" @click="change($event, 1)">&laquo;</a>
      </li>
      <li class="page-item d-none d-md-block" :class="{ disabled: page === 1 }">
        <a class="page-link" href="javascript:void(0);" aria-label="Previous" @click="change($event, page - 1)">&lsaquo;</a>
      </li>
      <li class="page-item" :class="{ active: p === page }" v-for="p in pagination">
        <a class="page-link" href="javascript:void(0);" @click="change($event, p)">{{ p }}</a>
      </li>
      <li class="page-item d-none d-md-block" :class="{ disabled: page === count }">
        <a class="page-link" href="javascript:void(0);" aria-label="Next" @click="change($event, page + 1)">&rsaquo;</a>
      </li>
      <li class="page-item" :class="{ disabled: page === count }">
        <a class="page-link" href="javascript:void(0);" aria-label="Last" @click="change($event, count)">&raquo;</a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import _ from 'lodash';

const props = defineProps({
  page: { type: Number, required: true },
  count: { type: Number, reqired: true }
});
const emit = defineEmits(['change']);

const pagination = computed(() => {
  const start = _.clamp(props.page - 3, 1, props.count + 1);
  const end = _.clamp(start + 7, 1, props.count + 1);
  return _.range(start, end);
});

function change(event, page) {
  event.target.blur();
  emit('change', page);
}
</script>

<style lang="">
  
</style>