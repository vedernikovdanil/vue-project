<template>
  <form class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog" :class="$attrs.class">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer" v-if="hasFooter">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="reset" class="btn btn-outline-secondary" v-if="hasResetBtn">Reset</button>
          <button type="submit" class="btn btn-primary">{{ submitBtnText }}</button>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { Modal } from 'bootstrap';
import BootstrapListeners from '@/mixins/BootstrapListeners.js';

export default {
  mixins: [ BootstrapListeners ],
  props: {
    hasFooter: { type: Boolean, default: true },
    title: { type: String, default: 'Modal title' },
    submitBtnText: { type: String, default: 'Save changes' },
    hasResetBtn: { type: Boolean, default: false },
  },
  data() {
    return {
      bsType: 'modal'
    }
  },
  beforeUnmount() {
    const modal = Modal.getInstance(this.$el);
    modal.hide();
  }
}

</script>

<style lang="">
  
</style>