<template>
  <div class="d-flex gap-2 m-2">
    <input
      class="form-control"
      type="number"
      :min="rangeMinMax[0]"
      :max="rangeMinMax[1]"
      :value="rangeValue[i]"
      :placeholder="rangePlaceholder[i]"
      @change="onInputRange($event, i)"
      step="any"
      v-for="(_, i) in 2"
    >
  </div>
  <ul class="list-group list-group-flush" :class="$attrs.class" ref="listGroup">
    <li class="list-group-item list-group-item-action" v-for="option in sortedOptions">
      <div class="form-check d-grid">
        <input
          class="form-check-input"
          type="checkbox"
          :value="option.value"
          :id="inputId(option.value)"
          v-model="checkedValue"
          @change="onChange"
        >
        <label class="form-check-label stretched-link text-truncate me-1" :for="inputId(option.value)">
          {{ option.name }}
        </label>
        <span class="text-muted">({{ option.count }})</span>
      </div>
    </li>
  </ul>
</template>

<script setup>
import { ref, computed, watch, watchEffect } from 'vue';
import _ from 'lodash';

const props = defineProps({
  name: { type: String, required: true },
  title: { type: String, required: true },
  options: { type: Array, required: true },
  maxShowCount: { type: Number, default: 7 },
  showAll: { type: Boolean, required: false },
  modelValue: { type: [Array, String], required: null },
});

const emit = defineEmits(['update:modelValue']);

const checkedValue = ref(props.modelValue);
const range = ref([]);
const listGroup = ref(null);

const sortedOptions = computed(() =>
  props.showAll ? props.options : props.options.slice(0, props.maxShowCount)
);

const rangeMinMax = computed(() => [
    props.options.at(0).value.split('-')[0],
    props.options.at(-1).value.split('-')[1]
  ]
);

const rangeValue = computed(() => 
  checkedValue.value.length === 1
    ? [
      checkedValue.value[0].split('-')[0],
      checkedValue.value[0].split('-')[1]
    ]
    : []
);

const rangePlaceholder = computed(() => [
  `From ${props.options.at(0).value.split('-')[0]}`,
  `To ${props.options.at(-1).value.split('-')[1]}`
]);

watch(() => props.showAll, () => listGroup.value.scrollTop = 0);
watchEffect(() => emit('update:modelValue', checkedValue.value));
watchEffect(() => checkedValue.value = props.modelValue);
watchEffect(() => !checkedValue.value.length && (range.value = []));

function onInputRange(event, index) {
  const extremes = [
    props.options.at(0).value.split('-')[0],
    props.options.at(-1).value.split('-')[1]
  ];
  let [min, max] = [event.target.value, range.value[+!index]];
  index && ([min, max] = [max, min]);
  if (index && !range.value[1] && max == extremes[0]) {
    max = extremes[1];
  }
  min && (min = _.clamp(min, extremes[0], extremes[1]));
  max && (max = _.clamp(max, extremes[0], extremes[1]));
  range.value = [min, max];
  emit('update:modelValue', [range.value.join('-')]);
}

function onChange() {
  if (range.value.length) {
    checkedValue.value = checkedValue.value.filter(value =>
      value !== range.value.join('-')
    );
    range.value = [];
  }
}

const inputId = (id) => `${props.name}-${id}`;
</script>

<style lang="">

</style>