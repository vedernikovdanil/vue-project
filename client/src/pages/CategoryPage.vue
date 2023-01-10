<template>
  <h1>Category</h1>
  <div class="category-list gap-2 mt-4">
    <router-link
      :to="`/products/${category.ID === 'all' ? '' : category.Name}?page=1&limit=10`"
      class="card p-3 category-item text-decoration-none"  
      v-for="category in categoryList"
    >
      <img :src="productsService.getImage('category', category.Name)" v-if="category.ID" />
      <h5>{{ _.startCase(category.Name) }}&nbsp;
        <small class="text-muted">({{ category.count }})</small>
      </h5>
    </router-link>
  </div>
</template>

<script setup>
import _ from 'lodash';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ProductsService from '../service/ProductsService';

const router = useRouter();
const productsService = new ProductsService(router);

const categoryList = ref([]);

onMounted(async () => {
  categoryList.value = await productsService.getCategory();
});
</script>

<style>
  .category-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 200px));
  }
  .category-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
</style>