<template>
  <div class="offcanvas-lg offcanvas-start" tabindex="-1" id="offcanvasResponsive" aria-labelledby="offcanvasResponsiveLabel">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" v-if="header">{{ header }}</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#offcanvasResponsive" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { Offcanvas } from 'bootstrap';
import BootstrapListeners from '@/mixins/BootstrapListeners.js';

export default {
  mixins: [ BootstrapListeners ],
  props: {
    header: { type: String, required: false }
  },
  data() {
    return {
      bsType: 'offcanvas'
    }
  },
  beforeUnmount() {
    const offcanvas = Offcanvas.getInstance(this.$el);
    offcanvas.hide();
  }
}
</script>

<style lang="">
  
</style>