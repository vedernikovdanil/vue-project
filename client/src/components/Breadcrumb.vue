<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"
        :class="{'active': link.active}"
        :aria-current="link.active ? 'page' : ''"
        v-for="link in linkList"
      >
        <router-link :to="link.href" v-if="link.href">{{ link.name }}</router-link>
        <span v-else>{{ link.name }}</span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
const props = defineProps({
  linkList: { type: Array, required: true }
});
</script>

<style lang="">
  
</style>