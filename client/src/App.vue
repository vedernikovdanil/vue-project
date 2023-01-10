<template>
  <div>
    <Navbar />
    <div class="container pt-4">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';

export default {
  components: { Navbar }
}
</script>

<style>
  * > .card {
    box-shadow: 0 0.125rem 0.25rem rgb(0 0 0 / 8%);
  }
  .placeholder > * {
    visibility: hidden;
  }
  .placeholder-glow .placeholder {
    transition: all 0.2s ease;
  }
</style>