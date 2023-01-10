<template>
  <div class="d-grid gap-3" :class="{'grid-view': gridView}">
    <ProductItem
      :class="{'placeholder rounded': loading}"
      :key="product?.id"
      :product="product"
      v-for="product in products"
    />
  </div>
</template>

<script lang="js">
import ProductItem from '@/components/product/ProductItem.vue';

export default {
  components: { ProductItem },
  props: {
    products: { type: Array, default: [] },
    gridView: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
  }
}
</script>

<style>
  .grid-view {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  .grid-view .product {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
  .grid-view .product-body {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1.5em auto 1.5em;
  }
  .grid-view .product-price-block {
    grid-template-columns: 1fr auto;
  }
  .grid-view .product-price-block {
    text-align: start;
    grid-row: inherit;
    grid-column: inherit;
    margin-left: 0;
  }
</style>